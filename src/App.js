import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Use your Client ID from .env

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);
    setIsLoggedIn(true);   };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>React Google Sign-In</h1>

        {/* Conditionally render the login button or logged-in message */}
        {!isLoggedIn ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        ) : (
          <div>
            <h2>You are logged in!</h2>
            <p>Welcome to the application.</p>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;