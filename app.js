const grid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const btnCarrito = document.getElementById("btnCarrito");
const closeCart = document.getElementById("closeCart");
const sendWhatsapp = document.getElementById("sendWhatsapp");
let carrito = [];

function moneda(valor){ return valor.toLocaleString("es-PY"); }

function mostrarProductos(categoria = "Todos"){
  grid.innerHTML = "";
  productos
    .filter(p => categoria === "Todos" || p.categoria === categoria)
    .forEach(p => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-img">${p.icono}</div>
        <div class="product-info">
          <span class="category">${p.categoria}</span>
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <div class="price">Gs. ${moneda(p.precio)}</div>
          <button class="btn primary" onclick="agregarCarrito(${p.id})">Agregar al carrito</button>
        </div>`;
      grid.appendChild(card);
    });
}

function agregarCarrito(id){
  const producto = productos.find(p => p.id === id);
  const item = carrito.find(i => i.id === id);
  if(item){ item.cantidad++; } else { carrito.push({...producto, cantidad:1}); }
  actualizarCarrito();
  cartPanel.classList.add("open");
}

function quitarCarrito(id){
  carrito = carrito.filter(i => i.id !== id);
  actualizarCarrito();
}

function actualizarCarrito(){
  cartCount.textContent = carrito.reduce((a,i)=>a+i.cantidad,0);
  cartItems.innerHTML = carrito.length ? "" : "<p style='padding:18px 0;color:#64748b'>Tu carrito está vacío.</p>";
  let total = 0;
  carrito.forEach(i => {
    total += i.precio * i.cantidad;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<div><strong>${i.nombre}</strong><br><small>${i.cantidad} x Gs. ${moneda(i.precio)}</small></div><button class="remove" onclick="quitarCarrito(${i.id})">Borrar</button>`;
    cartItems.appendChild(div);
  });
  cartTotal.textContent = moneda(total);
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    mostrarProductos(btn.dataset.category);
  });
});

btnCarrito.onclick = () => cartPanel.classList.add("open");
closeCart.onclick = () => cartPanel.classList.remove("open");

sendWhatsapp.onclick = () => {
  if(!carrito.length){ alert("Agregá al menos un producto al carrito."); return; }
  let texto = "Hola, quiero hacer este pedido:%0A%0A";
  carrito.forEach(i => texto += `• ${i.nombre} x${i.cantidad} - Gs. ${moneda(i.precio*i.cantidad)}%0A`);
  texto += `%0ATotal: Gs. ${cartTotal.textContent}`;
  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`, "_blank");
};

function enviarConsulta(e){
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const mensaje = document.getElementById("mensaje").value;
  const texto = `Hola, soy ${nombre}. Mi teléfono es ${telefono}. Consulta: ${mensaje}`;
  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`, "_blank");
}

mostrarProductos();
actualizarCarrito();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

function obtenerProductos(){
  const guardados = JSON.parse(localStorage.getItem('pitus_productos_extra') || '[]');
  return [...productos, ...guardados];
}

const mostrarProductosOriginal = mostrarProductos;
mostrarProductos = function(categoria = "Todos"){
  grid.innerHTML = "";
  obtenerProductos()
    .filter(p => categoria === "Todos" || p.categoria === categoria)
    .forEach(p => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-img">${p.icono}</div>
        <div class="product-info">
          <span class="category">${p.categoria}</span>
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <div class="price">Gs. ${moneda(Number(p.precio))}</div>
          <button class="btn primary" onclick="agregarCarrito(${p.id})">Agregar al carrito</button>
        </div>`;
      grid.appendChild(card);
    });
}

const agregarCarritoOriginal = agregarCarrito;
agregarCarrito = function(id){
  const producto = obtenerProductos().find(p => p.id === id);
  const item = carrito.find(i => i.id === id);
  if(item){ item.cantidad++; } else { carrito.push({...producto, cantidad:1}); }
  actualizarCarrito();
  cartPanel.classList.add("open");
}

const adminForm = document.getElementById('adminForm');
if(adminForm){
  adminForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const extras = JSON.parse(localStorage.getItem('pitus_productos_extra') || '[]');
    const nuevo = {
      id: Date.now(),
      nombre: document.getElementById('adminNombre').value,
      categoria: document.getElementById('adminCategoria').value,
      precio: Number(document.getElementById('adminPrecio').value),
      icono: document.getElementById('adminIcono').value || '💻',
      descripcion: document.getElementById('adminDescripcion').value
    };
    extras.push(nuevo);
    localStorage.setItem('pitus_productos_extra', JSON.stringify(extras));
    adminForm.reset();
    document.getElementById('adminIcono').value = '💻';
    mostrarProductos(document.querySelector('.filter.active')?.dataset.category || 'Todos');
    alert('Producto agregado en esta prueba. La tienda ya está más viva que CPU recién formateada.');
  });
  document.getElementById('limpiarLocales').addEventListener('click', ()=>{
    if(confirm('¿Borrar productos agregados en este navegador?')){
      localStorage.removeItem('pitus_productos_extra');
      mostrarProductos(document.querySelector('.filter.active')?.dataset.category || 'Todos');
    }
  });
}

mostrarProductos();
