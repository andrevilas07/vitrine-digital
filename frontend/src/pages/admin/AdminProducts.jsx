import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/products';
import { formatPrice } from '../../utils/format';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  function loadProducts() {
    getProducts().then(setProducts).catch(() => setError('Erro ao carregar produtos.'));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Excluir este produto?')) return;

    try {
      await deleteProduct(id);
      loadProducts();
    } catch {
      setError('Erro ao excluir produto.');
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <Link to="/admin/produtos/novo" className="btn-primary">
          Novo produto
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Ativo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.category?.name}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.active ? 'Sim' : 'Não'}</td>
              <td>
                <Link to={`/admin/produtos/${product.id}`}>Editar</Link>{' '}
                <button type="button" className="link-button" onClick={() => handleDelete(product.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
