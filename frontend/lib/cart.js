// All calculations use integer cents. Only formatting converts to dollars.
export function money(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function changeQuantity(cart, id, amount) {
  const next = { ...cart };
  const quantity = (next[id] || 0) + amount;
  if (quantity <= 0) delete next[id];
  else next[id] = Math.min(quantity, 99);
  return next;
}

export function getCartItems(foods, cart) {
  return foods
    .filter((food) => cart[food.id] > 0)
    .map((food) => ({ ...food, quantity: cart[food.id] }));
}

export function getSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);
}

export function readSavedCart(raw) {
  const saved = JSON.parse(raw || "{}");
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
  return Object.fromEntries(
    Object.entries(saved).filter(([id, quantity]) =>
      /^[1-9]\d*$/.test(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99
    )
  );
}
