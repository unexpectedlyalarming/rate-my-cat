
import React from 'react';

export default function Rating ({ rating }) {

    return (

        <div className="rating-container">
            <div className="rating-header">
                <h3 className="rating-title">{rating.rating}</h3>
                <p className="rating-author">{rating.username}</p>
                <time className="rating-date">Posted {rating.date}</time>
            </div>
            <p className="rating-body">{rating.comment}</p>

        </div>
    )
}

