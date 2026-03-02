type PaymentSuccessEmailParams = {
  to: string
  orderId: string
  productNames: string[]
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

export async function sendPaymentSuccessEmail(params: PaymentSuccessEmailParams) {
  const smtp = getSmtpConfig()
  if (!smtp) {
    console.warn('SMTP not configured; skipping payment success email')
    return
  }

  const dynamicImport = new Function('moduleName', 'return import(moduleName)') as (
    moduleName: string
  ) => Promise<{ createTransport: (config: Record<string, unknown>) => { sendMail: (options: Record<string, unknown>) => Promise<unknown> } }>
  const nodemailer = await dynamicImport('nodemailer')
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass
    }
  })

  const products = params.productNames.length ? params.productNames.join(', ') : 'obra adquirida'

  await transporter.sendMail({
    from: smtp.from,
    to: params.to,
    subject: 'Pagamento aprovado - Nathalia Malinowski',
    text: `Olá!\n\nRecebemos seu pagamento com sucesso para o pedido ${params.orderId}.\nProduto(s): ${products}.\n\nEntraremos em contato em breve para combinar os detalhes de entrega.\n\nObrigada!`,
    html: `<p>Olá!</p><p>Recebemos seu pagamento com sucesso para o pedido <strong>${params.orderId}</strong>.</p><p>Produto(s): <strong>${products}</strong>.</p><p>Entraremos em contato em breve para combinar os detalhes de entrega.</p><p>Obrigada!</p>`
  })
}
