//Page that displays all posts

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

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
            </div>


        </div>
        <RatingsContainer id={id} />
        </div>
    )
}