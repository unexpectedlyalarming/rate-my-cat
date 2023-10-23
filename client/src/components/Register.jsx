import React, { useContext, useState } from 'react';
import Auth from '../services/auth.service';
import { UserContext } from '../providers/userContext';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState(null);


    async function handleRegister(e) {
        try {

            e.preventDefault();


            const username = e.target.username.value;
            const password = e.target.password.value;
            const confirmPassword = e.target.confirmPassword.value;

            if (password !== confirmPassword) {
                setErrorMsg('Passwords do not match');
                throw new Error('Passwords do not match');
            }
            const newUser = await Auth.register(username, password);

            if (newUser instanceof Error)  {
                setErrorMsg(newUser.message);
                throw newUser;
            }
             if (newUser) {
                navigate('/login');
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
            <form onSubmit={handleRegister} className="form-container" >
                <label htmlFor="username">Username</label>
                <input placeholder="Username" type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input placeholder="Password" type="password" name="password" id="password" />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input placeholder="Confirm Password" type="password" name="confirmPassword" id="confirmPassword" />
                <p className={errorMsg ? "error" : "hidden"}>{errorMsg}</p>

                <button type="submit">Register</button>
            </form>
        </div>
        </>
    )
}