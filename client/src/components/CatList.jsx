import React from 'react';
import Cats from '../services/cats.service';
import Cat from './Cat';
import { useQuery } from '@tanstack/react-query';

export default function CatList() {

    async function fetchCats () {
        try {
            const cats = await Cats.getAllCats();

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
        return <p>Loading...</p>;
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