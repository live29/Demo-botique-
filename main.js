/* ============================================================================
   ✦ BOUTIQUE WEBSITE ENGINE ✦
   Reads config.js (CONFIG) and renders the entire website.
   ────────────────────────────────────────────────────────────────────────────
   ❗ Do not put client-specific data here — everything comes from CONFIG.
   ============================================================================ */

(function () {
  "use strict";

  /* ────────────────────────── SAFE CONFIG ACCESS ────────────────────────── */
  const C = (typeof CONFIG === "object" && CONFIG) ? CONFIG : {};
  const get = (path, fallback = "") =>
    path.split(".").reduce((o, k) => (o && o[k] !== undefined && o[k] !== null) ? o[k] : undefined, C) ?? fallback;

  const FEATURES = Object.assign(
    { bridalSection: true, testimonials: true, lookbook: true, offers: true,
      customCursor: true, preloader: true, scrollProgress: true },
    get("features", {})
  );

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => { const el = $(id); if (el) el.textContent = value || ""; };
  const hide = (el) => { if (el) el.classList.add("section-disabled"); };

  const escapeHTML = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]
  ));

  /* ────────────────────────── WHATSAPP HELPERS ──────────────────────────── */
  const waNumber = String(get("contact.whatsapp", "")).replace(/[^\d]/g, "");
  const waLink = (message) => waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
    : "";
  const shopName = get("shop.name", "Our Boutique");
  const waGeneric = waLink(`Hello ${shopName}! I would like to know more about your collection.`);
  const waProduct = (name) => waLink(`Hello, I am interested in "${name}". Could you please provide more details?`);

  const bindWhatsApp = (id, url) => {
    const el = $(id);
    if (!el) return;
    if (url) el.href = url; else el.style.display = "none";
  };

  /* ═══════════════════════════ 1. THEME & FONTS ═══════════════════════════ */
  function applyTheme() {
    const t = get("theme", {});
    const map = {
      "--primary": t.primary, "--secondary": t.secondary,
      "--accent": t.accent, "--accent-soft": t.accentSoft,
      "--bg": t.background, "--surface": t.surface,
      "--text": t.text, "--text-light": t.textLight
    };
    const root = document.documentElement;
    Object.entries(map).forEach(([k, v]) => { if (v) root.style.setProperty(k, v); });

    const heading = t.headingFont || "Cormorant Garamond";
    const body = t.bodyFont || "Jost";
    root.style.setProperty("--heading-font", `"${heading}", Georgia, serif`);
    root.style.setProperty("--body-font", `"${body}", "Segoe UI", sans-serif`);

    // Load Google Fonts dynamically from the configured family names
    const famFmt = (f) => f.trim().replace(/ /g, "+");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${famFmt(heading)}:ital,wght@0,400;0,500;0,600;1,500&family=${famFmt(body)}:wght@300;400;500;600&display=swap`;
    document.head.appendChild(link);
  }

  /* ═══════════════════════════ 2. SEO & META ══════════════════════════════ */
  function applySEO() {
    const seo = get("seo", {});
    const title = seo.title || shopName;
    document.title = title;

    const meta = (attr, name, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    meta("name", "description", seo.description || get("shop.description"));
    meta("name", "keywords", seo.keywords);
    meta("property", "og:title", title);
    meta("property", "og:description", seo.description || get("shop.description"));
    meta("property", "og:type", "website");
    meta("property", "og:image", seo.ogImage || get("hero.image"));
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "theme-color", get("theme.secondary", "#1C0A0D"));

    const fav = get("shop.favicon");
    if (fav) {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = fav;
      if (fav.endsWith(".svg")) link.type = "image/svg+xml";
      document.head.appendChild(link);
    }

    // Structured data — LocalBusiness (clothing store)
    const addr = get("contact.address", {});
    const ld = {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      name: shopName,
      description: get("shop.description"),
      telephone: get("contact.phone"),
      email: get("contact.email"),
      image: seo.ogImage || get("hero.image"),
      address: {
        "@type": "PostalAddress",
        streetAddress: addr.line1 || "",
        addressLocality: addr.city || "",
        addressRegion: addr.state || "",
        postalCode: addr.pincode || "",
        addressCountry: "IN"
      }
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(ld);
    document.head.appendChild(script);
  }

  /* ═══════════════════════════ 3. BRANDING ════════════════════════════════ */
  function brandMarkup(withTag) {
    const logo = get("shop.logo");
    const name = escapeHTML(shopName);
    const tag = escapeHTML(get("shop.tagline"));
    const img = logo ? `<img src="${escapeHTML(logo)}" alt="" width="44" height="44" />` : "";
    return `${img}<span class="brand-name">${name}${withTag && tag ? `<span class="brand-tag">${tag}</span>` : ""}</span>`;
  }

  function renderBranding() {
    const navBrand = $("nav-brand");
    if (navBrand) navBrand.innerHTML = brandMarkup(true);
    const footerBrand = $("footer-brand-link");
    if (footerBrand) footerBrand.innerHTML = brandMarkup(false);
    setText("footer-description", get("shop.description"));
    setText("footer-copyright", `© ${new Date().getFullYear()} ${shopName}. All rights reserved.`);
  }

  /* ═══════════════════════════ 4. NAVIGATION ══════════════════════════════ */
  const NAV_ITEMS = [
    { label: "Home", href: "#home" },
    { label: "Collections", href: "#collection" },
    { label: "About", href: "#about" },
    { label: "Lookbook", href: "#lookbook", feature: "lookbook" },
    { label: "Testimonials", href: "#testimonials", feature: "testimonials" },
    { label: "Contact", href: "#contact" }
  ];

  function renderNav() {
    const items = NAV_ITEMS.filter((i) => !i.feature || FEATURES[i.feature]);
    const desktop = $("nav-links");
    const mobile = $("mobile-nav-links");
    if (desktop) desktop.innerHTML = items.map((i) =>
      `<li><a href="${i.href}" data-nav>${escapeHTML(i.label)}</a></li>`).join("");
    if (mobile) mobile.innerHTML = items.map((i, idx) =>
      `<li><a href="${i.href}" data-nav style="transition-delay:${0.06 * idx + 0.15}s"><small>0${idx + 1}</small>${escapeHTML(i.label)}</a></li>`).join("");

    bindWhatsApp("nav-whatsapp", waGeneric);
    bindWhatsApp("mobile-whatsapp", waGeneric);
    bindWhatsApp("floating-whatsapp", waGeneric);

    // Mobile menu toggling
    const toggle = $("nav-toggle");
    const menu = $("mobile-menu");
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
    };
    toggle?.addEventListener("click", () => {
      const open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("is-locked", open);
    });
    menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    // Header compact state + floating WhatsApp visibility
    const header = $("site-header");
    const floatWa = $("floating-whatsapp");
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header?.classList.toggle("is-scrolled", y > 40);
        floatWa?.classList.toggle("is-visible", y > 500);
        updateProgress();
        updateActiveLink();
        ticking = false;
      });
    }, { passive: true });
  }

  /* Scroll progress bar */
  const progressEl = () => $("scroll-progress");
  function updateProgress() {
    if (!FEATURES.scrollProgress) return;
    const el = progressEl();
    if (!el) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    el.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
  }

  /* Active nav link highlighting */
  const sectionIds = ["home", "collection", "about", "lookbook", "testimonials", "contact"];
  function updateActiveLink() {
    let current = "home";
    for (const id of sectionIds) {
      const sec = $(id);
      if (sec && !sec.classList.contains("section-disabled") &&
          sec.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
    }
    document.querySelectorAll("[data-nav]").forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === `#${current}`);
    });
  }

  /* ═══════════════════════════ 5. HERO ════════════════════════════════════ */
  function renderHero() {
    const hero = get("hero", {});
    setText("hero-eyebrow", hero.eyebrow);
    setText("hero-subtitle", hero.subtitle);

    // Split the title into animated words
    const titleEl = $("hero-title");
    if (titleEl) {
      const words = String(hero.title || shopName).split(" ");
      titleEl.innerHTML = words.map((w) =>
        `<span class="word"><span>${escapeHTML(w)}</span></span>`).join(" ");
    }

    const img = $("hero-image");
    if (img && hero.image) {
      img.src = hero.image;
      img.alt = `${shopName} — featured collection`;
    }

    const btn1 = $("hero-btn-primary");
    if (btn1) {
      if (hero.buttonText) { btn1.textContent = hero.buttonText; btn1.href = hero.buttonLink || "#collection"; }
      else btn1.style.display = "none";
    }
    const btn2 = $("hero-btn-secondary");
    if (btn2) {
      if (hero.secondaryButtonText) { btn2.textContent = hero.secondaryButtonText; btn2.href = hero.secondaryButtonLink || "#contact"; }
      else btn2.style.display = "none";
    }

    const stats = Array.isArray(hero.stats) ? hero.stats.slice(0, 3) : [];
    const statsEl = $("hero-stats");
    if (statsEl) statsEl.innerHTML = stats.map((s) => `
      <div class="hero-stat">
        <div class="stat-value">${escapeHTML(s.value)}</div>
        <div class="stat-label">${escapeHTML(s.label)}</div>
      </div>`).join("");

    // Cinematic entrance (guarded — must run exactly once)
    const heroSection = document.querySelector(".hero");
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      heroSection?.classList.add("is-ready");
      animateHeroText();
    };
    if (img && hero.image && !img.complete) img.addEventListener("load", start, { once: true });
    // Fallback: start anyway shortly after
    setTimeout(start, 1200);
  }

  function animateHeroText() {
    if (prefersReducedMotion || !window.gsap) {
      document.querySelectorAll(".hero-title .word > span").forEach((s) => (s.style.transform = "none"));
      return;
    }
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(".hero-title .word > span", { y: 0, duration: 1.1, stagger: 0.09, ease: "power4.out" })
      .from(".hero-eyebrow", { opacity: 0, y: 18, duration: 0.8, ease: "power3.out" }, 0.1)
      .from(".hero-subtitle", { opacity: 0, y: 22, duration: 0.9, ease: "power3.out" }, 0.55)
      .from(".hero-cta .btn", { opacity: 0, y: 24, stagger: 0.12, duration: 0.8, ease: "power3.out" }, 0.7)
      .from(".hero-stat", { opacity: 0, y: 20, stagger: 0.1, duration: 0.7, ease: "power3.out" }, 0.9);
  }

  /* ═══════════════════════════ 6. RIBBON MARQUEE ══════════════════════════ */
  function renderRibbon() {
    const track = $("ribbon-track");
    if (!track) return;
    const cats = get("categories", []);
    const words = cats.length ? cats : [get("shop.tagline", "Elegance")];
    const seq = words.map((c) => `${escapeHTML(c)} <i class="fa-solid fa-diamond"></i>`).join(" ");
    // duplicated for the seamless loop
    track.innerHTML = `<span>${seq}</span><span aria-hidden="true">${seq}</span>`;
  }

  /* ═══════════════════════════ 7. COLLECTION & PRODUCTS ═══════════════════ */
  let productsSorted = [];

  function renderCollection() {
    const products = Array.isArray(get("products", [])) ? get("products", []) : [];
    const grid = $("product-grid");
    const filters = $("category-filters");
    if (!grid) return;

    if (!products.length) { hide($("collection")); return; }

    productsSorted = [...products].sort((a, b) => (b.featured === true) - (a.featured === true));

    // Category filter buttons — only categories that exist in config
    const cats = (get("categories", []) || []).filter(Boolean);
    if (filters) {
      filters.innerHTML =
        `<button class="filter-btn is-active" data-filter="*" role="tab" aria-selected="true">All</button>` +
        cats.map((c) => `<button class="filter-btn" data-filter="${escapeHTML(c)}" role="tab" aria-selected="false">${escapeHTML(c)}</button>`).join("");
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filters.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        filterProducts(btn.dataset.filter);
      });
    }

    grid.innerHTML = productsSorted.map((p, i) => {
      const badge = p.badge ? `<span class="product-badge">${escapeHTML(p.badge)}</span>` : "";
      return `
      <article class="product-card reveal-item" style="--d:${(i % 4) * 0.08}s" data-category="${escapeHTML(p.category || "")}" data-index="${i}">
        <div class="product-media">
          ${badge}
          <img src="${escapeHTML(p.image || "")}" alt="${escapeHTML(p.name || "Product")} — ${escapeHTML(p.category || "")}" loading="lazy" />
          <button class="product-quick" data-quickview="${i}" data-cursor="view">Quick View</button>
        </div>
        <div class="product-info">
          <p class="product-category">${escapeHTML(p.category || "")}</p>
          <h3 class="product-name">${escapeHTML(p.name || "")}</h3>
          <div class="product-foot">
            <span class="product-price">${escapeHTML(p.price || "")}</span>
            ${waNumber ? `<a class="product-wa" href="${waProduct(p.name || "this outfit")}" target="_blank" rel="noopener" aria-label="Enquire about ${escapeHTML(p.name || "product")} on WhatsApp"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></a>` : ""}
          </div>
        </div>
      </article>`;
    }).join("");

    // Open quick view: dedicated button on desktop, whole card on touch
    grid.addEventListener("click", (e) => {
      if (e.target.closest(".product-wa")) return;   // let WhatsApp link work
      const qBtn = e.target.closest("[data-quickview]");
      const card = e.target.closest(".product-card");
      const idx = qBtn ? Number(qBtn.dataset.quickview) : (card ? Number(card.dataset.index) : NaN);
      if (!Number.isNaN(idx)) openQuickView(idx);
    });

    if (!isTouch && !prefersReducedMotion) enableTilt(grid);
  }

  function filterProducts(cat) {
    document.querySelectorAll(".product-card").forEach((card) => {
      const show = cat === "*" || card.dataset.category === cat;
      card.classList.toggle("is-hidden", !show);
      if (show) {
        card.classList.remove("is-visible");
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("is-visible")));
      }
    });
  }

  /* 3D tilt on product cards (desktop only) */
  function enableTilt(grid) {
    let raf = null;
    grid.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
        card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(6px)`;
      });
    });
    grid.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".product-card");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  /* ═══════════════════════════ 8. QUICK VIEW MODAL ════════════════════════ */
  let lastFocused = null;
  function openQuickView(index) {
    const p = productsSorted[index];
    const modal = $("quickview");
    if (!p || !modal) return;
    lastFocused = document.activeElement;

    $("qv-image").src = p.image || "";
    $("qv-image").alt = p.name || "Product";
    setText("qv-category", p.category);
    setText("qv-name", p.name);
    setText("qv-price", p.price);
    setText("qv-description", p.description);
    const wa = $("qv-whatsapp");
    if (wa) {
      const url = waProduct(p.name || "this outfit");
      if (url) { wa.href = url; wa.style.display = ""; } else wa.style.display = "none";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $("quickview-close")?.focus();
  }
  function closeQuickView() {
    const modal = $("quickview");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    lastFocused?.focus?.();
  }
  function bindQuickView() {
    $("quickview-close")?.addEventListener("click", closeQuickView);
    $("quickview-backdrop")?.addEventListener("click", closeQuickView);
  }

  /* ═══════════════════════════ 9. BRIDAL FEATURE ══════════════════════════ */
  function renderBridal() {
    const section = $("bridal");
    if (!FEATURES.bridalSection || !get("bridal.title")) { hide(section); return; }
    const b = get("bridal", {});
    setText("bridal-eyebrow", b.eyebrow);
    setText("bridal-title", b.title);
    setText("bridal-description", b.description);
    const img = $("bridal-image");
    if (img && b.image) { img.src = b.image; img.alt = `${shopName} — bridal and festive collection`; }
    const list = $("bridal-highlights");
    if (list) list.innerHTML = (b.highlights || []).map((h) => `<li>${escapeHTML(h)}</li>`).join("");
    const btn = $("bridal-btn");
    if (btn) {
      const url = waLink(`Hello ${shopName}! I would like to book a bridal consultation.`);
      if (b.buttonText && url) { btn.textContent = b.buttonText; btn.href = url; }
      else btn.style.display = "none";
    }
  }

  /* ═══════════════════════════ 10. ABOUT ══════════════════════════════════ */
  function renderAbout() {
    const a = get("about", {});
    if (!a.title) { hide($("about")); return; }
    setText("about-eyebrow", a.eyebrow || "Our Story");
    setText("about-title", a.title);
    setText("about-quote", a.quote ? `“${a.quote}”` : "");
    if (!a.quote) hide($("about-quote"));
    setText("about-description", a.description);
    const img = $("about-image");
    if (img && a.image) { img.src = a.image; img.alt = `Inside ${shopName}`; }
    const points = $("about-points");
    if (points) points.innerHTML = (a.points || []).map((p) => `<li>${escapeHTML(p)}</li>`).join("");
    const est = get("shop.established");
    setText("about-badge", est ? `Since ${est}` : "");
  }

  /* ═══════════════════════════ 11. LOOKBOOK ═══════════════════════════════ */
  let galleryImages = [];
  let lightboxIndex = 0;

  function renderLookbook() {
    const section = $("lookbook");
    galleryImages = (get("gallery", []) || []).filter(Boolean);
    if (!FEATURES.lookbook || !galleryImages.length) { hide(section); return; }
    setText("lookbook-eyebrow", get("lookbookEyebrow", "Moments in Couture"));
    setText("lookbook-title", get("lookbookTitle", "The Lookbook"));
    const grid = $("lookbook-grid");
    if (!grid) return;
    grid.innerHTML = galleryImages.map((src, i) => `
      <button class="lookbook-item reveal-item" style="--d:${(i % 3) * 0.1}s" data-lightbox="${i}" data-cursor="view" aria-label="View lookbook image ${i + 1} fullscreen">
        <img src="${escapeHTML(src)}" alt="${escapeHTML(shopName)} lookbook — look ${i + 1}" loading="lazy" />
      </button>`).join("");
    grid.addEventListener("click", (e) => {
      const item = e.target.closest("[data-lightbox]");
      if (item) openLightbox(Number(item.dataset.lightbox));
    });
  }

  function openLightbox(i) {
    lightboxIndex = i;
    const lb = $("lightbox");
    const img = $("lightbox-image");
    if (!lb || !img) return;
    img.src = galleryImages[i];
    img.alt = `${shopName} lookbook — look ${i + 1}`;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $("lightbox-close")?.focus();
  }
  function closeLightbox() {
    const lb = $("lightbox");
    lb?.classList.remove("is-open");
    lb?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }
  function stepLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
    const img = $("lightbox-image");
    if (img) { img.src = galleryImages[lightboxIndex]; img.alt = `${shopName} lookbook — look ${lightboxIndex + 1}`; }
  }
  function bindLightbox() {
    $("lightbox-close")?.addEventListener("click", closeLightbox);
    $("lightbox-prev")?.addEventListener("click", () => stepLightbox(-1));
    $("lightbox-next")?.addEventListener("click", () => stepLightbox(1));
    $("lightbox")?.addEventListener("click", (e) => { if (e.target === e.currentTarget) closeLightbox(); });
  }

  /* ═══════════════════════════ 12. OFFER ══════════════════════════════════ */
  function renderOffer() {
    const section = $("offer");
    const o = get("offer", {});
    if (!FEATURES.offers || !o.title) { hide(section); return; }
    setText("offer-eyebrow", o.eyebrow);
    setText("offer-title", o.title);
    setText("offer-description", o.description);
    setText("offer-highlight", o.highlight);
    const btn = $("offer-btn");
    if (btn) {
      if (o.buttonText) { btn.textContent = o.buttonText; btn.href = o.buttonLink || "#collection"; }
      else btn.style.display = "none";
    }
    const bg = $("offer-bg");
    if (bg && o.image) bg.style.backgroundImage = `url("${o.image}")`;
  }

  /* ═══════════════════════════ 13. TESTIMONIALS ═══════════════════════════ */
  function renderTestimonials() {
    const section = $("testimonials");
    const list = get("testimonials", []) || [];
    if (!FEATURES.testimonials || !list.length) { hide(section); return; }
    const track = $("testimonial-track");
    if (!track) return;
    track.innerHTML = list.map((t, i) => {
      const rating = Math.max(0, Math.min(5, Number(t.rating) || 5));
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const initial = escapeHTML((t.name || "G").trim().charAt(0).toUpperCase());
      const avatar = t.photo
        ? `<img src="${escapeHTML(t.photo)}" alt="Photo of ${escapeHTML(t.name)}" loading="lazy" />`
        : initial;
      return `
      <blockquote class="testimonial-card reveal-item" style="--d:${(i % 4) * 0.1}s">
        <div class="testimonial-stars" aria-label="Rated ${rating} out of 5 stars">${stars}</div>
        <p class="testimonial-review">${escapeHTML(t.review)}</p>
        <footer class="testimonial-author">
          <span class="testimonial-avatar">${avatar}</span>
          <cite class="testimonial-name">${escapeHTML(t.name || "A Happy Client")}</cite>
        </footer>
      </blockquote>`;
    }).join("");
  }

  /* ═══════════════════════════ 14. CONTACT ════════════════════════════════ */
  function mapsUrl() {
    const explicit = get("contact.googleMaps");
    if (explicit && explicit !== "GOOGLE_MAPS_LINK") return explicit;
    const a = get("contact.address", {});
    const q = [a.line1, a.city, a.state, a.pincode].filter(Boolean).join(", ");
    return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : "";
  }

  function renderContact() {
    const cardsEl = $("contact-cards");
    if (!cardsEl) return;
    const phone = get("contact.phone");
    const email = get("contact.email");
    const a = get("contact.address", {});
    const addressText = [a.line1, [a.city, a.state].filter(Boolean).join(", "), a.pincode].filter(Boolean).join(" · ");
    const maps = mapsUrl();

    const cards = [];
    if (phone) cards.push(card("fa-solid fa-phone", "Call Us", phone, `tel:${phone.replace(/\s/g, "")}`, "Call now"));
    if (waGeneric) cards.push(card("fa-brands fa-whatsapp", "WhatsApp", get("contact.whatsapp"), waGeneric, "Chat with us"));
    if (email) cards.push(card("fa-regular fa-envelope", "Email", email, `mailto:${email}`, "Write to us"));
    if (addressText) cards.push(card("fa-solid fa-location-dot", "Visit the Boutique", addressText, maps, "Open in Google Maps"));
    cardsEl.innerHTML = cards.join("");

    function card(icon, title, text, href, action) {
      const inner = `
        <span class="contact-card-icon"><i class="${icon}" aria-hidden="true"></i></span>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(text)}</p>
        ${href ? `<span class="contact-card-action">${escapeHTML(action)} <i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i></span>` : ""}`;
      return href
        ? `<a class="contact-card reveal-item" href="${escapeHTML(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${inner}</a>`
        : `<div class="contact-card reveal-item">${inner}</div>`;
    }

    // Opening hours
    const hoursEl = $("hours-list");
    const hours = get("hours", {});
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0
    if (hoursEl) {
      hoursEl.innerHTML = days
        .filter((d) => hours[d])
        .map((d, _, arr) => {
          const isToday = days.indexOf(d) === todayIdx;
          return `<li class="${isToday ? "is-today" : ""}"><span>${d}</span><span>${escapeHTML(hours[d])}</span></li>`;
        }).join("");
      if (!hoursEl.innerHTML) hide(document.querySelector(".hours-card"));
    }
  }

  /* ═══════════════════════════ 15. SOCIAL & FOOTER ════════════════════════ */
  function socialMarkup() {
    const s = get("social", {});
    const defs = [
      ["instagram", "fa-brands fa-instagram", "Instagram"],
      ["facebook", "fa-brands fa-facebook-f", "Facebook"],
      ["youtube", "fa-brands fa-youtube", "YouTube"],
      ["pinterest", "fa-brands fa-pinterest-p", "Pinterest"]
    ];
    return defs
      .filter(([k]) => s[k])
      .map(([k, icon, label]) =>
        `<a href="${escapeHTML(s[k])}" target="_blank" rel="noopener" aria-label="${label}"><i class="${icon}" aria-hidden="true"></i></a>`)
      .join("");
  }

  function renderFooter() {
    const social = socialMarkup();
    ["footer-social", "contact-social", "mobile-social"].forEach((id) => {
      const el = $(id);
      if (el) el.innerHTML = social;
    });

    const nav = $("footer-nav");
    if (nav) nav.innerHTML = NAV_ITEMS
      .filter((i) => !i.feature || FEATURES[i.feature])
      .map((i) => `<li><a href="${i.href}" data-nav>${escapeHTML(i.label)}</a></li>`).join("");

    const cats = $("footer-categories");
    if (cats) cats.innerHTML = (get("categories", []) || [])
      .map((c) => `<li><a href="#collection">${escapeHTML(c)}</a></li>`).join("");

    const contact = $("footer-contact");
    if (contact) {
      const a = get("contact.address", {});
      const rows = [];
      const phone = get("contact.phone");
      const email = get("contact.email");
      if (a.line1) rows.push(`<li><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${escapeHTML([a.line1, a.city, a.state, a.pincode].filter(Boolean).join(", "))}</li>`);
      if (phone) rows.push(`<li><i class="fa-solid fa-phone" aria-hidden="true"></i>${escapeHTML(phone)}</li>`);
      if (email) rows.push(`<li><i class="fa-regular fa-envelope" aria-hidden="true"></i>${escapeHTML(email)}</li>`);
      contact.innerHTML = rows.join("");
    }
  }

  /* ═══════════════════════════ 16. SCROLL REVEALS & PARALLAX ══════════════ */
  function initReveals() {
    const els = document.querySelectorAll(".reveal, .reveal-item");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }

  function initParallax() {
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero media & ornaments drift as you scroll
    gsap.to("#hero-media", {
      yPercent: 14, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero-ornament-1", {
      y: -90, rotation: 3, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero-content", {
      yPercent: -8, opacity: 0.25, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 30%", scrub: true }
    });

    // Offer background parallax
    const offer = $("offer");
    if (offer && !offer.classList.contains("section-disabled")) {
      gsap.fromTo("#offer-bg", { yPercent: -10 }, {
        yPercent: 10, ease: "none",
        scrollTrigger: { trigger: "#offer", start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    // Editorial image drift in about/bridal
    [["#about-media", -34], ["#bridal-media", -30]].forEach(([sel, y]) => {
      const el = document.querySelector(sel);
      if (el && !el.closest(".section-disabled")) {
        gsap.to(sel, {
          y, ease: "none",
          scrollTrigger: { trigger: sel, start: "top bottom", end: "bottom top", scrub: true }
        });
      }
    });

    // Subtle mouse-follow depth on hero (desktop only)
    if (!isTouch) {
      const media = $("hero-media");
      const orn = document.querySelector(".hero-ornament-1");
      document.querySelector(".hero")?.addEventListener("pointermove", (e) => {
        const dx = (e.clientX / window.innerWidth - 0.5);
        const dy = (e.clientY / window.innerHeight - 0.5);
        gsap.to(media, { x: dx * -18, duration: 1.2, ease: "power2.out", overwrite: "auto" });
        gsap.to(orn, { x: dx * 26, rotationY: dx * 6, duration: 1.4, ease: "power2.out", overwrite: "auto" });
        void dy;
      });
    }
  }

  /* ═══════════════════════════ 17. CUSTOM CURSOR ══════════════════════════ */
  function initCursor() {
    if (!FEATURES.customCursor || isTouch || prefersReducedMotion) return;
    const dot = $("cursor-dot");
    const ring = $("cursor-ring");
    const label = $("cursor-label");
    if (!dot || !ring) return;
    document.body.classList.add("has-cursor");

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    // Expand over interactive elements; show "VIEW" over view targets
    document.addEventListener("pointerover", (e) => {
      const viewTarget = e.target.closest("[data-cursor='view']");
      const interactive = e.target.closest("a, button, .product-card");
      ring.classList.toggle("is-active", Boolean(interactive || viewTarget));
      if (label) label.textContent = viewTarget ? "VIEW" : "";
    });
  }

  /* ═══════════════════════════ 18. PRELOADER ══════════════════════════════ */
  function initPreloader() {
    const pre = $("preloader");
    if (!pre) return;
    if (!FEATURES.preloader || prefersReducedMotion) { pre.classList.add("done"); pre.remove(); return; }

    const emblem = $("preloader-emblem");
    const logo = get("shop.logo");
    if (emblem) emblem.innerHTML = logo ? `<img src="${escapeHTML(logo)}" alt="" />` : "";
    setText("preloader-name", shopName);

    const bar = $("preloader-progress");
    let progress = 0;
    const tick = setInterval(() => {
      progress = Math.min(progress + 8 + Math.random() * 16, 92);
      if (bar) bar.style.width = progress + "%";
    }, 110);

    const finish = () => {
      clearInterval(tick);
      if (bar) bar.style.width = "100%";
      setTimeout(() => {
        pre.classList.add("done");
        setTimeout(() => pre.remove(), 900);
      }, 320);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    setTimeout(finish, 3200); // hard cap — never block the site
  }

  /* ═══════════════════════════ 19. GLOBAL KEYS ════════════════════════════ */
  function bindKeys() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeQuickView(); closeLightbox(); }
      if ($("lightbox")?.classList.contains("is-open")) {
        if (e.key === "ArrowLeft") stepLightbox(-1);
        if (e.key === "ArrowRight") stepLightbox(1);
      }
    });
  }

  /* ═══════════════════════════ BOOT ═══════════════════════════════════════ */
  function boot() {
    applyTheme();
    applySEO();
    initPreloader();
    renderBranding();
    renderNav();
    renderHero();
    renderRibbon();
    renderCollection();
    renderBridal();
    renderAbout();
    renderLookbook();
    renderOffer();
    renderTestimonials();
    renderContact();
    renderFooter();
    bindQuickView();
    bindLightbox();
    bindKeys();
    initReveals();
    initParallax();
    initCursor();
    updateProgress();
    updateActiveLink();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
