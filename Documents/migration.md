
<style>
  .prompt-box { font-family: var(--font-mono); font-size: 13px; line-height: 1.7; background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.5rem; white-space: pre-wrap; word-break: break-word; color: var(--color-text-primary); max-height: 520px; overflow-y: auto; }
  .copy-btn { margin-top: 1rem; padding: 10px 24px; border: 0.5px solid var(--color-border-secondary); border-radius: var(--border-radius-md); background: transparent; color: var(--color-text-primary); font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
  .copy-btn:hover { background: var(--color-background-secondary); }
  .copy-btn:active { transform: scale(0.98); }
  .copied { color: var(--color-text-success); }
  .section-label { font-size: 11px; font-weight: 500; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
</style>

<h2 class="sr-only">Prompt complet pour le site web du plombier</h2>

<p class="section-label"><i class="ti ti-copy" aria-hidden="true"></i> Prompt à copier et donner à Lovable / Stitch / Bolt</p>

<div class="prompt-box" id="prompt-content">Build a complete full-stack web application for a Tunisian plumber. The app is a business showcase + marketplace for second-hand parts. Use React (frontend) + Supabase (backend/auth/db) + Tailwind CSS. Support French and Arabic (RTL ready).

══════════════════════════════════════
1. IDENTITY & BRANDING
══════════════════════════════════════
Business name: [NOM DU PLOMBIER]
Tagline: Plomberie · Climatisation · Gaz · Chauffage
Colors: deep blue #1E3A5F + orange accent #F97316
Logo area: show wrench + snowflake icons side by side
WhatsApp number: [NUMERO]
Facebook page: [URL FACEBOOK]
Contact email: [EMAIL]
Service zones (coverage map or list): [VILLES / ZONES]

══════════════════════════════════════
2. PAGES & NAVIGATION
══════════════════════════════════════
Pages user: Accueil | Services | Zone d'intervention | Pièces d'occasion | Profil

══════════════════════════════════════
3. HOME PAGE (Accueil)
══════════════════════════════════════
- Hero section: full-width banner with photo background, name + tagline, two CTA buttons: "Nous contacter" (scroll to contact) + "WhatsApp" (opens wa.me/NUMERO)
- Services summary cards (4 cards with icons):
    • Plomberie (leak repair, pipe installation, water heater)
    • Climatisation (installation, repair, maintenance)
    • Gaz de ville (installation, connection, repair)
    • Chauffage central (boiler, radiators, underfloor heating)
- "Pièces d'occasion" section preview: show latest 4 listings with photo, title, price, favorite button — link to full marketplace page
- Trust bar: years of experience, zones covered, WhatsApp button
- Footer: address, phone, WhatsApp, Facebook link, copyright

══════════════════════════════════════
4. SERVICES PAGE
══════════════════════════════════════
Detailed page for each of the 4 services with:
- Description of work done
- Before/after photo placeholder
- "Demander un devis" button → opens WhatsApp with pre-filled message about that service

══════════════════════════════════════
5. ZONE D'INTERVENTION PAGE
══════════════════════════════════════
- Show a list/map of covered cities/zones
- Static or interactive map (Leaflet.js) centered on Tunisia
- Short text: "Nous nous déplaçons dans les zones suivantes : [ZONES]"

══════════════════════════════════════
6. PIÈCES D'OCCASION MARKETPLACE
══════════════════════════════════════
This section is a mini-marketplace for used plumbing/HVAC parts.

--- DATABASE SCHEMA ---
Table: parts_listings
  id, title, subtitle, description, price (DT), images[] (array of URLs), category, condition, is_available, is_featured, created_at, updated_at, created_by (admin)

Table: favorites
  id, user_id, listing_id, created_at

Table: users (via Supabase Auth)
  role: 'anon' | 'user' | 'admin'

Categories (admin-manageable): Robinetterie | Tuyaux & Raccords | Chauffe-eau | Climatisation | Radiateurs | Vannes | Autre

--- USER ROLES ---

ANONYMOUS (not logged in):
  - Browse all available listings
  - Filter by category, price range, condition
  - View listing detail (photo gallery, title, subtitle, price, description)
  - See "Appeler" button → opens tel: link
  - See "WhatsApp" button → opens wa.me/NUMERO?text=Bonjour, je suis intéressé par : [TITRE DE L'ARTICLE] - [PRIX] DT. Lien: [URL]
  - Cannot save favorites

USER (logged in, role = 'user'):
  - All anonymous features
  - Save/unsave favorites (heart icon on each card)
  - View own favorites page
  - When clicking "Appeler" or "WhatsApp", the article info is automatically appended to the message

ADMIN (role = 'admin'):
  - Full CRUD on listings: add new part (title, subtitle, description, price, images upload, category, condition, is_featured toggle, is_available toggle)
  - Edit and delete any listing
  - Manage categories (add, rename, delete)
  - View all listings with status (available / sold)
  - Toggle featured status on any listing
  - Admin dashboard accessible at /admin (protected route)

--- MARKETPLACE UI ---
- Grid of cards (2 cols mobile, 3-4 cols desktop)
- Each card: photo, title, subtitle, price in DT, category badge, condition badge, heart icon (favorite), "Contacter" button
- Filter sidebar/top bar: by category (multi-select), price range slider, condition (neuf / bon état / usagé)
- Sort: newest first, price low→high, price high→low, featured first
- Listing detail modal or page: full photo gallery (swipeable), all info, two big buttons: "📞 Appeler" and "💬 WhatsApp" (pre-filled message with article title + price)

══════════════════════════════════════
7. CONTACT PAGE
══════════════════════════════════════
- Contact form (name, phone, service type dropdown, message) → sends via EmailJS or Supabase edge function
- Direct WhatsApp button (floating + in contact section)
- Facebook link
- Phone number (click to call)
- Map showing approximate service area

══════════════════════════════════════
8. FLOATING WHATSAPP BUTTON
══════════════════════════════════════
Fixed bottom-right on all pages. Green circle with WhatsApp icon. Opens wa.me/NUMERO with message: "Bonjour, j'ai besoin d'un plombier."

══════════════════════════════════════
9. AUTH SYSTEM
══════════════════════════════════════
- Supabase Auth (email + password)
- Login / Register modal (accessible from nav)
- After login: show user avatar/initials in nav, favorites accessible
- Admin role set in Supabase user_metadata or profiles table
- Protect /admin with role check — redirect non-admins to home

══════════════════════════════════════
10. TECH STACK
══════════════════════════════════════
- React + Vite
- Tailwind CSS
- Supabase (auth + postgres + storage for images)
- React Router v6
- Zustand or Context API for state
- Leaflet.js for map
- Mobile-first responsive design
- SEO: meta tags, og:image, sitemap hint
</div>

<button class="copy-btn" onclick="
  const text = document.getElementById('prompt-content').innerText;
  navigator.clipboard.writeText(text).then(() => {
    this.innerHTML = '<i class=\'ti ti-check\' aria-hidden=\'true\'></i> <span class=\'copied\'>Copié !</span>';
    setTimeout(() => { this.innerHTML = '<i class=\'ti ti-copy\' aria-hidden=\'true\'></i> Copier le prompt'; }, 2500);
  });
">
  <i class="ti ti-copy" aria-hidden="true"></i> Copier le prompt
</button>
