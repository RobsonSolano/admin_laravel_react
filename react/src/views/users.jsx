import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from 'date-fns';

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
    const [sortField, setSortField] = useState("id"); // Campo de ordenação padrão
    const [sortDirection, setSortDirection] = useState("desc"); // Sentido de ordenação padrão
    const [isSortingActive, setIsSortingActive] = useState(false);

    const handleFilterChange = (field, value) => {
        setTempFilterValues({
            ...tempFilterValues,
            [field]: value
        });
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        getUsers(1);
        setIsSortingActive(true); // Ativar a exibição do botão de limpar ordenação
    };

    const clearSorting = () => {
        setSortField("id");
        setSortDirection("desc");
        setIsSortingActive(false); // Desativar a exibição do botão de limpar ordenação
        getUsers(1);
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

    const onDelete = (user) => {
        if (window.confirm(`Deseja realmente excluir o usuário ${user.name}?`)) {
            // Chame a função de exclusão na API
            axiosClient.delete(`/users/${user.id}`)
                .then(() => {
                    // Atualize a lista de usuários após a exclusão
                    getUsers();
                    setNotification("Usuário excluído com sucesso.", "success");
                })
                .catch((error) => {
                    console.error("Erro ao excluir o usuário:", error);
                    setNotification("Erro ao excluir o usuário.", "error");
                });
        }
    };

    const getUsers = (page = 1) => {
        setLoading(true);
        const params = new URLSearchParams();

        // ... outras partes do código ...

        // Adicionar parâmetros de ordenação
        params.append("sort", sortField);
        params.append("direction", sortDirection);

        params.append("page", page);

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
                <div>
                    <button onClick={() => setShowFilter(!showFilter)} className="btn-edit custom-tooltip" style={{ marginBottom: '1em', width: 'max-content' }}>
                        {showFilter ? "Fechar Filtros " : "Abrir Filtros"}
                        {showFilter && <span className="button-tooltip">Clique para ocultar o filtro</span>}
                        {!showFilter && <span className="button-tooltip">Clique para exibir o filtro</span>}
                    </button>
                    {isSortingActive && (
                        <button onClick={clearSorting} className="btn-clear-sort btn-delete custom-tooltip" style={{ marginLeft: '1em' }}>
                            Limpar Ordenação <span className="button-tooltip">Clique para exibir o filtro</span>
                        </button>
                    )}
                </div>
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

            <div className="card animated fadeInDown table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("id")}>
                                ID{" "}
                                {sortField === "id" && sortDirection === "asc" && (
                                    <FontAwesomeIcon icon={faArrowUp} />
                                )}
                                {sortField === "id" && sortDirection === "desc" && (
                                    <FontAwesomeIcon icon={faArrowDown} />
                                )}
                            </th>
                            <th onClick={() => handleSort("name")}>
                                Name{" "}
                                {sortField === "name" && sortDirection === "asc" && (
                                    <FontAwesomeIcon icon={faArrowUp} />
                                )}
                                {sortField === "name" && sortDirection === "desc" && (
                                    <FontAwesomeIcon icon={faArrowDown} />
                                )}
                            </th>
                            <th onClick={() => handleSort("email")}>
                                Email{" "}
                                {sortField === "email" && sortDirection === "asc" && (
                                    <FontAwesomeIcon icon={faArrowUp} />
                                )}
                                {sortField === "email" && sortDirection === "desc" && (
                                    <FontAwesomeIcon icon={faArrowDown} />
                                )}
                            </th>
                            <th onClick={() => handleSort("created_at")}>
                                Created Date{" "}
                                {sortField === "created_at" && sortDirection === "asc" && (
                                    <FontAwesomeIcon icon={faArrowUp} />
                                )}
                                {sortField === "created_at" && sortDirection === "desc" && (
                                    <FontAwesomeIcon icon={faArrowDown} />
                                )}
                            </th>
                            <th className="table-actions">Actions</th>
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
                                    <td>{u.email ? u.email : '--'}</td>
                                    <td>{u.created_at}</td>
                                    <td className="table-actions">
                                        <Link className="btn-edit custom-tooltip" to={'/users/' + u.id}>Edit <span className="button-tooltip">Clique para ver os detalhes deste usuario</span></Link>
                                        &nbsp;
                                        <button onClick={() => onDelete(u)} className="btn-delete custom-tooltip">
                                            Delete <span className="button-tooltip">Clique para remover este usuário</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2em 0' }}>

                    <div className="pagination">
                        <button className="btn-paginate"
                            onClick={() => getUsers(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <button className="btn-paginate" style={{ marginLeft: '1em' }}
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
