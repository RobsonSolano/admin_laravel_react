import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider"

export default function ForgotPassword() {
    const emailRef = useRef();
    const [errors, setErrors] = useState(null);

    const { setUser, setToken } = useStateContext()

    const onSubmit = (ev) => {
        ev.preventDefault()

        const playlod = {
            email: emailRef.current.value
        }

        setErrors(null)
        axiosClient.post('/forgot-password', playlod)
            .then(({ data }) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                console.log(err.message);

                if (err.response && err.response.status === 422 && err.response.data && err.response.data.message) {
                    setErrors([err.response.data.message]);
                } else {
                    setErrors(["Não foi possível solicitar a recuperação de senha, por favor, tente novamente."]);
                }
            });
    }

    return (
        <form action="" onSubmit={onSubmit}>
            <h1 className="title">
                Recupere sua senha
            </h1>

            {errors && (
                <div className="alert">
                    {errors.map((errorMessage, index) => (
                        <p key={index}>{errorMessage}</p>
                    ))}
                </div>
            )}
            <input ref={emailRef} type="email" placeholder="Email Address" />
            <button type="submit" className="btn btn-block">Recuperar senha</button>
            <p className="message">
                Já possui login? <Link to="/login">Login</Link>
            </p>
        </form>
    )
}
