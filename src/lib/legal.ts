import { BUSINESS, SITE } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

/**
 * Storefront policy pages.
 *
 * These are the documents payment providers look for before approving an
 * account, and they are the ones customers cite in a dispute — so the numbers
 * here are derived from SITE rather than retyped, and the wording matches the
 * homepage FAQ. Change a shipping constant in one place and every page follows.
 *
 * NOTE: templates, not legal advice. Have a lawyer review them for your
 * jurisdiction before you take real money.
 */

const FREE = formatPrice(SITE.freeShippingThreshold);
const FLAT = formatPrice(SITE.flatShipping);

/** Last substantive edit. Bump when you change a policy's meaning. */
export const LEGAL_UPDATED = "10 July 2026";

export type LegalSection = {
  heading: string;
  body?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  sections: LegalSection[];
};

const contactLine = BUSINESS.address
  ? `${BUSINESS.legalName}, ${BUSINESS.address}`
  : BUSINESS.legalName;

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "shipping",
    title: "Shipping Policy",
    summary: "How and when your order reaches you.",
    sections: [
      {
        heading: "Made to order",
        body: [
          `Every ${SITE.name} piece is printed on demand. Nothing is made until you order it, which is why production takes a little longer than pulling a shirt off a shelf — and why nothing we make ends up as deadstock.`,
        ],
      },
      {
        heading: "Production & delivery time",
        bullets: [
          "Production: your order is printed and dispatched within about 48 hours.",
          "Delivery: most orders arrive 2–5 business days after dispatch.",
          "Total: expect roughly 3–7 business days from order to doorstep.",
          "Tracking is emailed to you as soon as your parcel leaves the print hub.",
        ],
      },
      {
        heading: "Shipping cost",
        bullets: [
          `Orders of ${FREE} or more ship free.`,
          `Orders below ${FREE} pay a flat ${FLAT}.`,
          "Shipping is calculated at checkout, before you pay.",
        ],
      },
      {
        heading: "Where we ship",
        body: [
          "We print in a network of production hubs and ship worldwide. Your order is routed to the hub nearest you, so most parcels travel domestically rather than across the world.",
          "Customs duties or import taxes, where they apply, are set by your country and are the recipient's responsibility. We cannot calculate or prepay them.",
        ],
      },
      {
        heading: "Wrong address, lost & delayed parcels",
        body: [
          "Please check your shipping address carefully — once an item is in production we cannot change it. If a parcel is returned to us because the address was incorrect or unclaimed, we will reship it once you cover the return postage.",
          `If tracking has not moved for 10 business days, email ${BUSINESS.supportEmail} and we will open an investigation with the carrier and, where the parcel is confirmed lost, reprint your order at no cost.`,
        ],
      },
    ],
  },

  {
    slug: "returns",
    title: "Returns & Refunds",
    summary: "30 days to change your mind. Misprints always on us.",
    sections: [
      {
        heading: "30-day returns",
        body: [
          "Not the right fit? Return any unworn, unwashed item in its original condition within 30 days of delivery for a full refund of the item price.",
          "Start a return by emailing us with your order number. We'll send return instructions. Return postage is paid by you unless the item was faulty, misprinted or not what you ordered.",
        ],
      },
      {
        heading: "Faulty or misprinted items",
        body: [
          "If your item arrives damaged, misprinted, or materially different from the product page, we replace or refund it in full — you keep the original and pay nothing.",
          "Email us within 30 days of delivery with your order number and a photo of the issue. Most claims are resolved within one business day.",
        ],
      },
      {
        heading: "How refunds are issued",
        bullets: [
          "Refunds return to your original payment method.",
          "We process the refund within 3 business days of receiving the returned item (or of approving a misprint claim).",
          "Your bank or card issuer may take a further 5–10 business days to post it.",
          "Original shipping charges are refunded only when the return is our fault.",
        ],
      },
      {
        heading: "What we cannot accept",
        bullets: [
          "Items that have been worn, washed, altered or damaged after delivery.",
          "Returns requested more than 30 days after delivery.",
          "Items returned without contacting us first — we cannot identify unlabelled parcels.",
        ],
      },
      {
        heading: "Cancelling an order",
        body: [
          "Because each item is made to order, we can only cancel before production starts — usually a short window after checkout. Email us immediately and we will cancel and refund in full if the order has not yet gone to print.",
        ],
      },
    ],
  },

  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What we collect, why, and who else sees it.",
    sections: [
      {
        heading: "Who we are",
        body: [
          `This site is operated by ${contactLine}. For any privacy question, contact ${BUSINESS.supportEmail}.`,
        ],
      },
      {
        heading: "What we collect",
        bullets: [
          "Order details: your name, email address, shipping address, and what you bought. We need these to make and deliver your order.",
          "Payment details: handled entirely by our payment provider. We never see or store your full card number.",
          "Email address, if you subscribe to our list. You can unsubscribe at any time.",
          "Basic technical data your browser sends (IP address, user agent) as part of serving the site.",
        ],
      },
      {
        heading: "What we do not do",
        bullets: [
          "We do not sell your personal data.",
          "We do not share it for anyone else's advertising.",
          "We do not run third-party advertising or tracking pixels on this site.",
        ],
      },
      {
        heading: "Who processes your data for us",
        body: [
          "To run the shop we pass the minimum necessary data to a small number of processors:",
        ],
        bullets: [
          "Our hosting provider, which serves the site and stores orders in an encrypted database.",
          "Our payment provider, which takes payment and performs fraud checks.",
          "Our print and fulfilment partner, which receives your name and shipping address in order to make and post your parcel.",
          "Our email provider, which sends your order confirmation and any tracking updates.",
        ],
      },
      {
        heading: "Cookies and local storage",
        body: [
          "We use no advertising or analytics cookies. Your shopping cart is kept in your browser's local storage so it survives a page reload. If you sign in to the admin area, a single signed, http-only session cookie identifies you; it expires after 12 hours.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Order records are retained for as long as we are required to keep them for tax and accounting purposes. Marketing emails are kept until you unsubscribe.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You may ask us for a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it. Email ${BUSINESS.supportEmail} and we will respond within ${BUSINESS.responseHours} hours. Deleting data attached to a completed order may be limited by our legal record-keeping duties.`,
        ],
      },
    ],
  },

  {
    slug: "terms",
    title: "Terms of Service",
    summary: "The agreement between you and us.",
    sections: [
      {
        heading: "These terms",
        body: [
          `By placing an order on ${SITE.name} you agree to these terms. If you do not agree with them, please do not order.`,
          `The site is operated by ${contactLine}.`,
        ],
      },
      {
        heading: "Orders and acceptance",
        body: [
          "Adding an item to your cart and submitting the checkout form is an offer to buy. A contract forms only when we confirm your order by email. We may decline an order — for example if an item is unavailable, if there was a pricing error, or if we suspect fraud — and where we do, we refund any payment in full.",
        ],
      },
      {
        heading: "Prices and payment",
        bullets: [
          `All prices are shown in ${SITE.currency} and include neither customs duties nor import taxes.`,
          "Shipping, where it applies, is added at checkout before you pay.",
          "The price you pay is the price shown at checkout, calculated on our server from the live catalogue.",
          "We may change prices at any time; changes never affect an order we have already confirmed.",
        ],
      },
      {
        heading: "Products",
        body: [
          "Our garments are printed on demand. Because printing and garment dyeing are physical processes, slight variation in placement and colour between items is normal and is not a defect. Product photographs are representative; screen colours vary.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          `The ${SITE.name} name, the site design, and the artwork we own may not be copied or resold without our written permission.`,
          "If you believe material on this site infringes your rights, contact us with details and we will investigate promptly and remove infringing material where the claim is substantiated.",
        ],
      },
      {
        heading: "Our liability",
        body: [
          "We stand behind our products: if an item is faulty, misprinted, or never arrives, we replace or refund it, as set out in our Returns & Refunds policy. That is your primary remedy.",
          "Beyond that, and to the extent the law allows, our total liability for any order is limited to the amount you paid for it. Nothing in these terms limits liability for death, personal injury, or fraud.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          `These terms are governed by the laws of ${BUSINESS.country}, and disputes are subject to the exclusive jurisdiction of its courts. If you are a consumer, this does not deprive you of protections that the law of your own country gives you.`,
        ],
      },
      {
        heading: "Changes",
        body: [
          "We may update these terms. The version published on the day you order is the one that applies to that order.",
        ],
      },
    ],
  },

  {
    slug: "contact",
    title: "Contact Us",
    summary: "A real person reads every message.",
    sections: [
      {
        heading: "Email",
        body: [
          `The fastest way to reach us is ${BUSINESS.supportEmail}. We reply within ${BUSINESS.responseHours} hours, Monday to Friday.`,
        ],
      },
      {
        heading: "Before you write",
        body: [
          "If you're asking about an order, please include your order number — it looks like DHN-XXXXXXX and is in your confirmation email. That lets us answer on the first reply instead of the third.",
        ],
      },
      {
        heading: "What we can help with",
        bullets: [
          "Where is my order, and has it shipped?",
          "I need to return or exchange something.",
          "My item arrived damaged or misprinted.",
          "Sizing, fabric and print questions.",
          "Wholesale, collaborations and press.",
        ],
      },
      {
        heading: "Business details",
        body: [
          contactLine,
          `Registered in ${BUSINESS.country}.`,
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | null {
  return LEGAL_DOCS.find((d) => d.slug === slug) ?? null;
}
