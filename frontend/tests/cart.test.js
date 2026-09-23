import test from "node:test";
import assert from "node:assert/strict";
import { changeQuantity, getCartItems, getSubtotal, readSavedCart, money } from "../lib/cart.js";

test("add, increment, decrement, and remove with exact prices", () => {
  const foods = [{ id: 1, price_cents: 1499 }, { id: 2, price_cents: 1250 }];
  let cart = changeQuantity({}, 1, 1);
  cart = changeQuantity(cart, 1, 1);
  cart = changeQuantity(cart, 2, 1);
  assert.equal(getSubtotal(getCartItems(foods, cart)), 4248);
  cart = changeQuantity(cart, 1, -1);
  assert.equal(getSubtotal(getCartItems(foods, cart)), 2749);
  cart = changeQuantity(cart, 2, -1);
  assert.equal(money(getSubtotal(getCartItems(foods, cart))), "$14.99");
  cart = changeQuantity(cart, 1, -1);
  assert.equal(getSubtotal(getCartItems(foods, cart)), 0);
});

test("stored quantities are validated and unavailable foods are ignored", () => {
  assert.deepEqual(readSavedCart('{"1":2,"2":-1,"3":"5","4":100}'), { 1: 2 });
  assert.deepEqual(readSavedCart("null"), {});
  assert.deepEqual(getCartItems([], { 1: 2 }), []);
});
