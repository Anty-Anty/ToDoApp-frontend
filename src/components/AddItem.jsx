import React, { useCallback, useReducer, useContext } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import Card from './UIElements/Card';
import Input from './FormElements/Input';
import LoadingSpinner from './UIElements/LoadingSpinner';
import ErrorModal from './UIElements/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_MAXLENGTH } from './util/validators';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from "../context/auth-context";

import './AddItem.css';

const AddItem = props => {

    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    const itemSubmitHandler = async event => {
        event.preventDefault();

        try {
            const responseData = await sendRequest(import.meta.env.VITE_BACKEND_URL + '/items',
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );

            props.onItemAdded(responseData.item);
            props.closeAddHandler();

        } catch (err) { };
        // console.log(props.userId); /* delete later? */
        // console.log(formState);
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <div className='items-list'>
                <div className='add-item'>
                    <Card className='add-item__content'>
                        <form className='add-item__form' onSubmit={itemSubmitHandler}>
                            <div className='add-item__input'>
                                {isLoading && <LoadingSpinner asOverlay />}
                                <Input
                                    id='title'
                                    element="input"
                                    name="toDoItem"
                                    placeholder="to do item"
                                    className='add-input'
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText='Please enter a valid title.'
                                    onInput={inputHandler}
                                />

                                <Input
                                    id='description'
                                    element="textarea"
                                    name="description"
                                    placeholder="description"
                                    // rows={2}
                                    className='add-textarea'
                                    validators={[VALIDATOR_MINLENGTH(3), VALIDATOR_MAXLENGTH(170)]}
                                    errorText='Please enter a valid description (at least 5 characters, max 200).'
                                    onInput={inputHandler}
                                />

                            </div>
                            <div className="add-button-stack">
                                <button
                                    type="submit"
                                    disabled={!formState.isValid}
                                    className={`btn ${!formState.isValid ? 'btn-disabled' : ''}`}

                                >add</button>
                                <button type="button" onClick={props.closeAddHandler}>cancel</button>

                            </div>
                        </form>

                    </Card>

                </div>
            </div>
        </>
    );
};

export default AddItem;