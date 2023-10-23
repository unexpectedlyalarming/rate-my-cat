import React from 'react';

export default function About() {

    return (
        <div className="container about-container">
            <h1>About</h1>
            <p>Rate my cat is a full-stack web application built with the MERN stack. It is a social media site for cat lovers. Users can create an account, post pictures of their cats, and rate other users' cats.</p>
            <h2>How do I use the site?</h2>
            <p>First you need an account. Then you need to go to your profile and create a cat. From there, you can post pictures featuring your cat. Make sure you pick the right one!</p>
            <p>Users can also rate cats, on a scale of 0-5 stars and leave a review. Be sure to check the leaderboard to see the top cats of the day, month, and year!</p>
            <a href="https://github.com/unexpectedlyalarming/rate-my-cat/"><p className="note">This is a work in progress app, so features are constantly being added. Stay tuned on the github repo for more info and a roadmap</p></a>
        </div>
    )
}