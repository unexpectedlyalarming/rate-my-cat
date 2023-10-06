import React, { useContext } from 'react';
import Auth from '../services/auth.service';
import { UserContext } from '../providers/userContext';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const navigate = useNavigate();


    async function handleRegister(e) {
        try {

            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
             if(Auth.register(username, password)){
                navigate('/login')
             }

        } catch (err) {
            console.error(err)
        }
    }
    return (
        <>
        <Nav/>
        <div className="container register-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}  >
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <button type="submit">Register</button>
            </form>
        </div>
        </>
    )
}