import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";

export default function AdministradoresForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification, updateModulos } = useStateContext(); // Importe useStateContext
    const { setLocalModulos } = useStateContext();
    const [modules, setModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [adminPermissions, setAdminPermissions] = useState([]);


    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        setLoading(true);

        Promise.all([
            axiosClient.get(`/users/${id}`),
            axiosClient.get(`/users/${id}/permissions`),
            // Load user permissions
        ])
            .then(([userData, permissionsData]) => {
                setLoading(false);
                setUser(userData.data);
                setSelectedModules(permissionsData.data.map((permission) => permission.admin_modulo_id)); // Use admin_modulo_id instead of id
                setAdminPermissions(permissionsData.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]); // Add id as a dependency to re-trigger when id changes

    useEffect(() => {
        axiosClient
            .get("/modulos/all")
            .then(({ data }) => {
                setModules(data.data);
            })
            .catch((error) => {
                console.error("Error fetching modules:", error);
            });
    }, []);

    const fetchModules = () => {
        axiosClient.get('/modulos')
            .then(({ data }) => {
                setLocalModulos(data.data); // Certifique-se de que setLocalModulos está sendo chamado corretamente aqui
            })
            .catch(error => {
                console.error('Error fetching modules:', error);
            });
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        const userData = {
            ...user,
            // Other user fields
            permissions: selectedModules,
        };


        if (user.id) {
            axiosClient
                .put(`/users/${user.id}`, userData)
                .then(() => {
                    // Chame a função updateModulos aqui para atualizar a lista de módulos
                    fetchModules();
                    setNotification("Administrador atualizado com sucesso");
                    navigate(`/administradores/${user.id}`);
                })
                .catch((err) => {
                    console.log(err);
                    return;
                    const response = err.response;
                    setNotification("Não foi possível atualizar o Administrador");

                    if (response && response.status === 422) {
                        setErrors(response.data.errors); // Corrigir "erros" para "errors"
                    }
                });
        } else {
            axiosClient
                .post(`/users`, userData)
                .then((response) => {
                    // O novo usuário é retornado como resposta
                    const newUser = response.data;

                    // Agora, você pode associar as permissões ao novo usuário
                    const userPermissions = selectedModules.map((moduleId) => ({
                        admin_user_id: newUser.id,
                        admin_modulo_id: moduleId,
                    }));

                    axiosClient
                        .post(`/users/${newUser.id}/permissions`, userPermissions)
                        .then(() => {
                            // Chame a função updateModulos aqui para atualizar a lista de módulos
                            setNotification("Administrador cadastrado com sucesso");
                            navigate("/administradores");
                        })
                        .catch((err) => {
                            const response = err.response;
                            setNotification("Não foi possível associar permissões ao Administrador");

                            if (response && response.status === 422) {
                                setErrors(response.data.errors); // Corrigir "erros" para "errors"
                            }
                        });
                })
                .catch((err) => {
                    const response = err.response;
                    setNotification("Não foi possível cadastrar o Administrador");

                    if (response && response.status === 422) {
                        setErrors(response.data.errors); // Corrigir "erros" para "errors"
                    }
                });
        }
    };

    return (
        <>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User: {user.name}</h1>}

            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}

                {errors && (
                    <div className="alert">
                        {errors.map((errorMessage, index) => (
                            <p key={index}>{errorMessage}</p>
                        ))}
                    </div>
                )}

                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            onChange={(ev) => setUser({ ...user, name: ev.target.value })}
                            value={user.name}
                            type="text"
                            placeholder="Nome"
                            autoComplete="off"
                        />
                        <input
                            onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                            value={user.email}
                            type="email"
                            placeholder="E-mail"
                            autoComplete="off"
                        />
                        <input
                            onChange={(ev) => setUser({ ...user, password: ev.target.value })}
                            type="password"
                            placeholder="Senha"
                            autoComplete="off"
                        />
                        <input
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    password_confirmation: ev.target.value,
                                })
                            }
                            type="password"
                            placeholder="Password Confirmation"
                        />
                        <div className="" style={{ marginBottom: "2em", display: 'flex', flexDirection: 'column', borderTop:'1px solid #ddd', paddingTop:'1.5em', marginTop:'1em' }}>
                            {modules.map((module) => (
                                <label key={module.id}>
                                    <input
                                        style={{ width: '20px' }}
                                        type="checkbox"
                                        value={module.id}
                                        checked={selectedModules.includes(module.id)}
                                        onChange={(event) => {
                                            const moduleId = parseInt(event.target.value, 10);
                                            if (event.target.checked) {
                                                setSelectedModules((prevSelected) => [
                                                    ...prevSelected,
                                                    moduleId,
                                                ]);
                                            } else {
                                                setSelectedModules((prevSelected) =>
                                                    prevSelected.filter((id) => id !== moduleId)
                                                );
                                            }
                                        }}
                                    />
                                    <span style={{marginLeft:'1em'}}>
                                        {module.nome}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Link to="/administradores" className="btn btn-light">
                                Cancelar
                            </Link>
                            <button className="btn">Save</button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
