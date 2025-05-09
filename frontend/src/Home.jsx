// HomePage.js
import React from 'react';
import yourImage from './assets/image 1.png';
import './Home.css';
function HomePage() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>WELCOME TO BLOCKCHAIN SUPPLYCHAIN PROJECT</p>
      <img src={yourImage} alt="logo image"  className="home-image" />
    </div>
  );
}

export default HomePage;
