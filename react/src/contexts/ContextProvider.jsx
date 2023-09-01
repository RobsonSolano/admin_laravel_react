import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    modulos: [],
    setUser: () => { },
    setToken: () => { },
    setNotification: () => { },
    setModulos: () => { },
})

export const ContextProvider = ({ children }) => {
    const [modulos, setModulos] = useState([]);
    const [user, setUser] = useState({});
    const [notification, _setNotification] = useState('');
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [localModulos, setLocalModulos] = useState([]);

    function updateModulos(newModulos) {
        setModulos(newModulos);
    }

    const setToken = (token) => {
        _setToken(token)

        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification('');
        }, 5000)
    }

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                notification,
                setNotification,
                modulos, // Inclua modulos no contexto
                updateModulos, // Inclua a função updateModulos no contexto
                localModulos, // Certifique-se de incluir localModulos no contexto
                setLocalModulos,
            }}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
