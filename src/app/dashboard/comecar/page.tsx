'use client';

import Link from 'next/link';
import {
  UserPlus,
  Layers,
  BookOpen,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/header';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  cta: string;
  color: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Cadastre seu paciente',
    description:
      'Crie um perfil para cada pessoa que vai usar o app. Defina nivel comunicativo, capacidade motora e visual. O app se adapta automaticamente ao perfil.',
    icon: UserPlus,
    href: '/dashboard/patients',
    cta: 'Ir para Pacientes',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    number: 2,
    title: 'Crie ou personalize pranchas',
    description:
      'Use as pranchas template (Core - Compacta, Comida, Acoes, etc.) ou crie pranchas customizadas com a IA. O app ja vem com 13 mil simbolos ARASAAC em portugues.',
    icon: Layers,
    href: '/dashboard/boards',
    cta: 'Ir para Pranchas',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    number: 3,
    title: 'Defina o programa de letramento',
    description:
      'Escolha entre 4 etapas (Fundamentos, Emergente, Desenvolvimento, Convencional) e atribua atividades ao paciente. Sao 15 atividades disponiveis.',
    icon: BookOpen,
    href: '/dashboard/literacy',
    cta: 'Ir para Letramento',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    number: 4,
    title: 'Convide a familia',
    description:
      'Adicione pais ou cuidadores para acompanharem o progresso. A familia recebe acesso ao perfil do paciente e pode reforcar atividades em casa.',
    icon: Users,
    href: '/dashboard/team',
    cta: 'Ir para Equipe',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    number: 5,
    title: 'Acompanhe o progresso',
    description:
      'Veja relatorios de uso, vocabulario, taxa comunicativa e marcos de letramento. Use os dados para ajustar a terapia.',
    icon: BarChart3,
    href: '/dashboard/analytics',
    cta: 'Ver Analytics',
    color: 'bg-green-100 text-green-700',
  },
];

const tips = [
  {
    title: 'Tudo funciona offline',
    description:
      'O paciente pode usar o app sem internet. Os dados sincronizam quando a conexao volta.',
  },
  {
    title: 'IA para frases naturais',
    description:
      'Quando o paciente toca o botao Falar, nossa IA transforma a sequencia de simbolos em uma frase gramaticalmente correta em portugues.',
  },
  {
    title: 'Cores Fitzgerald Key',
    description:
      'Pronomes em amarelo, verbos em verde, adjetivos em azul, substantivos em laranja, social em rosa. Padrao internacional de CAA.',
  },
  {
    title: 'Letras MAIUSCULAS',
    description:
      'Todas as palavras aparecem em caixa alta para facilitar o reconhecimento por aprendizes em fase inicial de alfabetizacao.',
  },
  {
    title: 'Pronuncia automatica',
    description:
      'Ao tocar qualquer simbolo, o app pronuncia a palavra. Isso ajuda a associacao pictograma-som-palavra.',
  },
  {
    title: 'Compartilhe o app',
    description:
      'Indique aos pais para baixar o app gratuitamente em palavracadabra.com.br/baixar.',
  },
];

export default function ComecarPage() {
  return (
    <div>
      <Header
        title="Como comecar"
        subtitle="Guia rapido para usar o Palavra Cadabra com seus pacientes"
      />

      <div className="p-6 space-y-8 max-w-5xl mx-auto">
        {/* Welcome card */}
        <div className="bg-gradient-to-br from-[#6750A4] to-[#8A74BF] rounded-3xl p-8 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Bem-vindo ao Palavra Cadabra
              </h2>
              <p className="text-white/90 leading-relaxed">
                Em 5 passos simples voce configura tudo e ja pode comecar a
                trabalhar com seus pacientes nao verbais. Nosso sistema combina
                CAA (Comunicacao Aumentativa e Alternativa) com alfabetizacao
                estruturada e suporte de inteligencia artificial.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-5">
                  {/* Step number circle */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#6750A4] text-white flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <div className={`p-2 rounded-xl ${step.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-2 text-[#6750A4] font-semibold hover:underline"
                    >
                      {step.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-[#00BFA5]" />
            <h2 className="text-xl font-bold text-gray-900">
              Dicas importantes
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="border border-gray-100 rounded-2xl p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* App download */}
        <div className="bg-[#F5F0FF] rounded-3xl p-8 border border-[#6750A4]/20">
          <div className="flex items-start gap-4">
            <div className="bg-[#6750A4] p-3 rounded-2xl">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Indique o app aos seus pacientes
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                O app esta disponivel para Android (APK) e iPhone/iPad (PWA).
                Compartilhe o link com os pais ou cuidadores:
              </p>
              <div className="bg-white rounded-xl p-3 flex items-center justify-between gap-3">
                <code className="text-sm text-gray-700 truncate">
                  https://www.palavracadabra.com.br/baixar
                </code>
                <a
                  href="/baixar"
                  target="_blank"
                  className="flex-shrink-0 px-4 py-2 bg-[#6750A4] hover:bg-[#5a4590] text-white text-sm font-semibold rounded-lg"
                >
                  Abrir
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Duvidas? Entre em contato:{' '}
            <a
              href="mailto:contato@palavracadabra.com.br"
              className="text-[#6750A4] font-semibold hover:underline"
            >
              contato@palavracadabra.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
