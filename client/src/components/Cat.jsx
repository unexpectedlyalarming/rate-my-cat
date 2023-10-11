import React from "react";
import { Link } from "react-router-dom";

export default function Cat({ cat }) {

    return (
        <Link className="cat-container" to={`/cat/${cat._id}`}> 

        <h2>{cat.name}</h2>
        <p>Breed: {cat.breed}</p>
        <p>Color: {cat.color}</p>
        <p>Age: {cat.age}</p>
        <p>Followers: {cat.followers.length}</p>
        <img className="cat-img" src={cat.image} alt={cat.name} />

        

        </Link>
    )
}