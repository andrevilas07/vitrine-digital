import { useEffect, useState } from 'react';
import { getSizes, createSize, updateSize, deleteSize } from '../../api/sizes';

export default function AdminSizes() {
  const [sizes, setSizes] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');

  function loadSizes() {
    getSizes().then(setSizes).catch(() => setError('Erro ao carregar tamanhos.'));
  }

  useEffect(() => {
    loadSizes();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setError('');

    try {
      await createSize({ name });
      setName('');
      loadSizes();
    } catch {
      setError('Erro ao criar tamanho.');
    }
  }

  function startEdit(size) {
    setEditingId(size.id);
    setEditingName(size.name);
  }

  async function handleUpdate(id) {
    setError('');
    try {
      await updateSize(id, { name: editingName });
      setEditingId(null);
      loadSizes();
    } catch {
      setError('Erro ao atualizar tamanho.');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este tamanho?')) return;

    try {
      await deleteSize(id);
      loadSizes();
    } catch {
      setError('Erro ao excluir tamanho.');
    }
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="form form-inline">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Novo tamanho"
          required
        />
        <button type="submit" className="btn-primary">
          Adicionar
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="admin-list">
        {sizes.map((size) => (
          <li key={size.id}>
            {editingId === size.id ? (
              <>
                <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                <button type="button" className="link-button" onClick={() => handleUpdate(size.id)}>
                  Salvar
                </button>
                <button type="button" className="link-button" onClick={() => setEditingId(null)}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span>{size.name}</span>
                <button type="button" className="link-button" onClick={() => startEdit(size)}>
                  Editar
                </button>
                <button type="button" className="link-button" onClick={() => handleDelete(size.id)}>
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
