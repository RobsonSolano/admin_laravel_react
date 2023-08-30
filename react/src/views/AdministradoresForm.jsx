import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import axiosClient from "../axios-client"
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";

export default function AdministradoresForm() {

    const { id } = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();

    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    if (id) {
        useEffect(() => {
            setLoading(true)

            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setUser(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault();

        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    //Todo show notification
                    setNotification("Administrador atualizado com sucesso");
                    navigate('/administradores')
                })
                .catch(err => {
                    const response = err.response;
                    setNotification("Não foi possível atualizar o Administrador");

                    if (response && response.status === 422) {
                        setErrors(response.data.errors); // Corrigir "erros" para "errors"
                    }
                })
        } else {
            axiosClient.post(`/users`, user)
                .then(() => {
                    //Todo show notification
                    setNotification("Administrador cadastrado com sucesso");

                    navigate('/administradores')
                })
                .catch(err => {
                    const response = err.response;
                    setNotification("Não foi possível cadastrar o Administrador");

                    if (response && response.status === 422) {
                        setErrors(response.data.errors); // Corrigir "erros" para "errors"
                    }
                })
        }
    }

    return (
        <>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User: {user.name}</h1>}

            <div className="card animated fadeInDown">
                {loading && (
                    <div className="text-center">Loading...</div>
                )}

                {errors && (
                    <div className="alert">
                        {errors.map((errorMessage, index) => (
                            <p key={index}>{errorMessage}</p>
                        ))}
                    </div>
                )}

                {!loading &&
                    <form onSubmit={onSubmit}>
                        <input onChange={ev => setUser({ ...user, name: ev.target.value })} value={user.name} type="text" placeholder="Nome" />
                        <input onChange={ev => setUser({ ...user, email: ev.target.value })} value={user.email} type="email" placeholder="E-mail" />
                        <input onChange={ev => setUser({ ...user, password: ev.target.value })} type="password" placeholder="Senha" />
                        <input onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} type="password" placeholder="Password Confirmation" />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link to="/administradores" className="btn btn-light">Cancelar</Link>
                            <button className="btn">Save</button>
                        </div>
                    </form>
                }
            </div>
        </>
    )
}
