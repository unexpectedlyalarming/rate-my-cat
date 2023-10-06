//User profile component, includes user info, cat info, and cat rating history

import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../providers/userContext';
import { useParams } from 'react-router-dom';
import Users from '../services/users.service';
import Posts from '../services/posts.service';
import Cat from './Cat';
import Post from './Post';

//TODO: Send back array of cats and posts with user info
export default function Profile ({ user }) {


    return (
        <div className="container profile-container">
            <div className="profile-header">
                <h2>{user.username}</h2>
                <p className="profile-date">Joined: {user.date}</p>
                <p className="profile-bio">{user.bio}</p>
                <p className="Total ratings: {user.ratings.length}"></p>
                </div>
                <div className="profile-cats"> 
                    {user.cats.map(cat => {
                        <Cat cat={cat} key={cat.id}/>
                    })}
                
                </div>
                <div className="profile-posts"> 
                    {user.posts.map(post => {
                        <Post post={post} key={post.id}/>
                    })}
                
                </div>


            </div>
    )


}