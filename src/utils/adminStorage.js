// Simple client-side storage for admin providers and price lists
const PROVIDERS_KEY = 'admin_providers_v1';
const CATEGORIES_KEY = 'admin_categories_v1';

export function loadProviders() {
  try {
    const raw = localStorage.getItem(PROVIDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('loadProviders error', e);
    return [];
  }
}

export function saveProviders(providers) {
  try {
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
  } catch (e) {
    console.error('saveProviders error', e);
  }
}

export function addOrReplaceProvider(provider) {
  const list = loadProviders();
  const idx = list.findIndex(p => p.id === provider.id || p.name === provider.name);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...provider };
  } else {
    list.push(provider);
  }
  saveProviders(list);
  return list;
}

export function removeProviderById(id) {
  const list = loadProviders();
  const filtered = list.filter(p => p.id !== id);
  saveProviders(filtered);
  return filtered;
}

export function updateProvider(provider) {
  const list = loadProviders();
  const idx = list.findIndex(p => p.id === provider.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...provider };
    saveProviders(list);
  }
  return list;
}

export function clearProviders() {
  localStorage.removeItem(PROVIDERS_KEY);
}

// Categories management
export function loadCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('loadCategories error', e);
    return [];
  }
}

export function saveCategories(categories) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('saveCategories error', e);
  }
}

export function addCategory(name) {
  const list = loadCategories();
  if (!list.includes(name)) {
    list.push(name);
    saveCategories(list);
  }
  return list;
}

export function removeCategory(name) {
  const list = loadCategories();
  const filtered = list.filter(c => c !== name);
  saveCategories(filtered);
  return filtered;
}

export function clearCategories() {
  localStorage.removeItem(CATEGORIES_KEY);
}

export default {
  loadProviders, saveProviders, addOrReplaceProvider, removeProviderById, updateProvider, clearProviders,
  loadCategories, saveCategories, addCategory, removeCategory, clearCategories
};
