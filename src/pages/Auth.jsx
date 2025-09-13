import React, { useState, useContext } from "react";

import Card from "../components/UIElements/Card";
import Input from "../components/FormElements/Input";
import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL } from "../components/util/validators";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from '../hooks/http-hook'
import { AuthContext } from "../context/auth-context";

import './Auth.css'


const Auth = () => {

    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const switchModeHandler = () => {
        // this triggered when we switch from signup mode to loging
        // and it drops the name field
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
            // this triggered when we switch from login to signup
            // form-hook.js is modified that it has name field 
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            //LOGIN mode
            try {
                
                const responseData = await sendRequest(import.meta.env.VITE_BACKEND_URL + '/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }), {
                    'Content-Type': 'application/json',
                }
                );

                auth.login(responseData.userId, responseData.name, responseData.token);

            } catch (err) { };

        } else {
            //SIGNUP mode
            try {
                //data we send to API:
                const responseData = await sendRequest(import.meta.env.VITE_BACKEND_URL + '/users/signup',
                    'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        'Content-Type': 'application/json',
                    }
                );

                //based on what backend returns:
                // auth.login(responseData.user.id, responseData.user.name);
                auth.login(responseData.userId, responseData.name, responseData.token);

            } catch (err) { };

        }
    };

    const errorHandler = () => {
        clearError();
    };

    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            <Card className='auth-container'>
                {isLoading && <LoadingSpinner asOverlay />}
                <form onSubmit={authSubmitHandler} className='auth-form'>
                    <h3>{isLoginMode ? 'login' : 'signup'}</h3>
                    {!isLoginMode &&
                        <Input
                            id="name"
                            element="input"
                            type="text"
                            placeholder="name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name."
                            onInput={inputHandler}
                        />}

                    <Input
                        id='email'
                        element='input'
                        name='email'
                        type='email'
                        placeholder='email'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />

                    <Input
                        id='password'
                        element='input'
                        name='password'
                        type='password'
                        placeholder='password'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password at least 6 characters."
                        onInput={inputHandler}
                    />

                    <button
                        type="submit"
                        disabled={!formState.isValid}
                        className={`btn ${!formState.isValid ? 'btn-disabled' : ''}`}
                    >
                        {isLoginMode ? 'login' : 'signup'}
                    </button>
                    {/* <button type='button'>cancel</button> */}
                    <button type='button' onClick={switchModeHandler} className="auth-text-button">
                        switch to {isLoginMode ? 'signup' : 'login'}
                    </button>
                </form>
            </Card>

        </>
    )
};

export default Auth;