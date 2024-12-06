import React from 'react'


export default function Register() {
  const [Gos,setGos] = React.useState(true);

function submitHandler(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const fname = formData.get('fname');
  const oname = formData.get('oname');
  const email = formData.get('email');
  const password = formData.get('password');
  const password2 = formData.get('password2');
  console.log(name, fname, oname, email, password, password2);
  if (password !== password2) {
    alert('Пароли не совпадают');

  }else{
    setGos(false);

  }
}

  return (
    <div className="">
    { Gos ? 
    <div>
      <form action="" method='POST' onSubmit={(e) => submitHandler(e)}>
        <input type="text" name="name" placeholder='Имя'/>
        <input type="text" name="fname" placeholder='Фамилия'/>
        <input type="text" name="oname" placeholder='Отчество'/>
        <input type="text" name="email" placeholder='Email'/>
        <input type="password" name="password" placeholder='Пароль'/>
        <input type="password" name="password2" placeholder='Повторите пароль'/>
        <button type='submit'>Зарегистрироваться</button>
      </form>
    </div>
    :
      <div>
      <form action="" method='POST'>
        <input type="text" name="code" placeholder='Код'/>
      </form>
    </div>
    }
    </div>

  )
}
