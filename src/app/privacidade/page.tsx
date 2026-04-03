import Link from 'next/link';
import { Sparkles, Mail, ExternalLink, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Politica de Privacidade — Palavra Cadabra',
  description:
    'Politica de Privacidade da plataforma Palavra Cadabra, em conformidade com a LGPD.',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-extrabold text-gray-900 mt-12 mb-4">
      {children}
    </h2>
  );
}

export default function PrivacidadePage() {
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
            Politica de Privacidade
          </h1>
          <p className="text-gray-500 mb-8">
            Ultima atualizacao: 03 de abril de 2026
          </p>

          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
            <p>
              A presente Politica de Privacidade descreve como a PalavraCadabra
              Tecnologia Assistiva (&quot;nos&quot;, &quot;nosso&quot; ou
              &quot;Palavra Cadabra&quot;) coleta, utiliza, armazena e protege
              os dados pessoais dos usuarios de nossa plataforma, em
              conformidade com a Lei Geral de Protecao de Dados Pessoais (Lei
              n. 13.709/2018 &mdash; LGPD) e demais legislacoes aplicaveis.
            </p>

            <SectionTitle>1. Controlador de Dados</SectionTitle>
            <p>
              O controlador dos dados pessoais tratados por meio da plataforma
              Palavra Cadabra e:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Razao Social:</strong> PalavraCadabra Tecnologia
                Assistiva
              </li>
              <li>
                <strong>Encarregado de Protecao de Dados (DPO):</strong>{' '}
                <a
                  href="mailto:dpo@palavracadabra.com.br"
                  className="text-brand-primary hover:underline"
                >
                  dpo@palavracadabra.com.br
                </a>
              </li>
            </ul>

            <SectionTitle>2. Dados Coletados</SectionTitle>
            <p>
              Coletamos os seguintes tipos de dados pessoais, sempre com base
              legal adequada:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Dados de cadastro:</strong> nome, e-mail, telefone,
                papel (responsavel, terapeuta, pesquisador).
              </li>
              <li>
                <strong>Perfil AAC:</strong> configuracoes de comunicacao,
                pranchas personalizadas, vocabulario, preferencias de
                acessibilidade e layout.
              </li>
              <li>
                <strong>Dados de comunicacao:</strong> historico de mensagens
                formadas por pictogramas, texto digitado e interacoes com a
                interface de comunicacao.
              </li>
              <li>
                <strong>Logs de uso:</strong> frequencia de acesso, tempo de
                sessao, funcionalidades utilizadas e dados de navegacao no
                aplicativo.
              </li>
              <li>
                <strong>Dados de letramento:</strong> progresso em atividades
                de alfabetizacao, desempenho em exercicios e marcos de
                aprendizagem.
              </li>
              <li>
                <strong>Dados do dispositivo:</strong> sistema operacional,
                versao do aplicativo, modelo do dispositivo e identificadores
                anonimos.
              </li>
            </ul>

            <SectionTitle>3. Bases Legais para o Tratamento</SectionTitle>
            <p>
              Os dados pessoais sao tratados com fundamento nas seguintes bases
              legais previstas na LGPD:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Consentimento (Art. 7, I):</strong> para coleta de
                dados de comunicacao, compartilhamento de dados anonimizados
                para pesquisa cientifica e envio de comunicacoes.
              </li>
              <li>
                <strong>Execucao de contrato (Art. 7, V):</strong> para
                prestacao do servico de comunicacao aumentativa e alternativa,
                manutencao da conta do usuario e fornecimento das
                funcionalidades da plataforma.
              </li>
              <li>
                <strong>Interesse legitimo (Art. 7, IX):</strong> para
                melhoria continua da plataforma, seguranca e prevencao de
                fraudes.
              </li>
            </ul>

            <SectionTitle>4. Compartilhamento de Dados</SectionTitle>
            <p>
              Nao vendemos dados pessoais. O compartilhamento ocorre apenas
              nas seguintes situacoes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Pesquisa cientifica:</strong> dados anonimizados e
                agregados podem ser compartilhados com instituicoes de pesquisa,
                exclusivamente mediante consentimento previo e explicito do
                titular ou responsavel legal.
              </li>
              <li>
                <strong>Terapeutas vinculados:</strong> dados de progresso e
                comunicacao sao compartilhados com os terapeutas
                expressamente autorizados pelo responsavel do usuario.
              </li>
              <li>
                <strong>Prestadores de servico:</strong> provedores de
                infraestrutura (AWS), processamento de pagamentos e servicos
                essenciais a operacao da plataforma, sujeitos a acordos de
                confidencialidade.
              </li>
              <li>
                <strong>Obrigacao legal:</strong> quando exigido por lei,
                regulamento ou decisao judicial.
              </li>
            </ul>

            <SectionTitle>5. Transferencia Internacional de Dados</SectionTitle>
            <p>
              Os dados pessoais podem ser armazenados e processados em
              servidores localizados nos Estados Unidos (AWS, regiao
              us-east-1). Essa transferencia e realizada em conformidade com
              o Capitulo V da LGPD, mediante:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Clausulas contratuais padrao:</strong> acordos
                firmados com a AWS que garantem nivel adequado de protecao de
                dados.
              </li>
              <li>
                <strong>Medidas tecnicas:</strong> criptografia em transito e
                em repouso para todos os dados transferidos.
              </li>
            </ul>

            <SectionTitle>6. Direitos do Titular</SectionTitle>
            <p>
              Em conformidade com os Arts. 17 a 22 da LGPD, o titular dos dados
              tem direito a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Acesso:</strong> solicitar informacoes sobre quais
                dados pessoais seus estao sendo tratados.
              </li>
              <li>
                <strong>Correcao:</strong> solicitar a correcao de dados
                incompletos, inexatos ou desatualizados.
              </li>
              <li>
                <strong>Exclusao:</strong> solicitar a eliminacao de dados
                pessoais tratados com base no consentimento.
              </li>
              <li>
                <strong>Portabilidade:</strong> solicitar a transferencia de
                seus dados pessoais a outro fornecedor de servico, em formato
                estruturado e interoperavel.
              </li>
              <li>
                <strong>Oposicao:</strong> opor-se ao tratamento de dados
                realizado com base em interesse legitimo, caso discorde da
                finalidade.
              </li>
              <li>
                <strong>Revogacao do consentimento:</strong> revogar o
                consentimento a qualquer momento, sem prejudizo da licitude do
                tratamento realizado anteriormente.
              </li>
            </ul>
            <p>
              Para exercer qualquer desses direitos, entre em contato pelo
              e-mail{' '}
              <a
                href="mailto:dpo@palavracadabra.com.br"
                className="text-brand-primary hover:underline"
              >
                dpo@palavracadabra.com.br
              </a>
              . Responderemos em ate 15 dias uteis.
            </p>

            <SectionTitle>7. Retencao de Dados</SectionTitle>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Os dados pessoais sao mantidos enquanto a conta do usuario
                estiver ativa e o servico estiver sendo utilizado.
              </li>
              <li>
                Apos solicitacao de exclusao, os dados serao eliminados em ate
                30 (trinta) dias, exceto quando houver obrigacao legal de
                retencao.
              </li>
              <li>
                Dados anonimizados utilizados para pesquisa cientifica nao
                sao considerados dados pessoais e podem ser mantidos
                indefinidamente.
              </li>
            </ul>

            <SectionTitle>8. Seguranca dos Dados</SectionTitle>
            <p>
              Adotamos medidas tecnicas e organizacionais adequadas para
              proteger os dados pessoais:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Criptografia em transito:</strong> todas as
                comunicacoes sao protegidas por TLS 1.2 ou superior.
              </li>
              <li>
                <strong>Criptografia em repouso:</strong> dados armazenados
                sao criptografados utilizando AES-256.
              </li>
              <li>
                <strong>Acesso restrito:</strong> apenas colaboradores
                autorizados tem acesso aos dados pessoais, com registro de
                auditoria.
              </li>
              <li>
                <strong>Backups:</strong> copias de seguranca periodicas com
                criptografia.
              </li>
              <li>
                <strong>Monitoramento:</strong> sistemas de deteccao de
                intrusao e monitoramento continuo da infraestrutura.
              </li>
            </ul>

            <SectionTitle>9. Cookies e Tecnologias Similares</SectionTitle>
            <p>
              Utilizamos cookies estritamente necessarios para o funcionamento
              da plataforma:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cookies de sessao:</strong> utilizados para
                autenticacao e manutencao da sessao do usuario. Expiram ao
                encerrar o navegador ou apos o periodo de inatividade
                configurado.
              </li>
            </ul>
            <p>
              Nao utilizamos cookies de rastreamento, publicidade ou analytics
              de terceiros.
            </p>

            <SectionTitle>10. Dados de Criancas e Adolescentes</SectionTitle>
            <p>
              A plataforma Palavra Cadabra e utilizada predominantemente por
              criancas e adolescentes. Em conformidade com o Art. 14 da LGPD e
              com o Estatuto da Crianca e do Adolescente (ECA &mdash; Lei n.
              8.069/1990):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                O tratamento de dados pessoais de criancas e adolescentes e
                realizado exclusivamente com o consentimento especifico e em
                destaque de pelo menos um dos pais ou responsavel legal.
              </li>
              <li>
                Coletamos apenas os dados estritamente necessarios para a
                prestacao do servico.
              </li>
              <li>
                Os responsaveis legais podem, a qualquer momento, consultar,
                corrigir ou solicitar a exclusao dos dados de seus dependentes.
              </li>
            </ul>

            <SectionTitle>11. Alteracoes nesta Politica</SectionTitle>
            <p>
              Esta Politica de Privacidade pode ser atualizada periodicamente.
              Notificaremos os usuarios sobre alteracoes significativas por
              meio do aplicativo ou por e-mail. A data da ultima atualizacao
              sera sempre indicada no topo deste documento.
            </p>

            <SectionTitle>12. Contato</SectionTitle>
            <p>
              Para duvidas, solicitacoes ou reclamacoes relacionadas a esta
              Politica de Privacidade ou ao tratamento de seus dados pessoais,
              entre em contato conosco:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>E-mail geral:</strong>{' '}
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
            <p className="mt-6">
              Caso nao esteja satisfeito com nossa resposta, voce pode
              apresentar uma reclamacao perante a Autoridade Nacional de
              Protecao de Dados (ANPD).
            </p>
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
