/* ============================================================================
   ✦ BOUTIQUE WEBSITE CONFIGURATION ✦
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to customise the website for a
   new client. Change the values below, replace the images inside
   assets/images/  — and the entire website updates automatically.

   ❗ Never edit index.html, style.css or main.js for client customisation.
   ============================================================================ */

const CONFIG = {

  /* ─────────────────────────────  BOUTIQUE IDENTITY  ───────────────────── */
  shop: {
    name: "Krishna Boutique",
    shortName: "OSR",                       // used for the monogram emblem
    tagline: "Elegance Woven in Tradition",
    description: "Premium ethnic and contemporary Indian fashion for every occasion — sarees, lehengas, suits and bridal couture, curated with love.",
    logo: "logo.svg",         // set "" to use the text monogram only
    favicon: "favicon.svg",
    established: "2008"                     // shown in About; set "" to hide
  },

  /* ─────────────────────────────  CONTACT DETAILS  ─────────────────────── */
  contact: {
    phone: "+91 9555514915",
    whatsapp: "+91 9555514915",            // WhatsApp CTA number (with country code)
    email: "hello@krishnaboutique.in",
    address: {
      line1: "12, Hazratganj Market, Near City Mall",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226001"
    },
    // Paste any Google Maps share link. Leave "" to auto-generate from address.
    googleMaps: ""
  },

  /* ──────────────  SOCIAL LINKS (leave "" to hide a button)  ───────────── */
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "",
    pinterest: ""
  },

  /* ─────────────────────────────  OPENING HOURS  ───────────────────────── */
  hours: {
    monday:    "10:00 AM – 8:00 PM",
    tuesday:   "10:00 AM – 8:00 PM",
    wednesday: "10:00 AM – 8:00 PM",
    thursday:  "10:00 AM – 8:00 PM",
    friday:    "10:00 AM – 8:00 PM",
    saturday:  "10:00 AM – 9:00 PM",
    sunday:    "11:00 AM – 6:00 PM"
  },

  /* ────────────────  FEATURE SWITCHES (true = show, false = hide) ──────── */
  features: {
    bridalSection: true,
    testimonials: true,
    lookbook: true,
    offers: true,
    customCursor: true,       // premium desktop cursor (auto-disabled on touch)
    preloader: true,
    scrollProgress: true
  },

  /* ─────────────────────────────  HERO SECTION  ────────────────────────── */
  hero: {
    eyebrow: "The Art of Indian Elegance",
    title: "Tradition, Reimagined.",
    subtitle: "Discover timeless Indian fashion crafted for your most beautiful moments.",
    image: "hero.jpg",
    buttonText: "Explore Collection",
    buttonLink: "#collection",
    secondaryButtonText: "Visit Boutique",
    secondaryButtonLink: "#contact",
    stats: [                                 // small trust badges (max 3), [] to hide
      { value: "15+", label: "Years of Craft" },
      { value: "5000+", label: "Happy Clients" },
      { value: "100%", label: "Handpicked Fabrics" }
    ]
  },

  /* ─────────────────────────────  ABOUT SECTION  ───────────────────────── */
  about: {
    eyebrow: "Our Story",
    title: "Where Tradition Meets Modern Elegance",
    description: "Rooted in Indian tradition and designed for the modern woman, our boutique began as a small family atelier and has grown into a destination for handpicked ethnic couture. Every saree, lehenga and suit in our collection is chosen for its fabric, fall and finish — because we believe an outfit should feel as beautiful as it looks.",
    quote: "Rooted in Indian tradition, designed for the modern woman.",
    image: "about.jpg",
    points: [                                // highlight points, [] to hide
      "Handpicked designer fabrics & weaves",
      "In-house tailoring & perfect fitting",
      "Bridal styling consultation",
      "Exclusive festive collections every season"
    ]
  },

  /* ───────────────  COLLECTION CATEGORIES (filter buttons)  ────────────── */
  categories: [
    "Sarees",
    "Lehengas",
    "Suits",
    "Anarkali",
    "Kurtis",
    "Bridal Wear"
  ],

  /* ────────────────────────────  PRODUCTS  ─────────────────────────────
     Add as many products as you like — cards are generated automatically.
     badge: "New" | "Bestseller" | "Limited" | "" (empty = no badge)
     featured: true shows the product first.                              */
  products: [
    {
      name: "Banarasi Silk Saree",
      category: "Sarees",
      price: "₹8,499",
      image: "product-01.jpg",
      description: "Pure Banarasi silk saree with handwoven gold zari borders and a rich pallu — a timeless heirloom piece for weddings and festive evenings.",
      badge: "Bestseller",
      featured: true
    },
    {
      name: "Royal Blue Designer Saree",
      category: "Sarees",
      price: "₹6,999",
      image: "product-02.jpg",
      description: "Deep navy designer saree with delicate embellishments, draped to perfection for receptions and evening soirées.",
      badge: "New",
      featured: true
    },
    {
      name: "Crimson Bridal Lehenga",
      category: "Bridal Wear",
      price: "₹34,999",
      image: "product-03.jpg",
      description: "A regal crimson bridal lehenga with heavy zardozi embroidery, voluminous flare and a hand-finished dupatta — made for your big day.",
      badge: "Limited",
      featured: true
    },
    {
      name: "Scarlet Anarkali Suit",
      category: "Anarkali",
      price: "₹5,499",
      image: "product-04.jpg",
      description: "Floor-length red Anarkali with intricate embroidery and a flowing silhouette — graceful for sangeet and festive occasions.",
      badge: "New"
    },
    {
      name: "Amethyst Anarkali Gown",
      category: "Anarkali",
      price: "₹5,999",
      image: "product-05.jpg",
      description: "Rich purple Anarkali gown with embroidered bodice and matching dupatta — an effortless statement of elegance.",
      badge: ""
    },
    {
      name: "Mustard Festive Kurti",
      category: "Kurtis",
      price: "₹2,499",
      image: "product-06.jpg",
      description: "A-line mustard kurti in breathable fabric with subtle detailing — everyday elegance with a festive touch.",
      badge: ""
    },
    {
      name: "Vermilion Silk Saree",
      category: "Sarees",
      price: "₹7,299",
      image: "product-07.jpg",
      description: "Classic red and gold silk saree paired with traditional jewellery-friendly tones — grace that never goes out of style.",
      badge: "Bestseller"
    },
    {
      name: "Regal Wedding Lehenga",
      category: "Lehengas",
      price: "₹28,999",
      image: "product-08.jpg",
      description: "Heavily embroidered wedding lehenga with cascading gold work — crafted for brides and bridesmaids who love drama.",
      badge: ""
    }
  ],

  /* ──────────────  BRIDAL / FESTIVE FEATURE  (features.bridalSection) ──── */
  bridal: {
    eyebrow: "Signature Collection",
    title: "Bridal & Festive Couture",
    description: "From regal bridal lehengas to reception sarees and festive ensembles — discover a collection created for the most important days of your life. Book a private styling session at the boutique.",
    image: "bridal.jpg",
    buttonText: "Book Bridal Consultation",
    highlights: ["Bridal Lehengas", "Wedding Sarees", "Reception Wear", "Festive Ensembles"]
  },

  /* ─────────────────  LOOKBOOK / GALLERY  (features.lookbook) ──────────── */
  lookbookTitle: "The Lookbook",
  lookbookEyebrow: "Moments in Couture",
  gallery: [
    "gallery-01.jpg",
    "gallery-02.jpg",
    "gallery-03.jpg",
    "gallery-04.jpg",
    "gallery-05.jpg",
    "gallery-06.jpg"
  ],

  /* ─────────────────  TESTIMONIALS  (features.testimonials) ────────────── */
  testimonials: [
    {
      name: "Ananya Sharma",
      review: "I bought my wedding lehenga here and the experience was unforgettable. The fitting, the fabric, the finish — everything was flawless.",
      rating: 5,
      photo: ""                               // optional: "assets/images/customer-01.jpg"
    },
    {
      name: "Priya Verma",
      review: "Beautiful collection and truly excellent service. The team helped me pick a saree for my sister's engagement in minutes.",
      rating: 5,
      photo: ""
    },
    {
      name: "Ritika Singh",
      review: "Premium quality at fair prices. Their festive collection is always ahead of the trend. Highly recommended!",
      rating: 5,
      photo: ""
    },
    {
      name: "Meera Kapoor",
      review: "The WhatsApp enquiry made everything so easy — I reserved my outfit before even visiting the store. Lovely boutique.",
      rating: 4,
      photo: ""
    }
  ],

  /* ─────────────────────  OFFER SECTION  (features.offers) ─────────────── */
  offer: {
    eyebrow: "Limited Season",
    title: "Festive Collection 2026",
    description: "Discover our latest festive styles — new silks, statement lehengas and hand-embroidered suits, fresh from the ateliers.",
    highlight: "Up to 20% off on festive picks",
    buttonText: "Explore Now",
    buttonLink: "#collection",
    image: "offer.jpg"
  },

  /* ─────────────────────────────  THEME  ───────────────────────────────
     Change the whole visual identity here. Colours accept any CSS colour.
     Fonts must be Google Fonts family names.                             */
  theme: {
    primary: "#3B0D11",        // deep maroon — main brand colour
    secondary: "#1C0A0D",      // near-black plum — dark surfaces
    accent: "#C9A24B",         // antique gold — lines, highlights, CTAs
    accentSoft: "#E8C878",     // light gold — gradients
    background: "#FAF5EC",     // warm ivory — page background
    surface: "#FFFFFF",        // cards
    text: "#2A1A14",           // body text on light
    textLight: "#F5EBDD",      // body text on dark
    headingFont: "Cormorant Garamond",
    bodyFont: "Jost"
  },

  /* ─────────────────────────────  SEO  ─────────────────────────────────── */
  seo: {
    title: "Krishna Boutique | Premium Indian Fashion in Lucknow",
    description: "Krishna Boutique — premium sarees, lehengas, suits and bridal couture in Lucknow. Visit the boutique or enquire on WhatsApp.",
    keywords: "boutique, saree, lehenga, salwar suit, anarkali, kurti, bridal wear, festive wear, ethnic fashion, Lucknow boutique",
    ogImage: "hero.jpg"        // image used when shared on social media
  }
};
