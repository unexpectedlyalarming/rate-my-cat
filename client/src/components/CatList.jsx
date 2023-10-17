import React from 'react';
import Cats from '../services/cats.service';
import Cat from './Cat';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';

export default function CatList() {

    async function fetchCats () {
        try {
            const cats = await Cats.getAllCats();
            if (!cats) {
                return 0;
            }

            return cats;
        } catch (err) {
            console.error(err)
        }
    }
    
    
     
    
    const {
        status,
        error,
        data: cats,
    } = useQuery({
        queryKey: ["cats"],
        queryFn: fetchCats,
        refetchInterval: 7000,
    });



    if (status === "loading") {
        return <div className="loading-container"><CircularProgress /></div>
      }
      
      if (status === "error") {
        return <p className="error">An error has occurred: {error.message}</p>;
      }

      const catsList = cats?.map((cat) => (
        <Cat cat={cat} key={cat._id}/>
      )) || [];
    return (
        <div className="container">
        <h1>CatList</h1>
        <div className="cats-container">
            {catsList}
        </div>
        </div>
    );
}