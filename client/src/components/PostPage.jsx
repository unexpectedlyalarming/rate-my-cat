//Page that displays all posts

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Reactions from '../services/reactions.service';
import Posts from '../services/posts.service';
import { useQuery, useMutation, QueryCache } from '@tanstack/react-query';

import { Link, useParams } from 'react-router-dom';
import Post from './Post';
import { formatDistanceToNow } from 'date-fns';
import RatingsContainer from './RatingsContainer';


export default function PostPage () {
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


    async function setReactions () {
        setReactionCount(post?.reactions?.length);
        await checkReaction();
    }

    async function fetchPost() {
        try {
            const post = await Posts.getPostById(id);

            const newPost = post[0];
            if (!newPost) {
                return "Error";
            }
            const newDate = formatDistanceToNow(new Date(newPost.date), { addSuffix: true })
            setDate(newDate);
            await setReactions();
            return newPost;
        } catch (err) {
                console.error(err);
            }
        }

        const { 
            data: post, 
            status,
            refetch,
        } = useQuery({
            queryKey: ["post"],
            queryFn: fetchPost,
            refetchInterval: 5000,
        });

        const reactMutation = useMutation(Reactions.createReaction);
        const deleteMutation = useMutation(Reactions.deleteReaction);
      
        async function handleReact() {
          if (hasLiked) {
            await deleteMutation.mutateAsync(post._id);
            setReactionCount((count) => count - 1);
            setHasLiked(false);
          } else {
            await reactMutation.mutateAsync(post._id);
            setReactionCount((count) => count + 1);
            setHasLiked(true);
          }
        }

        useEffect(() => {
            if (post) {
            setReactionCount(post.reactions.length);
            checkReaction();
            }
        }, [post]);


    if (status === "loading") {
        return <div className="loading-container"><CircularProgress /></div>
    }
    if (status === "error") {
        return <div className="loading-container"><CircularProgress /></div>
    }


    return (
        <div className="container">

        <div className="post-container single-post">
            <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
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