import React, { useMemo, useRef, useState } from 'react';
import ReactQuill, {Quill} from 'react-quill';
import { useNavigate } from 'react-router-dom';
import './quill.css';
import 'react-quill/dist/quill.snow.css';
import styles from './PostCreator.module.css';
import ImageResize from 'quill-image-resize';
import simplifyDate from '../../date';
import {BsFillEyeFill} from "react-icons/bs";
import { usePostContext } from '../../context/PostContext';

Quill.register('modules/ImageResize', ImageResize);

export default function PostCreator({postService}) {
    const {selectedPostID,setPostID} = usePostContext();
    const [title, setTitle] = useState("");
    const [content,setContent] = useState("");
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const quillRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();

        const tempElement = document.createElement('div');
        tempElement.innerHTML = content;

        const elementsWithSrc = tempElement.querySelectorAll('[src]');
        const srcAttributes = [];

        console.log(elementsWithSrc.length);

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
                    console.log(element.file);
                } else if(element.type === "image") {
                    formData.append("image",element.file);
                    console.log(element.file);
                }
                
            })

            if(validFiles[0].type === "video") {
                jsonData = {title,content,video:true};
            } else {
                jsonData = {title,content,video:false};
            }
            formData.append("jsonFile", JSON.stringify(jsonData));
        }
        else {
            jsonData = {title,content,video:false};
            formData.append("jsonFile", JSON.stringify(jsonData));
        }

        postService.createPost(formData)
            .then((response)=>{
                const post = {...response}
                console.log(response);
                setPostID(post.id);
                navigate(`/forums/post/${response.title}`);
            })
            .catch((error)=>{console.log(error)})
        
    };

    const handleContent = (contents) => {
        setContent(contents);
        console.log(contents);
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
            <h1>Create Post</h1>
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
                            {/* {post &&
                            <div className={styles.postInfo}>
                                <img className={styles.profileImg} src={post.image_url} alt="userImg" />
                                <div className={styles.postInfoSubContainer}>
                                    <div className={styles.postNickname}>{post.nickname}</div>
                                    <div className={styles.postTime}>{simplifyDate(post.created_at)}</div>
                                </div>
                                <div className={styles.views}>
                                    <BsFillEyeFill/>
                                    {post.views}
                                </div>
                            </div>} */}
                        </div>
                        <ReactQuill className={"editor"}
                                    ref={quillRef}
                                    onChange={handleContent}
                                    modules={modules}/>
                        <div className={styles.btnContainer}>
                            <button className={styles.cancelBtn} onClick={()=>{navigate("/")}}>Cancel</button>
                            <button className={styles.createBtn} disabled={title.trim().length === 0}>Create</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

