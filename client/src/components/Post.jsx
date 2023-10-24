import React, { useState } from 'react';
import Posts from '../services/posts.service';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Reactions from '../services/reactions.service';
import { useContext } from 'react';
import { UserContext } from '../providers/userContext';
import DeleteIcon from '@mui/icons-material/Delete';
export default function Post ({ post }) {

    const { user } = useContext(UserContext);

    const navigate = useNavigate();
    const [reactionCount, setReactionCount] = useState(post.reactions.length);
    const [hasLiked, setHasLiked] = useState(false);

    const date = formatDistanceToNow(new Date(post.date), { addSuffix: true });


    async function checkReaction() {
        try {
            const hasReacted = await Reactions.checkReaction(post._id);
            if (hasReacted === "true") {
                setHasLiked(true);
            } else {
                setHasLiked(false);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleReact () {
        checkReaction();
        if (!hasLiked) {
        const newReaction = await Reactions.createReaction(post._id);
        if (newReaction instanceof Error) {
            throw newReaction;
        } else {
            setReactionCount(reactionCount + 1);
            setHasLiked(true);
        }
    } else {
        const deletedReaction = await Reactions.deleteReaction(post._id);
        if (deletedReaction instanceof Error) {
            throw deletedReaction;
        } else {
            setReactionCount(reactionCount - 1);
            setHasLiked(false);
        }

    }
}

checkReaction(post._id);

    async function handleDelete(e) {
        e.preventDefault();
        try {
            const deletedPost = await Posts.deletePost(post._id);
            if (deletedPost) {
                navigate("/");
            } else {
                throw new Error("Post not deleted");
            }
        } catch (err) {
            console.error(err);
        }
    }


        
        return (
            
            <div className="post-container">
            <div className="post-header">
                <Link to={`/cat/${post.catId}`}className="post-cat">{post.catName}</Link>
                <time className="post-date">Posted {date}</time>
            </div>
                <Link to={`/post/${post._id}`} className="post-title">{post.title}</Link>
            <Link to={`/post/${post._id}` } className="post-body">
                <img src={post.image} alt={post.title} />
            </Link>
            <div className="post-footer">
                <Link to={`/post/${post._id}`} className="comment-icon"><CommentIcon /><p>{post.ratings ? post?.ratings?.length : "0"}</p>  </Link>
                {post?.userId === user?.id ? <button className="delete-post" onClick={handleDelete}><DeleteIcon /></button> : null}
                <button className="favorite-button" onClick={handleReact}>
                    {reactionCount}
                    <FavoriteIcon className={hasLiked ? "liked" : "not-liked"}/>
                </button>
            </div>
        </div>
    )
}