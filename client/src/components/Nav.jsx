import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Auth from '../services/auth.service';
//Import usercontext from provider, check if logged in. If so, hide login/register buttons and show logout button

import { UserContext } from '../providers/userContext';

export default function Nav() {


    const {user, setUser} = useContext(UserContext);

    const [mobileMenu, setMobileMenu] = React.useState(false)

    function toggleMobileMenu() {
        setMobileMenu(!mobileMenu)
    }

    async function logout(e) {
        e.preventDefault();
        Auth.logout();
        setUser(null);
        Navigate('/')
        
    }

    //Import usercontext from provider, check if logged in. If so, hide login/register buttons and show logout button
    //If not logged in, show login/register buttons and hide logout button



const loggedOut = (
    <div className={`nav-container ${mobileMenu ? 'active' : ''}`}>
        <nav className="nav">
            <ul className="logged-out">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </nav>
    </div>
    );


        if (!user) return loggedOut;

    return (
        <div className={`nav-container ${mobileMenu ? 'active' : ''}`}>
        
        <nav className="nav">
            <ul>

                <li><Link to="/">Home</Link></li>
                <li><Link to="/cats">Cats</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>

            </ul>
            <ul className="logged-in">
                <li><button onClick={logout}>Logout</button>
                </li>
                </ul>

            
            
            </nav>
            <button className="nav-button" onClick={toggleMobileMenu}>Menu</button>

        </div>
    )

}