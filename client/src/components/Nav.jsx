import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../services/auth.service';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../providers/userContext';
import HomeIcon from '@mui/icons-material/Home';
export default function Nav() {
    const navigate = useNavigate();

    const {user, setUser} = useContext(UserContext);
    // Toggle mobile menu
    const [mobileMenu, setMobileMenu] = React.useState(false)
    function toggleMobileMenu() {
        setMobileMenu(!mobileMenu)
    }

    async function logout(e) {
        e.preventDefault();
        Auth.logout();
        setUser(null);
        navigate('/')
    }


const loggedOut = (
    <div className={`nav-container ${mobileMenu ? 'active' : ''}`}>
        <nav className="nav">
            <ul className="logged-out">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </nav>
        <button className="nav-button" onClick={toggleMobileMenu}>Menu</button>
    </div>
    );
        if (!user) return loggedOut;
    return (
        <div className={`nav-container ${mobileMenu ? 'active' : ''}`}>
        <nav className="nav">
            <ul>
                <li><Link to="/"><HomeIcon /></Link></li>
                <li><Link to="/cats">Cats</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                <li><Link to="/facts">Cat facts</Link></li>
            </ul>
            <ul className="logged-in">
                <li className="nav-pfp"><img className="profile-image nav-image" src={user.image} alt={user.username}/> <Link to={`/profile/${user?.id?.toString()}`}>Profile</Link></li>
                <li><button onClick={logout}>Logout</button></li>
                </ul>
            </nav>
            <button className="nav-button" onClick={toggleMobileMenu}> <MenuIcon /> </button>
        </div>
    )
}