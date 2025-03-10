import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Use your Client ID from .env

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log('Login Success:', credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
}

export default App;