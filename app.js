/* CutNest mini-project
   Supabase is optional for the demo UI. To activate the backend,
   put your Supabase project URL and anon key below, then run supabase.sql.
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

function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function saveCart(){localStorage.setItem("cutnest_cart",JSON.stringify(cart)); updateCartCount()}
function updateCartCount(){document.querySelectorAll("#cartCount").forEach(e=>e.textContent=cart.reduce((s,i)=>s+i.qty,0))}
function toast(msg){const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function addToCart(id){
 const p=products.find(x=>String(x.id)===String(id)); if(!p)return;
 const item=cart.find(x=>String(x.id)===String(id));
 if(item)item.qty++; else cart.push({id:p.id,name:p.name,price:p.price,category:p.category,icon:p.icon,image:p.image||"",qty:1});
 saveCart(); toast(p.name+" added to cart");
}
function removeFromCart(id){cart=cart.filter(x=>String(x.id)!==String(id));saveCart();renderCart()}
function changeQty(id,delta){const x=cart.find(i=>String(i.id)===String(id));if(!x)return;x.qty+=delta;if(x.qty<=0)removeFromCart(id);else{saveCart();renderCart()}}
function productImage(p){
 if(p.image)return `<img src="${p.image}" alt="${p.name}">`;
 return `<div class="placeholder">${p.icon||"✦"}</div>`;
}
async function loadProducts(){
 if(db){
   const {data,error}=await db.from("products").select("*").order("created_at",{ascending:true});
   if(!error && data?.length){products=data;return}
 }
}
function renderProducts(list=products){
 const grid=document.getElementById("productGrid");if(!grid)return;
 grid.innerHTML=list.map(p=>`<article class="card">
  <div class="product-img">${productImage(p)}</div>
  <div class="card-body"><button class="wishlist" onclick="toast('Wishlist demo')">♡</button>
  <div class="category">${p.category}</div><h3>${p.name}</h3>
  <div class="price-row"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart('${p.id}')">🛒</button></div></div>
 </article>`).join("");
 const r=document.getElementById("resultText");if(r)r.textContent=`${list.length} designs available`;
}
function initHome(){
 updateCartCount(); loadProducts().then(()=>renderProducts());
 const search=document.getElementById("searchInput");
 search?.addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderProducts(products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q)))});
 document.querySelectorAll("[data-category]").forEach(a=>a.addEventListener("click",()=>renderProducts(products.filter(p=>p.category===a.dataset.category))));
 document.getElementById("sortSelect")?.addEventListener("change",e=>{
  let x=[...products];if(e.target.value==="low")x.sort((a,b)=>a.price-b.price);if(e.target.value==="high")x.sort((a,b)=>b.price-a.price);if(e.target.value==="name")x.sort((a,b)=>a.name.localeCompare(b.name));renderProducts(x);
 });
}
function cartTotals(){return {items:cart.reduce((s,i)=>s+i.price*i.qty,0),count:cart.reduce((s,i)=>s+i.qty,0)}}
function renderCart(){
 updateCartCount();const empty=document.getElementById("cartEmpty"),layout=document.getElementById("cartLayout");
 if(!cart.length){empty?.classList.remove("hidden");layout?.classList.add("hidden");return}
 empty?.classList.add("hidden");layout?.classList.remove("hidden");
 const el=document.getElementById("cartItems");
 el.innerHTML=cart.map(i=>`<div class="cart-item">
  <div class="cart-product"><div class="product-img" style="width:75px;height:65px">${i.image?`<img src="${i.image}" alt="">`:`<div class="placeholder" style="font-size:28px">${i.icon||"✦"}</div>`}</div><div><strong>${i.name}</strong><button class="remove" onclick="removeFromCart('${i.id}')">🗑 Remove</button></div></div>
  <div>${money(i.price)}</div><div class="qty"><button onclick="changeQty('${i.id}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${i.id}',1)">+</button></div><div><strong>${money(i.price*i.qty)}</strong></div>
 </div>`).join("");
 const t=cartTotals();document.getElementById("summaryItems").textContent=money(t.items);document.getElementById("summaryTotal").textContent=money(t.items);
}
function renderCheckout(){
 updateCartCount();const box=document.getElementById("checkoutProducts"),form=document.getElementById("checkoutForm");
 if(!cart.length){box.innerHTML="<p>Your cart is empty.</p>";form.classList.add("hidden");return}
 box.innerHTML=cart.map(i=>`<div class="checkout-product"><span>${i.name} × ${i.qty}</span><strong>${money(i.price*i.qty)}</strong></div>`).join("");
 document.getElementById("checkoutTotal").textContent=money(cartTotals().items);
 form.addEventListener("submit",placeOrder);
}
async function placeOrder(e){
 e.preventDefault();if(!cart.length)return;
 const customer={name:document.getElementById("name").value,email:document.getElementById("email").value,phone:document.getElementById("phone").value,address:document.getElementById("address").value};
 let orderId="CN-"+Date.now().toString().slice(-8);
 if(db){
   const {data,error}=await db.from("orders").insert({customer_name:customer.name,email:customer.email,phone:customer.phone,address:customer.address,total:cartTotals().items,status:"Placed"}).select("id").single();
   if(!error && data){
     orderId=data.id;
     await db.from("order_items").insert(cart.map(i=>({order_id:data.id,product_id:i.id,product_name:i.name,price:i.price,quantity:i.qty})));
   }
 }
 cart=[];saveCart();document.getElementById("checkoutForm").classList.add("hidden");document.getElementById("success").classList.remove("hidden");document.getElementById("orderNumber").textContent="Order ID: "+orderId;
}
if(document.getElementById("productGrid"))initHome();
