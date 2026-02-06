import React, { useState } from 'react';
import { addOrReplaceProvider, loadProviders } from '../utils/adminStorage';
import { normalizeName } from '../utils/normalizeName';

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const headers = lines[0].split(/,|;|\t/).map(h => h.trim().toLowerCase());
  const rows = lines.slice(1);
  const result = [];

  for (const row of rows) {
    const cols = row.split(/,|;|\t/).map(c => c.trim());
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = cols[i] || '';
    }
    result.push(obj);
  }

  return result;
};

const UploadPriceList = ({ onProvidersUpdate }) => {
  const [providerName, setProviderName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [rateToUsd, setRateToUsd] = useState('');
  const [message, setMessage] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    let items = [];

    if (file.name.toLowerCase().endsWith('.json')) {
      try {
        const parsed = JSON.parse(text);
        // Expect array of { product, price }
        items = parsed.map(it => ({ product: it.product || it.producto || it.name || '', price: it.price || it.precio || it.price_usd || '' }));
      } catch (err) {
        setMessage('JSON inválido');
        return;
      }
    } else {
      // CSV
      const parsed = parseCSV(text);
      items = parsed.map(row => ({ product: row.product || row.producto || row.name || '', price: row.price || row.precio || '' }));
    }

    if (!providerName) {
      setMessage('Proporciona un nombre de proveedor antes de subir.');
      return;
    }

    const rate = currency === 'USD' ? 1 : parseFloat(rateToUsd) || 1;

    const provider = {
      id: `${providerName}-${Date.now()}`,
      name: providerName,
      currency,
      rateToUsd: rate,
      products: items.map(it => {
        const precio_num = parseFloat((it.price || '').toString().replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
        const precio_usd = currency === 'USD' ? precio_num : (precio_num / rate);
        return {
          producto: it.product.trim(),
          precio_original: precio_num,
          precio_usd: Number(precio_usd.toFixed(2)),
          normalized: normalizeName(it.product || '')
        };
      }).filter(p => p.producto)
    };

    const list = addOrReplaceProvider(provider);
    setMessage(`Proveedor '${providerName}' subido (${provider.products.length} items).`);

    if (onProvidersUpdate) onProvidersUpdate(list);
  };

  const handleLoadExisting = () => {
    const list = loadProviders();
    if (onProvidersUpdate) onProvidersUpdate(list);
    setMessage(`Cargados ${list.length} proveedores guardados`);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ color: '#000000', marginBottom: 20 }}>📥 Cargar lista de precios (Proveedor)</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <input placeholder="Nombre del proveedor" value={providerName} onChange={e => setProviderName(e.target.value)} />
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="ARS">ARS</option>
        </select>
        {currency === 'ARS' && (
          <input placeholder="ARS por USD (ej: 350)" value={rateToUsd} onChange={e => setRateToUsd(e.target.value)} />
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <input type="file" accept=".csv,.txt,.json" onChange={handleFile} />
        <button onClick={handleLoadExisting}>📂 Cargar proveedores guardados</button>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.8)' }}>{message}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
        Formatos aceptados: CSV con columnas "product,price" o JSON array con objetos {'{product,price}' }.
      </div>
    </div>
  );
};

export default UploadPriceList;
