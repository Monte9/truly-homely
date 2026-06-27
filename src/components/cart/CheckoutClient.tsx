"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/format";

export default function CheckoutClient() {
  const { mounted, lines, subtotal, clear } = useCart();

  function placeOrder() {
    window.alert("Coming soon");
    clear();
  }

  // Avoid a flash of "empty" before localStorage hydrates.
  if (!mounted) {
    return <div className="py-24 text-center text-muted">Loading your cart…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center" data-testid="checkout-empty">
        <h1 className="font-serif text-4xl text-ink">Your cart is empty</h1>
        <p className="max-w-sm text-ink-soft">
          Add a few homely dishes to your cart and they will show up here, ready to order.
        </p>
        <Link
          href="/"
          className="rounded-full bg-terracotta px-6 py-3 text-base font-bold text-white shadow-[0_8px_20px_rgba(188,83,40,0.4)]"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="checkout">
      <Link href="/" className="text-sm font-semibold text-terracotta-ink hover:underline">
        ← Back to the menu
      </Link>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Checkout</h1>
      <p className="mt-2 text-ink-soft">Review your order before placing it.</p>

      <ul className="mt-8 divide-y divide-line rounded-3xl border border-line bg-card">
        {lines.map(({ item, qty }) => (
          <li key={item.slug} data-testid="checkout-item" data-slug={item.slug} className="flex items-center gap-4 px-4 py-4 sm:px-6">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper-2">
              <Image src={item.images[0]} alt={item.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-lg text-ink">{item.name}</h2>
              <p className="text-sm text-muted">
                {formatINR(item.price ?? 0)} × {qty}
              </p>
            </div>
            <span className="shrink-0 font-bold text-ink tabular-nums">
              {formatINR((item.price ?? 0) * qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-3xl bg-paper-2 px-6 py-5">
        <span className="text-lg font-semibold text-ink">Total</span>
        <span data-testid="cart-total" className="font-serif text-2xl font-bold text-terracotta-ink tabular-nums">
          {formatINR(subtotal)}
        </span>
      </div>

      <button
        type="button"
        data-testid="place-order"
        onClick={placeOrder}
        className="mt-6 w-full rounded-full bg-terracotta px-6 py-4 text-lg font-bold text-white shadow-[0_10px_24px_rgba(188,83,40,0.4)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        Place Order
      </button>
    </div>
  );
}
