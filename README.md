# CutNest – Laser-Cut Design E-Commerce Mini Project

A responsive 4-page college mini-project built with HTML, CSS and JavaScript, with Supabase for products/orders and Vercel for deployment.

## Pages
1. **Home / Products** – banner, search, categories, product cards, wishlist heart and Add-to-Cart button. Prices are intentionally hidden on the main product cards to match the reference UI.
2. **Wishlist** – saved products with remove and Add-to-Cart actions.
3. **Cart** – selected products, quantity controls, remove, total and Create Requirement button.
4. **Create Requirement / Receipt** – receipt preview, customer details, order submission, final receipt and Print / Save as PDF.

## Supabase
The frontend uses the Supabase Project URL and Publishable key in `app.js`. Do not use a secret/service-role key in frontend code.

The database tables are `products`, `orders`, and `order_items`.

## Vercel
The project is a static site and can be deployed directly from the GitHub repository to Vercel.
