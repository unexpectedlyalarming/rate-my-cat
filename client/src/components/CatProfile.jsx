
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../providers/userContext';
import { Link, useParams } from 'react-router-dom';
import Cats from '../services/cats.service';
import Post from './Post';
import { CircularProgress } from '@mui/material';


export default function CatProfile () {
    
    const {id} = useParams();
    
    
    
    async function fetchCat () {
        try {
            const cat = await Cats.getCatById(id);

            return cat;
        } catch (err) {
            console.error(err)
        }
    }
    
    
     
    
    const {
        status,
        error,
        data: cat,
    } = useQuery({
        queryKey: ["cat"],
        queryFn: fetchCat,
        refetchInterval: 7000,
    });

    if (status === "loading") {
        return <div className="loading-container"><CircularProgress /></div>
      }
      
      if (status === "error") {
        return <p className="error">An error has occurred: {error.message}</p>;
      }
    
    

const postsList = (cat && cat?.posts?.length > 0) ? cat?.posts.map(post => (
    <Post post={post} key={post.id}/>
)) : <p>No posts yet!</p>;

    return (
        <div className="container profile-container cat-profile">
            <div className="profile-header">
                <h2>{cat?.name}</h2>
                <p className="profile-date">{cat?.age?.toString()} years old</p>
                <p className="profile-color">Color: {cat?.color}</p>
                <p className="profile-breed">Breed: {cat?.breed}</p>
                <Link className="profile-owner" to={`/profile/${cat?.userId}`}>Owner: {cat?.owner}</Link>
                <p className="profile-ratings">Total ratings: {cat?.ratings?.length}</p>
                </div>
                <div className="profile-posts"> 
                <h2>Posts</h2>
                    {postsList}
                
                </div>


            </div>
    )


}