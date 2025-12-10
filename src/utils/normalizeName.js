// utils/normalizeName.js

export function normalizeName(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD") // elimina acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "") // elimina emojis y símbolos
    .replace(/\s+/g, "_") // espacios por guiones bajos
    .replace(/_+/g, "_") // múltiplos guiones bajos por uno solo
    .trim();
}
