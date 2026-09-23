"use client";

import Link from "next/link";
import { useShop } from "../store";
import { FoodStatus } from "../components";
import { money } from "../../lib/cart";

export default function CartPage() {
  const { items, count, subtotal, change, remove, loading, error } = useShop();

  return (
    <main className="mx-auto min-h-[65vh] max-w-6xl px-5 py-12">
      <p className="eyebrow">Review your order</p><h1 className="mt-3 text-4xl font-extrabold">Your Food Cart</h1>
      <FoodStatus />
      {!loading && !error && (items.length === 0 ? <div className="mt-10 rounded-3xl bg-white p-10 text-center"><p className="text-xl font-bold">Your cart is empty.</p><p className="mt-3 text-slate-600">Let's find something delicious.</p><Link className="primary mt-6 inline-block" href="/">Browse Foods</Link></div> :
        <div className="mt-10 grid items-start gap-7 lg:grid-cols-[1.4fr_1fr]">
          <section aria-label="Cart items">
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-indigo-50 p-5"><div><h2 className="font-bold">FreshBites Kitchen</h2><p className="mt-1 text-sm text-slate-600">Your delicious picks</p></div><span className="rounded-full bg-green-200 px-3 py-1 text-sm text-green-900">{count} items</span></div>
            <div className="space-y-4">{items.map((item) => <article key={item.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <img src={item.image_url} alt={item.name} className="h-24 w-20 rounded-xl object-cover sm:w-28" />
              <div className="min-w-0 flex-1"><h3 className="font-bold sm:text-lg">{item.name}</h3><p className="mt-1 text-xs text-slate-500">{money(item.price_cents)} each</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-4 rounded-full bg-indigo-50 px-3 py-1"><button aria-label={`Decrease ${item.name}`} className="px-2 py-1 text-lg" onClick={() => change(item.id, -1)}>−</button><span>{item.quantity}</span><button aria-label={`Increase ${item.name}`} disabled={item.quantity >= 99} className="px-2 py-1 text-lg disabled:opacity-30" onClick={() => change(item.id, 1)}>+</button></div><button aria-label={`Remove ${item.name}`} className="text-xs text-red-600" onClick={() => remove(item.id)}>Remove</button></div>
              </div><p className="text-sm font-bold text-orange-700 sm:text-base">{money(item.price_cents * item.quantity)}</p>
            </article>)}</div>
            <Link href="/" className="mt-6 inline-block text-sm font-semibold text-orange-700">← Add more food</Link>
          </section>
          <aside className="rounded-3xl bg-white p-7 shadow-sm" aria-label="Order summary">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="mt-7 flex justify-between text-slate-600"><span>Subtotal ({count} items)</span><span>{money(subtotal)}</span></div>
            <div className="mt-4 flex justify-between text-slate-600"><span>Delivery</span><span className="text-green-700">Free</span></div>
            <div className="mt-7 flex items-center justify-between border-t border-orange-100 pt-7"><span className="text-xl font-bold">Total</span><p data-testid="cart-total" aria-live="polite" className="text-4xl font-extrabold text-orange-700">{money(subtotal)}</p></div>
            <p className="mt-6 text-sm leading-6 text-slate-500">This practice cart stops here. No payment or order will be placed.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
