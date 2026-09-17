# CutNest — Mini Project

A 3-page laser-cut design e-commerce demo made for the mini-project requirement.

## Pages
1. `index.html` — product listing, categories, search, sorting and Add to Cart.
2. `cart.html` — selected products, quantity controls, remove, totals.
3. `checkout.html` — customer details and demo order placement.

## Backend
Supabase is supported for:
- Product storage
- Order storage
- Order item storage

The website also has demo products/local cart fallback so the UI works before Supabase is connected.

## Connect Supabase
1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase.sql`.
4. Open `app.js`.
5. Replace:
   `YOUR_SUPABASE_URL`
   `YOUR_SUPABASE_ANON_KEY`
   with the project's Project URL and anon/public key.
6. Upload the project to GitHub.
7. Import the repository into Vercel and deploy.

## Important
Use only the Supabase **anon/public** key in this frontend. Never put a Supabase service-role/secret key in `app.js`.

## Vercel
This is a static HTML/CSS/JS project, so no build command is required. Vercel can deploy it directly.

## Demo flow
Home → Add products → Cart → Change quantity/remove → Checkout → Place Demo Order → Supabase orders/order_items (when connected).
