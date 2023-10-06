import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Posts from '../services/posts.service';

export default function Post ({ post }) {


    //
    async function handleReview () {



    }

    async function handleReact () {

    }







        
        return (
            <div className="post-container">
            <div className="post-header">
                <h3>{post.title}</h3>
                <p>{post.username}</p>
                <p>{post.date}</p>
            </div>
            <div className="post-body">
                <img src={post.image} alt={post.title} />
            </div>
            <div className="post-footer">
                <button onClick={handleReview}>Review</button>
                <button onClick={handleReact}>React</button>
            </div>
        </div>
    )
}