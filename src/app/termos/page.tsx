import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Termos de Uso — Palavra Cadabra',
  description:
    'Termos de Uso da plataforma Palavra Cadabra.',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">
      {children}
    </h2>
  );
}

export default function TermosPage() {
  return (
    <>
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-brand-primary" />
            <span className="text-xl font-extrabold text-brand-primary">
              Palavra Cadabra
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </nav>

      {/* ── Content ────────────────────────────────────────────── */}
      <main className="pt-32 pb-24 bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Termos de Uso
          </h1>
          <p className="text-gray-500 mb-8">
            Ultima atualizacao: 03 de abril de 2026
          </p>

          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
            <p>
              Estes Termos de Uso (&quot;Termos&quot;) regulam o acesso e a
              utilizacao da plataforma Palavra Cadabra, incluindo o aplicativo
              movel e o portal web, fornecidos pela PalavraCadabra Tecnologia
              Assistiva (&quot;nos&quot;, &quot;nosso&quot; ou &quot;Palavra
              Cadabra&quot;). Ao utilizar nossos servicos, voce concorda com
              estes Termos.
            </p>

            <SectionTitle>1. Aceitacao dos Termos</SectionTitle>
            <p>
              Ao criar uma conta ou utilizar a plataforma Palavra Cadabra, voce
              declara ter lido, compreendido e concordado com estes Termos de
              Uso e com nossa{' '}
              <Link href="/privacidade" className="text-brand-primary hover:underline">
                Politica de Privacidade
              </Link>
              . Caso nao concorde com qualquer disposicao, nao utilize a
              plataforma.
            </p>

            <SectionTitle>2. Descricao do Servico</SectionTitle>
            <p>
              O Palavra Cadabra e uma plataforma de comunicacao aumentativa e
              alternativa (CAA) que oferece:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Aplicativo movel:</strong> ferramenta de CAA com
                pictogramas, predicao inteligente e sintese de voz (TTS) em
                portugues brasileiro, disponivel para iOS e Android.
              </li>
              <li>
                <strong>Portal do terapeuta:</strong> interface web para
                fonoaudiologos e terapeutas gerenciarem pacientes, pranchas de
                comunicacao e acompanharem o progresso.
              </li>
              <li>
                <strong>Modulo de alfabetizacao:</strong> programa estruturado
                de letramento para pessoas nao verbais.
              </li>
              <li>
                <strong>Plataforma de pesquisa:</strong> ferramentas para
                coleta e analise de dados anonimizados para pesquisa cientifica.
              </li>
            </ul>

            <SectionTitle>3. Cadastro e Conta</SectionTitle>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Para utilizar a plataforma, e necessario criar uma conta com
                informacoes verdadeiras e atualizadas.
              </li>
              <li>
                Contas de usuarios menores de 18 anos devem ser criadas por
                um responsavel legal, em conformidade com o Estatuto da
                Crianca e do Adolescente (ECA).
              </li>
              <li>
                Voce e responsavel por manter a confidencialidade de suas
                credenciais de acesso.
              </li>
              <li>
                Nos nos reservamos o direito de suspender ou encerrar contas
                que violem estes Termos.
              </li>
            </ul>

            <SectionTitle>4. Uso Permitido</SectionTitle>
            <p>A plataforma deve ser utilizada exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Comunicacao aumentativa e alternativa de pessoas nao verbais
                ou com dificuldades de comunicacao.
              </li>
              <li>
                Acompanhamento terapeutico e clinico por profissionais
                habilitados.
              </li>
              <li>
                Atividades de alfabetizacao e letramento.
              </li>
              <li>
                Pesquisa cientifica, mediante consentimento e em conformidade
                com a LGPD.
              </li>
            </ul>

            <SectionTitle>5. Uso Proibido</SectionTitle>
            <p>E expressamente proibido:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Utilizar a plataforma para fins ilegais, fraudulentos ou que
                violem direitos de terceiros.
              </li>
              <li>
                Tentar obter acesso nao autorizado a sistemas, contas ou dados
                de outros usuarios.
              </li>
              <li>
                Realizar engenharia reversa, descompilar ou desmontar o
                software da plataforma.
              </li>
              <li>
                Distribuir, sublicenciar ou comercializar o acesso a
                plataforma sem autorizacao.
              </li>
              <li>
                Inserir conteudo ofensivo, discriminatorio ou que viole
                direitos fundamentais.
              </li>
            </ul>

            <SectionTitle>6. Propriedade Intelectual</SectionTitle>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                A plataforma Palavra Cadabra, incluindo software, design,
                textos e logotipos, e de propriedade da PalavraCadabra
                Tecnologia Assistiva e esta protegida por leis de propriedade
                intelectual.
              </li>
              <li>
                Os pictogramas ARASAAC sao licenciados sob Creative Commons
                BY-NC-SA e pertencem ao Governo de Aragao (Espanha).
              </li>
              <li>
                O conteudo gerado pelo usuario (pranchas personalizadas,
                vocabularios) permanece de propriedade do usuario, com licenca
                de uso concedida a plataforma para prestacao do servico.
              </li>
            </ul>

            <SectionTitle>7. Plano Gratuito e Planos Pagos</SectionTitle>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                A plataforma oferece um plano gratuito com funcionalidades
                essenciais de comunicacao.
              </li>
              <li>
                Funcionalidades avancadas podem estar disponiveis em planos
                pagos (freemium).
              </li>
              <li>
                Valores, formas de pagamento e politica de cancelamento dos
                planos pagos serao informados no momento da contratacao.
              </li>
              <li>
                Nos nos reservamos o direito de alterar precos e
                funcionalidades dos planos, mediante aviso previo de 30 dias.
              </li>
            </ul>

            <SectionTitle>8. Disponibilidade e Modo Offline</SectionTitle>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                O aplicativo movel foi projetado para funcionar integralmente
                em modo offline, sem necessidade de conexao a internet para as
                funcionalidades essenciais de comunicacao.
              </li>
              <li>
                Funcionalidades que dependem de conexao (sincronizacao,
                predicao avancada com IA, portal web) requerem acesso a
                internet.
              </li>
              <li>
                Nos nos esforcaremos para manter a plataforma disponivel, mas
                nao garantimos disponibilidade ininterrupta.
              </li>
            </ul>

            <SectionTitle>9. Privacidade e Protecao de Dados</SectionTitle>
            <p>
              O tratamento de dados pessoais e regido por nossa{' '}
              <Link href="/privacidade" className="text-brand-primary hover:underline">
                Politica de Privacidade
              </Link>
              , que e parte integrante destes Termos. Ao utilizar a plataforma,
              voce consente com o tratamento de dados conforme descrito naquela
              politica.
            </p>

            <SectionTitle>10. Limitacao de Responsabilidade</SectionTitle>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                A plataforma Palavra Cadabra e uma ferramenta de tecnologia
                assistiva e nao substitui acompanhamento profissional de saude.
              </li>
              <li>
                Nao nos responsabilizamos por decisoes clinicas ou
                terapeuticas tomadas com base nas informacoes fornecidas pela
                plataforma.
              </li>
              <li>
                A plataforma e fornecida &quot;como esta&quot;, sem garantias
                expressas ou implicitas de adequacao a um proposito especifico.
              </li>
              <li>
                Nossa responsabilidade total esta limitada ao valor pago pelo
                usuario nos ultimos 12 meses, quando aplicavel.
              </li>
            </ul>

            <SectionTitle>11. Pesquisa Cientifica</SectionTitle>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                A participacao em pesquisa cientifica e voluntaria e requer
                consentimento explicito e especifico.
              </li>
              <li>
                Apenas dados anonimizados e agregados sao utilizados para fins
                de pesquisa.
              </li>
              <li>
                O consentimento para pesquisa pode ser revogado a qualquer
                momento, sem prejuizo ao uso da plataforma.
              </li>
            </ul>

            <SectionTitle>12. Alteracoes nos Termos</SectionTitle>
            <p>
              Podemos atualizar estes Termos periodicamente. Alteracoes
              significativas serao comunicadas por meio do aplicativo ou por
              e-mail com antecedencia minima de 30 dias. O uso continuado da
              plataforma apos a notificacao constitui aceitacao dos novos
              Termos.
            </p>

            <SectionTitle>13. Rescisao</SectionTitle>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                O usuario pode encerrar sua conta a qualquer momento por meio
                das configuracoes do aplicativo ou solicitando por e-mail.
              </li>
              <li>
                Nos podemos encerrar ou suspender o acesso em caso de violacao
                destes Termos, mediante notificacao previa quando possivel.
              </li>
              <li>
                Apos o encerramento, os dados pessoais serao tratados
                conforme nossa Politica de Privacidade.
              </li>
            </ul>

            <SectionTitle>14. Legislacao Aplicavel e Foro</SectionTitle>
            <p>
              Estes Termos sao regidos pelas leis da Republica Federativa do
              Brasil. Fica eleito o foro da comarca de residencia do usuario
              para dirimir quaisquer controversias oriundas destes Termos, em
              conformidade com o Codigo de Defesa do Consumidor.
            </p>

            <SectionTitle>15. Contato</SectionTitle>
            <p>
              Para duvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>E-mail:</strong>{' '}
                <a
                  href="mailto:contato@palavracadabra.com.br"
                  className="text-brand-primary hover:underline"
                >
                  contato@palavracadabra.com.br
                </a>
              </li>
              <li>
                <strong>DPO:</strong>{' '}
                <a
                  href="mailto:dpo@palavracadabra.com.br"
                  className="text-brand-primary hover:underline"
                >
                  dpo@palavracadabra.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary-light" />
                <span className="text-lg font-extrabold text-white">
                  Palavra Cadabra
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Tecnologia assistiva brasileira para comunicacao aumentativa e
                alternativa.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Produto
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/#download" className="hover:text-white transition-colors">
                    Baixar App
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Portal do Terapeuta
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacidade" className="hover:text-white transition-colors">
                    Politica de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/termos" className="hover:text-white transition-colors">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Contato
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="mailto:contato@palavracadabra.com.br"
                    className="hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    contato@palavracadabra.com.br
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; 2026 Palavra Cadabra &mdash; Tecnologia Assistiva</p>
            <p>
              Pictogramas:{' '}
              <a
                href="https://arasaac.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                ARASAAC
              </a>{' '}
              (CC BY-NC-SA)
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
