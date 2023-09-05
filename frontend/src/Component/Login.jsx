import { useState, useRef } from 'react';
import axios from '../Api/apiService';
import { useNavigate } from 'react-router-dom';
import "./style.css"


const Login = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const name = nameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const response = await axios.post('/adduser', { name, email, password });
       console.log(response)
      
     
        navigate('/userhome');
      
    } catch (error) {
      setErr("Email already exists")
      console.error('Network error:', error);
    }
  };

  return (
    <div className="form-container">
      <p style={{ color: 'red' }}>{err ? err : ''}</p>
      <h2>Signup</h2>
      <form onSubmit={handleSubmitForm}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            ref={nameRef}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            ref={emailRef}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            ref={passwordRef}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Login;
