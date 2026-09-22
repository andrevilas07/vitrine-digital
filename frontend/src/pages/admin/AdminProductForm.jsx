import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import { getSizes } from '../../api/sizes';

const emptyForm = {
  category_id: '',
  code: '',
  name: '',
  description: '',
  gender: 'U',
  price: '',
  active: true,
  sizes: [],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
    getSizes().then(setSizes).catch(() => setSizes([]));
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    getProduct(id).then((product) => {
      setForm({
        category_id: product.category?.id ?? '',
        code: product.code ?? '',
        name: product.name,
        description: product.description ?? '',
        gender: product.gender,
        price: product.price,
        active: product.active,
        sizes: product.sizes?.map((size) => size.id) ?? [],
      });
    });
  }, [id, isEditing]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function toggleSize(sizeId) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(sizeId)
        ? prev.sizes.filter((s) => s !== sizeId)
        : [...prev.sizes, sizeId],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);

    const formData = new FormData();
    formData.append('category_id', form.category_id);
    formData.append('code', form.code);
    formData.append('name', form.name);
    formData.append('description', form.description ?? '');
    formData.append('gender', form.gender);
    formData.append('price', form.price);
    formData.append('active', form.active ? '1' : '0');
    form.sizes.forEach((sizeId) => formData.append('sizes[]', sizeId));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (isEditing) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/admin/produtos');
    } catch {
      setError('Erro ao salvar produto. Verifique os campos.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2>{isEditing ? 'Editar produto' : 'Novo produto'}</h2>

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required />

        <label htmlFor="code">Código</label>
        <input id="code" name="code" value={form.code} onChange={handleChange} required />

        <label htmlFor="category_id">Categoria</label>
        <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} required>
          <option value="">Selecione...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="gender">Gênero</label>
        <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="U">Unissex</option>
        </select>

        <label htmlFor="price">Preço</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Descrição</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange} />

        <label htmlFor="image">Imagem</label>
        <input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />

        <div className="size-picker">
          <span>Tamanhos:</span>
          {sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              className={form.sizes.includes(size.id) ? 'size-option active' : 'size-option'}
              onClick={() => toggleSize(size.id)}
            >
              {size.name}
            </button>
          ))}
        </div>

        <label className="checkbox-label">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
          Ativo
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
