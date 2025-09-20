import React from 'react';
import { NavLink, Link } from "react-router-dom";
import "./Welcome.css"

const Welcome = () => {
    return (
        <>
            <h1 className="welcome-title">Hi. Please sign up or login.</h1>
            <NavLink className="welcome"
                to="/auth"
            >login / signup</NavLink>
        </>
    )
};

export default Welcome;