import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "tailwindcss/tailwind.css";
import Feed from "../feed";
import "./landing.css"
import { Link } from "react-router-dom";
import background from "../img/calendar-wallpaper.jpg"

function Landing() {
  
  return (
    <div className="h-screen" style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat' }}>
            <h1 className="landingHeader">
              {" "}
              Welcome to My Calendar
              {" "}
            </h1>
          <div>
            <Link className="linkStyle" to="/feed">
              <div className="loginButton" id="login">
                Login with Google
              </div>
            </Link>
          </div>
    </div>
  );
}

export default Landing;
