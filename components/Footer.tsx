'use client'

import { Instagram, Mail } from 'lucide-react'

type FooterProps = {
  contactInfo?: boolean
  paymentInfo?: boolean
}

const WhatsAppIcon = ({ className = 'text-[#6b7a5e]' }: { className?: string }) => (
  <span className="flex h-4 w-4 items-center justify-center">
    <img
      src="https://cdn.simpleicons.org/whatsapp/6b7a5e?viewbox=auto"
      alt=""
      aria-hidden="true"
      className={className}
      width="16"
      height="16"
    />
  </span>
)

const Footer = ({ contactInfo = true, paymentInfo = false }: FooterProps) => {
  const whatsappHref = 'https://wa.me/5545998028130?text=Ola%20Nathalia%2C%20gostaria%20de%20falar%20sobre%20um%20projeto.'
  const phoneHref = 'tel:+5545998028130'
  const instagramHref = 'https://instagram.com/nathalia_malinowski'
  const emailHref = 'mailto:malinowskinathalia@gmail.com?subject=Projeto%20de%20Interiores'

  return (
    <footer className="relative bg-[#f5f1eb] text-[#6b7a5e]">
      {paymentInfo ? (
        <div>
          <div className="px-6 sm:px-8 lg:px-16">
            <div className="py-10 md:py-12">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full max-w-[340px] text-left">
                    <h3 className="text-[16px] font-sans font-normal tracking-wide text-[#6b7a5e] pb-5">ATENDIMENTO</h3>
                    <div className="w-full pt-5 space-y-2 text-[16px] font-extralight tracking-wide leading-none text-[#6b7a5e] border-t-2 border-[#6b7a5e]/40">
                      <a href={phoneHref} className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <WhatsAppIcon />
                        <span>(45) 99802-8130</span>
                      </a>
                      <a href={instagramHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <Instagram size={16} className="text-[#6b7a5e]" />
                        <span>nathalia_malinowski</span>
                      </a>
                      <a href={emailHref} className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <Mail size={16} className="text-[#6b7a5e]" />
                        <span>malinowskinathalia@gmail.com</span>
                      </a>
                      <p className="pt-3 text-[16px] font-extralight text-[#6b7a5e]">Seg a Sex das 08h às 17h</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center ">
                  <div className="w-full max-w-[440px] text-left">
                    <h3 className="text-[16px] font-sans font-normal tracking-wide text-[#6b7a5e] pb-5">PAGAMENTO</h3>
                    <div className="w-full pt-10 border-t-2 border-[#6b7a5e]/40">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/960px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png"
                          alt="Visa"
                          className="h-4 md:h-5 w-auto object-contain"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/330px-Mastercard_2019_logo.svg.png"
                          alt="Mastercard"
                          className="h-4 md:h-5 w-auto object-contain"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/5/51/Elo_logo.png"
                          alt="Elo"
                          className="h-4 md:h-6 w-auto object-contain"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Mercado_Pago.svg/960px-Mercado_Pago.svg.png"
                          alt="Mercado Pago"
                          className="h-4 md:h-7 w-auto object-contain"
                        />
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Pix_%28Brazil%29_logo.svg/330px-Pix_%28Brazil%29_logo.svg.png"
                          alt="Pix"
                          className="h-4 md:h-6 w-auto object-contain opacity-70"
                        />
                        <img
                          src="https://cdn.worldvectorlogo.com/logos/picpay-1.svg"
                          alt="PicPay"
                          className="h-4 md:h-5 w-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : contactInfo ? (
        <div id="contato">
          <div className="px-6 sm:px-8 lg:px-16">
            <div className="py-10 md:py-12">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-[24px] leading-[1.08] font-serif font-normal text-[#6b7a5e] max-w-[560px]">
                    Vamos criar um espaço que
                    <br />
                    faça sentido para você?
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 px-8 py-2 rounded-[12px] bg-[#b89b5e] text-[#ebeae0] font-sans font-normal text-[21px] leading-none"
                  >
                    Agendar conversa
                  </a>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="w-full max-w-[340px] text-left">
                    <h3 className="text-[16px] font-sans font-normal tracking-wide text-[#6b7a5e] pb-5">ATENDIMENTO</h3>
                    <div className="w-full pt-5 space-y-2 text-[14px] font-normal leading-none text-[#6b7a5e] border-t-2 border-[#6b7a5e]/40">
                      <a href={phoneHref} className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <WhatsAppIcon />
                        <span>(45) 99802-8130</span>
                      </a>
                      <a href={instagramHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <Instagram size={16} className="text-[#6b7a5e]" />
                        <span>nathalia_malinowski</span>
                      </a>
                      <a href={emailHref} className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <Mail size={16} className="text-[#6b7a5e]" />
                        <span>malinowskinathalia@gmail.com</span>
                      </a>
                      <p className="pt-3 text-[14px] font-normal text-[#6b7a5e]">Seg a Sex das 08h às 17h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-t-2 border-[#DDB980]/40 py-3 text-center">
        <img src="/nm-gold.png" alt="NM" className="mx-auto h-12 w-auto"/>
      </div>
    </footer>
  )
}

export default Footer
