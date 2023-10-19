//Page that displays all posts

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Reactions from '../services/reactions.service';
import Posts from '../services/posts.service';


import { Link, useParams } from 'react-router-dom';
import Post from './Post';
import { formatDistanceToNow } from 'date-fns';
import RatingsContainer from './RatingsContainer';


export default function PostPage () {
    const [post, setPost] = useState(null);
    const [loading, isLoading] = useState(true);
    const [date, setDate] = useState(null);


    const { id } = useParams();



    const [reactionCount, setReactionCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

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
    async function setReactions () {
        setReactionCount(post.reactions.length);
    }
    useEffect(() => {

        async function fetchPost() {
            try {
                const post = await Posts.getPostById(id);
                setPost(post[0]);
                if (!post) {
                    throw new Error("Post not found");
                    
                }
                const newDate = formatDistanceToNow(new Date(post[0].date), { addSuffix: true })

                setDate(newDate);
                setReactions();
                setTimeout(() => {
                    
                    isLoading(false);
                }, 500)
            } catch (err) {
                console.error(err);
                isLoading(false)
            }
        }
        fetchPost()
        
    }, [id])


    if (loading) {
        return <div className="loading-container"><CircularProgress /></div>
    }


    return (
        <div className="container">

        <div className="post-container">
            <div className="post-header">
                <h2 to={`/post/${post._id}`} className="post-title">{post.title}</h2>
                <Link to={`/cat/${post.catId}`}className="post-cat">{post.catName}</Link>
            </div>
            <div className="post-body">
                <img src={post.image} alt={post.title} />
                <time className="post-date">Posted {date}</time>

                <button className="favorite-button" onClick={handleReact}>
                    {reactionCount}
                    <FavoriteIcon className={hasLiked ? "liked" : "not-liked"}/>
                </button>
            </div>


        </div>
        <RatingsContainer id={id} />
        </div>
    )
}