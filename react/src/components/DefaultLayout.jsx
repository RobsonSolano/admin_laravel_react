import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars} from '@fortawesome/free-solid-svg-icons';


export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken } = useStateContext();
    const [loggedOut, setLoggedOut] = useState(false);
    const [sidebarHidden, setSidebarHidden] = useState(false);

    const onLogout = (ev) => {
        ev.preventDefault();

        console.log('Token:', token);

        axiosClient.post('/logout', null).then(() => {
            setUser({});
            setToken(null);
            setLoggedOut(true);
        });

    };

    const toggleSidebar = () => {
        setSidebarHidden(!sidebarHidden);
    };

    useEffect(() => {
        console.log('Token:', token);

        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data);
            });
    }, []);

    return (
        <div id="defaultLayout" className={` ${sidebarHidden ? "defaultLayoutExpanded" : ""}`}>
            {loggedOut && <Navigate to="/login" />}
            <aside className={sidebarHidden ? "hidden" : ""}>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>
            <div className={`content ${sidebarHidden ? "expanded" : ""}`}>
                <header>
                    <div>
                        <button className="menu-toggle btn" onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
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
    )
}
