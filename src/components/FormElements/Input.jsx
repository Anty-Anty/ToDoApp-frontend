import React, { useReducer, useEffect } from "react";

import { validate } from '../util/validators'
import './Input.css'

//useReducer function
const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
            case 'TOUCH':{
                return {
                    ...state,
                    isTouched:true
                }
            }
        default:
            return state;
    }
};


const Input = props => {

    // useReducer
    const [inputState, dispatch] = useReducer(inputReducer, { 
        value: props.initialValue || '', 
        isTouched: false,
        isValid: props.initialValidity || false
    });

    const {id, onInput} = props;
    const{value, isValid} = inputState;

    useEffect(()=>{
        onInput(id, value, isValid)
    },[id, value, isValid, onInput])

    const changeHandler = event => {
        //useReducer action
        dispatch({type:'CHANGE', val: event.target.value, validators: props.validators});
    };

    const touchHandler = () =>{
        dispatch({
            type:'TOUCH'
        });
    };
    
    const element = props.element === 'input' ?
        (<input
            id={props.id}
            name={props.name}
            type={props.type}
            placeholder={props.placeholder}
            value={inputState.value}
            onChange={changeHandler}
            onBlur={touchHandler}
            className={`${props.className} ${!inputState.isValid && 'add-item-invalid'}`}
        />) : (
            <textarea
                id={props.id}
                name={props.name}
                rows={props.rows || 3}
                placeholder={props.placeholder}
                value={inputState.value}
                onChange={changeHandler}
                onBlur={touchHandler}
                className={`${props.className} ${!inputState.isValid && inputState.isTouched && 'add-item-invalid'}`}
            />);

    return (
    <>
    {element}
    {!inputState.isValid && inputState.isTouched && <div className="err">{props.errorText}</div>}
    
    </>
    )

};

export default Input;