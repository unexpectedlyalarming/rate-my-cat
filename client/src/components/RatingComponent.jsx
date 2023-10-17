
import React from 'react';
import { useContext } from 'react';
import { UserContext } from '../providers/userContext';
import { formatDistanceToNow } from 'date-fns';
import { CircularProgress } from '@mui/material';

import Ratings from '../services/ratings.service';

export default function RatingComponent ({ rating }) {
    const { user } = useContext(UserContext);


    const date = formatDistanceToNow(new Date(rating.date), { addSuffix: true })




    async function handleDelete(e) {
        e.preventDefault();
        try {
            const deletedRating = await Ratings.deleteRating(rating._id);
            if (deletedRating) {
                console.log(deletedRating);
            } else {
                throw new Error("Rating not deleted");
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (!rating) return <div className="container"><CircularProgress /></div>;


    return (

        <div className="rating-container">
            <div className="rating-header">
                <h3 className="rating-title">{rating.rating}</h3>
                <p className="rating-author">{rating.username}</p>
                <time className="rating-date">Posted {date}</time>
            </div>
            <p className="rating-body">{rating.comment}</p>
            {user?.id === rating.userId ? <button className="delete-rating" onClick={handleDelete}>Delete</button> : null}

        </div>
    )
}

