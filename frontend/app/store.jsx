"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { changeQuantity, getCartItems, getSubtotal, readSavedCart } from "../lib/cart";

const ShopContext = createContext(null);
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
const STORAGE_KEY = "freshbites-cart-v1";

export function ShopProvider({ children }) {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setCart(readSavedCart(localStorage.getItem(STORAGE_KEY)));
    } catch {
      setCart({});
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Cart still works for this visit if browser storage is unavailable.
    }
  }, [cart, ready]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/foods`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load foods.");
        return response.json();
      })
      .then(setFoods)
      .catch((err) => {
        if (err.name !== "AbortError") setError("Cannot reach the food server. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  function change(id, amount) {
    setCart((previous) => changeQuantity(previous, id, amount));
  }

  function remove(id) {
    setCart((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }

  const items = getCartItems(foods, cart);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal(items);

  return (
    <ShopContext.Provider value={{ foods, items, count, subtotal, change, remove, loading: loading || !ready, error }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
