import React, { useRef, useState, useEffect, useContext } from "react";
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './UIElements/Backdrop';
import Input from "./FormElements/Input";
import LoadingSpinner from "./UIElements/LoadingSpinner";
import ErrorModal from "./UIElements/ErrorModal";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from './util/validators'
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";

import './EditItem.css'

const EditOverlay = props => {

    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
    // loading spinner is managed locally (not with http-hook)
    const [formReady, setFormReady] = useState(false);

    const [formState, inputHandler, setFormData] = useForm(
        // initialization of form
        //Probably setting initial data is not nessasry since I render either Loading spinner (formReady) or form
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        }, false);

    // FINDING ITEM IN ToDoList's props.Items array instead of fetching from DB.
    const identifiedItem = props.Items
        ? props.Items.find(item => item.id === props.itemId)
        : null;

    // populate form data / fill in the form
    useEffect(() => {

        if (identifiedItem) {
            setFormData(
                {
                    title: {
                        value: identifiedItem.title,
                        isValid: true
                    },
                    description: {
                        value: identifiedItem.description,
                        isValid: true
                    }
                }, true);
        };

        setFormReady(true);
    }, [setFormData, identifiedItem]);

    // UPDATING DATABASE AND UPDATING LOCAL TODOITEM STATE
    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `${import.meta.env.VITE_BACKEND_URL}/items/${props.itemId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            )

            // sends changes to ToDoList.jsx's local state, to reflect changes immidietly
            if (props.onItemUpdated) {
                props.onItemUpdated({
                    id: props.itemId,
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                });
            }
            // closes Edit modal after saucerful PATCH request
            props.closeEditModalHandler();
        } catch (err) { }
    };

    //probavly never renders since props.show is coming from perent?
    if (!identifiedItem && props.show && !error) {
        return <div className="center">Couldnot find place</div>
    }

    const content = !formReady ?
        (<div className="center"><LoadingSpinner /></div>) //fixing CSSTransition
        :
        (
            <>
                <ErrorModal error={error} onClear={clearError} />
                <form className='container-child' onSubmit={placeSubmitHandler} >
                    <h3 className="header">edit item</h3>
                    <div className='edit__input'>
                        <Input
                            id='title'
                            element="input"
                            name="toDoItem"
                            placeholder="to do item"
                            className='edit-input'
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText='Please enter a valid title.'
                            onInput={inputHandler}
                            initialValue={formState.inputs.title.value}
                            initialValidity={formState.inputs.title.isValid}
                        />
                        <Input
                            id='description'
                            element="textarea"
                            name="description"
                            placeholder="description"
                            className='edit-textarea'
                            validators={[VALIDATOR_MINLENGTH(3)]}
                            errorText='Please enter a valid description (at least 5 characters).'
                            // rows={4}
                            onInput={inputHandler}
                            initialValue={formState.inputs.description.value}
                            initialValidity={formState.inputs.description.isValid}
                        />
                    </div>

                    <div className="button-stack__edit">
                        <button
                            type="submit"
                            disabled={!formState.isValid}
                            className={`btn ${!formState.isValid ? 'btn-disabled' : ''}`}
                        >ok
                        </button>
                        <button type="button" onClick={props.closeEditModalHandler}>cancel</button>
                    </div>

                </form>
            </>


        );
    return ReactDOM.createPortal(
        <div ref={props.nodeRef} className="container">
            {content}
        </div>,
        document.getElementById('edit-hook'));
};

const EditItem = props => {
    const nodeRef = useRef(null); // Create the ref to fix findDOMNode error (CSSTransition)

    return <>
        {props.show && <Backdrop onClickProp={props.onCancel} />}
        <CSSTransition
            in={props.show}
            mountOnEnter
            unmountOnExit
            timeout={300}
            classNames='fade'
            nodeRef={nodeRef} // Pass the ref 
        >

            <EditOverlay {...props} nodeRef={nodeRef} />

        </CSSTransition>
    </>
};

export default EditItem; 