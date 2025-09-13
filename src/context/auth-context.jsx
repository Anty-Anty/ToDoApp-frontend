import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    // remove name later
    name: null,
    token: null,
    login: () => { },
    logout: () => { }
});