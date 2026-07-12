import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendWelcomeEmail } from "@/lib/server/email";
import { getStripeWebhookSecret } from "@/lib/server/env";
import { upsertSubscriptionFromStripe } from "@/lib/server/membership";
import { getStripe } from "@/lib/server/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      getStripeWebhookSecret(),
    );
  } catch {
    console.error("[stripe/webhook] signature failed");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          session.metadata?.user_id || session.client_reference_id || "";
        if (!userId) break;

        const plan =
          session.metadata?.plan === "monthly" ? "monthly" : "yearly";
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id ?? null;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;

        if (subId) {
          const sub = (await stripe.subscriptions.retrieve(
            subId,
          )) as Stripe.Subscription;
          const periodEnd =
            "current_period_end" in sub && typeof sub.current_period_end === "number"
              ? new Date(sub.current_period_end * 1000)
              : null;
          await upsertSubscriptionFromStripe({
            userId,
            email: session.customer_details?.email || session.customer_email,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subId,
            plan,
            status:
              sub.status === "trialing"
                ? "trialing"
                : sub.status === "active"
                  ? "active"
                  : "inactive",
            currentPeriodEnd: periodEnd,
          });
        } else {
          await upsertSubscriptionFromStripe({
            userId,
            email: session.customer_details?.email || session.customer_email,
            stripeCustomerId: customerId,
            stripeSubscriptionId: null,
            plan,
            status: "active",
            currentPeriodEnd: null,
          });
        }

        const to =
          session.customer_details?.email || session.customer_email || "";
        if (to) await sendWelcomeEmail({ to });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;
        const plan = sub.metadata?.plan === "monthly" ? "monthly" : "yearly";
        const statusMap: Record<
          string,
          "active" | "past_due" | "canceled" | "trialing" | "inactive"
        > = {
          active: "active",
          trialing: "trialing",
          past_due: "past_due",
          canceled: "canceled",
          unpaid: "past_due",
          incomplete: "inactive",
          incomplete_expired: "canceled",
          paused: "inactive",
        };
        const periodEnd =
          "current_period_end" in sub &&
          typeof (sub as { current_period_end?: number }).current_period_end ===
            "number"
            ? new Date(
                (sub as { current_period_end: number }).current_period_end *
                  1000,
              )
            : null;
        await upsertSubscriptionFromStripe({
          userId,
          stripeCustomerId:
            typeof sub.customer === "string" ? sub.customer : sub.customer.id,
          stripeSubscriptionId: sub.id,
          plan,
          status: statusMap[sub.status] ?? "inactive",
          currentPeriodEnd: periodEnd,
        });
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error(
      "[stripe/webhook] handler error",
      e instanceof Error ? e.message : e,
    );
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
