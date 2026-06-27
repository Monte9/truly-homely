import type { Metadata } from "next";
import CheckoutClient from "@/components/cart/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout - Truly Homely",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-28 pt-8 sm:px-6">
      <CheckoutClient />
    </main>
  );
}
