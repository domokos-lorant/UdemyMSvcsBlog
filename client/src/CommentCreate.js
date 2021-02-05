import React, { useState } from "react";
import axios from "axios";

const CommentCreate = ({ postId }) => {
    const [content, setContent] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content });

        setContent("");
    };

    return (
        <div className="mt-2">
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="comment">New Comment</label>
                    <input
                        id="comment"
                        className="form-control"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Submit</button>
            </form>
        </div>
    );
};

export default CommentCreate;