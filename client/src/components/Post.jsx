import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Posts from '../services/posts.service';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Reactions from '../services/reactions.service';
export default function Post ({ post }) {

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











        
        return (
            
            <div className="post-container">
            <div className="post-header">
                <Link to={`/post/${post._id}`} className="post-title">{post.title}</Link>
                <Link to={`/cat/${post.catId}`}className="post-cat">{post.catName}</Link>
                <time className="post-date">Posted {date}</time>
            </div>
            <Link to={`/post/${post._id}` } className="post-body">
                <img src={post.image} alt={post.title} />
            </Link>
            <div className="post-footer">
                <Link to={`/post/${post._id}`}   ><p>{post.ratings ? post?.ratings?.length : "0"}</p> <CommentIcon /> </Link>

                <button className="favorite-button" onClick={handleReact}>
                    {reactionCount}
                    <FavoriteIcon className={hasLiked ? "liked" : "not-liked"}/>
                </button>
            </div>
        </div>
    )
}