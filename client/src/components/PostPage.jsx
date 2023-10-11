//Page that displays all posts

import React, { useEffect, useState } from 'react';


import Posts from '../services/posts.service';


import { Link, useParams } from 'react-router-dom';
import Post from './Post';
import { formatDistanceToNow } from 'date-fns';


export default function PostPage () {
    const [post, setPost] = useState(null);
    const [loading, isLoading] = useState(true);
    const [date, setDate] = useState(null);


    const { id } = useParams();

    useEffect(() => {

        async function fetchPost() {
            try {
                const post = await Posts.getPostById(id);
                setPost(post);
                setDate(formatDistanceToNow(new Date(post.date), { addSuffix: true }));

                console.log(post);
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
        return <div className="container"><p>Loading...</p></div>
    }


    return (
        <div className="container post-container">
            <div className="post-header">
                <Link to={`/post/${post._id}`} className="post-title">{post.title}</Link>
                <Link to={`/cat/${post.catId}`}className="post-cat">{post.catName}</Link>
                <p className="post-date">Posted {date}</p>
            </div>
            <div className="post-body">
                <img src={post.image} alt={post.title} />
            </div>


        </div>
    )
}