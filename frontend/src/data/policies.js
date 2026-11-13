// ─────────────────────────────────────────────────────────────
// Legal & policy pages (Privacy, Terms, Refund, Shipping, Contact).
//
// These pages are required by Razorpay to approve the website for payments.
// Keep the business details below in line with the Razorpay account (the name
// on the PAN / bank account) and with what the site actually does.
//
// ⚠️ REVIEW BEFORE GOING LIVE: the timelines (dispatch days, delivery days,
// claim window, refund days) are standard defaults. Change them here if the
// business works differently; every page reads them from POLICY_TERMS.
// ─────────────────────────────────────────────────────────────

export const BUSINESS = {
  brand: 'Reiki & Vaastu World',
  owner: 'Yash Naresh Chhabdiya',
  founder: 'Dr. Naresh Chhabdiya',
  website: 'https://www.reikiandvaastuworld.com',
  email: 'reiki.vastuworld@gmail.com',
  phones: ['8446656677', '9423424596'],
  registeredAddress:
    'Sanjiwani Center, Khatri Complex, 1st Lane, Shop 4, Walcut Compound, Amravati, Maharashtra, India',
  centers: [
    {
      name: 'Amravati Center',
      address: 'Sanjiwani Center, Khatri Complex, 1st Lane, Shop 4, Walcut Compound, Amravati, Maharashtra, India'
    },
    {
      name: 'Nagpur Center',
      address: 'Reiki & Vaastu World, Near New English High School, Mahal, Nagpur, Maharashtra, India'
    }
  ],
  jurisdiction: 'Amravati, Maharashtra'
};

export const POLICY_TERMS = {
  lastUpdated: '12 November 2026',
  dispatchDays: '2–4 business days',
  deliveryDays: '5–10 business days',
  claimWindowHours: 48,
  refundDays: '5–7 business days',
  rescheduleNoticeHours: 24
};

const B = BUSINESS;
const T = POLICY_TERMS;
const phoneText = B.phones.join(' / ');

/**
 * Each page: { slug, title, intro, sections: [{ heading, paragraphs?, list?, note? }] }
 * A section renders its paragraphs, then its list, then its note.
 * The slug is also the page's URL path (/privacy-policy, ...).
 */
export const POLICIES = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    intro: `This Privacy Policy explains how ${B.brand} ("we", "us"), owned and operated by ${B.owner}, collects, uses and protects your personal information when you use ${B.website} (the "Website"), buy our products, or contact us for courses and consultations.`,
    sections: [
      {
        heading: 'Information we collect',
        list: [
          'Contact details you give us: your name, mobile number and email address.',
          'Delivery details when you place an order: your address, city, state and PIN code.',
          'Your live location, only if you choose to share it at checkout. It is used to fill in and locate your delivery address.',
          'Enquiry details: the course, service, centre, preferred date and time, and any message you send us.',
          'Testimonials you submit, including your name and rating. They are published only after we review and approve them.',
          'Order and payment records: what you bought, the amount, and the payment reference and status we receive from Razorpay.'
        ]
      },
      {
        heading: 'Payment information',
        paragraphs: [
          'Online payments are processed by Razorpay Software Private Limited, a PCI-DSS compliant payment gateway. Your card, UPI, net banking and wallet details are entered on Razorpay’s secure checkout and are never received or stored by us.'
        ]
      },
      {
        heading: 'How we use your information',
        list: [
          'To process, deliver and support your orders, including sending order updates.',
          'To respond to your enquiries and to schedule courses, consultations and sessions.',
          'To verify payments, prevent fraud and keep our records as required by law.',
          'To improve our Website and services.'
        ],
        note: 'We do not sell, rent or trade your personal information.'
      },
      {
        heading: 'Service providers we share information with',
        paragraphs: ['We share only the information each provider needs to perform its service for us:'],
        list: [
          'Razorpay: payment processing.',
          'Courier and delivery partners: your name, phone number and address, to deliver your order.',
          'Hosting and database providers (Vercel, Render and MongoDB Atlas): to run the Website and store records securely.',
          'Email service providers: to send order and enquiry notifications.',
          'OpenStreetMap (Nominatim): only if you use “Use my current location” at checkout, your coordinates are sent to look up the matching address.',
          'YouTube: videos embedded on the Website are served by YouTube, which may set its own cookies when you play them.'
        ]
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'The Website does not use advertising or tracking cookies. A secure login cookie is used only for our staff portal. Third-party content such as embedded YouTube videos may set cookies under their own policies.'
        ]
      },
      {
        heading: 'Data security and retention',
        paragraphs: [
          'Your information is sent over encrypted HTTPS connections and stored with access limited to authorised staff. We keep order and payment records for as long as required by tax and accounting laws, and other information only as long as needed for the purposes above.'
        ]
      },
      {
        heading: 'Your rights',
        paragraphs: [
          `You may ask to access, correct or delete your personal information, or withdraw consent, by writing to ${B.email}. We will respond within a reasonable time, subject to records we must keep by law.`
        ]
      },
      {
        heading: 'Grievance officer',
        paragraphs: [
          `In line with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, any complaint about your personal data can be sent to our Grievance Officer: ${B.owner}, ${B.brand}, ${B.registeredAddress}. Email: ${B.email}. Phone: ${phoneText}.`
        ]
      },
      {
        heading: 'Changes to this policy',
        paragraphs: ['We may update this policy from time to time. The latest version is always available on this page, with the date it was last updated.']
      }
    ]
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    intro: `These Terms & Conditions govern your use of ${B.website} (the "Website") and your purchase of products and services from ${B.brand}, owned and operated by ${B.owner} ("we", "us"). By using the Website or placing an order, you agree to these terms.`,
    sections: [
      {
        heading: 'About us',
        paragraphs: [
          `${B.brand} is a training and treatment centre for Reiki, Vaastu Shastra, astrology, numerology, Lama-Fera, crystal therapy and related holistic practices, founded by ${B.founder}, with centres in Amravati and Nagpur, Maharashtra. Through the Website we sell energised crystal and spiritual products, and take enquiries for courses, consultations and healing sessions.`
        ]
      },
      {
        heading: 'Eligibility',
        paragraphs: ['You must be at least 18 years old, or use the Website under the supervision of a parent or guardian, to place an order.']
      },
      {
        heading: 'Products, prices and payment',
        list: [
          'All prices are in Indian Rupees (INR) and are the total amount payable for the product, including delivery within India, unless stated otherwise at checkout.',
          'Crystals and gemstones are natural materials, so colour, pattern and size may vary slightly from the photographs.',
          'Payments are processed securely by Razorpay. An order is confirmed only after the payment is successfully received.',
          'We may correct pricing or listing errors and may cancel an order affected by such an error, with a full refund of any amount paid.',
          'We may limit quantities or decline orders at our discretion, for example where an item is out of stock. Any amount paid for an order we cannot fulfil is refunded in full.'
        ]
      },
      {
        heading: 'Courses, consultations and sessions',
        paragraphs: [
          'Courses, consultations, Vaastu audits and healing sessions are booked through enquiry forms or by contacting us. Fees, schedules and any payment terms are confirmed with you directly before booking. Cancellation and rescheduling are covered in our Refund & Cancellation Policy.'
        ]
      },
      {
        heading: 'Important disclaimer',
        paragraphs: [
          'Reiki, Vaastu, astrology, numerology, crystal therapy and related practices are traditional and complementary holistic practices. They are not a substitute for professional medical, psychological, legal or financial advice, diagnosis or treatment. Always consult a qualified professional for such matters. Individual experiences differ, and we do not guarantee any specific result.'
        ]
      },
      {
        heading: 'Use of the Website',
        list: [
          'You agree to give accurate information and not to misuse the Website, attempt unauthorised access, or interfere with its operation.',
          'All content on the Website, including text, images, logos and videos, belongs to us or our licensors and may not be copied or reused without permission.'
        ]
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          'To the extent permitted by law, our total liability for any claim relating to an order is limited to the amount you paid for that order. We are not liable for indirect or consequential losses, or for delays caused by events beyond our reasonable control.'
        ]
      },
      {
        heading: 'Governing law',
        paragraphs: [`These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts at ${B.jurisdiction}.`]
      },
      {
        heading: 'Contact',
        paragraphs: [`Questions about these terms can be sent to ${B.email} or ${phoneText}.`]
      }
    ]
  },
  {
    slug: 'refund-policy',
    title: 'Refund & Cancellation Policy',
    intro: `This policy explains how cancellations, replacements and refunds work for orders placed with ${B.brand} on ${B.website}.`,
    sections: [
      {
        heading: 'Cancelling a product order',
        paragraphs: [
          `You can cancel an order for a full refund any time before it is dispatched. Call or WhatsApp us at ${phoneText}, or email ${B.email}, with your order reference (it starts with “RVP-”). Once an order has been dispatched, it can no longer be cancelled.`
        ]
      },
      {
        heading: 'Damaged, defective or wrong items',
        paragraphs: [
          `If your product arrives damaged or defective, or you receive the wrong item, contact us within ${T.claimWindowHours} hours of delivery with your order reference and clear photos (an unboxing video helps). After verifying the issue, we will send a free replacement or, if a replacement is not possible, issue a full refund. You do not need to pay for return shipping in these cases.`
        ]
      },
      {
        heading: 'Returns',
        paragraphs: [
          'Each product is personally cleansed and energised for the buyer before dispatch, so we cannot accept returns for a change of mind. Natural variation in the colour, pattern or size of crystals is not considered a defect.'
        ]
      },
      {
        heading: 'How refunds are paid',
        list: [
          `Approved refunds are initiated within 2 business days and credited to your original payment method (card, UPI, net banking or wallet) through Razorpay, usually within ${T.refundDays}, depending on your bank.`,
          `If money was deducted but the payment failed or the order was not confirmed, the amount is refunded automatically, usually within ${T.refundDays}.`
        ]
      },
      {
        heading: 'Courses, consultations and sessions',
        list: [
          `You may reschedule a consultation, session or Vaastu visit by informing us at least ${T.rescheduleNoticeHours} hours in advance.`,
          `Fees paid for a course or session are refunded in full if you cancel at least ${T.rescheduleNoticeHours} hours before the scheduled start, or if we cancel and cannot offer a suitable new date.`,
          'Fees are not refundable once a session has taken place or a course has started.'
        ]
      },
      {
        heading: 'Contact for cancellations and refunds',
        paragraphs: [`Email ${B.email} or call ${phoneText}. Please include your order reference.`]
      }
    ]
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    intro: `This policy explains how ${B.brand} ships products ordered on ${B.website}.`,
    sections: [
      {
        heading: 'Where we deliver',
        paragraphs: ['We currently deliver to addresses within India only.']
      },
      {
        heading: 'Shipping charges',
        paragraphs: ['Delivery within India is included in the product price. No extra shipping charge is added at checkout.']
      },
      {
        heading: 'Dispatch and delivery times',
        list: [
          `Orders are dispatched within ${T.dispatchDays} after payment is confirmed. This includes time for each product to be cleansed and energised before packing.`,
          `After dispatch, delivery usually takes ${T.deliveryDays}, depending on your location.`,
          'Delivery to remote areas, or during holidays, strikes, bad weather or other events outside our control, may take longer.'
        ]
      },
      {
        heading: 'Order updates and tracking',
        paragraphs: [
          'Once your order is dispatched, we share the courier and tracking details by phone, WhatsApp or email. You can also check your payment and order status anytime using the link shown after payment.'
        ]
      },
      {
        heading: 'Delivery address',
        paragraphs: [
          'Please make sure your name, phone number, address and PIN code are correct at checkout. If a parcel is returned because of an incorrect address or because nobody was available to receive it, we will contact you to arrange re-delivery. Additional courier charges may apply.'
        ]
      },
      {
        heading: 'Damaged parcels',
        paragraphs: [
          `If the parcel looks damaged or tampered with on delivery, please note it with the courier if possible and contact us within ${T.claimWindowHours} hours. See our Refund & Cancellation Policy for replacements and refunds.`
        ]
      },
      {
        heading: 'Questions',
        paragraphs: [`For any delivery question, contact us at ${phoneText} or ${B.email}.`]
      }
    ]
  }
];

export const CONTACT_PAGE = { slug: 'contact-us', title: 'Contact Us' };

/** All page slugs, in the order they are listed in links. */
export const POLICY_LINKS = [
  { slug: 'contact-us', label: 'Contact Us' },
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms-and-conditions', label: 'Terms & Conditions' },
  { slug: 'refund-policy', label: 'Refund & Cancellation' },
  { slug: 'shipping-policy', label: 'Shipping & Delivery' }
];

export const POLICY_SLUGS = POLICY_LINKS.map((l) => l.slug);

export function policySlugFromPath(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  return POLICY_SLUGS.includes(slug) ? slug : null;
}
