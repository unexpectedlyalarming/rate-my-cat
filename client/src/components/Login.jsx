import React, { useContext, useEffect, useState } from 'react';
import Auth from '../services/auth.service';
import Nav from './Nav';
import { UserContext } from '../providers/userContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    
    const {user, setUser} = useContext(UserContext);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    async function handleLogin(e) {
        try {

            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;

            const loggedUser = await Auth.login(username, password);
            if(loggedUser instanceof Error) {
                setErrorMsg(loggedUser.message);
                throw loggedUser;
            }
            if (loggedUser) {
                await setUser(loggedUser);
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
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <p className={errorMsg ? "error" : "hidden"}>{errorMsg}</p>
                <button type="submit">Login</button>
            </form>
        </div>
        </>
    )
}