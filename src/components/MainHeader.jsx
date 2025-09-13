import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";

import { AuthContext } from "../context/auth-context";
import "./MainHeader.css";

const MainHeader = props => {
    const auth = useContext(AuthContext);

    // console.log(auth.isLoggedIn);

    return (
        <header className="main-header">
            <h1><Link 
            to={auth.isLoggedIn ? (`/${auth.userId}/list`):("/")}
            >ToDo List</Link></h1>

            <div className="nav-link-container">

                {auth.isLoggedIn ? (
                    <>
                            <NavLink className='nav-link'
                                to={`/${auth.userId}/settings`}
                            >◯</NavLink>
                        
                            <button className='nav-link-button' type="button" onClick={auth.logout}>logout</button>
                    </>
                ) : (
                        <NavLink className='nav-link'
                            to="/auth"
                        // className={({ isActive }) => isActive ? 'active-link' : undefined}
                        >{auth.isLoggedIn ? 'logout' : 'login'}</NavLink>
                )}

            </div>
        </header>
    )
};

export default MainHeader;