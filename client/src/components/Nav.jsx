import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../services/auth.service';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../providers/userContext';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PetsIcon from '@mui/icons-material/Pets';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
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
<></>
    );
        if (!user) return loggedOut;
    return (
        <div className={`nav-container ${mobileMenu ? 'active' : ''}`}>
        <nav className="nav">
            <ul>
            <li><Link to="/"><HomeIcon />Home</Link></li>

            </ul>
            <ul>
                <li><Link to="/cats">Cats (WIP)</Link></li>
                <li><Link to="/leaderboard"><LeaderboardIcon />Leaderboard</Link></li>
                <li><Link to="/facts"><PetsIcon/>Cat facts</Link></li>
                <li><Link to="/about"><QuestionMarkIcon />About</Link></li>
        
            </ul>
            <ul className="logged-in">
                <li className="nav-pfp"><img className="profile-image nav-image" src={user.image ? user.image : "./img/user-placeholder.png"} alt={user.username}/> <Link to={`/profile/${user?.id?.toString()}`}>Profile</Link></li>
                <li><button onClick={logout}>Logout</button></li>
                </ul>
            </nav>
            <button className="nav-button" onClick={toggleMobileMenu}> <MenuIcon /> </button>
        </div>
    )
}