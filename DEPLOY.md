# Guia Rápido de Deploy

## 🚀 Comandos Essenciais (Copiar e Colar)

### Configuração Inicial

```bash
# Navegue até a pasta do projeto
cd nathalia-portfolio

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

---

## 📦 Build de Produção (Teste Local)

```bash
# Criar build otimizado
npm run build

# Executar build local
npm run start
```

---

## 🌐 Deploy para Vercel (Método CLI)

```bash
# Instalar Vercel CLI (apenas uma vez)
npm install -g vercel

# Fazer login na Vercel
vercel login

# Deploy em produção
vercel --prod
```

---

## 🌐 Deploy via GitHub (Recomendado)

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Portfolio Nathalia Malinowski - Deploy inicial"

# Definir branch principal
git branch -M main

# Adicionar repositório remoto (SUBSTITUA pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/nathalia-portfolio.git

# Enviar para GitHub
git push -u origin main
```

**Depois:**
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Clique em "Deploy"

✅ **Pronto!** Seu site estará online em segundos.

---

## 🔧 Comandos Úteis

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Executar em porta diferente
npm run dev -- -p 3001

# Verificar erros
npm run lint
```

---

## ⚠️ Checklist Antes do Deploy

- [ ] Todas as imagens estão na pasta `public/`
- [ ] Vídeo `hero-video.mp4` está funcionando
- [ ] Informações de contato estão corretas
- [ ] Links do Instagram estão funcionando
- [ ] Site testado em modo produção (`npm run build`)
- [ ] Site responsivo testado em mobile

---

## 📱 Teste de Responsividade

Depois do deploy, teste em:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Use as ferramentas de desenvolvedor do Chrome (F12 → Toggle Device Toolbar)

---

## 🎯 Seu Site Estará em:

- **Vercel**: `seu-projeto.vercel.app`
- **Domínio personalizado** (opcional): Configure nas configurações da Vercel

---

## 💡 Dicas

1. **Vídeo Grande?** Comprima o vídeo para < 5MB usando [HandBrake](https://handbrake.fr/)
2. **Domínio Próprio?** Configure em: Vercel Project → Settings → Domains
3. **Analytics?** Adicione Vercel Analytics nas configurações do projeto
4. **SSL?** A Vercel fornece SSL grátis automaticamente

---

## 🆘 Problemas Comuns

### Erro: "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Erro: "Module not found"
```bash
rm -rf node_modules
npm install
```

### Erro no Build
```bash
rm -rf .next
npm run build
```

### Vídeo não carrega
- Verifique se `hero-video.mp4` está em `public/`
- Verifique o tamanho do arquivo (máx recomendado: 10MB)

---

## ✅ Tempo Estimado

- ⏱️ **Instalação**: 2-3 minutos
- ⏱️ **Deploy**: 5-10 minutos
- ⏱️ **Site no ar**: Total de 15 minutos

---

## 📞 Precisa de Ajuda?

- 📧 Email: malinowskinathalia@gmail.com
- 📱 Instagram: @nathalia_malinowski

Boa sorte com seu novo site! 🎉
