"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "./store";

export function Header() {
  const { count } = useShop();
  const pathname = usePathname();
  return (
    <header className="border-b border-slate-100 bg-white/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6" aria-label="Main navigation">
        <Link href="/" className="text-xl font-extrabold text-orange-700">FreshBites</Link>
        <div className="flex items-center gap-2 text-sm sm:gap-5">
          <Link href="/" className={pathname === "/" ? "nav-active" : "px-3 py-2"}>Home</Link>
          <Link href="/#foods" className="hidden sm:block">All Foods</Link>
          <Link href="/cart/" className={pathname.startsWith("/cart") ? "nav-active" : "px-3 py-2"}>
            Cart <span aria-live="polite" className="ml-1 rounded-full bg-orange-800 px-2 py-0.5 text-xs text-white">{count}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-indigo-50 px-5 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        <div><p className="text-xl font-bold text-orange-700">FreshBites</p><p className="mt-3 max-w-xs text-sm text-slate-600">Fresh cravings, delivered hot to your door.</p></div>
        <div><p className="font-bold">Quick links</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-600"><Link href="/">Home</Link><Link href="/#foods">All Foods</Link><Link href="/cart/">My Cart</Link></div></div>
        <div><p className="font-bold">Made for good food</p><p className="mt-3 text-sm text-slate-600">Browse your favorites and put together your next delicious meal.</p></div>
      </div>
    </footer>
  );
}

export function FoodStatus() {
  const { loading, error } = useShop();
  if (error) return <div role="alert" className="rounded-2xl bg-orange-50 p-6">{error} <button className="ml-2 underline" onClick={() => window.location.reload()}>Retry</button></div>;
  if (loading) return <p role="status" className="py-8 text-slate-600">Loading the menu… The server may take a moment to wake up.</p>;
  return null;
}
