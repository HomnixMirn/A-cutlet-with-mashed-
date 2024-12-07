import React from 'react'
import './login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '..';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    function submitHandler(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        axios.post(`${API_URL}forgotPassword`, {email: email}).then((res) => navigate('/')).catch((err) => console.log(err));
        ;
    }
    return (
        <div className="login-container">
            <form action="" method='POST' onSubmit={(e) => submitHandler(e)}>
                <input type="email" name='email'/>
                <button type="submit">Отправить на почту</button>
                </form>
            </div>
    )

}

export default ForgotPassword