import { useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider"

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();


    const {setUser, setToken} = useStateContext()

    const onSubmit = (ev) => {
        ev.preventDefault()

        const playlod = {
            name : nameRef.current.value,
            email : emailRef.current.value,
            password : passwordRef.current.value,
            password_confirmation : passwordConfirmationRef.current.value
        }

        axiosClient.post('/signup',playlod)
        .then(({data}) => {
            setUser(data.user)
            setToken(data.token)
        })
        .catch(err => {
            const response = err.response;

            if(response && response.status === 422){
                console.log(response.data.erros);
            }
        })
    }

    return (
        <form action="" onSubmit={onSubmit}>
            <h1 className="title">
                Create your account
            </h1>
            <input ref={nameRef} type="text" placeholder="Full name" />
            <input ref={emailRef} type="email" placeholder="Email Address" />
            <input ref={passwordRef} type="password" placeholder="Password" />
            <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
            <button type="submit" className="btn btn-block">Signup</button>
            <p className="message">
                Alreaty Registered? <Link to="/login">Sign in</Link>
            </p>
        </form>
    )
}

// 57:18
