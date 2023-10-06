import React, { useContext, useEffect } from 'react';
import Auth from '../services/auth.service';
import Nav from './Nav';
import { UserContext } from '../providers/userContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    async function handleLogin(e) {
        try {

            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            await setUser(await Auth.login(username, password));
        } catch (err) {
            console.error(err)
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
            <form onSubmit={handleLogin}  >
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <button type="submit">Login</button>
            </form>
        </div>
        </>
    )
}