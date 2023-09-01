import './../assets/css/notfound.css';
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <div className="page-not-found">
                <div className="card">
                    <h2>Página não encontrada</h2>
                    <Link to="/login" className="btn-voltar">
                        Voltar
                    </Link>
                </div>
            </div>
        </>
    )
}
