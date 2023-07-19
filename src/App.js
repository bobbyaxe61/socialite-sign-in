import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Landing = () => {

  const googleWebSignIn = () => {

    let data = {
      scope: 'openid+profile+email',
      include_granted_scopes: 'true',
      response_type:'token',
      state:'state_parameter_passthrough_value',
      redirect_uri:'https://example.com/api/auth/socialite/google/callback',
      client_id:'XXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com',
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?scope=${data.scope}&include_granted_scopes=${data.include_granted_scopes}&response_type=${data.response_type}&state=${data.state}&redirect_uri=${data.redirect_uri}&client_id=${data.client_id}`;
  }

  const appleWebSignIn = () => {

    let data = {
      client_id:'com.example.app',
      nonce:(Math.random() + 1).toString(36),
      redirect_uri:'https://example.com/api/auth/socialite/apple/callback',
      response_mode:'fragment',
      response_type:'code+id_token',
      scope: '',
      state:'state_parameter_passthrough_value',
    }

    return `https://appleid.apple.com/auth/authorize?client_id=${data.client_id}&nonce=${data.nonce}&redirect_uri=${data.redirect_uri}&response_mode=${data.response_mode}&response_type=${data.response_type}&scope=${data.scope}&state=${data.state}`;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>
          Inspect the <code>src/App.js</code> file to view the implementation.
        </p>

        <p>
          <a href={googleWebSignIn()}>Google Web Sign In</a>
        </p>

        <p>
          <a href={appleWebSignIn()}>Apple Web Sign In</a>
        </p>

      </header>
    </div>
  );
}

const Home = () => {

  React.useEffect(() => {

    const url = window.location.href.replace('#','?');
    const searchParams = new URLSearchParams(new URL(url).search);
    let access_token = searchParams.get('access_token');
    let id_token = searchParams.get('id_token');

    // Check if google login or apple login
    let socialite_url;
    let token;

    if (access_token) {
      socialite_url = "https://server.example.com/api/auth/socialite/google/callback";
      token = access_token;
    }

    if (id_token) {
      socialite_url = "https://server.example.com/api/auth/socialite/apple/callback";
      token = id_token;
    }

    if (socialite_url && token) {

      axios({
        url:socialite_url,
        method:'get',
        params: {
          token:token,
        }
      })
      .then(res=>{
        return console.log(res);
      })
      .catch(err=>{
        return console.log(err);
      });

    }

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
         Your Home
        </p>
      </header>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route index element={<Test />} /> */}
        <Route index element={<Landing />} />
        <Route path="/api/auth/socialite/google/callback" element={<Home />} />
        <Route path="/api/auth/socialite/apple/callback" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
