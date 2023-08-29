import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider"

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState(null);

    const { setUser, setToken } = useStateContext()

    const onSubmit = (ev) => {
        ev.preventDefault()

        const playlod = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        setErrors(null)
        axiosClient.post('/login', playlod)
            .then(({ data }) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                console.log(err.message);

                if (err.response && err.response.status === 422 && err.response.data && err.response.data.message) {
                    setErrors([err.response.data.message]);
                } else {
                    setErrors(["E-mail ou senha incorretos, por favor tente novamente."]);
                }
            });
    }

    return (
        <form action="" onSubmit={onSubmit}>
            <h1 className="title">
                Login into your account
            </h1>

            {errors && (
                <div className="alert">
                    {errors.map((errorMessage, index) => (
                        <p key={index}>{errorMessage}</p>
                    ))}
                </div>
            )}
            <input ref={emailRef} type="email" placeholder="Email Address" />
            <input ref={passwordRef} type="password" placeholder="Password" />
            <button type="submit" className="btn btn-block">Login</button>
            <p className="message">
                Not Registered? <Link to="/signup">Create an account</Link>
            </p>
        </form>
    )
}
