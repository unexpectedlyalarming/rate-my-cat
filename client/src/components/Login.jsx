import React, { useContext, useEffect, useState } from 'react';
import Auth from '../services/auth.service';
import Nav from './Nav';
import { UserContext } from '../providers/userContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    
    const {user, setUser} = useContext(UserContext);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    async function handleGuest() {
        try {
            const guestUser = await Auth.login("guest", "guest");
            if (guestUser instanceof Error) {
                setErrorMsg(guestUser.message);
                throw guestUser;
            }
            if (guestUser) {
                await setUser(guestUser.user);
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async function handleLogin(e) {
        try {

            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;

            const loggedUser = await Auth.login(username, password);
            console.log(loggedUser)
            if(loggedUser instanceof Error) {
                setErrorMsg(loggedUser.message);
                throw loggedUser;
            }
            if (loggedUser) {
                await setUser(loggedUser.user);

            }
        } catch (err) {
            throw new Error(err.message);
        }
    }
    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user]);

    return (
        <>
        <Nav/>
        <div className="container login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="form-container">
                <label htmlFor="username">Username</label>
                <input placeholder="Username" type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input placeholder="Password" type="password" name="password" id="password" />
                <p className={errorMsg ? "error" : "hidden"}>{errorMsg}</p>
                <button type="submit">Login</button>
                <button type="button" onClick={handleGuest}>Login as guest</button>
                <button type="button" onClick={() => navigate('/register')}>Register</button>
                
            </form>
        </div>
        </>
    )
}