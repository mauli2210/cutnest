/* CutNest - e-commerce mini project
   Supabase connection: keep your existing Project URL + Publishable key here.
   Never use a Supabase secret/service-role key in this frontend file.
*/
const SUPABASE_URL = "https://igtjtflqnitogzasfwxh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FJqhD6RZLg8ipNGLKGL8NA_A1q7anAY";
const db = (window.supabase && SUPABASE_URL.startsWith("http"))
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const demoProducts = [
 {id:"1",name:"Tree Wall Art",price:299,category:"Wall Art",icon:"🌳"},
 {id:"2",name:"Geometric Deer",price:399,category:"Home Decor",icon:"🦌"},
 {id:"3",name:"Table Organizer",price:449,category:"Organizers",icon:"▣"},
 {id:"4",name:"Photo Frame",price:249,category:"Home Decor",icon:"▤"},
 {id:"5",name:"Eiffel Tower Model",price:399,category:"Models",icon:"🗼"},
 {id:"6",name:"Happy Birthday Topper",price:199,category:"Gifts",icon:"🎂"},
 {id:"7",name:"Pen Holder",price:199,category:"Office",icon:"▥"},
 {id:"8",name:"Cat Silhouette",price:349,category:"Wall Art",icon:"🐈"},
 {id:"9",name:"Wall Clock",price:599,category:"Home Decor",icon:"◷"},
 {id:"10",name:"House Model",price:499,category:"Models",icon:"⌂"},
 {id:"11",name:"Butterfly Wall Art",price:299,category:"Wall Art",icon:"🦋"},
 {id:"12",name:"Plant Stand",price:299,category:"Home Decor",icon:"🪴"},
 {id:"13",name:"Key Holder",price:279,category:"Organizers",icon:"⌘"},
 {id:"14",name:"Car Model",price:449,category:"Models",icon:"🚗"},
 {id:"15",name:"Mandala Art",price:349,category:"Wall Art",icon:"✺"}
];

let products = [...demoProducts];
let cart = JSON.parse(localStorage.getItem("cutnest_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("cutnest_wishlist") || "[]");
const realProductImages = {
  "Tree Wall Art": "https://images-dublez-cdn.rshop.sk/ret-prod-main/products/d9a6c9a6cd64438c726db64246ed14ae.jpg",
  "Geometric Deer": "https://media.s-bol.com/m9g2zKvBQQvG/QWA9Zm7/550x550.jpg",
  "Table Organizer": "https://eduwood.pl/userdata/public/gfx/1570/1000030802.jpg",
  "Photo Frame": "https://i.etsystatic.com/24961853/r/il/07224e/7597185507/il_1588xN.7597185507_5uvc.jpg",
  "Eiffel Tower Model": "https://i.etsystatic.com/40112469/r/il/7c7fc5/7451281088/il_794xN.7451281088_n6e4.jpg",
  "Happy Birthday Topper": "https://www.lovelottie.com.au/cdn/shop/products/60.png?v=1622258328&width=800",
  "Pen Holder": "https://vector-painter.com/cdn/shop/files/Pen-holder-laser-cut-1_7df5d60c-6567-45ed-a37f-cdf4d1c28517.webp?v=1777413448&width=533",
  "Cat Silhouette": "https://i.etsystatic.com/42246316/r/il/aa87ff/7663059724/il_794xN.7663059724_b012.jpg",
  "Wall Clock": "https://i.etsystatic.com/50979072/r/il/45a453/5925253901/il_fullxfull.5925253901_lvaw.jpg",
  "House Model": "https://i.etsystatic.com/61300150/r/il/d75c6f/7339720336/il_1140xN.7339720336_nap8.jpg",
  "Butterfly Wall Art": "https://i.etsystatic.com/7409724/r/il/e06986/3836454475/il_794xN.3836454475_cicj.jpg",
  "Plant Stand": "https://storage-us.atomm.com/resource/xart/result/599655/96ecb7f0-ce05-4891-89f1-3e04eed5896b.png",
  "Key Holder": "https://littlemakes.com/img/image20_easy-wood-crafts-to-make-and-sell-ideas_creative-key-holders.jpg",
  "Car Model": "https://cwwh.de/shop/images/product_images/original_images/Porsche%20911%20BJ%2064%20als%203D%20Laser%20Cut%20Holzmodell%2005.jpg",
  "Mandala Art": "https://i.etsystatic.com/61822528/r/il/5399c3/7203159114/il_1588xN.7203159114_5wnr.jpg"
};



function money(n){ return "₹" + Number(n || 0).toLocaleString("en-IN"); }
function saveCart(){ localStorage.setItem("cutnest_cart", JSON.stringify(cart)); updateCounts(); }
function saveWishlist(){ localStorage.setItem("cutnest_wishlist", JSON.stringify(wishlist)); updateCounts(); }
function updateCounts(){
  document.querySelectorAll("#cartCount").forEach(e => e.textContent = cart.reduce((s,i)=>s+Number(i.qty||0),0));
  document.querySelectorAll("#wishlistCount").forEach(e => e.textContent = wishlist.length);
}
function toast(msg){
  const t = document.getElementById("toast"); if(!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(window.cutnestToastTimer);
  window.cutnestToastTimer = setTimeout(()=>t.classList.remove("show"), 1800);
}
function isWishlisted(id){ return wishlist.some(x => String(x.id) === String(id)); }
function toggleWishlist(id){
  const p = products.find(x => String(x.id) === String(id)); if(!p) return;
  if(isWishlisted(id)){
    wishlist = wishlist.filter(x => String(x.id) !== String(id));
    toast("Removed from wishlist");
  } else {
    wishlist.push({id:p.id,name:p.name,price:p.price,category:p.category,icon:p.icon,image:p.image||""});
    toast("Added to wishlist");
  }
  saveWishlist();
  if(document.getElementById("productGrid")) renderProducts();
  if(document.getElementById("wishlistGrid")) renderWishlist();
}
function addToCart(id){
  const p = products.find(x => String(x.id) === String(id)); if(!p) return;
  const item = cart.find(x => String(x.id) === String(id));
  if(item){ item.qty++; if(!item.image && p.image) item.image = p.image; }
  else cart.push({id:p.id,name:p.name,price:p.price,category:p.category,icon:p.icon,image:p.image||"",qty:1});
  saveCart(); toast(p.name + " added to cart");
}
function removeFromCart(id){ cart = cart.filter(x => String(x.id) !== String(id)); saveCart(); renderCart(); }
function changeQty(id,delta){
  const x = cart.find(i => String(i.id) === String(id)); if(!x) return;
  x.qty += delta;
  if(x.qty <= 0) removeFromCart(id); else { saveCart(); renderCart(); }
}
function productImage(p){
  const localImage = realProductImages[p.name];
  if(localImage) return `<img loading="lazy" src="${localImage}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`;
  return `<img loading="lazy" src="" alt=""><div class="placeholder">${p.icon||"✦"}</div>`;
}
async function loadProducts(){
  if(db){
    const {data,error} = await db.from("products").select("*").order("created_at",{ascending:true});
    if(!error && data?.length){
      products = data;
      // Refresh saved wishlist/cart images after Supabase products load.
      cart = cart.map(item => {
        const p = products.find(x => String(x.id) === String(item.id) || x.name === item.name);
        return p ? {...item,id:p.id,price:p.price,category:p.category,image:realProductImages[p.name]||p.image||item.image||""} : item;
      });
      wishlist = wishlist.map(item => {
        const p = products.find(x => String(x.id) === String(item.id) || x.name === item.name);
        return p ? {...item,id:p.id,price:p.price,category:p.category,image:realProductImages[p.name]||p.image||item.image||""} : item;
      });
      saveCart(); saveWishlist();
    } else if(error) console.warn("Supabase products could not be loaded:", error.message);
  }
}
function renderProducts(list=products){
  const grid = document.getElementById("productGrid"); if(!grid) return;
  grid.innerHTML = list.map(p => `<article class="card">
    <div class="product-img">${productImage(p)}</div>
    <div class="card-body">
      <button class="wishlist ${isWishlisted(p.id)?"liked":""}" aria-label="${isWishlisted(p.id)?"Remove from wishlist":"Add to wishlist"}" onclick="toggleWishlist('${p.id}')">${isWishlisted(p.id)?"♥":"♡"}</button>
      <div class="category">${p.category}</div>
      <h3>${p.name}</h3>
      <div class="card-actions"><span class="product-action-label">Laser-ready design</span><button class="add" aria-label="Add ${p.name} to cart" onclick="addToCart('${p.id}')">🛒</button></div>
    </div>
  </article>`).join("");
  const r = document.getElementById("resultText"); if(r) r.textContent = `${list.length} designs available`;
}
function setActiveCategory(target){
  document.querySelectorAll(".categories a").forEach(a => a.classList.remove("active"));
  if(target) target.classList.add("active");
}
async function initHome(){
  updateCounts();
  await loadProducts();
  renderProducts();
  const search = document.getElementById("searchInput");
  search?.addEventListener("input", e => {
    const q = e.target.value.toLowerCase().trim();
    renderProducts(products.filter(p => (p.name+" "+p.category).toLowerCase().includes(q)));
  });
  document.querySelectorAll("[data-category]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); setActiveCategory(a);
    const category = a.dataset.category;
    renderProducts(products.filter(p => p.category === category));
    document.getElementById("products")?.scrollIntoView({behavior:"smooth"});
  }));
  document.querySelector(".categories a.active")?.addEventListener("click", e => {
    e.preventDefault(); setActiveCategory(e.currentTarget); renderProducts(products);
    document.getElementById("products")?.scrollIntoView({behavior:"smooth"});
  });
  document.getElementById("sortSelect")?.addEventListener("change", e => {
    let x = [...products];
    if(e.target.value === "low") x.sort((a,b)=>a.price-b.price);
    if(e.target.value === "high") x.sort((a,b)=>b.price-a.price);
    if(e.target.value === "name") x.sort((a,b)=>a.name.localeCompare(b.name));
    renderProducts(x);
  });
}
function cartTotals(){ return {items:cart.reduce((s,i)=>s+Number(i.price)*Number(i.qty),0),count:cart.reduce((s,i)=>s+Number(i.qty),0)}; }
function renderCart(){
  updateCounts();
  const empty = document.getElementById("cartEmpty"), layout = document.getElementById("cartLayout");
  if(!empty || !layout) return;
  if(!cart.length){ empty.classList.remove("hidden"); layout.classList.add("hidden"); return; }
  empty.classList.add("hidden"); layout.classList.remove("hidden");
  const el = document.getElementById("cartItems");
  el.innerHTML = cart.map(i => `<div class="cart-item">
    <div class="cart-product"><div class="product-img cart-thumb">${i.image?`<img loading="lazy" src="${i.image}" alt="${i.name}">`:`<div class="placeholder">${i.icon||"✦"}</div>`}</div><div><strong>${i.name}</strong><small>${i.category||"Laser-cut design"}</small><button class="remove" onclick="removeFromCart('${i.id}')">Remove</button></div></div>
    <div class="cart-price">${money(i.price)}</div>
    <div class="qty"><button aria-label="Decrease quantity" onclick="changeQty('${i.id}',-1)">−</button><span>${i.qty}</span><button aria-label="Increase quantity" onclick="changeQty('${i.id}',1)">+</button></div>
    <div class="line-total"><strong>${money(i.price*i.qty)}</strong></div>
  </div>`).join("");
  const t = cartTotals();
  document.getElementById("summaryItems").textContent = money(t.items);
  document.getElementById("summaryTotal").textContent = money(t.items);
}
function renderWishlist(){
  updateCounts();
  const grid = document.getElementById("wishlistGrid"), empty = document.getElementById("wishlistEmpty");
  if(!grid || !empty) return;
  if(!wishlist.length){ grid.innerHTML=""; empty.classList.remove("hidden"); return; }
  empty.classList.add("hidden");
  grid.innerHTML = wishlist.map(p => `<article class="wishlist-card">
    <div class="product-img">${productImage(p)}</div>
    <div class="card-body"><button class="wishlist liked" aria-label="Remove from wishlist" onclick="toggleWishlist('${p.id}')">♥</button><div class="category">${p.category}</div><h3>${p.name}</h3><div class="card-actions"><span class="product-action-label">Saved design</span><button class="add" onclick="addToCart('${p.id}')">🛒</button></div></div>
  </article>`).join("");
}
function renderCheckout(){
  updateCounts();
  const layout = document.getElementById("checkoutLayout"), empty = document.getElementById("checkoutEmpty");
  if(!layout || !empty) return;
  if(!cart.length){ layout.classList.add("hidden"); empty.classList.remove("hidden"); return; }
  empty.classList.add("hidden"); layout.classList.remove("hidden");
  const now = new Date();
  document.getElementById("receiptDate").textContent = now.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
  document.getElementById("checkoutProducts").innerHTML = cart.map(i => `<div class="receipt-item"><div><strong>${i.name}</strong><small>${i.category||"Laser-cut design"} · Qty ${i.qty}</small></div><strong>${money(i.price*i.qty)}</strong></div>`).join("");
  document.getElementById("checkoutTotal").textContent = money(cartTotals().items);
  const form = document.getElementById("checkoutForm");
  form?.addEventListener("submit",placeOrder,{once:true});
}
async function placeOrder(e){
  e.preventDefault(); if(!cart.length) return;
  const customer = {
    name:document.getElementById("name").value.trim(),
    email:document.getElementById("email").value.trim(),
    phone:document.getElementById("phone").value.trim(),
    address:document.getElementById("address").value.trim(),
    notes:document.getElementById("notes")?.value.trim() || ""
  };
  const selected = [...cart];
  const total = cartTotals().items;
  let orderId = "CN-" + Date.now().toString().slice(-8);
  let savedToSupabase = false;
  if(db){
    const {data,error} = await db.from("orders").insert({customer_name:customer.name,email:customer.email,phone:customer.phone,address:customer.address,total,status:"Placed"}).select("id").single();
    if(!error && data){
      orderId = data.id; savedToSupabase = true;
      const {error:itemError} = await db.from("order_items").insert(selected.map(i=>({order_id:data.id,product_id:i.id,product_name:i.name,price:i.price,quantity:i.qty})));
      if(itemError) console.warn("Order items were not saved:", itemError.message);
    } else if(error){
      console.warn("Supabase order was not saved:", error.message);
    }
  }
  document.getElementById("checkoutLayout").classList.add("hidden");
  document.getElementById("finalReceipt").classList.remove("hidden");
  document.getElementById("orderNumber").textContent = `Requirement ID: ${orderId}${savedToSupabase?" · Saved":" · Demo receipt"}`;
  document.getElementById("customerReceipt").innerHTML = `<div><span>Name</span><strong>${escapeHtml(customer.name)}</strong></div><div><span>Mobile</span><strong>${escapeHtml(customer.phone)}</strong></div><div><span>Email</span><strong>${escapeHtml(customer.email)}</strong></div><div><span>Address</span><strong>${escapeHtml(customer.address)}</strong></div>${customer.notes?`<div><span>Special Requirement</span><strong>${escapeHtml(customer.notes)}</strong></div>`:""}`;
  document.getElementById("finalItems").innerHTML = selected.map(i=>`<div class="receipt-item"><div><strong>${escapeHtml(i.name)}</strong><small>${escapeHtml(i.category||"Laser-cut design")} · Qty ${i.qty}</small></div><strong>${money(i.price*i.qty)}</strong></div>`).join("");
  document.getElementById("finalTotal").textContent = money(total);
  cart=[]; saveCart();
  window.scrollTo({top:0,behavior:"smooth"});
}
function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
}

if(document.getElementById("productGrid")) initHome();
