# Projeto Shop (exemplo)

Breve projeto estático de loja com páginas: `index.html`, `cart.html`, `checkout.html`.

Como usar:

1. Abra esta pasta no VS Code.
2. Instale a extensão **Live Server** (se ainda não tiver).
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Fluxo de teste:
- Na `index.html` adicione quantidades e clique em "Adicionar".
- Abra `cart.html` para ver os itens (salvos em `localStorage`).
- Em `checkout.html` preencha o formulário para simular finalização.

Onde editar produtos: `js/data.js` (array `PRODUCTS`).

Rodando o proxy Node/Express local (opcional, recomendado para testes com token):

1. Abra um terminal na pasta `shop`.
2. Copie `.env.example` para `.env` e preencha as variáveis (ou deixe em branco para usar `products.json`).
3. Instale dependências: `npm install`.
4. Inicie o servidor: `npm start` (ou `npm run dev` se tiver `nodemon`).

Isso servirá o frontend em `http://localhost:3000` e exporá a rota `/api/products` usada pelo frontend.

Iniciar o frontend sem Node (rápido):

- Se preferir rodar apenas os arquivos estáticos (sem o proxy Express), use a extensão **Live Server** do VS Code: clique com o botão direito em `index.html` e escolha **Open with Live Server**.
- Alternativamente (PowerShell), execute `./start.ps1` nesta pasta; o script tenta usar `py -3 -m http.server 3000` se você tiver Python instalado e mostrará instruções caso não tenha Python/Node instalados.

