import React from 'react';
import { Link } from 'react-router-dom';
export default function Nav() {
    const [mobileMenu, setMobileMenu] = React.useState(false)

    function toggleMobileMenu() {
        setMobileMenu(!mobileMenu)
    }



    return (
        <div className={`nav-container ${mobileMenu ? 'active' : ''}`}>
        
        <nav className="nav">
            <ul>

                <li><Link href="/">Home</Link></li>
                <li><Link href="/cats">Cats</Link></li>
                <li><Link href="/leaderboard">Leaderboard</Link></li>

            </ul>
            <ul>
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/register">Register</Link></li>
                <li><Link href="/logout">Logout</Link></li>

            </ul>
            </nav>
            <button className="nav-button" onClick={toggleMobileMenu}>Menu</button>

        </div>
    )

}