import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
    const queryClient = useQueryClient();
    
    
    
    const {
        status,
        data: ratings,
        refetch,
    } = useQuery({
        queryKey: ["ratings"],
        queryFn: fetchRatings,
        refetchInterval: 7000,
    });


    const { mutate: mutateRating } = useMutation((rating) => {
        const newRating = rating;
        return newRating;
    }, {
        onSuccess: (newRating) => {
            // handle success
            queryClient.setQueryData(
                ["ratings"],
                (existingRatings) => [...existingRatings, newRating]
              );
        },
        onError: (err) => {
          console.error(err);
        },
      });
    
    
    async function handleCreate(rating) {
             mutateRating(rating);
      }

      useEffect(() => {
        if (status === "success") {
            refetch();
      }
    }
    , [status, refetch, ratings]);


    



    

    
    const ratingsList = ratings?.length > 0 ? ratings?.map((currentRating) => (
      <RatingComponent rating={currentRating} key={currentRating._id}/>
    )) : <p>No ratings yet!</p>;


    if (status === "loading") return <div className="container"><CircularProgress /></div>;


    return (
        <>
            <CreateRating id={id} handleCreate={handleCreate}/>
            <div className="ratings-container">

            {ratingsList}
            </div>

        </>
    );
};

export default RatingsContainer;
