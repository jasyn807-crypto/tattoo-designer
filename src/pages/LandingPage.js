import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      <h1>Welcome to the Tattoo Design App!</h1>
      <p>Your ultimate tool for generating and modifying tattoo designs with AI.</p>
      <div>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default LandingPage;