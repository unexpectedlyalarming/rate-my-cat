//User profile component, includes user info, cat info, and cat rating history

import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../providers/userContext';
import { useParams } from 'react-router-dom';
import Users from '../services/users.service';
import Posts from '../services/posts.service';



//TODO: Send back array of cats and posts with user info
export default function Profile () {

    //Set up react query for fetching user info from URL params
    const {id} = useParams();


    async function fetchProfile () {
        const profile = await Users.getUserById(id);
        return profile;
      }
    
    
    
    
      const {
        status,
        error,
        data: user,
    } = useQuery({
        queryKey: ["user"],
        queryFn: fetchProfile,
        refetchInterval: 7000,
    });
    


    return (
        <div className="container profile-container">
            <div className="profile-header">
                <h2>{user?.username}</h2>
                <p className="profile-date">Joined: {user?.date}</p>
                <p className="profile-bio">{user?.bio}</p>
                <p className="Total ratings: {user.ratings.length}"></p>
                </div>
                <div className="profile-cats"> 
                    {user ? user?.cats.map(cat => {
                        <Cat cat={cat} key={cat.id}/>
                    }) : null}
                
                </div>
                <div className="profile-posts"> 
                    {user ? user?.posts.map(post => {
                        <Post post={post} key={post.id}/>
                    }) : null}
                
                </div>


            </div>
    )


}