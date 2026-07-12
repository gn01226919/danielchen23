import "server-only";
import Stripe from "stripe";
import {
  getAppUrl,
  getStripePriceMonthly,
  getStripePriceYearly,
  getStripeSecretKey,
  hasStripe,
} from "./env";

export function isStripeConfigured() {
  return (
    hasStripe() &&
    Boolean(getStripePriceMonthly() && getStripePriceYearly())
  );
}

export function getStripe() {
  return new Stripe(getStripeSecretKey());
}

export function priceIdForPlan(plan: "monthly" | "yearly") {
  const id =
    plan === "monthly" ? getStripePriceMonthly() : getStripePriceYearly();
  if (!id) throw new Error(`Missing STRIPE_PRICE_${plan.toUpperCase()}`);
  return id;
}

export async function createCheckoutSession(opts: {
  userId: string;
  email: string;
  plan: "monthly" | "yearly";
}) {
  const stripe = getStripe();
  const app = getAppUrl();
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: opts.email,
    client_reference_id: opts.userId,
    line_items: [{ price: priceIdForPlan(opts.plan), quantity: 1 }],
    success_url: `${app}/account?checkout=success`,
    cancel_url: `${app}/subscribe?checkout=cancel`,
    metadata: {
      user_id: opts.userId,
      plan: opts.plan,
    },
    subscription_data: {
      metadata: {
        user_id: opts.userId,
        plan: opts.plan,
      },
    },
  });
}

export async function createBillingPortalSession(customerId: string) {
  const stripe = getStripe();
  const app = getAppUrl();
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${app}/account`,
  });
}
