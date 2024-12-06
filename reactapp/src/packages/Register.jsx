import React from 'react'
import axios from "axios";
import { API_URL } from '..';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  const [Gos,setGos] = React.useState(true);
  const navigate = useNavigate();
function submitHandler(e) {
  if (Gos) {

    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    console.log(email);
    axios.post(`${API_URL}get_code`, {email: email}).then((res) => setGos(false)).catch((err) => console.log(err));
    ;
  }
  else{
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  const code = formData.get('code');
  axios.post(`${API_URL}register`, {email: email, password: password, code: code}).then(navigate('/login')).catch((err) => console.log(err));

  
  }

  
}



  return (
    <div className="">

    <div>
      <form action="" method='POST' onSubmit={(e) => submitHandler(e)}>
        <input type="text" name="email" placeholder='Email'/>
        {Gos==true ?<button type='submit'>Получить код</button>
        :<input type="text" name="code" placeholder='Код'/>}
        <input type="password" name="password" placeholder='Пароль'/>
        <button type='submit'>Зарегистрироваться</button>
      </form>
    </div>

    </div>

  )
}
