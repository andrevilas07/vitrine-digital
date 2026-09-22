import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const GENDER_LABELS = { M: 'Masculino', F: 'Feminino', U: 'Unissex' };

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        setProduct(data);
        setSelectedSize(data.sizes?.[0] ?? null);
      })
      .catch(() => setError('Produto não encontrado.'));
  }, [id]);

  function handleAddToCart() {
    addItem(product, selectedSize, qty);
    setAdded(true);
  }

  if (error) return <p className="error page">{error}</p>;
  if (!product) return <p className="page">Carregando...</p>;

  return (
    <div className="page product-detail">
      <button type="button" className="link-button" onClick={() => navigate(-1)}>
        &larr; Voltar
      </button>

      <div className="product-detail-content">
        <div className="product-detail-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="product-card-placeholder">Sem imagem</div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-card-category">{product.category?.name}</span>
          <h1>{product.name}</h1>
          {product.code && <p className="product-card-code">Código: {product.code}</p>}
          <p className="product-card-price">{formatPrice(product.price)}</p>
          <p>{GENDER_LABELS[product.gender] ?? product.gender}</p>
          {product.description && <p>{product.description}</p>}

          {product.sizes?.length > 0 && (
            <div className="size-picker">
              <span>Tamanho:</span>
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  className={size.id === selectedSize?.id ? 'size-option active' : 'size-option'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.name}
                </button>
              ))}
            </div>
          )}

          <div className="qty-picker">
            <label htmlFor="qty">Quantidade:</label>
            <input
              id="qty"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <button type="button" className="btn-primary" onClick={handleAddToCart}>
            Adicionar ao carrinho
          </button>

          {added && <p className="success">Produto adicionado ao carrinho!</p>}
        </div>
      </div>
    </div>
  );
}
