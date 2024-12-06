import React from 'react'
import './login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '..';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();
    function submitHandler(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const url = new URL(window.location.href);
        const email = url.pathname.split('/')[2];
        
        axios.post(`${API_URL}resetPassword/${email}`, {password: password}).then((res) => navigate('/')).catch((err) => console.log(err));
        ;
    }
    const url = new URL(window.location.href);
    console.log(url.pathname.split('/')[2]);
    
    return (
        <div className="login-container">
            <form action="" method='POST' onSubmit={(e) => submitHandler(e)}>
                <input type="password" name='password'/>
                <input type="password" name='password_check'/>
                <button type="submit">Обновить Пароль</button>
                </form>
            </div>
    )
}
