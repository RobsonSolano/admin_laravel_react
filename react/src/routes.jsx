import {Routes, createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/auth/login";
import Signup from "./views/auth/signup";
import Administradores from "./views/administradores/Administradores";
import NotFound from "./views/NotFound";
import Dashboard from "./views/dashboard";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import AdministradoresForm from "./views/administradores/AdministradoresForm";
import ForgotPassword from "./views/auth/forgotpassword";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/login" />
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
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'signup',
                element: <Signup />
            },
            {
                path: 'recuperar-senha',
                element: <ForgotPassword />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router;
