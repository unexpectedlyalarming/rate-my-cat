
import React from 'react';
import { useContext, useState } from 'react';
import { UserContext } from '../providers/userContext';
import { formatDistanceToNow } from 'date-fns';
import { Alert, CircularProgress, Rating } from '@mui/material';
import Ratings from '../services/ratings.service';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
export default function RatingComponent ({ rating }) {
    const { user } = useContext(UserContext);
    const [alert, setAlert] = useState(false);

    async function toggleAlert () {
        setAlert(true);

    }



    const date = formatDistanceToNow(new Date(rating.date), { addSuffix: true })




    async function handleDelete(e) {
        e.preventDefault();
        try {
            const deletedRating = await Ratings.deleteRating(rating._id);
            if (deletedRating) {
                toggleAlert();
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
            <Rating value={rating.rating / 2} precision={0.5} readOnly />
                <Link to={`/profile/${rating.userId}`} className="rating-author">{rating.username}</Link>
                <time className="rating-date">Posted {date}</time>
            </div>
            <p className="rating-body">{rating.comment}</p>
            {user?.id === rating.userId ? <button className="delete-rating" onClick={handleDelete}><DeleteIcon /></button> : null}
            <Alert severity="success" className={`alert ${alert ? "" : "hidden"}`}>Rating deleted!</Alert>

        </div>
    )
}

