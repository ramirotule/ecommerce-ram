import React, { useState, useEffect } from 'react';
import { loadProviders } from '../utils/adminStorage';
import { normalizeName } from '../utils/normalizeName';

const PriceSearch = ({ productos = [] }) => {
  const [query, setQuery] = useState('');
  const [providers, setProviders] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setProviders(loadProviders());
  }, []);

  const handleSearch = () => {
    const q = normalizeName(query);
    if (!q) {
      setResults([]);
      return;
    }

    const matches = [];
    for (const prov of providers) {
      for (const p of prov.products || []) {
        if ((p.normalized || '').includes(q) || (p.producto || '').toLowerCase().includes(query.toLowerCase())) {
          matches.push({ provider: prov.name, precio_usd: p.precio_usd, producto: p.producto });
        }
      }
    }

    // Also try matching base productos list if provided
    if (productos && productos.length) {
      for (const base of productos) {
        const baseNorm = normalizeName(base.producto || base.product || '');
        if (baseNorm.includes(q)) {
          // Try to find provider prices for this product
          for (const prov of providers) {
            for (const p of prov.products || []) {
              if ((p.normalized || '') === baseNorm) {
                matches.push({ provider: prov.name, precio_usd: p.precio_usd, producto: p.producto });
              }
            }
          }
        }
      }
    }

    const sorted = matches.sort((a, b) => a.precio_usd - b.precio_usd);
    setResults(sorted);
  };

  const best = results.length ? results[0] : null;

  return (
    <div style={{ marginTop: 12 }}>
      <h3 style={{ color: '#000000', marginBottom: 20 }}>🔎 Buscar producto y comparar precios</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input placeholder="Buscar producto..." value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {best ? (
        <div style={{ background: 'rgba(255,255,255,0.04)', padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <strong>Mejor precio:</strong> {best.producto} — <strong>U$S {best.precio_usd}</strong> por <em>{best.provider}</em>
        </div>
      ) : null}

      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
        {results.map((r, i) => (
          <div key={i} style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ color: '#00F100' }}>{r.producto}</strong>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{r.provider}</div>
              </div>
              <div style={{ fontWeight: 700 }}>U$S {r.precio_usd}</div>
            </div>
          </div>
        ))}
        {results.length === 0 && <div style={{ color: 'rgba(255,255,255,0.6)' }}>Sin resultados</div>}
      </div>
    </div>
  );
};

export default PriceSearch;
