import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <h1>Página não encontrada</h1>
      <Link to="/">Voltar para a home</Link>
    </div>
  );
}
