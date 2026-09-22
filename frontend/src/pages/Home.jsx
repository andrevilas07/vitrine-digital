import { useEffect, useState } from 'react';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import { getSizes } from '../api/sizes';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [filters, setFilters] = useState({ category_id: '', gender: '', size_id: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
    getSizes().then(setSizes).catch(() => setSizes([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');

    const params = { active: true };
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.gender) params.gender = filters.gender;
    if (filters.size_id) params.size_id = filters.size_id;

    getProducts(params)
      .then(setProducts)
      .catch(() => setError('Não foi possível carregar os produtos.'))
      .finally(() => setLoading(false));
  }, [filters]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="page">
      <h1>Nossos produtos</h1>

      <div className="filters">
        <select name="category_id" value={filters.category_id} onChange={handleFilterChange}>
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select name="gender" value={filters.gender} onChange={handleFilterChange}>
          <option value="">Todos os gêneros</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="U">Unissex</option>
        </select>

        <select name="size_id" value={filters.size_id} onChange={handleFilterChange}>
          <option value="">Todos os tamanhos</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.id}>
              {size.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Carregando produtos...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && products.length === 0 && <p>Nenhum produto encontrado.</p>}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
