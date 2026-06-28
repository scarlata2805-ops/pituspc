const WHATSAPP='595985650381';
let cart=[];
const grid=document.getElementById('productGrid');
function renderProducts(filter='todos'){
  grid.innerHTML='';
  window.PRODUCTOS.filter(p=>filter==='todos'||p.categoria===filter).forEach(p=>{
    const card=document.createElement('article');
    card.className='product-card';
    card.innerHTML=`<div class="product-icon">${p.icono}</div><h3>${p.nombre}</h3><p>${p.detalle}</p><div class="price">${p.precio}</div><button class="btn primary" data-id="${p.id}">Agregar al carrito</button>`;
    grid.appendChild(card);
  });
}
renderProducts();
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.filter)}));
grid.addEventListener('click',e=>{if(e.target.matches('button[data-id]')){const p=window.PRODUCTOS.find(x=>x.id==e.target.dataset.id);cart.push(p);updateCart();}});
function updateCart(){document.getElementById('cartCount').textContent=cart.length;document.getElementById('cartItems').innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-item"><b>${p.nombre}</b><br>${p.precio}<br><button onclick="removeItem(${i})">Quitar</button></div>`).join(''):'<p>Tu carrito está vacío.</p>'}
window.removeItem=i=>{cart.splice(i,1);updateCart()};
document.getElementById('cartBtn').onclick=()=>document.getElementById('cartPanel').classList.add('open');
document.getElementById('closeCart').onclick=()=>document.getElementById('cartPanel').classList.remove('open');
document.getElementById('sendCart').onclick=()=>{const txt=cart.length?cart.map(p=>`- ${p.nombre} (${p.precio})`).join('%0A'):'Quiero consultar productos';window.open(`https://wa.me/${WHATSAPP}?text=Hola%20Pitu's%20PC,%20quiero%20realizar%20este%20pedido:%0A${txt}`,'_blank')};
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);const msg=`Hola Pitu's PC, soy ${d.get('nombre')}. Mi teléfono es ${d.get('telefono')}. Me interesa: ${d.get('interes')}. Mensaje: ${d.get('mensaje')||'Necesito más información'}`;window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank')});
document.getElementById('botClose').onclick=()=>document.getElementById('pitubot').style.display='none';
document.getElementById('menuToggle').onclick=()=>document.getElementById('nav').classList.toggle('open');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
let counted=false;const si=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!counted){counted=true;document.querySelectorAll('[data-count]').forEach(el=>{let n=+el.dataset.count,c=0,step=Math.max(1,Math.ceil(n/60));let t=setInterval(()=>{c+=step;if(c>=n){c=n;clearInterval(t)}el.textContent=c},25)})}}));si.observe(document.querySelector('.stats'));
const canvas=document.getElementById('particles'),ctx=canvas.getContext('2d');let w,h,pts=[];function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;pts=Array.from({length:70},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,r:Math.random()*2+1}))}resize();addEventListener('resize',resize);function anim(){ctx.clearRect(0,0,w,h);pts.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.fillStyle='rgba(0,210,255,.75)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();for(let j=i+1;j<pts.length;j++){let q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<130){ctx.strokeStyle=`rgba(255,199,0,${(130-d)/800})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}});requestAnimationFrame(anim)}anim();
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
