import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';

// import ToDoItems from "./pages/ToDoItems";
import Welcome from "./pages/Welcome";
import MainHeader from "./components/MainHeader";
// import Auth from './pages/Auth';
// import UserSettings from './pages/UserSettings';

import { AuthContext } from './context/auth-context';
import LoadingSpinner from './components/UIElements/LoadingSpinner';

//code splitting
const ToDoItems = React.lazy(() =>import("./pages/ToDoItems"));
const Auth = React.lazy(() =>import('./pages/Auth'));
const UserSettings = React.lazy(() =>import('./pages/UserSettings'));

import logo from './assets/react.svg';

import './App.css';

function App() {

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  //probably username for settings page need o be recived as respond to http request to backend from settings page
  const [userName, setUserName] = useState(null);


  const login = useCallback((uid, name, token) => {
    setToken(token);
    //storing object with userId and token in local storage
    localStorage.setItem(
      'userData',
      // REMOVE NAME FROM HERE LATER
      JSON.stringify({ userId: uid, name: name, token: token })
    );
    setUserId(uid);
    // REMOVE NAME FROM HERE LATER
    setUserName(name);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    // REMOVE NAME FROM HERE LATER
    setUserName(null);

    localStorage.removeItem('userData');
  }, []);

  //auto loging after pagereload using localstorage data (useEffect always runs after the render cicle)
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token) {
      // REMOVE NAME FROM HERE LATER
      login(storedData.userId, storedData.name, storedData.token);
    }
  }, [login]);

  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/:uid/list" element={<ToDoItems />} />
        <Route path={`/:uid/settings`} element={<UserSettings />} />
        <Route path="*" element={<Navigate to={`/${userId}/list`} replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}
    >

      <BrowserRouter>
        <div className="App">

          <MainHeader />

          <main>
            {/* code splitting */}
            <Suspense fallback={<div className='center'><LoadingSpinner/></div>}>
            {routes}
            </Suspense>

            {/* {<Route path="/" element={<Welcome />} />
              <Route path="/:uid/list" element={<ToDoItems />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" replace />} />} */}

          </main>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;