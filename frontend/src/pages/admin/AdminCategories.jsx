import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');

  function loadCategories() {
    getCategories().then(setCategories).catch(() => setError('Erro ao carregar categorias.'));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setError('');

    try {
      await createCategory({ name });
      setName('');
      loadCategories();
    } catch {
      setError('Erro ao criar categoria.');
    }
  }

  function startEdit(category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function handleUpdate(id) {
    setError('');
    try {
      await updateCategory(id, { name: editingName });
      setEditingId(null);
      loadCategories();
    } catch {
      setError('Erro ao atualizar categoria.');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir esta categoria?')) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch {
      setError('Erro ao excluir categoria.');
    }
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="form form-inline">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nova categoria"
          required
        />
        <button type="submit" className="btn-primary">
          Adicionar
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="admin-list">
        {categories.map((category) => (
          <li key={category.id}>
            {editingId === category.id ? (
              <>
                <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                <button type="button" className="link-button" onClick={() => handleUpdate(category.id)}>
                  Salvar
                </button>
                <button type="button" className="link-button" onClick={() => setEditingId(null)}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span>{category.name}</span>
                <button type="button" className="link-button" onClick={() => startEdit(category)}>
                  Editar
                </button>
                <button type="button" className="link-button" onClick={() => handleDelete(category.id)}>
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
