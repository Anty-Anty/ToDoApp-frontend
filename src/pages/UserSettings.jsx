import React, { useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from '../hooks/http-hook';

import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import ErrorModal from '../components/UIElements/ErrorModal';

import './UserSettings.css';

const UserSettings = () => {

    const auth = useContext(AuthContext);

    const userId = useParams().uid;

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [loadedUserInfo, setLoadedUserInfo] = useState();
    const [pickedColor, setPickedColor] = useState("#ffd900");

    //FETCH USER DATA
    useEffect(() => {
        //async is not used directly in useEffect. 
        const fetchUserData = async () => {
            try {
                const responseData = await sendRequest(
                    `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/userInfo`,
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                );
                setLoadedUserInfo({
                    name: responseData.name,
                    email: responseData.email,
                    createdAt: responseData.createdAt
                });

                setPickedColor(responseData.userTitleColor || "#ffd900");
            } catch (err) { }
        };
        fetchUserData();
    }, [sendRequest, userId]);

    // SAVE PICKED COLOR:
    const saveColorHandler = async (colorToSave = pickedColor) => {
        try {
            await sendRequest(
                `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/color`,
                'PATCH',
                JSON.stringify({ userTitleColor: pickedColor }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
        } catch (err) { }
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <h1>User information</h1>
            {loadedUserInfo && (
                <>
                    <p>User name: {loadedUserInfo.name}</p>
                    <p>Email: {loadedUserInfo.email}</p>
                    {/* <p>Joined: {new Date(loadedUserInfo.createdAt).toLocaleDateString()}</p> */}
                    <p>
                        Joined:{" "}
                        {new Date(loadedUserInfo.createdAt).toLocaleDateString("en-US", {
                            month: "short", // "Sep"
                            day: "numeric", // "13"
                            year: "numeric", // "2025"
                        })}
                    </p>

                    {/* Color Picker */}
                    <div style={{ marginTop: "20px" }}>
                        <label htmlFor="colorPicker">Pick item title color: </label>
                        <input
                            id="colorPicker"
                            type="color"
                            value={pickedColor}
                            onChange={(e) => setPickedColor(e.target.value)}
                        />
                        <button 
                        onClick={() => setPickedColor("#ffd900")} 
                        className="user-set-text-button"
                        style={{ "--user-title-color": pickedColor }}
                        >Set to default color</button>
                        <p>Selected color: <span style={{ color: pickedColor }}>{pickedColor}</span></p>
                        <button onClick={saveColorHandler}>Save Color</button>
                    </div>
                </>
            )}
        </>
    )
};

export default UserSettings;