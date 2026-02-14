'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ServicosPage() {
    const scrollToContact = () => {
        window.location.href = '/#contato'
    }

    return (
        <main className="min-h-screen page-fade-in">
            <Navbar backgroundVariant={"dirt"}/>

            {/* Hero Section - Title + First Service left (60%) + Video right (40%) */}
            <section className="relative mt-16">
                <div className="flex flex-col lg:flex-row">
                    {/* Left side - 60% width - Title + First Service Card */}
                    <div className="lg:w-[55%]">
                        <div className="bg-bg px-24 py-12">
                            <h1 className="text-6xl font-serif text-[#b89b5e] pt-8 pb-16">
                                Serviços
                            </h1>

                            {/* Service card with border */}
                            <article className="border-2 border-[#b89b5e]/60 p-8 bg-bg/50 mb-8">
                                <h2 className="text-2xl lg:text-3xl font-serif text-darkGreen mb-4 leading-tight font-bold">
                                    Projeto de Interiores Residencial
                                </h2>
                                <div className="border-l-2 border-dirt/20 pl-4 text-base text-text/80 font-sans leading-relaxed py-4">
                                    <p className="mb-4">
                                        Desenvolvimento completo de projetos residenciais, do conceito à definição de layout, materiais e acabamentos.
                                    </p>
                                    <p className="mb-4">
                                        Cada projeto nasce da escuta atenta e da interpretação da identidade de quem vive o espaço, resultando em ambientes funcionais, atemporais e cheios de significado.
                                    </p>
                                    <p>
                                        O processo é construído em camadas, respeitando o tempo, a história e o modo de viver de cada cliente, com soluções que unem estética, sensibilidade e propósito.
                                    </p>
                                </div>
                            </article>

                            {/* Inclui - NO border */}
                            <div className="ml-12">

                                <div className="mb-8">
                                    <h3 className="text-lg font-serif text-dirt mb-3">Inclui</h3>
                                    <ul className="space-y-1 ml-4 text-[15px] text-[#b89b5e] font-sans">
                                        <li>• conversa inicial de alinhamento</li>
                                        <li>• conceito e narrativa do projeto</li>
                                        <li>• layout e organização dos ambientes</li>
                                        <li>• paleta de cores e definição de materiais</li>
                                        <li>• modelagem 3D para visualização do projeto</li>
                                    </ul>
                                </div>

                                {/* Indicado para quem busca - NO border */}
                                <div>
                                    <h3 className="text-lg font-serif text-dirt mb-3">Indicado para quem busca:</h3>
                                    <ul className="space-y-1 ml-4 text-[15px] text-[#b89b5e] font-sans">
                                        <li>• transformação completa do ambiente</li>
                                        <li>• um projeto autoral e personalizado</li>
                                        <li>• resultado funcional e atemporal</li>
                                        <li>• soluções estéticas alinhadas à rotina</li>
                                        <li>• identidade aplicada ao espaço</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Video - 40% width with max height */}
                    <div className="lg:w-[45%]">
                        <div className="relative h-[400px] lg:h-auto lg:max-h-[800px]">
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/service-main-video.mp4" type="video/mp4" />
                                Seu navegador não suporta vídeos.
                            </video>
                        </div>
                    </div>
                </div>
            </section>

            {/* Middle Services - Collage Layout with offset positioning */}
            <section className="relative bg-bg pt-16 lg:pt-20">
                <div className="px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Service 2 - Aligned */}
                        <div>
                            <article className="border-2 border-[#b89b5e]/60 p-8 bg-bg/50 mb-8 -mt-20">
                                <h2 className="text-2xl lg:text-3xl font-serif text-darkGreen mb-4 leading-tight font-bold">
                                    Consultoria de Interiores e Curadoria Virtual
                                </h2>
                                <div className="border-l-2 border-dirt/20 pl-4 text-base text-text/80 font-sans leading-relaxed py-4">
                                    <p className="mb-4">
                                        A Consultoria de Interiores e Curadoria Virtual é um serviço estratégico para quem busca direcionamento profissional sem a necessidade de um projeto completo.
                                    </p>
                                    <p className="mb-4">
                                        A partir de uma conversa inicial, analiso o espaço, entendo as necessidades e os desejos, e entrego uma proposta digital personalizada, incluindo moodboard, paleta de cores e curadoria de itens com links de compra.
                                    </p>
                                    <p>
                                        Todo o material é entregue de forma digital, pensado para orientar escolhas com mais clareza, identidade e segurança.
                                    </p>
                                </div>
                            </article>

                            <div className="ml-12">
                                <div className="mb-8">
                                    <h3 className="text-lg font-serif text-dirt mb-3">Inclui</h3>
                                    <ul className="space-y-1 ml-4 text-[15px] text-[#b89b5e] font-sans">
                                        <li>• conversa inicial de alinhamento</li>
                                        <li>• análise das necessidades e do ambiente</li>
                                        <li>• moodboard conceitual</li>
                                        <li>• paleta de cores</li>
                                        <li>• direcionamento estético</li>
                                        <li>• curadoria de itens decorativos</li>
                                        <li>• links de compra para os itens indicados</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-serif text-dirt mb-3">Indicado para quem deseja:</h3>
                                    <ul className="space-y-1 ml-4 text-[15px] text-[#b89b5e] font-sans">
                                        <li>• orientação prática e segura</li>
                                        <li>• transformar ambientes de forma pontual</li>
                                        <li>• clareza estética antes de investir</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Service 3 - Aligned */}
                        <div>
                            <article className="border-2 border-[#b89b5e]/60 p-8 bg-bg/50 mb-8">
                                <h2 className="text-2xl lg:text-3xl font-serif text-darkGreen mb-4 leading-tight font-bold">
                                    Pinturas Muralistas Autorais
                                </h2>
                                <div className="border-l-2 border-dirt/20 pl-4 text-base text-text/80 font-sans leading-relaxed py-4">
                                    <p className="mb-4">
                                        Criação de pinturas murais autorais desenvolvidas a partir do espaço, da arquitetura e da história de quem o habita.
                                    </p>
                                    <p className="mb-4">
                                        Cada mural é único e pensado para dialogar com o ambiente, acrescentando identidade, textura e presença de forma sensível e permanente.
                                    </p>
                                    <p>
                                        O mural pode ser integrado a projetos de interiores ou contratado de forma complementar, sempre respeitando o contexto e a proposta do espaço.
                                    </p>
                                </div>
                            </article>

                            <div className="ml-12">
                                <div className="mb-8">
                                    <h3 className="text-lg font-serif text-dirt mb-3">Inclui</h3>
                                    <ul className="space-y-1 ml-4 text-[15px] text-[#b89b5e] font-sans">
                                        <li>• concepção artística autoral</li>
                                        <li>• desenvolvimento do mural a partir do espaço</li>
                                        <li>• estudo de composição e cores</li>
                                        <li>• pintura executada no local</li>
                                        <li>• materiais artísticos profissionais</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-serif text-dirt mb-3">Indicado para quem deseja:</h3>
                                    <ul className="space-y-1 ml-4 text-[15px] text-[#b89b5e] font-sans">
                                        <li>• ambientes com identidade e presença</li>
                                        <li>• soluções autorais e exclusivas</li>
                                        <li>• arte integrada ao espaço</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Section - CTA left + Last Service right */}
            <section className="relative bg-bg pb-16 lg:pb-20">
                <div className="px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left - CTA + Contact */}
                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl lg:text-4xl font-serif text-darkGreen my-8 leading-tight font-bold text-center">
                                Vamos criar um espaço que faça sentido para você?
                            </h2>
                            <div className="flex justify-center mb-20">
                                <button
                                    onClick={scrollToContact}
                                    className="inline-block px-12 py-4 bg-[#b89b5e] text-bg font-sans font-medium rounded-md text-lg hover:bg-gold transition-colors duration-300"
                                >
                                    Agendar conversa
                                </button>
                            </div>
                            <div className="space-y-3 text-text/70 font-sans text-base mt-36">
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#b89b5e]">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                    <span>(45) 99802-8130</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#b89b5e]">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                    </svg>
                                    <span>nathalia_malinowski</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#b89b5e]">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                    <span>malinowskinathalia@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Service 4 */}
                        <div>
                            <article className="border-2 border-[#b89b5e]/60 p-8 bg-bg/50 mb-8">
                                <h2 className="text-2xl lg:text-3xl font-serif text-darkGreen mb-4 leading-tight font-bold">
                                    Curadoria e Peças Autorais
                                </h2>
                                <div className="border-l-2 border-dirt/20 pl-4 text-base text-text/80 font-sans leading-relaxed py-4">
                                    <p className="mb-4">
                                        Além dos serviços de interiores, a marca desenvolve uma curadoria artística de objetos e telas autorais, além de peças de artistas independentes selecionadas com cuidado e intenção.
                                    </p>
                                    <p className="mb-4">
                                        A Galeria de Artes funciona como um serviço à parte, independente dos serviços de interiores, reunindo obras que dialogam com espaço, tempo e identidade.
                                    </p>
                                    <p>
                                        As peças estão disponíveis na Galeria sob curadoria e indicações pontuais, podendo ser integradas a projetos, consultorias ou adquiridas sob consulta.
                                    </p>
                                </div>
                            </article>

                            {/* Inclui/Indicado for Service 4 - below the service card */}
                            <div className="ml-12">
                                <div className="mb-8">
                                    <h3 className="text-lg font-serif text-dirt mb-3">Inclui</h3>
                                    <ul className="space-y-1 ml-4 text-[15px] text-[#b89b5e] font-sans">
                                        <li>• curadoria de objetos e telas autorais</li>
                                        <li>• seleção de peças de artistas independentes</li>
                                        <li>• disponibilidade sob consulta</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-serif text-dirt mb-3">Indicado para quem deseja:</h3>
                                    <ul className="space-y-1 ml-4 text-[15px] text-[#b89b5e] font-sans">
                                        <li>• peças com significado e identidade</li>
                                        <li>• arte como extensão do espaço</li>
                                        <li>• curadoria sensível e autoral</li>
                                        <li>• obras e objetos com história</li>
                                        <li>• composições únicas</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer contactInfo={false} />
        </main>
    )
}