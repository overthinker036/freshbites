"use client";

import { useState } from "react";
import { FoodStatus } from "./components";
import { useShop } from "./store";
import { money } from "../lib/cart";

const categories = ["All", "Burgers", "Pizza", "Salads", "Pasta", "Desserts", "Drinks"];
const icons = ["🍽️", "🍔", "🍕", "🥗", "🍝", "🍰", "🥤"];

export default function Home() {
  const { foods, change, loading, error } = useShop();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [notice, setNotice] = useState("");
  const visible = foods.filter((food) =>
    (category === "All" || food.category === category) &&
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-6xl px-5">
      <section className="grid items-center gap-10 rounded-b-3xl bg-gradient-to-br from-orange-50 to-indigo-50 px-5 py-12 sm:px-8 md:grid-cols-2 md:py-16">
        <div>
          <span className="rounded-full bg-green-200 px-3 py-1 text-xs text-green-900">Fresh food. Big flavor.</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">Fresh cravings,<br /><span className="text-orange-700">delivered hot</span> to your door.</h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">Discover delicious favorites, comforting classics, and fresh bowls made to brighten your day.</p>
          <form className="mt-7 flex flex-col gap-2 rounded-xl bg-white p-2 shadow-md sm:flex-row" onSubmit={(event) => { event.preventDefault(); document.getElementById("foods").scrollIntoView({ behavior: "smooth" }); }}>
            <input aria-label="Search foods" placeholder="Search for burgers, pizza, bowls…" className="min-w-0 flex-1 px-3 py-3 text-sm" value={search} onChange={(event) => setSearch(event.target.value)} />
            <button className="primary text-sm">Explore Food →</button>
          </form>
        </div>
        <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-lg">
          <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=80" alt="A freshly prepared burger" className="h-64 w-full rounded-2xl object-cover lg:h-80" />
          <div className="flex items-center gap-3 p-4"><span className="rounded-lg bg-green-200 p-3">🍔</span><div><p className="font-bold">Your next favorite bite</p><p className="text-xs text-slate-500">Freshly prepared. Full of flavor.</p></div></div>
        </div>
      </section>

      <section className="py-12">
        <p className="eyebrow">Categories</p><h2 className="mt-2 text-2xl font-bold">What are you craving today?</h2>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((name, index) => <button key={name} aria-pressed={category === name} onClick={() => setCategory(name)} className={`rounded-2xl border p-5 text-sm font-semibold ${category === name ? "border-orange-600 bg-orange-50" : "border-slate-100 bg-white"}`}><span className="mb-3 block text-3xl">{icons[index]}</span>{name}</button>)}
        </div>
      </section>

      <section id="foods" className="scroll-mt-6">
        <p className="eyebrow">Handpicked favorites</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Featured Dishes</h2><p role="status" className="text-sm text-orange-700">{notice}</p></div>
        <FoodStatus />
        {!loading && !error && visible.length === 0 && <p className="py-8">No foods match your search.</p>}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((food) => <article key={food.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <img src={food.image_url} alt={food.name} className="h-52 w-full object-cover" loading="lazy" />
            <div className="p-5"><p className="eyebrow">{food.category}</p><h3 className="mt-2 text-lg font-bold">{food.name}</h3><p className="mt-2 min-h-10 text-sm text-slate-600">{food.description}</p>
              <div className="mt-5 flex items-center justify-between gap-2"><span className="font-bold text-orange-700">{money(food.price_cents)}</span><button className="primary text-sm" aria-label={`Add ${food.name} to cart`} onClick={() => { change(food.id, 1); setNotice(`${food.name} added to cart`); }}>+ Add to Cart</button></div>
            </div>
          </article>)}
        </div>
      </section>

      <section className="py-16 text-center">
        <p className="eyebrow">Simple & easy</p><h2 className="mt-3 text-3xl font-bold">Good food in three easy steps</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[["01", "Choose your meal", "Browse the menu and find something delicious."], ["02", "Build your cart", "Add your favorites and choose your quantities."], ["03", "Review your total", "See your order and its price at a glance."]].map(([number, title, text]) => <div key={number} className="rounded-3xl border border-orange-100 bg-white p-8"><span className="rounded-xl bg-orange-50 p-3 font-bold text-orange-700">{number}</span><h3 className="mt-6 font-bold">{title}</h3><p className="mt-3 text-sm text-slate-600">{text}</p></div>)}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl bg-gradient-to-br from-orange-100 to-indigo-100 p-8 md:grid-cols-2 md:p-12">
        <div><p className="eyebrow">FreshBites on the go</p><h2 className="mt-4 text-3xl font-bold">Great food,<br /><span className="text-orange-700">wherever you are.</span></h2><p className="mt-4 text-sm leading-6 text-slate-600">Browse on your phone or your laptop. Your next favorite meal is a few taps away.</p></div>
        <div className="self-center rounded-2xl bg-white p-6 shadow-lg"><p className="text-sm font-bold text-green-700">Fresh picks, every day</p><p className="mt-4 text-xl font-bold">Something for every craving</p><p className="mt-3 text-sm text-slate-600">Burgers, pizza, fresh bowls and sweet treats.</p><a href="#foods" className="mt-5 inline-block text-sm font-bold text-orange-700">Explore the menu →</a></div>
      </section>
    </main>
  );
}
