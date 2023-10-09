import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Posts from '../services/posts.service';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
export default function Post ({ post }) {

    const date = formatDistanceToNow(new Date(post.date), { addSuffix: true });


    //
    async function handleReview () {



    }

    async function handleReact () {

    }







        
        return (
            <div className="post-container">
            <div className="post-header">
                <Link to={`/post/${post._id}`} className="post-title">{post.title}</Link>
                <Link to={`/cat/${post.catId}`}className="post-cat">{post.catName}</Link>
                <p className="post-date">Posted {date}</p>
            </div>
            <div className="post-body">
                <img src="./img/placeholder.jpg" alt={post.title} />
            </div>
            <div className="post-footer">
                <button onClick={handleReview}>Review</button>
                <button onClick={handleReact}>React</button>
            </div>
        </div>
    )
}