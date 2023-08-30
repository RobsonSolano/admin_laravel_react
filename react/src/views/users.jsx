import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [tempFilterValues, setTempFilterValues] = useState({
        name: "",
        email: "",
        created_at: ""
    });

    const handleFilterChange = (field, value) => {
        setTempFilterValues({
            ...tempFilterValues,
            [field]: value
        });
    };

    const applyFilters = () => {
        // Aplicar os filtros temporários ao estado dos filtros principais
        setTempFilterValues(tempFilterValues);

        // Chamar getUsers após atualizar o estado dos filtros
        getUsers();
    };

    const clearFilters = () => {
        setLoading(true);

        setTempFilterValues({
            name: "",
            email: "",
            created_at: ""
        });

        tempFilterValues.name = "";
        tempFilterValues.email = "";
        tempFilterValues.created_at = "";

        // Chamar getUsers após limpar os filtros temporários
        getUsers();
    };

    const getUsers = (page = 1) => {
        setLoading(true);
        const params = new URLSearchParams();

        if (tempFilterValues.name) {
            params.append("name", tempFilterValues.name);
        }

        if (tempFilterValues.email) {
            params.append("email", tempFilterValues.email);
        }

        if (tempFilterValues.created_at) {
            const encodedCreatedAt = encodeURIComponent(tempFilterValues.created_at);
            params.append("created_at", encodedCreatedAt);
        }

        params.append("page", page);

        console.log(params);
        console.log(params.toString());
        axiosClient.get(`/users?${params.toString()}`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
                setCurrentPage(page);
                setTotalPages(data.meta.last_page);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error fetching users:', error);
            });
    };

    useEffect(() => {
        getUsers(); // Chamar getUsers ao carregar a página inicialmente
    }, []);

    useEffect(() => {
        if (showFilter) {
            getUsers(); // Chamar getUsers sempre que showFilter mudar
        }
    }, [showFilter]);

    useEffect(() => {
        if (!showFilter) {
            applyFilters(); // Chamar applyFilters quando fechar os filtros para aplicar os filtros temporários
        }
    }, [showFilter]);

    return (
        <div className="card fadeInDown">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add custom-tooltip">Add new User<span className="button-tooltip">Cadastre um novo usuário</span></Link>
            </div>

            <div style={{ marginBottom: '1em', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <button onClick={() => setShowFilter(!showFilter)} className="btn-edit custom-tooltip" style={{ marginBottom: '1em', width: 'max-content' }}>
                    {showFilter ? "Fechar Filtros " : "Abrir Filtros"}
                    { showFilter && <span className="button-tooltip">Clique para ocultar o filtro</span>}
                    { !showFilter && <span className="button-tooltip">Clique para exibir o filtro</span>}
                </button>
                {showFilter && (
                    <div className="filterArea" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', width: '100%', justifyContent: "space-beetwen" }}>
                            <input
                                type="text"
                                placeholder="Nome"
                                value={tempFilterValues.name}
                                onChange={(e) => handleFilterChange("name", e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                value={tempFilterValues.email}
                                onChange={(e) => handleFilterChange("email", e.target.value)}
                            />
                            <input
                                type="date"
                                placeholder="Data de Criação"
                                value={tempFilterValues.created_at}
                                onChange={(e) => handleFilterChange("created_at", e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                onClick={() => applyFilters()}
                                className="btn-add custom-tooltip" // Adicione a classe custom-tooltip aqui
                            >
                                Aplicar Filtros
                                <span className="button-tooltip">Clique para pesquisar</span>
                            </button>                          &nbsp;
                            {tempFilterValues.name || tempFilterValues.email || tempFilterValues.created_at ? (
                                <button onClick={() => clearFilters()} className="btn-delete custom-tooltip">Limpar &times;
                                <span className="button-tooltip">Limpar filtros &times;</span></button>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link className="btn-edit custom-tooltip" to={'/users/' + u.id}>Edit <span className="button-tooltip">Clique para ver os detalhes deste usuario</span></Link>
                                        &nbsp;
                                        <button onClick={() => onDelete(u)} className="btn-delete custom-tooltip">Delete <span className="button-tooltip">Clique para remover este usuario</span></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2em 0' }}>

                    <div className="pagination">
                        <button className=""
                            onClick={() => getUsers(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <button style={{ marginLeft: '1em' }}
                            onClick={() => getUsers(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Próximo
                        </button>
                    </div>

                </div>
            </div>

        </div>
    )
}
