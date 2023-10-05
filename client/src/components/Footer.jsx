import React from 'react';
import { Link } from 'react-router-dom';


export default function Footer () {

    return (
        <footer>
            <div className="section-1">
                <ul>
                    <Link to="/contact">Contact</Link>
                    <Link to="/about">About</Link>
                    <Link to="/terms">Terms</Link>
                    <Link to="/privacy">Privacy</Link>

                </ul>

            </div>
            <div className="section-2">
                <ul>

                    <Link to="/cats">Cats</Link>
                    <Link to="/leaderboard">Leaderboard</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </ul>
                
                </div>
            </footer>

    )
    
}