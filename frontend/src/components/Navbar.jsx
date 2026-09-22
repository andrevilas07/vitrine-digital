import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        LetsMuse <span>Shop</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Produtos</Link>
        <Link to="/carrinho">Carrinho ({count})</Link>
        {isAuthenticated && (
          <button type="button" onClick={logout} className="link-button">
            Sair
          </button>
        )}
      </nav>
    </header>
  );
}
