import React, { useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from '../hooks/http-hook';

import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import ErrorModal from '../components/UIElements/ErrorModal';

const UserSettings = () => {

    //THIS IS NEED TO BE HTTP REQUEST to get user data, not context
    const auth = useContext(AuthContext);

    const userId = useParams().uid;

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [loadedUserInfo, setLoadedUserInfo] = useState();

    useEffect(() => {
        //async is not used directly in useEffect. 
        const fetchItems = async () => {
            try {
                const responseData = await sendRequest(
                    `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/userInfo`,
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                );
                setLoadedUserInfo({ name: responseData.name, email: responseData.email });
            } catch (err) { }
        };
        fetchItems();
    }, [sendRequest, userId]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <h1>User information</h1>
            {loadedUserInfo && (
                <>
                    <p>User name: {loadedUserInfo.name}</p>
                    <p>Email: {loadedUserInfo.email}</p>
                </>
            )}
        </>
    )
};

export default UserSettings;