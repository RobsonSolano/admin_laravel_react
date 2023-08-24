import {Routes, createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/login";
import Signup from "./views/signup";
import Users from "./views/users";
import NotFound from "./views/NotFound";
import Dashboard from "./views/dashboard";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/users" />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/users',
                element: <Users />
            },
        ]
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
        ]
    },

    {
        path: '*',
        element: <NotFound />
    },
])

export default router;
