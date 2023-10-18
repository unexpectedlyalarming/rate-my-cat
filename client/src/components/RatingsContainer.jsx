import React from 'react';
import { useQuery } from '@tanstack/react-query'
import RatingComponent from './RatingComponent';
import { CircularProgress } from '@mui/material';
import Ratings from '../services/ratings.service';
import CreateRating from './CreateRating';
const RatingsContainer = ({id}) => {



    async function fetchRatings() {
        try {
            const ratings = await Ratings.getRatingsByPostId(id);

            return ratings;
        } catch (err) {
            console.error(err)
        }
    }



    const {
        status,
        error,
        data: ratings,
    } = useQuery({
        queryKey: ["ratings"],
        queryFn: fetchRatings,
        refetchInterval: 7000,
    });

    
    const ratingsList = ratings?.length > 0 ? ratings?.map((currentRating) => (
      <RatingComponent rating={currentRating} key={currentRating._id}/>
    )) : <p>No ratings yet!</p>;


    if (status === "loading") return <div className="container"><CircularProgress /></div>;


    return (
        <>
            <CreateRating id={id}/>
            {ratingsList}

        </>
    );
};

export default RatingsContainer;
