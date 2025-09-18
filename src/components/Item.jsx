import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Card from './UIElements/Card';

import './Item.css';

const Item = props => {

    return (
        <>
            <li className='item'>
                <Card className='item__content'>
                    <div className='item__text'>
                        {/* <div className='item__info'> */}
                             <h2 style={{ "--user-title-color": props.userTitleColor }}>{props.title}</h2>
                            {/* <h2>{props.title}</h2> */}
                            <p>{props.description}</p>
                        {/* </div> */}

                        <div className="button-stack">
                            <button onClick={props.showEditModalHandler}>edit</button>
                            <button onClick={props.showDeleteModalHandler}>delete</button>
                        </div>

                    </div>
                </Card>

            </li>
        </>
    );
};

export default Item;