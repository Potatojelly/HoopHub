import React, { useState } from 'react';
import styles from './PostEditor.module.css'

export default function PostCreate() {
    const [title, setTitle] = useState("");
    const [bdoy, setBody] = useState("");
    const handleSubmit = () => {};
    return
    // return (
    //     <div>
    //         <div>
    //             <div>
    //                 <h1>Create Post</h1>
    //                 <form onSubmit={handleSubmit}>
    //                     <div>
    //                         <input type="text" 
    //                                 placeholder="Title"
    //                                 maxLength={100}
    //                                 value={title}
    //                                 onChange={(e)=>setTitle(e.target.value)}/>
    //                         <div>{title.trim().length}/100</div>
    //                     </div>
    //                     <textarea rows={}
    //                             placeholder="Description"
    //                             value={body}
    //                             onChange={(e)=>setBody(e.target.value)}>
    //                     </textarea>
    //                     <div>
    //                         <button disabled={title.trim().length === 0}>Create</button>
    //                     </div>
    //                 </form>
    //             </div>
    //         </div>
    //     </div>
    // );
}

