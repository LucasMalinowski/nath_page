type PaymentSuccessEmailParams = {
  to: string
  orderId: string
  productNames: string[]
  trackingCode?: string | null
  trackingUrl?: string | null
  isPickup?: boolean
  pickupLabel?: string | null
}

type PickupPendingEmailParams = {
  to: string
  orderId: string
  buyerEmail: string
  buyerName?: string | null
  buyerPhone?: string | null
  productNames: string[]
  pickupLabel?: string | null
}

type SuperFreteLowBalanceEmailParams = {
  to: string
  balance: number
  threshold: number
}

type AbandonedCartEmailParams = {
  to: string
  userEmail: string
  fullName?: string | null
  phone?: string | null
  userId: string
  cartUpdatedAt: string
  cartUrl: string
  subtotalText: string
  items: {
    productName: string
    quantity: number
    unitPriceText: string
    lineTotalText: string
  }[]
  pendingOrdersCount: number
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number.parseInt(process.env.SMTP_PORT, 10) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || 'Nathalia Malinowski <no-reply@nathaliamalinowski.com>'
  const secure = process.env.SMTP_SECURE === 'true' || port === 465

  if (!host || !user || !pass || !Number.isFinite(port)) {
    return null
  }

  return { host, port, user, pass, from, secure }
}

async function getTransporter() {
  const smtp = getSmtpConfig()
  if (!smtp) {
    console.warn('SMTP not configured; skipping email')
    return null
  }

  const dynamicImport = new Function('moduleName', 'return import(moduleName)') as (
    moduleName: string
  ) => Promise<{ createTransport: (config: Record<string, unknown>) => { sendMail: (options: Record<string, unknown>) => Promise<unknown> } }>
  const nodemailer = await dynamicImport('nodemailer')

  return {
    from: smtp.from,
    transporter: nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass
      }
    })
  }
}

function getPickupDetails() {
  return {
    address: process.env.PICKUP_ADDRESS?.trim() || null,
    contact: process.env.PICKUP_CONTACT?.trim() || process.env.PICKUP_CONTACT_WHATSAPP?.trim() || null,
    instructions:
      process.env.PICKUP_INSTRUCTIONS?.trim() ||
      'Entre em contato para combinar o melhor dia e horario de retirada.'
  }
}

export async function sendPaymentSuccessEmail(params: PaymentSuccessEmailParams) {
  const transport = await getTransporter()
  if (!transport) {
    return
  }

  const products = params.productNames.length ? params.productNames.join(', ') : 'obra adquirida'
  const pickupLabel = params.pickupLabel?.trim() || 'o local combinado'
  const pickupDetails = getPickupDetails()
  const pickupTextParts = [
    `Seu pedido ficou marcado para retirada sem custo em ${pickupLabel}.`,
    pickupDetails.address ? `Endereco para retirada: ${pickupDetails.address}.` : null,
    pickupDetails.contact ? `Contato para combinar a retirada: ${pickupDetails.contact}.` : null,
    `Instrucao: ${pickupDetails.instructions}`
  ].filter(Boolean)
  const pickupHtmlParts = [
    `Seu pedido ficou marcado para <strong>retirada sem custo</strong> em ${escapeHtml(pickupLabel)}.`,
    pickupDetails.address ? `<br/><strong>Endereco para retirada:</strong> ${escapeHtml(pickupDetails.address)}.` : null,
    pickupDetails.contact ? `<br/><strong>Contato:</strong> ${escapeHtml(pickupDetails.contact)}.` : null,
    `<br/><strong>Instrucao:</strong> ${escapeHtml(pickupDetails.instructions)}`
  ].filter(Boolean)
  const shippingText = params.isPickup
    ? `\n\n${pickupTextParts.join(' ')}`
    : params.trackingCode
    ? `\n\nSeu envio foi gerado com o código de rastreio ${params.trackingCode}.${params.trackingUrl ? ` Acompanhe em: ${params.trackingUrl}` : ''}`
    : '\n\nSeu envio será preparado em seguida e enviaremos o rastreio assim que estiver disponível.'
  const shippingHtml = params.isPickup
    ? `<p>${pickupHtmlParts.join('')}</p>`
    : params.trackingCode
    ? `<p>Seu envio foi gerado com o código de rastreio <strong>${params.trackingCode}</strong>.${params.trackingUrl ? ` <a href="${params.trackingUrl}">Acompanhar entrega</a>.` : ''}</p>`
    : '<p>Seu envio será preparado em seguida e enviaremos o rastreio assim que estiver disponível.</p>'

  await transport.transporter.sendMail({
    from: transport.from,
    to: params.to,
    subject: 'Pagamento aprovado - Nathalia Malinowski',
    text: `Olá!\n\nRecebemos seu pagamento com sucesso para o pedido ${params.orderId}.\nProduto(s): ${products}.${shippingText}\n\nObrigada!`,
    html: `<p>Olá!</p><p>Recebemos seu pagamento com sucesso para o pedido <strong>${params.orderId}</strong>.</p><p>Produto(s): <strong>${products}</strong>.</p>${shippingHtml}<p>Obrigada!</p>`
  })
}

export async function sendPickupPendingEmail(params: PickupPendingEmailParams): Promise<boolean> {
  const transport = await getTransporter()
  if (!transport) {
    return false
  }

  const products = params.productNames.length ? params.productNames.join(', ') : 'obra adquirida'
  const pickupLabel = params.pickupLabel?.trim() || 'Retirada no local'
  const pickupDetails = getPickupDetails()
  const buyerName = params.buyerName?.trim() || 'Nome nao informado'
  const buyerPhone = params.buyerPhone?.trim() || 'Telefone nao informado'

  await transport.transporter.sendMail({
    from: transport.from,
    to: params.to,
    subject: 'Retirada pendente - Nathalia Malinowski',
    text:
      `Um pedido pago ficou pendente de retirada.\n\n` +
      `Pedido: ${params.orderId}\n` +
      `Cliente: ${buyerName}\n` +
      `E-mail: ${params.buyerEmail}\n` +
      `Telefone: ${buyerPhone}\n` +
      `Produto(s): ${products}\n` +
      `Localidade selecionada: ${pickupLabel}\n` +
      `Endereco configurado: ${pickupDetails.address || 'Nao configurado'}\n` +
      `Contato configurado: ${pickupDetails.contact || 'Nao configurado'}\n` +
      `Instrucao enviada ao cliente: ${pickupDetails.instructions}\n`,
    html:
      `<p>Um pedido pago ficou pendente de retirada.</p>` +
      `<p><strong>Pedido:</strong> ${escapeHtml(params.orderId)}<br/>` +
      `<strong>Cliente:</strong> ${escapeHtml(buyerName)}<br/>` +
      `<strong>E-mail:</strong> ${escapeHtml(params.buyerEmail)}<br/>` +
      `<strong>Telefone:</strong> ${escapeHtml(buyerPhone)}<br/>` +
      `<strong>Produto(s):</strong> ${escapeHtml(products)}<br/>` +
      `<strong>Localidade selecionada:</strong> ${escapeHtml(pickupLabel)}<br/>` +
      `<strong>Endereco configurado:</strong> ${escapeHtml(pickupDetails.address || 'Nao configurado')}<br/>` +
      `<strong>Contato configurado:</strong> ${escapeHtml(pickupDetails.contact || 'Nao configurado')}<br/>` +
      `<strong>Instrucao enviada ao cliente:</strong> ${escapeHtml(pickupDetails.instructions)}</p>`
  })

  return true
}

export async function sendSuperFreteLowBalanceEmail(params: SuperFreteLowBalanceEmailParams) {
  const transport = await getTransporter()
  if (!transport) {
    return
  }

  const balanceText = params.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const thresholdText = params.threshold.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  await transport.transporter.sendMail({
    from: transport.from,
    to: params.to,
    subject: 'Alerta de saldo baixo no SuperFrete',
    text: `Olá!\n\nO saldo atual da conta SuperFrete está em ${balanceText}, abaixo do limite configurado de ${thresholdText}.\n\nFaça uma recarga para evitar falhas na emissão de etiquetas.\n`,
    html: `<p>Olá!</p><p>O saldo atual da conta SuperFrete está em <strong>${balanceText}</strong>, abaixo do limite configurado de <strong>${thresholdText}</strong>.</p><p>Faça uma recarga para evitar falhas na emissão de etiquetas.</p>`
  })
}

export async function sendAbandonedCartEmail(params: AbandonedCartEmailParams): Promise<boolean> {
  const transport = await getTransporter()
  if (!transport) {
    return false
  }

  const name = params.fullName?.trim() || 'Nome nao informado'
  const phone = params.phone?.trim() || 'Telefone nao informado'
  const escapedName = escapeHtml(name)
  const escapedPhone = escapeHtml(phone)
  const escapedEmail = escapeHtml(params.userEmail)
  const escapedUserId = escapeHtml(params.userId)
  const escapedCartUpdatedAt = escapeHtml(params.cartUpdatedAt)
  const escapedPendingOrdersCount = escapeHtml(params.pendingOrdersCount)
  const escapedSubtotalText = escapeHtml(params.subtotalText)
  const escapedCartUrl = escapeHtml(params.cartUrl)
  const itemsText = params.items
    .map((item) => `- ${item.productName} x${item.quantity}: ${item.lineTotalText} (${item.unitPriceText} un.)`)
    .join('\n')
  const itemsHtml = params.items
    .map(
      (item) =>
        `<li><strong>${escapeHtml(item.productName)}</strong> x${escapeHtml(item.quantity)}: ${escapeHtml(item.lineTotalText)} <span style="color:#735746">(${escapeHtml(item.unitPriceText)} un.)</span></li>`
    )
    .join('')

  await transport.transporter.sendMail({
    from: transport.from,
    to: params.to,
    subject: 'Carrinho abandonado - Nathalia Malinowski',
    text:
      `Um cliente deixou itens no carrinho sem finalizar.\n\n` +
      `Cliente: ${name}\n` +
      `E-mail: ${params.userEmail}\n` +
      `Telefone: ${phone}\n` +
      `User ID: ${params.userId}\n` +
      `Atualizado em: ${params.cartUpdatedAt}\n` +
      `Pedidos pendentes: ${params.pendingOrdersCount}\n` +
      `Subtotal: ${params.subtotalText}\n\n` +
      `Itens:\n${itemsText}\n\n` +
      `Link do carrinho: ${params.cartUrl}\n`,
    html:
      `<p>Um cliente deixou itens no carrinho sem finalizar.</p>` +
      `<p><strong>Cliente:</strong> ${escapedName}<br/>` +
      `<strong>E-mail:</strong> ${escapedEmail}<br/>` +
      `<strong>Telefone:</strong> ${escapedPhone}<br/>` +
      `<strong>User ID:</strong> ${escapedUserId}<br/>` +
      `<strong>Atualizado em:</strong> ${escapedCartUpdatedAt}<br/>` +
      `<strong>Pedidos pendentes:</strong> ${escapedPendingOrdersCount}<br/>` +
      `<strong>Subtotal:</strong> ${escapedSubtotalText}</p>` +
      `<ul>${itemsHtml}</ul>` +
      `<p><a href="${escapedCartUrl}">Abrir site</a></p>`
  })

  return true
}
