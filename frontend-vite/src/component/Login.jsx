import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login({ onLogin }) {
  const handleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/google', {
        token: credentialResponse.credential,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // store user info including role

      onLogin(user); // pass user info to App

    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <h2>Login with Google</h2>
      <GoogleLogin onSuccess={handleLogin} onError={() => alert("Login Failed")} />
    </div>
  );
}

export default Login;
