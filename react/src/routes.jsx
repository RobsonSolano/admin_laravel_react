import {Routes, createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/login";
import Signup from "./views/signup";
import Administradores from "./views/Administradores";
import NotFound from "./views/NotFound";
import Dashboard from "./views/dashboard";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import AdministradoresForm from "./views/AdministradoresForm";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/administradores" />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/administradores',
                element: <Administradores />
            },
            {
                path: '/administradores/new',
                element: <AdministradoresForm key="AdministradoresCreate"/>
            },
            {
                path: '/administradores/:id',
                element: <AdministradoresForm key="AdministradoresUpdate"/>
            },
            {
                path: '*',
                element: <NotFound />
            }
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
            // {
            //     path: '*',
            //     element: <NotFound />
            // }
        ]
    },
])

export default router;
