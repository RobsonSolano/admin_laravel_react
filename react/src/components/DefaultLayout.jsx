import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();
    const [loggedOut, setLoggedOut] = useState(false);

    const onLogout = (ev) => {
        ev.preventDefault();

        console.log('Token:', token);

        axiosClient.post('/logout', null).then(() => {
            setUser({});
            setToken(null);
            setLoggedOut(true);
        });

    };

    useEffect(() => {
        console.log('Token:', token);

        axiosClient.get('/user')
        .then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
             {loggedOut && <Navigate to="/login" />}
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}
