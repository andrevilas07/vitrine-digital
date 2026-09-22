import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const WHATSAPP_NUMBER = '5514996188004';

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total } = useCart();

  function handleCheckout() {
    const linhas = items.map((item) => {
      const tamanho = item.size ? ` (Tamanho ${item.size.name})` : '';
      const codigo = item.product.code ? ` [Cód.: ${item.product.code}]` : '';
      return `- ${item.product.name}${codigo}${tamanho} x${item.qty} - ${formatPrice(item.product.price * item.qty)}`;
    });

    const mensagem = [
      'Olá! Gostaria de finalizar o seguinte pedido:',
      '',
      ...linhas,
      '',
      `Total: ${formatPrice(total)}`,
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    clearCart();
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Carrinho</h1>
        <p>Seu carrinho está vazio.</p>
        <Link to="/" className="btn-primary">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Carrinho</h1>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Tamanho</th>
            <th>Preço</th>
            <th>Qtd.</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <td>{item.product.code}</td>
              <td>{item.product.name}</td>
              <td>{item.size ? item.size.name : '-'}</td>
              <td>{formatPrice(item.product.price)}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateQty(item.key, Number(e.target.value))}
                />
              </td>
              <td>{formatPrice(item.product.price * item.qty)}</td>
              <td>
                <button type="button" className="link-button" onClick={() => removeItem(item.key)}>
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <strong>Total: {formatPrice(total)}</strong>
        <button type="button" className="btn-primary" onClick={handleCheckout}>
          Finalizar pedido no WhatsApp
        </button>
      </div>
    </div>
  );
}
