import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {

    return (
        <div className="container">
            <h1>404: Page Not Found</h1>
            <p>Maybe you meant to go somewhere else?</p>
            <Link to="/">Go home</Link>
        </div>
    )
}