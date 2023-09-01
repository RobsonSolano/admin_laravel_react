import React, { useState, useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken, modulos, localModulos, setLocalModulos } = useStateContext();
    const [loggedOut, setLoggedOut] = useState(false);
    const [sidebarHidden, setSidebarHidden] = useState(false);
    // const [localModulos, setLocalModulos] = useState([]);
    const location = useLocation();

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post('/logout', null).then(() => {
            setUser({});
            setToken(null);
            setLoggedOut(true);
        });
    };

    const toggleSidebar = () => {
        setSidebarHidden(!sidebarHidden);
    };

    const fetchModules = () => {
        axiosClient.get('/modulos')
            .then(({ data }) => {
                setLocalModulos(data.data); // Certifique-se de que setLocalModulos está sendo chamado corretamente aqui
            })
            .catch(error => {
                console.error('Error fetching modules:', error);
            });
    };

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data);
            });

        fetchModules(); // Chame a função fetchModules ao carregar o layout
    }, []);

    useEffect(() => {
        setLocalModulos(modulos);
    }, [modulos]);

    return (
        <div id="defaultLayout" className={` ${sidebarHidden ? "defaultLayoutExpanded" : ""}`}>
            {loggedOut && <Navigate to="/login" />}
            <aside className={sidebarHidden ? "hidden" : ""}>
                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                    Dashboard
                </Link>
                {localModulos.map((m) => (
                    <Link
                        key={m.id} // Chave única aqui
                        to={`/${m.rota}`}
                        className={location.pathname === `/${m.rota}` ? "active" : ""}
                    >
                        {m.nome}
                    </Link>
                ))}
            </aside>
            <div className={`content ${sidebarHidden ? "expanded" : ""}`}>
                <header>
                    <div>
                        <button className="menu-toggle btn custom-tooltip" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faBars} />
                            <span className="button-tooltip tooltip-right">{`${sidebarHidden ? "Exibir menu lateral" : "Ocultar menu lateral"}`}</span>
                        </button>
                    </div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogout} className="btn-logout" style={{ marginLeft: '1em' }}>Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>

            {
                notification && <div className="notification">
                    {notification}
                </div>
            }
        </div>
    );
}
