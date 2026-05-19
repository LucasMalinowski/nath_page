# Nathalia Malinowski - Portfolio de Design de Interiores

Site profissional desenvolvido em Next.js 14 para a designer de interiores e artista muralista Nathalia Malinowski.

## 🎨 Características

- Design elegante e sofisticado com estética de luxo
- Totalmente responsivo (mobile, tablet, desktop)
- Vídeo hero no topo da página
- Seções: Hero, Sobre, Serviços e Contato
- Paleta de cores: bege, sage e coral
- Tipografia: Cormorant Garamond (serif) e Montserrat (sans-serif)
- Animações suaves e transições elegantes
- Integração com Instagram
- SEO otimizado

## 📋 Seções do Site

1. **Hero** - Vídeo de fundo com logo NM e nome
2. **Sobre Mim** - Biografia com foto de perfil circular
3. **Serviços** - 4 cards com os serviços oferecidos:
   - Projetos personalizados
   - Pinturas e Murais Autorais
   - Consultoria de ambientes
   - Modelagem 3D
4. **Contato** - Telefone, email e link do Instagram
5. **Footer** - Logo e copyright

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**
- **Google Fonts** (Cormorant Garamond & Montserrat)

## 📦 Instalação

### Pré-requisitos

- Node.js 18.x ou superior
- npm, yarn ou pnpm

### Passo 1: Instalar dependências

```bash
npm install
```

Ou com yarn:
```bash
yarn install
```

Ou com pnpm:
```bash
pnpm install
```

### Passo 2: Executar em desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

### Passo 3: Build para produção

```bash
npm run build
npm run start
```

## 📁 Estrutura de Arquivos

```
nathalia-portfolio/
├── app/
│   ├── globals.css          # Estilos globais e fontes
│   ├── layout.tsx           # Layout raiz com metadados
│   └── page.tsx             # Página principal
├── components/
│   ├── Navbar.tsx           # Navegação fixa no topo
│   ├── Hero.tsx             # Seção hero com vídeo
│   ├── About.tsx            # Seção sobre mim
│   ├── Services.tsx         # Seção de serviços
│   ├── Contact.tsx          # Seção de contato
│   └── Footer.tsx           # Rodapé
├── public/
│   ├── hero-video.mp4       # Vídeo do hero
│   ├── profile-photo.jpeg   # Foto de perfil
│   └── background-texture.jpeg # Textura floral de fundo
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 Personalização

### Alterar Cores

Edite o arquivo `tailwind.config.js`:

```javascript
colors: {
  beige: { ... },
  sage: { ... },
  coral: { ... },
}
```

### Alterar Conteúdo

1. **Texto do Hero**: `components/Hero.tsx`
2. **Biografia**: `components/About.tsx`
3. **Serviços**: `components/Services.tsx`
4. **Contato**: `components/Contact.tsx`

### Alterar Imagens

Substitua os arquivos na pasta `public/`:
- `hero-video.mp4` - Vídeo de fundo do hero
- `profile-photo.jpeg` - Foto de perfil
- `background-texture.jpeg` - Textura de fundo

## 🌐 Deploy para Vercel

### Método 1: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Método 2: Via GitHub (Recomendado)

1. **Criar repositório no GitHub e fazer push**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin SEU_REPOSITORIO_GITHUB
git push -u origin main
```

2. **Conectar à Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - Clique em "Deploy"

3. **Deploys automáticos**
   - Todo push na branch `main` → Deploy em produção
   - Pushes em outras branches → Preview deployments

## 📱 Informações de Contato no Site

- **Telefone**: (45) 99802-8130
- **Email**: malinowskinathalia@gmail.com
- **Instagram**: [@nathalia_malinowski](https://www.instagram.com/nathalia_malinowski/)

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificar erros
```

## 📊 Tracking, PostHog e carrinho abandonado

Configure estas variáveis na Vercel para ativar o tracking:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PROJECT_API_KEY=phc_...
POSTHOG_HOST=https://us.i.posthog.com
CART_ABANDONMENT_EMAIL=malinowskinathalia@gmail.com
CART_ABANDONMENT_HOURS=4
CRON_SECRET=...
```

O app registra pageviews, autocapture, login/logout, visualização de produto, add-to-cart, alterações no carrinho, cupom, frete, início de checkout, criação de pedido, retorno do Mercado Pago e status de pagamento.

O alerta de carrinho abandonado roda diariamente em `/api/admin/cart-abandonment`. Ele exige `CRON_SECRET`, procura carrinhos parados por pelo menos `CART_ABANDONMENT_HOURS` e envia um e-mail para `CART_ABANDONMENT_EMAIL` com nome, e-mail, telefone, itens, subtotal e pedidos pendentes. A tabela `cart_abandonment_notifications` evita repetir o mesmo alerta até o carrinho mudar.

## 📝 Observações Importantes

1. **Vídeo**: O arquivo `hero-video.mp4` tem 13MB. Para melhor performance, considere comprimir o vídeo antes do deploy.

2. **Imagens**: As imagens são otimizadas automaticamente pelo Next.js Image component.

3. **Fontes**: As fontes Google (Cormorant Garamond e Montserrat) são carregadas via Google Fonts CDN.

4. **Instagram Portfolio**: O link "PORTFÓLIO" na navegação abre o Instagram em nova aba.

## 🎯 Performance

- Lighthouse Score esperado: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Totalmente responsivo em todos os dispositivos

## 📄 Licença

© 2026 Nathalia Malinowski. Todos os direitos reservados.

## 🤝 Suporte

Para dúvidas ou suporte:
- Email: malinowskinathalia@gmail.com
- Instagram: @nathalia_malinowski

---

Desenvolvido com ❤️ usando Next.js
