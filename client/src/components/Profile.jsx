//User profile component, includes user info, cat info, and cat rating history

import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../providers/userContext';
import { Link, useParams } from 'react-router-dom';
import Users from '../services/users.service';
import Posts from '../services/posts.service';
import { formatDistanceToNow } from 'date-fns';
import Post from './Post';
import Cat from './Cat';


//TODO: Send back array of cats and posts with user info
export default function Profile () {
    
    //Set up react query for fetching user info from URL params
    const {id} = useParams();
    
    
    async function fetchProfile () {
        try {
            const profile = await Users.getProfileById(id);
            return profile;
        } catch (err) {
            console.error(err)
        }
    }
    
    
    
    
    const {
        status,
        error,
        data: profile,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
        refetchInterval: 7000,
    });

    if (status === "loading") {
        return <p>Loading...</p>;
      }
      
      if (status === "error") {
        return <p className="error">An error has occurred: {error.message}</p>;
      }
    
    const date = formatDistanceToNow(new Date(profile?.user?.date), { addSuffix: true }) || null;
    
    const catsList = (profile && profile?.cats.length > 0) ? profile?.cats.map(cat => (
        <Cat cat={cat} key={cat.id}/>
    )) : <p>No cats yet!</p>;

const postsList = (profile && profile?.posts.length > 0) ? profile?.posts.map(post => (
    <Post post={post} key={post.id}/>
)) : <p>No posts yet!</p>;

const isUsersProfile = (profile?.user?._id === id) ? true : false;

    return (
        <div className="container profile-container">
            <div className="profile-header">
                <h2>{profile?.user?.username}</h2>
                <p className="profile-date">Joined {date}</p>
                <p className="profile-bio">{profile?.user?.bio}</p>
                <p className="profile-ratings">Total ratings: {profile?.ratings?.length}</p>
                </div>
                <h2>Cats</h2>
                {isUsersProfile && <p className="profile-add-cat"><Link to="/add-cat">Add a cat</Link></p>}
                <div className="profile-cats"> 
                    {catsList}
                
                </div>
                <h2>Posts</h2>
                <div className="profile-posts"> 
                    {postsList}
                
                </div>


            </div>
    )


}