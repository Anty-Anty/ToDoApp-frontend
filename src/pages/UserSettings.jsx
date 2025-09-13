import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const UserSettings = () => {

    //THIS IS NEED TO BE HTTP REQUEST to get user data, not context
    const auth = useContext(AuthContext);

    return (
        <>
            <h1>User settings</h1>
            <p>User name: {auth.userName}</p>
        </>
    )
};

export default UserSettings;