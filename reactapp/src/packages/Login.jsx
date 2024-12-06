import React from 'react'

export default function Login() {
    function submitHandler(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        console.log(email, password);
    }
  return (  
    <div>
        <form action="" method='POST' onSubmit={(e) => submitHandler(e)}>
            <input type="email" name="email" />
            <input type="password" name='password' />
            <button type='submit'>Войти</button>
        </form> 
    </div>
  )
}
