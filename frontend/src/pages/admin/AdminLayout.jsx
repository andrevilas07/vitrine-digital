import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="page">
      <h1>Administração</h1>

      <nav className="admin-tabs">
        <NavLink to="/admin/produtos" className={({ isActive }) => (isActive ? 'active' : '')}>
          Produtos
        </NavLink>
        <NavLink to="/admin/categorias" className={({ isActive }) => (isActive ? 'active' : '')}>
          Categorias
        </NavLink>
        <NavLink to="/admin/tamanhos" className={({ isActive }) => (isActive ? 'active' : '')}>
          Tamanhos
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
