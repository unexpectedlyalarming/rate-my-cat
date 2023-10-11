import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Posts from '../services/posts.service';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
export default function Post ({ post }) {

    const navigate = useNavigate();

    const date = formatDistanceToNow(new Date(post.date), { addSuffix: true });


    //

    async function handleReact () {

    }







        
        return (
            
            <div className="post-container">
            <div className="post-header">
                <Link to={`/post/${post._id}`} className="post-title">{post.title}</Link>
                <Link to={`/cat/${post.catId}`}className="post-cat">{post.catName}</Link>
                <p className="post-date">Posted {date}</p>
            </div>
            <Link className="post-body">
                <img src={post.image} alt={post.title} />
            </Link>
            <div className="post-footer">
                <Link>{post.ratings ? post?.ratings?.length : "0"} Ratings (Be the first?)</Link>
                <button onClick={handleReact}>React</button>
            </div>
        </div>
    )
}