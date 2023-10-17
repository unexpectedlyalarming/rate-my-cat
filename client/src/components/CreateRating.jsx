import { CircularProgress, Rating } from '@mui/material';
import React, { useState } from 'react';
import Ratings from '../services/ratings.service';
import { TextareaAutosize } from '@mui/material'

export default function RatingComponent ({ id }) {
    const [currentRating, setCurrentRating] = useState(0);

    async function createRating(e) {
        e.preventDefault();
        try {
            
            const newRating = {
                rating: currentRating * 2,
                comment: e.target.elements.comment.value,
                postId: id,
            }
            console.log("Creating!")
            const createdRating = await Ratings.createRating(newRating);
            if (createdRating) {
                console.log(createdRating);
                e.target.reset();
            } else {
                throw new Error("Rating not created");
            }
            
        } catch (err) {
            console.error(err);
        }
    }
    if (isNaN(currentRating)) setCurrentRating(0);

    if ( isNaN(currentRating)) return <div className="container"><CircularProgress /></div>;


    
        return (
    

                <form className="rating-form form-container" onSubmit={createRating} >


                    <label htmlFor="rating">{`${currentRating} stars (${currentRating * 2}/10)`}</label>
                    <Rating name="rating" value={currentRating} precision={0.5} onChange={(event, newValue) => setCurrentRating(newValue)} />
                    <label htmlFor="comment">Comment</label>
                    <TextareaAutosize name="comment" id="comment" minRows={3} placeholder="Comment" required></TextareaAutosize>
                    <button type="submit" >Submit</button>
 
                    </form>

        )
    }