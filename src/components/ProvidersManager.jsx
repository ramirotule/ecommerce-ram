import React, { useEffect, useState } from 'react';
import { loadProviders, saveProviders, removeProviderById, updateProvider, addOrReplaceProvider } from '../utils/adminStorage';

const ProvidersManager = ({ onSelectProvider }) => {
  const [providers, setProviders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setProviders(loadProviders());
  }, []);

  const openNewModal = () => {
    setEditing({
      name: '',
      address: '',
      phone: '',
      contact: '',
      currency: 'USD',
      rateToUsd: 1,
      products: []
    });
    setShowModal(true);
  };

  const openEditModal = (provider) => {
    setEditing({ ...provider });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este proveedor?')) {
      removeProviderById(id);
      setProviders(loadProviders());
    }
  };

  const handleAddEmpty = () => {
    openNewModal();
  };

  const handleRename = (provider) => {
    openEditModal(provider);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleModalConfirm = () => {
    if (!editing || !editing.name) {
      alert('El proveedor debe tener un nombre');
      return;
    }
    // Ensure fields exist
    const provToSave = {
      id: editing.id || `prov-${Date.now()}`,
      name: editing.name,
      address: editing.address || '',
      phone: editing.phone || '',
      contact: editing.contact || '',
      currency: editing.currency || 'USD',
      rateToUsd: editing.rateToUsd || 1,
      products: editing.products || []
    };

    addOrReplaceProvider(provToSave);
    const list = loadProviders();
    setProviders(list);
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ color: '#000000', marginBottom: 20 }}>Proveedores</h3>
        <div>
          <button onClick={openNewModal} style={{ marginRight: 8 }}>+ Nuevo</button>
        </div>
      </div>

      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {providers.length === 0 && <div style={{ color: 'rgba(0, 0, 0, 0.6)' }}>No hay proveedores</div>}

        {/* Table view */}
        {providers.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'black' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <th style={{ padding: 8 }}>Nombre</th>
                <th style={{ padding: 8 }}>Dirección</th>
                <th style={{ padding: 8 }}>Teléfono</th>
                <th style={{ padding: 8 }}>Contacto</th>
                <th style={{ padding: 8 }}>Items</th>
                <th style={{ padding: 8 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {providers.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: 8 }}>{p.name}</td>
                  <td style={{ padding: 8 }}>{p.address || ''}</td>
                  <td style={{ padding: 8 }}>{p.phone || ''}</td>
                  <td style={{ padding: 8 }}>{p.contact || ''}</td>
                  <td style={{ padding: 8 }}>{(p.products || []).length}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => openEditModal(p)}
                      title="Editar"
                      aria-label="Editar"
                      style={{ marginRight: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Eliminar"
                      aria-label="Eliminar"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', color: '#000', padding: 20, borderRadius: 8, width: 520, maxWidth: '95%' }}>
            <h3 style={{ marginTop: 0 }}>{editing && editing.id ? (providers.find(x=>x.id===editing.id) ? 'Editar proveedor' : 'Nuevo proveedor') : 'Proveedor'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12 }}>Nombre</label>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12 }}>Dirección</label>
                <input value={editing.address || ''} onChange={e => setEditing({ ...editing, address: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12 }}>Teléfono</label>
                <input value={editing.phone || ''} onChange={e => setEditing({ ...editing, phone: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12 }}>Contacto</label>
                <input value={editing.contact || ''} onChange={e => setEditing({ ...editing, contact: e.target.value })} style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={handleModalCancel} style={{ background: 'transparent' }}>Cancelar</button>
              <button onClick={handleModalConfirm} style={{ background: '#00F100', color: '#fff', padding: '8px 12px', borderRadius: 6 }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProvidersManager;
