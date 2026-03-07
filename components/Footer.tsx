'use client'

import { Instagram, Mail, MessageCircle } from 'lucide-react'

type FooterProps = {
    contactInfo?: boolean
}
const Footer = ({contactInfo = true}: FooterProps) => {
  return (
    <footer className="relative bg-[#f5f1eb] text-text">
      { contactInfo && (

        <div id="contato">
          <div className="px-6 sm:px-8 lg:px-16">
            <div className="py-10 md:py-12">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-[24px] leading-[1.08] font-serif font-normal text-[#3b2f26] max-w-[560px]">
                    Vamos criar um espaço que
                    <br />
                    faça sentido para você?
                  </p>
                  <button
                    type="button"
                    className="mt-6 px-8 py-2 rounded-[12px] bg-[#b89b5e] text-bg font-sans font-normal text-[21px] leading-none"
                  >
                    Agendar conversa
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="w-full max-w-[340px] text-left">
                    <h3 className="text-[16px] font-sans font-normal tracking-wide text-[#3b2f26] pb-5">ATENDIMENTO</h3>
                    <div className="w-full pt-5 space-y-2 text-[16px] font-extralight tracking-wide leading-none text-[#3b2f26] border-t border-[#6b7a5e]">
                      <div className="flex items-center gap-3">
                        <MessageCircle size={16} className="text-[#3b2f26]" />
                        <span>(45) 99802-8130</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Instagram size={16} className="text-[#3b2f26]" />
                        <span>nathalia_malinowski</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-[#3b2f26]" />
                        <span>malinowskinathalia@gmail.com</span>
                      </div>
                      <p className="pt-3 text-[16px] font-extralight text-[#3b2f26]">Seg a Sex das 08h às 17h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-[#e3d8c9] py-3 text-center">
        <img src="/nm-gold.png" alt="NM" className="mx-auto h-12 w-auto"/>
      </div>
    </footer>
  )
}

export default Footer
