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
import { CircularProgress } from '@mui/material';
import RatingComponent from './RatingComponent';

//TODO: Send back array of cats and posts with user info
export default function Profile () {
    
    //Set up react query for fetching user info from URL params
    const {id} = useParams();

    const { user } = useContext(UserContext);
    
    
    async function fetchProfile () {
        try {
            const profile = await Users.getProfileById(id);
            return profile;
        } catch (err) {
            console.error(err);
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
        return <div className="loading-container"><CircularProgress /></div>
      }
      
      if (status === "error") {
        return <p className="error">An error has occurred: {error.message}</p>;
      }
    
    const date = formatDistanceToNow(new Date(profile?.user?.date), { addSuffix: true }) || null;
    
    const catsList = (profile && profile?.cats.length > 0) ? profile?.cats.map(cat => (
        <Cat cat={cat} key={cat._id}/>
    )) : <p>No cats yet!</p>;

const postsList = (profile && profile?.posts.length > 0) ? profile?.posts.map(post => (
    <div className="profile-post" key={post.id}><Post post={post} key={post.id}/></div>
)) : <p>No posts yet!</p>;

const ratingsList = (profile && profile?.ratings.length > 0) ? profile?.ratings.map(rating => (
    <Link key={rating._id} to={`/post/${rating.postId}`}><RatingComponent rating={rating} ></RatingComponent></Link>
)) : <p>No ratings yet!</p>;

const isUsersProfile = (profile?.user?._id === user.id) ? true : false;


    return (
        <div className="container profile-container">
            <div className="profile-header">
                <img src={profile?.user?.image ? profile.user.image : "./img/user-placeholder.png"} alt={profile.user.username} className="profile-image" />
                <h2>{profile?.user?.username}</h2>
                <p className={profile?.user?.bio ? "profile-bio" : "hidden"}>{profile?.user?.bio}</p>
                <p className="profile-ratings">Total ratings: {profile?.ratings?.length}</p>
                <time className="profile-date">Joined {date}</time>
                {isUsersProfile && <div className="edit-profile"><Link to="/edit-profile">Edit profile</Link></div>}
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
                <h2>Ratings</h2>
                <div className="profile-ratings"> 
                    {ratingsList}
                
                </div>


            </div>
    )


}