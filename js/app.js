const CART_KEY = 'shop_cart_v1';

function formatCurrency(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}

// Busca produtos de uma API. O endpoint pode retornar um array direto
// ou um objeto com propriedade `products` contendo o array.
async function fetchProductsFromApi(url) {
  if (!url) return false;

  try {
    
    const params = new URLSearchParams({
    PAGINA: 1,
    BUSCA: '',
    IDEMPRESAMATRIZ: 1
  });
   
    const url = `${PRODUCTS_API_URL}/servico`;

    console.log('url:', url);

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
      //body: ${params.toString()}
    });
    console.log('API HTTP Status:', res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    console.log('API Response:', json);

    const list = Array.isArray(json)
      ? json
      : (json.products && Array.isArray(json.products) ? json.products : null);

    if (!list) throw new Error('Formato inesperado');

    PRODUCTS = list.map(p => ({
      id: String(p.id || p.sku || p.code || p.name),
      name: p.name || p.title || 'Produto',
      desc: p.desc || p.description || '',
      price: Number(p.price || p.value || 0) || 0,
      image: p.image || p.photo || p.img || ''
    }));

    return true;
  } catch (err) {
    console.error('Erro ao buscar produtos da API:', err);
    return false;
  }
}


function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)||'[]')
  }catch(e){return []}
}

function saveCart(cart){localStorage.setItem(CART_KEY,JSON.stringify(cart)); updateCartCount()}

function updateCartCount()
  { const count = getCart().reduce((s,i)=>s+i.quantity,0);            
    const el = document.getElementById('cart-count'); 
    if(el) el.textContent = count;

    const totalgeral = getCart().reduce((s, i) => {
      const product = PRODUCTS.find(p => p.id === i.id);
    return s + (product ? product.price * i.quantity : 0);
    }, 0);
    
    const vr = document.getElementById('cart-total');  
    //console.log('prod:', totalgeral);
    if(vr) vr.textContent = formatCurrency(totalgeral); 
  }

function addToCart(productId, qty)
{
  const cart = getCart(); 
  const idx = cart.findIndex(i=>i.id===productId);
  if(idx>-1){
    cart[idx].quantity += qty;
  } 
  else {cart.push({id:productId,quantity:qty})}
  saveCart(cart);
}

let selectedCategory = '';
let selectedCategoryNormalized = '';

function normalize(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
function setCategory(cat){ selectedCategory = cat || ''; selectedCategoryNormalized = normalize(selectedCategory); renderProducts(); renderCategories(); }

function renderCategories(){
  const catContainer = document.getElementById('categories'); if(!catContainer) return;
  // Get unique categories
  const cats = Array.from(new Set(PRODUCTS.map(p=>p.category||'Outros')));
  catContainer.innerHTML = '';
  // Compute counts per category
  const counts = PRODUCTS.reduce((acc,p)=>{ const k = p.category || 'Outros'; acc[k] = (acc[k]||0)+1; return acc; },{});
  // Add 'Todos' button with total count
  const allBtn = document.createElement('button'); allBtn.className='category-btn'; allBtn.textContent='Todos';
  const totalCount = PRODUCTS.length || 0; const allBadge = document.createElement('span'); allBadge.className='count-badge'; allBadge.textContent = totalCount; allBtn.appendChild(allBadge);
  allBtn.addEventListener('click',()=>setCategory(''));
  catContainer.appendChild(allBtn);
  cats.forEach(c=>{
    const b = document.createElement('button'); b.className='category-btn'; b.textContent=c; b.addEventListener('click',()=>setCategory(c));
    const badge = document.createElement('span'); badge.className='count-badge'; badge.textContent = counts[c] || 0; b.appendChild(badge);
    catContainer.appendChild(b);
  });
}

function renderProducts(){const container = document.getElementById('products'); if(!container) return;
  container.innerHTML = '';
  // debug removed in production
  // Group by category when no specific category selected, otherwise show filtered items only
  const items = PRODUCTS.filter(p => !selectedCategoryNormalized || normalize(p.category) === selectedCategoryNormalized);
  const grouped = items.reduce((acc, p) => { const k = p.category || 'Outros'; (acc[k] = acc[k] || []).push(p); return acc; }, {});
  const keys = Object.keys(grouped);
  if(keys.length === 0){
    container.innerHTML = `<div class="no-products"><p>Nenhum produto encontrado nessa categoria.</p><button id="clear-filter" class="btn">Mostrar todos</button></div>`;
    const clear = document.getElementById('clear-filter'); if(clear) clear.addEventListener('click',()=>setCategory(''));
    return;
  }
  keys.forEach(category => {
    //const heading = document.createElement('h2'); heading.className='category-heading'; heading.textContent = category; container.appendChild(heading);
    grouped[category].forEach(p=>{
    const div = document.createElement('div'); div.className='product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="meta">
        <strong>${formatCurrency(p.price)}</strong>
        <div>
          <input type="number" min="1" value="1" style="width:60px" data-id="${p.id}" class="qty-input">
          <button class="btn add-btn" data-id="${p.id}">Adicionar</button>
        </div>
      </div>
    `;
    container.appendChild(div);
    });
  });
  // update button active state
  document.querySelectorAll('.category-btn').forEach(b=>{
    const active = (selectedCategoryNormalized === '' && b.textContent === 'Todos') || normalize(b.textContent) === selectedCategoryNormalized;
    b.classList.toggle('active', active);
  });
  document.querySelectorAll('.add-btn').forEach(btn=>btn.addEventListener('click',e=>{
    const id = btn.getAttribute('data-id'); const input = document.querySelector(`.qty-input[data-id="${id}"]`);
    const q = Math.max(1, parseInt(input.value||1,10)); addToCart(id,q); alert('Adicionado ao carrinho');
  }));
}

function renderCart(){const container = document.getElementById('cart'); if(!container) return;
  const cart = getCart(); if(cart.length===0){container.innerHTML='<p>Carrinho vazio</p>'; return}
  container.innerHTML='';
  let total = 0;
  cart.forEach(item=>{
    const prod = PRODUCTS.find(p=>p.id===item.id) || {name:'Produto desconhecido',price:0,image:''};
    const el = document.createElement('div'); el.className='cart-item';
    el.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}">
      <div style="flex:1">
        <h4>${prod.name}</h4>
        <p>${formatCurrency(prod.price)}</p>
        <label>Quantidade: <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="cart-qty" style="width:70px"></label>
      </div>
      <div>
        <p>${formatCurrency(prod.price * item.quantity)}</p>
        <button class="btn remove-btn" data-id="${item.id}">Remover</button>
      </div>
    `;
    container.appendChild(el);
    total += (prod.price * item.quantity);    
  });

  // Atualiza sumário do carrinho
  const summaryEl = document.getElementById('cart-summary');
  if(summaryEl){
    const count = cart.reduce((s,i)=>s+i.quantity,0);
    summaryEl.innerHTML = `<div class="cart-summary-inner">Itens: ${count} &nbsp; | &nbsp; Total: <strong>${formatCurrency(total)}</strong></div>`;
  }

  document.querySelectorAll('.cart-qty').forEach(inp=>inp.addEventListener('change',e=>{
    const id = inp.getAttribute('data-id'); const q = Math.max(1, parseInt(inp.value||1,10));
    const cart = getCart(); const idx = cart.findIndex(i=>i.id===id); if(idx>-1){cart[idx].quantity = q; saveCart(cart); renderCart();}
  }));

  document.querySelectorAll('.remove-btn').forEach(b=>b.addEventListener('click',e=>{
    const id = b.getAttribute('data-id'); let cart = getCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); renderCart();
  }));
}

function initCheckout(){const form = document.getElementById('checkout-form'); if(!form) return;
  // Lógica para exibir troco quando pagamento em dinheiro e para preencher endereço a partir do CEP (ViaCEP)
  const trocoField = document.getElementById('troco-field');
  const paymentRadios = form.querySelectorAll('input[name="payment_method"]');
  function updatePaymentUI(){
    const sel = form.querySelector('input[name="payment_method"]:checked');
    if(sel && sel.value === 'dinheiro'){
      if(trocoField) trocoField.style.display = 'block';
    } else {
      if(trocoField){ trocoField.style.display = 'none'; const t = form.querySelector('input[name="troco"]'); if(t) t.value = ''; }
    }
  }
  paymentRadios.forEach(r=>r.addEventListener('change',updatePaymentUI));
  updatePaymentUI();

  // Busca automática de endereço via ViaCEP ao sair do campo CEP
  const cepInput = form.querySelector('input[name="cep"]');
  if(cepInput){
    cepInput.addEventListener('blur', async ()=>{
      const raw = (cepInput.value||'').replace(/\D/g,'');
      if(raw.length !== 8) return;
      try{
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        if(!res.ok) throw new Error('HTTP '+res.status);
        const data = await res.json();
        if(data.erro){ alert('CEP não encontrado'); return; }
        const rua = form.querySelector('input[name="rua"]');
        const bairro = form.querySelector('input[name="bairro"]');
        if(rua) rua.value = data.logradouro || '';
        if(bairro) bairro.value = data.bairro || '';
      }catch(err){ console.error('Erro ao buscar CEP:',err); }
    });
  }

  form.addEventListener('submit',e=>{
    e.preventDefault(); const data = Object.fromEntries(new FormData(form).entries());
    const cart = getCart(); if(cart.length===0){alert('Carrinho vazio'); return}
    // Validar método de pagamento (basta selecionar)
    const method = data.payment_method || '';
    if(!method){ alert('Por favor, selecione a forma de pagamento (Cartão ou Pix).'); return }
    const summary = document.getElementById('checkout-summary');
    const total = cart.reduce((s,i)=>{
      const p = PRODUCTS.find(x=>x.id===i.id); return s + (p? p.price * i.quantity : 0);
    },0);
    // montar endereço a partir dos campos
    const enderecoText = `${data.cep || ''} - ${data.rua || ''}, ${data.numero || ''} - ${data.bairro || ''}`;
    // criar resumo da forma de pagamento (inclui troco quando aplicável)
    let paymentSummary = '';
    if(method === 'cartao') paymentSummary = `<p>Forma de pagamento: Cartão</p>`;
    else if(method === 'pix') paymentSummary = `<p>Forma de pagamento: Pix</p>`;
    else if(method === 'dinheiro'){
      const trocoAmount = Number(String(data.troco||'').replace(',','.')) || 0;
      paymentSummary = `<p>Forma de pagamento: Dinheiro</p>`;
      if(trocoAmount > 0){
        paymentSummary += `<p>Troco para: ${formatCurrency(trocoAmount)}</p>`;
        const change = trocoAmount - total;
        if(change >= 0){
          paymentSummary += `<p>Troco a devolver: ${formatCurrency(change)}</p>`;
        } else {
          paymentSummary += `<p style="color:#a00">Valor informado insuficiente. Falta: ${formatCurrency(Math.abs(change))}</p>`;
        }
      }
    }

    // Monta relatório de sucesso e mostra na tela
    const reportHtml = `
      <h3>Compra finalizada com sucesso</h3>
      <p>Nome: ${data.nome}</p>
      <p>Telefone: ${data.telefone}</p>
      <p>CPF: ${data.cpf}</p>
      <p>Endereço: ${enderecoText}</p>
      ${paymentSummary}
      <p>Total: ${formatCurrency(total)}</p>
      <p>Obrigado! Você será redirecionado para a loja em alguns segundos.</p>
      <p><a href="index.html" class="btn" id="back-now">Voltar para a loja agora</a></p>
    `;
    summary.innerHTML = reportHtml;

    // Limpa carrinho e atualiza contadores antes do redirecionamento
    localStorage.removeItem(CART_KEY); updateCartCount();

    // Redireciona automaticamente após 5 segundos
    const redirectMs = 5000;
    const backNow = document.getElementById('back-now');
    if(backNow) backNow.addEventListener('click', ()=>{ /* link already naviga */ });
    setTimeout(()=>{ window.location.href = 'index.html'; }, redirectMs);
  });
}

// Inicialização em páginas
document.addEventListener('DOMContentLoaded',async ()=>{
  updateCartCount();
  // Se a variável PRODUCTS_API_URL estiver definida (em js/data.js), tenta buscar da API
  try{
    const apiUrl = (typeof PRODUCTS_API_URL !== 'undefined') ? PRODUCTS_API_URL : '';
    if(apiUrl){
      const ok = await fetchProductsFromApi(apiUrl);
      if(!ok) console.warn('Usando produtos locais como fallback.');
    }
  }catch(e){
    console.warn('Erro ao inicializar fetch de produtos:',e);
  }

  // Render categories then render products (show ALL categories by default)
  renderCategories();
  setCategory('');
  renderProducts(); renderCart(); initCheckout();
  // No admin button binding (button removed from DOM)
});
