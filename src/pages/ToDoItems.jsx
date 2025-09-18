import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ItemsList from '../components/ItemsList';
import AddItem from '../components/AddItem';
import Button from '../components/UIElements/Button';
import Backdrop from '../components/UIElements/Backdrop';
import EditItem from '../components/EditItem';
import Modal from '../components/UIElements/Modal';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import ErrorModal from '../components/UIElements/ErrorModal';
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from '../hooks/http-hook';


import '../components/Item.css';
import '../components/ItemsList.css';

const ToDoItem = () => {

    const auth = useContext(AuthContext);

    const userId = useParams().uid;

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    //FETCHING ITEMS FROM DATABASE:
    const [loadedItems, setLoadedItems] = useState();

    useEffect(() => {
        //async is not used directly in useEffect. 
        const fetchItems = async () => {
            try {
                const responseData = await sendRequest(
                    `${import.meta.env.VITE_BACKEND_URL}/items/user/${userId}`,
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                );
                setLoadedItems(responseData.itemsList);
            } catch (err) { }
        };
        fetchItems();
    }, [sendRequest, userId]);

    //FETCHING CUSTOM USER ITEM TITLE COLOR:
    const [userColor, setUserColor] = useState("#ffd900"); // default black

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const responseData = await sendRequest(
                    `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/userInfo`,
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                );
                setUserColor(responseData.userTitleColor || "#ffd900"); // fallback if not set
            } catch (err) { }
        };
        fetchUserInfo();
    }, [sendRequest, userId]);

    // ADD ITEM
    // state controls visibility of AddItem.jsx
    const [showAddItem, setShowAddItem] = useState(false);

    const showAddHandler = () => { setShowAddItem(true) };
    const closeAddHandler = () => { setShowAddItem(false) };

    // updating UI: new item is added locally to state without reset of the scroll position 
    const handleItemAdded = (newItem) => {
        setLoadedItems((prevItems) => [...prevItems, newItem]);
    };

    // EDIT ITEM.
    // state controls visibility of EditItem.jsx
    const [showEditItem, setShowEditItem] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const showEditModalHandler = (id) => {
        setSelectedItemId(id);
        setShowEditItem(true);
    };

    const closeEditModalHandler = () => {
        setShowEditItem(false);
        setSelectedItemId(null);
    };

    // updating UI: updated items added localy to state to reflect changes immidietly
    const handleItemUpdated = (updatedItem) => {
        setLoadedItems(prevItems =>
            prevItems.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
    };

    // DELETE ITEM confirmation.
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const showDeleteModalHandler = (id) => {
        setDeleteItemId(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModalHandler = () => {
        setShowDeleteModal(false);
        setDeleteItemId(null);
    };

    // sending delete http request
    const confirmDeleteHandler = async () => {
        setShowDeleteModal(false);
        // console.log('DELETING...')
        try {
            await sendRequest(
                `${import.meta.env.VITE_BACKEND_URL}/items/${deleteItemId}`,
                'DELETE',
                null,
                { Authorization: 'Bearer ' + auth.token }
            );
            // updating UI, could not figure out why delete trigers re-render, 
            // when adding and editing dont, probably something with Modal structure 
            setLoadedItems(prevItems =>
                prevItems.filter(item => item.id !== deleteItemId));
        } catch (err) { };
    };

    //JSX
    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className='center'><LoadingSpinner /></div>}
            {/* EDIT ITEM */}
            <EditItem
                userId={userId}
                itemId={selectedItemId}
                show={showEditItem}
                onCancel={closeEditModalHandler}
                closeEditModalHandler={closeEditModalHandler}
                Items={loadedItems}
                onItemUpdated={handleItemUpdated}
            />

            {/* CONFIRATION TO DELETE ITEM */}
            <Modal
                userId={userId}
                itemId={deleteItemId}
                show={showDeleteModal}
                onCancel={closeDeleteModalHandler}
                footerClass="footer"
                footer={
                    <>
                        <button type="button" onClick={confirmDeleteHandler}>delete</button>
                        <button type="button" onClick={closeDeleteModalHandler}>cancel</button>
                    </>
                }
            >
                <p>Please confirm deletion.</p>
            </Modal>

            {/* LIST OF ITEMS */}
            {!isLoading && loadedItems &&
                <ItemsList
                    items={loadedItems}
                    showEditModalHandler={showEditModalHandler}
                    showDeleteModalHandler={showDeleteModalHandler}
                    userTitleColor = {userColor}
                />}

            {/* ADD ITEM */}
            {showAddItem && (
                <AddItem
                    // userId={userId} /* delete later? */
                    closeAddHandler={closeAddHandler}
                    onItemAdded={handleItemAdded} />


            )}

            {!showAddItem && <div className='items-list'>
                <button className='item' onClick={showAddHandler}>
                    +
                </button>
            </div>
            }
        </>
    )
};

export default ToDoItem;