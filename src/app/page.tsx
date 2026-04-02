import Link from 'next/link';
import {
  MessageCircle,
  BookOpen,
  FlaskConical,
  Download,
  Monitor,
  Smartphone,
  UserCog,
  Settings,
  MessageSquare,
  BarChart3,
  Layout,
  Brain,
  Shield,
  WifiOff,
  Eye,
  Hand,
  Contrast,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Globe,
  CircleDollarSign,
  Mail,
  ExternalLink,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Reusable tiny components                                           */
/* ------------------------------------------------------------------ */

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: color + '18', color }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
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

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#funcionalidades" className="hover:text-brand-primary transition-colors">
              Funcionalidades
            </a>
            <a href="#comparativo" className="hover:text-brand-primary transition-colors">
              Comparativo
            </a>
            <a href="#como-funciona" className="hover:text-brand-primary transition-colors">
              Como funciona
            </a>
            <a href="#terapeutas" className="hover:text-brand-primary transition-colors">
              Terapeutas
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
            >
              Entrar
            </Link>
            <a
              href="#download"
              className="inline-flex items-center gap-2 bg-brand-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-primary-dark transition-colors"
            >
              <Download className="w-4 h-4" />
              Baixar App
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary-dark to-brand-secondary opacity-95" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Comunicação <br className="hidden sm:block" />
            para todos.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/85 leading-relaxed mb-10">
            Palavra Cadabra é uma plataforma de comunicação aumentativa e
            alternativa (CAA) que dá voz a pessoas não verbais, com
            alfabetização integrada e pesquisa científica.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#download"
              className="inline-flex items-center gap-2.5 bg-white text-brand-primary font-bold text-lg px-8 py-4 rounded-full hover:bg-gray-50 shadow-lg shadow-black/10 transition-all hover:scale-[1.02]"
            >
              <Download className="w-5 h-5" />
              Baixar App
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2.5 border-2 border-white/40 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-white/10 transition-all"
            >
              <Monitor className="w-5 h-5" />
              Portal do Terapeuta
            </Link>
          </div>

          {/* Mock app preview */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-white/20">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {[
                    { label: 'Eu', color: '#FFD700' },
                    { label: 'Quero', color: '#4CAF50' },
                    { label: 'Comer', color: '#4CAF50' },
                    { label: 'Beber', color: '#4CAF50' },
                    { label: 'Brincar', color: '#4CAF50' },
                    { label: 'Mamãe', color: '#FF9800' },
                    { label: 'Sim', color: '#E91E63' },
                    { label: 'Não', color: '#E91E63' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="aspect-square rounded-2xl flex items-center justify-center text-white font-bold text-sm md:text-base shadow-sm"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-brand-surface rounded-xl px-4 py-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-primary" />
                  <span className="text-brand-primary font-semibold">
                    &quot;Eu quero comer&quot;
                  </span>
                  <span className="ml-auto text-xs text-gray-400">
                    TTS: Polly Camila
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section
        id="funcionalidades"
        className="py-24 md:py-32 bg-brand-bg scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Três pilares, uma plataforma"
            subtitle="Comunicação, alfabetização e pesquisa científica reunidas em uma experiência integrada e acessível."
          />

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="w-7 h-7" />}
              title="Comunica"
              description="Ferramenta CAA completa com 13.000+ pictogramas ARASAAC, predição inteligente e TTS em português brasileiro."
              color="#6750A4"
            />
            <FeatureCard
              icon={<BookOpen className="w-7 h-7" />}
              title="Alfabetiza"
              description="Programa estruturado de letramento para pessoas não verbais, com acompanhamento individualizado por terapeutas."
              color="#00BFA5"
            />
            <FeatureCard
              icon={<FlaskConical className="w-7 h-7" />}
              title="Pesquisa"
              description="Plataforma científica para mapear padrões de comunicação e cognição não verbal, com dados anonimizados."
              color="#E91E63"
            />
          </div>
        </div>
      </section>

      {/* ── Differentials / Comparison ──────────────────────────── */}
      <section
        id="comparativo"
        className="py-24 md:py-32 bg-brand-surface scroll-mt-16"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Por que Palavra Cadabra?"
            subtitle="Comparamos com as principais soluções de CAA do mercado."
          />

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Recurso
                    </th>
                    <th className="px-6 py-5 text-sm font-bold text-brand-primary uppercase tracking-wider">
                      Palavra Cadabra
                    </th>
                    <th className="px-6 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Concorrentes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    {
                      feature: 'Plataformas',
                      us: 'iOS + Android',
                      them: 'iOS apenas',
                      icon: <Smartphone className="w-5 h-5" />,
                    },
                    {
                      feature: 'Idioma',
                      us: 'pt-BR nativo',
                      them: 'Traduzido / parcial',
                      icon: <Globe className="w-5 h-5" />,
                    },
                    {
                      feature: 'Preço',
                      us: 'Gratuito / Freemium',
                      them: '~US$ 299',
                      icon: <CircleDollarSign className="w-5 h-5" />,
                    },
                    {
                      feature: 'IA Preditiva',
                      us: 'Claude + ML híbrido',
                      them: 'Básica ou inexistente',
                      icon: <Brain className="w-5 h-5" />,
                    },
                    {
                      feature: 'Modo Offline',
                      us: '100% funcional',
                      them: 'Limitado',
                      icon: <WifiOff className="w-5 h-5" />,
                    },
                    {
                      feature: 'Pesquisa Científica',
                      us: 'Integrada',
                      them: 'Não oferece',
                      icon: <FlaskConical className="w-5 h-5" />,
                    },
                  ].map((row) => (
                    <tr key={row.feature} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium flex items-center gap-3">
                        <span className="text-gray-400">{row.icon}</span>
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-brand-primary">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-brand-secondary" />
                          {row.us}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {row.them}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ────────────────────────────────────────── */}
      <section
        id="como-funciona"
        className="py-24 md:py-32 bg-brand-bg scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Como funciona"
            subtitle="Comece a se comunicar em minutos."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                icon: <Download className="w-7 h-7" />,
                title: 'Baixe o app',
                desc: 'Disponível gratuitamente na App Store e Google Play.',
              },
              {
                step: '2',
                icon: <UserCog className="w-7 h-7" />,
                title: 'Configure o perfil',
                desc: 'Personalize vocabulário, layout e preferências de acessibilidade.',
              },
              {
                step: '3',
                icon: <MessageSquare className="w-7 h-7" />,
                title: 'Comunique-se',
                desc: 'Use pictogramas, texto ou teclado com predição inteligente e voz.',
              },
              {
                step: '4',
                icon: <BarChart3 className="w-7 h-7" />,
                title: 'Acompanhe o progresso',
                desc: 'Terapeutas e familiares visualizam a evolução em tempo real.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-primary/10 text-brand-primary mb-6">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-brand-primary text-white text-sm font-bold rounded-full flex items-center justify-center shadow">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Therapists ──────────────────────────────────────── */}
      <section
        id="terapeutas"
        className="py-24 md:py-32 bg-brand-surface scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                Portal completo para fonoaudiólogos e terapeutas
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Gerencie seus pacientes, personalize pranchas de comunicação e
                acompanhe a evolução com insights clínicos baseados em IA.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <BarChart3 className="w-6 h-6" />,
                    title: 'Dashboard de analytics',
                    desc: 'Visualize frequência de uso, vocabulário e progresso de cada paciente.',
                  },
                  {
                    icon: <Layout className="w-6 h-6" />,
                    title: 'Gerenciamento de pranchas',
                    desc: 'Crie e edite pranchas de comunicação personalizadas remotamente.',
                  },
                  {
                    icon: <Brain className="w-6 h-6" />,
                    title: 'Insights clínicos com IA',
                    desc: 'Receba sugestões automáticas de vocabulário e alertas de padrões.',
                  },
                  {
                    icon: <Settings className="w-6 h-6" />,
                    title: 'Configuração remota',
                    desc: 'Ajuste o app do paciente sem precisar de acesso físico ao dispositivo.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 mt-10 bg-brand-primary text-white font-bold px-8 py-4 rounded-full hover:bg-brand-primary-dark transition-colors"
              >
                Acessar Portal
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Portal preview card */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400 font-mono">
                  portal.palavracadabra.edu.br
                </span>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-brand-surface rounded-xl" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-brand-primary/10 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-brand-primary">
                      24
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Pacientes</div>
                  </div>
                  <div className="bg-brand-secondary/10 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-brand-secondary">
                      89%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Engajamento</div>
                  </div>
                  <div className="bg-pink-50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-black text-pink-500">
                      +12
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Palavras/sem
                    </div>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-brand-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-gray-50 rounded-xl" />
                  <div className="h-20 bg-gray-50 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Accessibility ───────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-brand-bg scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Acessibilidade sem concessões"
            subtitle="Projetado para ser utilizado por todos, independentemente de habilidades motoras ou sensoriais."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: <Hand className="w-7 h-7" />,
                title: 'Alvos de toque',
                desc: 'Mínimo de 64dp para facilitar o acesso motor.',
              },
              {
                icon: <Settings className="w-7 h-7" />,
                title: 'Varredura por switch',
                desc: 'Compatível com acionadores externos.',
              },
              {
                icon: <Eye className="w-7 h-7" />,
                title: 'Rastreamento ocular',
                desc: 'Compatível com dispositivos de eye-gaze.',
              },
              {
                icon: <Contrast className="w-7 h-7" />,
                title: 'Alto contraste',
                desc: 'Modo de alto contraste para baixa visão.',
              },
              {
                icon: <CheckCircle2 className="w-7 h-7" />,
                title: 'WCAG AA',
                desc: 'Em conformidade com as diretrizes de acessibilidade.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary mb-4">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Science / Tech ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-brand-surface scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            title="Construído sobre evidência científica"
            subtitle="Nossa abordagem combina as melhores práticas em CAA e alfabetização com tecnologia de ponta."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: 'Base em pesquisa',
                desc: 'Fundamentado nos trabalhos de Erickson, Light e na pedagogia de Paulo Freire adaptada para não verbais.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'LGPD compliant',
                desc: 'Total conformidade com a Lei Geral de Proteção de Dados. Dados sensíveis criptografados em repouso e em trânsito.',
              },
              {
                icon: <FlaskConical className="w-6 h-6" />,
                title: 'Dados anonimizados',
                desc: 'Contribua para a pesquisa científica com dados anonimizados, mediante consentimento explícito.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 text-left border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download CTA ────────────────────────────────────────── */}
      <section
        id="download"
        className="py-24 md:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Dê voz a quem precisa
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            Baixe gratuitamente e comece a transformar a comunicação de pessoas
            não verbais hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white text-brand-primary font-bold text-lg px-8 py-4 rounded-full hover:bg-gray-50 shadow-lg transition-all hover:scale-[1.02]"
            >
              <Download className="w-5 h-5" />
              Google Play
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white text-brand-primary font-bold text-lg px-8 py-4 rounded-full hover:bg-gray-50 shadow-lg transition-all hover:scale-[1.02]"
            >
              <Download className="w-5 h-5" />
              App Store
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-brand-primary-light" />
                <span className="text-lg font-extrabold text-white">
                  Palavra Cadabra
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Tecnologia assistiva brasileira para comunicação aumentativa e
                alternativa.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Produto
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#download" className="hover:text-white transition-colors">
                    Baixar App
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Portal do Terapeuta
                  </Link>
                </li>
                <li>
                  <a href="#funcionalidades" className="hover:text-white transition-colors">
                    Funcionalidades
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Recursos
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Contato
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="mailto:contato@palavracadabra.edu.br"
                    className="hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    contato@palavracadabra.edu.br
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
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
