import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';

const GENDER_LABELS = { M: 'Masculino', F: 'Feminino', U: 'Unissex' };

export default function ProductCard({ product }) {
  return (
    <Link to={`/produtos/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">Sem imagem</div>
        )}
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.category?.name}</span>
        <h3>{product.name}</h3>
        <p className="product-card-price">{formatPrice(product.price)}</p>
        <span className="product-card-gender">{GENDER_LABELS[product.gender] ?? product.gender}</span>
        {product.code && <span className="product-card-code">Cód.: {product.code}</span>}
      </div>
    </Link>
  );
}
