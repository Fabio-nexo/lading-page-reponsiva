// Produtos de exemplo — modifique aqui para atualizar a lista da loja
// Produtos de exemplo — modifique aqui para atualizar a lista da loja.
// Se quiser carregar de uma API, defina `PRODUCTS_API_URL` abaixo (string). Deixe vazia para usar o catálogo local.
// Para testes locais, usamos o arquivo products.json
//const PRODUCTS_API_URL = 'products.json';
const PRODUCTS_API_URL = 'http://44.223.22.69:8051';
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJRCI6MX0.beIuQUtx285AAz3_IqKp1chhjnR-gBEn14vRtv9Mvtc';

// Lista local de produtos (fallback). O código no `js/app.js` pode sobrescrever essa variável quando buscar da API.
let PRODUCTS = [
  { id: 'p1', name: 'Essencia Ziggy', desc: 'Essência aromática, 30ml', price: 49.9, image: 'https://cdn.awsli.com.br/600x700/2745/2745087/produto/267020933/7898962227091-kpy4wu1onf.jpg', category: 'Essências' },
  { id: 'p2', name: 'Essência Banana Tropical', desc: 'Essencia Refrescante', price: 39.5, image: 'https://cdn.awsli.com.br/600x700/2745/2745087/produto/267020932/7898965792060-0i1fo19o40.jpg  ',category: 'Essências' },
  { id: 'p3', name: 'Essencia Yorgut', desc: 'Doce', price: 39.0, image: 'https://www.elitetabacariacvel.com.br/timthumb.php?src=image/catalog/ziggy/yorgut.jpeg&w=800=&h=800&zc=1', category: 'Essências' },
  // Carvão category moved to Essências per user request
  { id: 'c1', name: 'Carvão Premium 1kg', desc: 'Carvão para narguilé - queima uniforme', price: 15.9, image: 'http://images.tcdn.com.br/img/img_prod/548679/carvao_zomo_coco_para_narguile_500g_1986_1_2c3f4dcd9994c1b54bd2e504848d4dc7.jpg', category: 'Carvão' },
  { id: 'c2', name: 'Carvão Natural 1kg', desc: 'Carvão para narguilé - queima uniforme', price: 19.9, image: 'http://images.tcdn.com.br/img/img_prod/548679/carvao_zomo_coco_para_narguile_500g_1986_1_2c3f4dcd9994c1b54bd2e504848d4dc7.jpg', category: 'Carvão' }
];


