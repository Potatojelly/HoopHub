import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, {Quill} from 'react-quill';
import { useNavigate } from 'react-router-dom';
import './quill.css';
import 'react-quill/dist/quill.snow.css';
import styles from './PostCreator.module.css';
import ImageResize from 'quill-image-resize';
import Alarm from '../Alarm/Alarm';
import { useCreatePost } from '../../hooks/usePostsData';

Quill.register('modules/ImageResize', ImageResize);

export default function PostCreator() {
    const navigate = useNavigate();
    const quillRef = useRef();
    const controller = useRef( new AbortController());
    const [isUploading,setIsUploading] = useState(false);
    const [isPosting,setIsPosting] = useState(false);
    const [isCanceled,setIsCanceled] = useState(false);
    const [isError,setIsError] = useState(false);
    const [title, setTitle] = useState("");
    const [content,setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const {mutate:createPost} = useCreatePost();

    const handleSubmit = (e) => {
        e.preventDefault();
        const tempElement = document.createElement('div');
        tempElement.innerHTML = content;

        const elementsWithSrc = tempElement.querySelectorAll('[src]');
        const srcAttributes = [];

        const formData = new FormData();
        let jsonData = {};

        if(elementsWithSrc.length > 0) {
            elementsWithSrc.forEach((element) => {
                const src = element.getAttribute('src');
                srcAttributes.push(src);
            });

            const validFiles = [];
            files.forEach((element)=>{
                if(srcAttributes.find((src)=>src===element.URL)) {
                    if(element.video) {
                        validFiles.push({type:"video",file:element.video});
                    } else if(element.image) {
                        validFiles.push({type:"image",file:element.image});
                    }
                } 
            })

            validFiles.forEach((element)=>{
                if(element.type === "video") {
                    formData.append("video",element.file);
                } else if(element.type === "image") {
                    formData.append("image",element.file);
                }
                
            })
        }

        jsonData = {title,content};
        formData.append("jsonFile", JSON.stringify(jsonData));

        const uploadProgressCallback = (progressEvent) => {
            const loaded = progressEvent.loaded; 
            const total = progressEvent.total; 
            const percentage = Math.round((loaded / total) * 100);
            setProgress(percentage);
            if(percentage === 100) {
                setIsUploading(false);
                setIsPosting(true);
            }
        }

        setIsUploading(true);
        createPost({formData,signal:controller.current.signal,callback: uploadProgressCallback},{
            onSuccess: (response) => {
                const post = {...response}
                navigate(`/forums/post/view?title=${response.title}&postNum=${post.id}&page=1`);
                setIsPosting(false);
                setProgress(0);
            },
            onError: (err) => {
                if(err === "CanceledError") {
                    setIsCanceled(true);
                    setTimeout(()=>{
                        setIsCanceled(false);
                        setIsUploading(false);
                        navigate("/");
                    },1000)
                    return;
                }
                setIsError(true);
                setTimeout(()=>{setIsError(false)},3000);
            }
        })
    };

    const handleContent = (contents) => {
        setContent(contents);
    };

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type","file");
        input.setAttribute("accept","image/*");
        input.click();
        input.addEventListener("change",()=>{
            const file = input.files[0];
            const imageURL = URL.createObjectURL(file);
            const info = {};
            info.image = file;
            info.URL = imageURL;
            setFiles((prevFiles) => [...prevFiles, info]);

            const Image = Quill.import("formats/image");
            Image.sanitize = (imageURL) => imageURL;

            const editor = quillRef.current.getEditor(); 
            const range = editor.getSelection();
            editor.insertEmbed(range.index, "image", imageURL);
            editor.formatText(range.index, range.index+1, 'width', '680px');
            editor.setSelection(range.index+1,range.index+1);
        })
    };

        
    const videoHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type","file");
        input.setAttribute("accept","video/*");
        input.click();

        input.addEventListener("change",()=>{
            const file = input.files[0];
            const videoURL = URL.createObjectURL(file);
            const info = {};
            info.video = file;
            info.URL = videoURL;
            setFiles((prevFiles) => [...prevFiles, info]);

            const Video = Quill.import("formats/video");
            Video.sanitize = (videoURL) => videoURL;

            const editor = quillRef.current.getEditor(); 
            const range = editor.getSelection();
            editor.insertEmbed(range.index, "video", videoURL);
            editor.formatText(range.index, range.index+1, {'width': '680px', 'height': '400px'});
        })
    };

    const handleCancel = (e) => {
        e.preventDefault();
        if(isUploading) {
            controller.current.abort();
            return;
        }
        navigate("/")
    }

    useEffect(()=>{
        const cancelController = controller.current;
        return () => {
            cancelController.abort();
        }
    },[])

    const modules = useMemo(()=> {
        return {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, 'link'],
                    [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, 
                        { 'background': [] }],
                    ['image', 'video'],
                ],
                handlers: {
                    image: imageHandler,
                    video: videoHandler,
                }
            },
            ImageResize: {
                parchment: Quill.import('parchment')
            }
        }
    },[]);

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Create Post</h1>
            <div className={styles.editor}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.subForm}>
                        <div className={styles.titleContainer}>
                            <input className={styles.title}
                                    type="text" 
                                    placeholder="Title"
                                    maxLength={100}
                                    value={title}
                                    onChange={(e)=>setTitle(e.target.value)}/>
                            <div className={styles.counter}>{title.trim().length}/100</div>
                        </div>
                        <ReactQuill className={"editor"}
                                    ref={quillRef}
                                    onChange={handleContent}
                                    modules={modules}/>
                        <div className={styles.btnContainer}>
                            <button className={styles.cancelBtn} onClick={handleCancel} disabled={isPosting}>Cancel</button>
                            <button className={styles.createBtn} disabled={title.trim().length === 0 || isUploading || isPosting}>Create</button>
                        </div>
                    </div>
                </form>
            </div>
            {isUploading && <Alarm message={"Uplaoding..."} upload={true} progress={progress}/>}
            {isPosting && <Alarm message={"Posting..."}/>} 
            {isCanceled && <Alarm message={"Posting is canceled."}/>} 
            {isError && <Alarm message={"Something went wrong..."}/>}
        </div>
    );
}

