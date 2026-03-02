declare module 'nodemailer' {
  type MailOptions = {
    from?: string
    to?: string
    subject?: string
    text?: string
    html?: string
  }

  type Transporter = {
    sendMail(options: MailOptions): Promise<unknown>
  }

  export function createTransport(config: Record<string, unknown>): Transporter
}
