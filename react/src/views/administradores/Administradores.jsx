import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Administradores() {

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
    const [totalItens, setTotalItens] = useState(false);

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

    const getUsers = (page = 1) => {
        setLoading(true);
        const params = new URLSearchParams();

        // ... outras partes do código ...

        // Adicionar parâmetros de ordenação
        params.append("sort", sortField);
        params.append("direction", sortDirection);

        // Adicionar parâmetros de filtro
        if (tempFilterValues.name) {
            params.append("name", tempFilterValues.name);
        }
        if (tempFilterValues.email) {
            params.append("email", tempFilterValues.email);
        }
        if (tempFilterValues.created_at) {
            params.append("created_at", tempFilterValues.created_at);
        }

        params.append("page", page);

        axiosClient.get(`/users?${params.toString()}`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
                setCurrentPage(page);
                setTotalPages(data.meta.last_page);
                setTotalItens(data.meta.total);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Erro ao buscar administradores:', error);
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
                <h2>Gerenciar Administradores</h2>
                <Link to="/administradores/new" className="btn-add custom-tooltip">+ Novo Administrador<span className="button-tooltip">Cadastre um novo administrador</span></Link>
            </div>

            <div style={{ marginBottom: '1em', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div>
                    <button onClick={() => setShowFilter(!showFilter)} className="btn-edit custom-tooltip" style={{ marginBottom: '1em', width: 'max-content' }}>
                        {showFilter ? "Fechar filtros " : "Exibir filtros"}
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
                        <tr className="tr-list-itens">
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
                            <th onClick={() => handleSort("created_at")} className="data-cadastro">
                                Created Date{" "}
                                {sortField === "created_at" && sortDirection === "asc" && (
                                    <FontAwesomeIcon icon={faArrowUp} />
                                )}
                                {sortField === "created_at" && sortDirection === "desc" && (
                                    <FontAwesomeIcon icon={faArrowDown} />
                                )}
                            </th>
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
                                    <td><Link className="custom-tooltip" to={'/administradores/' + u.id} style={{ textDecoration: 'none' }}>{u.name} <span className="button-tooltip">Clique para ver os detalhes deste administrador</span></Link>
                                    </td>
                                    <td>{u.email ? u.email : '--'}</td>
                                    <td className="data-cadastro">{u.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2em 0', flexDirection: 'column' }}>
                    <div style={{ marginBottom: "1em", textAlign: 'center' }}>
                        <p>Total de {totalItens} {totalItens > 1 ? 'itens' : 'item'}</p>
                    </div>
                    {totalPages > 1 &&
                        <div className="pagination">
                            <button className={`btn-paginate ${currentPage < 2 ? "disabled" : ""}`}
                                onClick={() => getUsers(currentPage - 1)}
                                disabled={currentPage < 2}
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
                    }
                </div>
            </div>

        </div >
    )
}
