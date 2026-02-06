import React, { useEffect, useState } from 'react';
import { loadCategories, addCategory, removeCategory } from '../utils/adminStorage';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');

  useEffect(() => {
    setCategories(loadCategories());
  }, []);

  const handleAdd = () => {
    const name = newCat.trim();
    if (!name) return;
    const list = addCategory(name);
    setCategories(list);
    setNewCat('');
  };

  const handleRemove = (name) => {
    if (!confirm(`Eliminar categoría '${name}'?`)) return;
    const list = removeCategory(name);
    setCategories(list);
  };

  return (
    <div>
      <h3 style={{ color: '#000000', marginBottom: 20 }}>Categorías</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input placeholder="Nueva categoría" value={newCat} onChange={e => setNewCat(e.target.value)} />
        <button onClick={handleAdd}>Agregar</button>
      </div>

      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {categories.length === 0 && <div style={{ color: 'rgba(255,255,255,0.6)' }}>Sin categorías</div>}
        {categories.map(c => (
          <div key={c} style={{ display: 'flex', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div>{c}</div>
            <button onClick={() => handleRemove(c)} style={{ color: '#ff6b6b' }}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesManager;
