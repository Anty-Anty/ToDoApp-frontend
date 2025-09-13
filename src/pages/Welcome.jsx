import React from 'react';
import { NavLink, Link } from "react-router-dom";

const Welcome = () => {
    return (
        <>
            <h1>Hi. Please sign up or login</h1>
            <NavLink
                to="/auth"
            >login</NavLink>
        </>
    )
};

export default Welcome;