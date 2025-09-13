import React from 'react';
import { useNavigate } from 'react-router-dom';


import Item from './Item';
import Card from './UIElements/Card'

import './ItemsList.css';


const ItemsList = props => {

    const navigate = useNavigate();

    //check if there are items
    if (props.items.length === 0) {
        return (
            <div className='items-list'>
                 <div className='item'>
                    <Card className='item__content'>To Do List is empty.</Card>
                </div>
            </div>
        );
    }

    // render list of items

    return (
        <ul className='items-list'>
            {props.items.map(item => (
                // react needs a key for each item to render list
                <Item
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    showEditModalHandler={()=>props.showEditModalHandler(item.id)} //pass the edited item Id
                    showDeleteModalHandler={()=>props.showDeleteModalHandler(item.id)} //pass the edited item Id
                />

            ))}

        </ul>
    )


};

export default ItemsList;