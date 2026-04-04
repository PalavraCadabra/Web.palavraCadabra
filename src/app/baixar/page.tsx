import Link from "next/link";
import { Download, Smartphone, Apple, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Baixar — Palavra Cadabra",
  description: "Baixe o Palavra Cadabra para Android ou instale como app no iPhone/iPad via PWA.",
};

export default function DownloadPage() {
  const apkUrl = "https://palavracadabra-downloads.s3.amazonaws.com/palavra-cadabra-latest.apk";
  const pwaUrl = "http://palavracadabra-app-pwa.s3-website-us-east-1.amazonaws.com";

  return (
    <div className="min-h-screen bg-[#FFFBFE]">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E0EC]">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#6750A4] font-bold text-xl">
            <ArrowLeft className="w-5 h-5" />
            Palavra Cadabra
          </Link>
          <Link href="/login" className="text-[#6750A4] hover:underline font-medium">
            Portal do Terapeuta
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1B20] mb-4">
          Baixe o Palavra Cadabra
        </h1>
        <p className="text-xl text-[#49454F] mb-2">
          Comunicação aumentativa gratuita para pessoas não verbais
        </p>
        <p className="text-sm text-[#79747E]">
          Versão beta — instalação direta (sem lojas)
        </p>
      </section>

      {/* Download Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-8">
        {/* Android */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E7E0EC]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#4CAF50]/10 p-3 rounded-2xl">
              <Smartphone className="w-8 h-8 text-[#4CAF50]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1D1B20]">Android</h2>
              <p className="text-sm text-[#79747E]">Android 7.0 ou superior</p>
            </div>
          </div>

          <p className="text-[#49454F] mb-6">
            Baixe o APK e instale diretamente no seu dispositivo Android.
          </p>

          <a
            href={apkUrl}
            className="block w-full bg-[#6750A4] hover:bg-[#5a4590] text-white text-center font-semibold py-4 rounded-2xl transition-colors mb-4"
          >
            <Download className="w-5 h-5 inline mr-2" />
            Baixar APK (62 MB)
          </a>

          <div className="bg-[#F5F0FF] rounded-2xl p-4 text-sm">
            <p className="font-semibold text-[#1D1B20] mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FF9800]" />
              Como instalar
            </p>
            <ol className="space-y-2 text-[#49454F] list-decimal list-inside">
              <li>Baixe o arquivo APK clicando no botão acima</li>
              <li>
                Abra as <strong>Configurações</strong> do Android → <strong>Segurança</strong>
              </li>
              <li>
                Ative <strong>&quot;Fontes desconhecidas&quot;</strong> ou{" "}
                <strong>&quot;Instalar apps de origem desconhecida&quot;</strong>
              </li>
              <li>Abra o arquivo APK baixado e toque em &quot;Instalar&quot;</li>
              <li>Desative &quot;Fontes desconhecidas&quot; depois da instalação</li>
            </ol>
          </div>
        </div>

        {/* iOS */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E7E0EC]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#6750A4]/10 p-3 rounded-2xl">
              <Apple className="w-8 h-8 text-[#6750A4]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1D1B20]">iPhone / iPad</h2>
              <p className="text-sm text-[#79747E]">iOS 15 ou superior (via Safari)</p>
            </div>
          </div>

          <p className="text-[#49454F] mb-6">
            Instale como aplicativo diretamente do navegador — funciona igual a um app nativo.
          </p>

          <a
            href={pwaUrl}
            className="block w-full bg-[#6750A4] hover:bg-[#5a4590] text-white text-center font-semibold py-4 rounded-2xl transition-colors mb-4"
          >
            <Download className="w-5 h-5 inline mr-2" />
            Abrir no Safari
          </a>

          <div className="bg-[#F5F0FF] rounded-2xl p-4 text-sm">
            <p className="font-semibold text-[#1D1B20] mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FF9800]" />
              Como instalar
            </p>
            <ol className="space-y-2 text-[#49454F] list-decimal list-inside">
              <li>
                Abra o link acima <strong>no Safari</strong> (não Chrome)
              </li>
              <li>
                Toque no ícone <strong>Compartilhar</strong> (quadrado com seta para cima) na
                barra inferior
              </li>
              <li>
                Role para baixo e toque em <strong>&quot;Adicionar à Tela de Início&quot;</strong>
              </li>
              <li>Toque em &quot;Adicionar&quot; no canto superior direito</li>
              <li>O ícone do Palavra Cadabra aparecerá na sua tela inicial</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#F5F0FF] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#1D1B20] mb-12">
            O que você encontra no app
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "13.000+ símbolos", desc: "Biblioteca ARASAAC completa em português" },
              { title: "100% offline", desc: "Funciona sem internet após o primeiro uso" },
              { title: "Predição inteligente", desc: "Sugere o próximo símbolo automaticamente" },
              { title: "Pranchas personalizadas", desc: "Configure do jeito que precisar" },
              { title: "Alfabetização integrada", desc: "Atividades para aprender a ler e escrever" },
              { title: "Sincronização", desc: "Dados seguros na nuvem, LGPD-compliant" },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6">
                <CheckCircle2 className="w-6 h-6 text-[#00BFA5] mb-3" />
                <h3 className="font-bold text-[#1D1B20] mb-2">{f.title}</h3>
                <p className="text-sm text-[#49454F]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-[#FFF8E1] border border-[#FFD54F] rounded-2xl p-6">
          <h3 className="font-bold text-[#1D1B20] mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#F57C00]" />
            Sobre a versão beta
          </h3>
          <p className="text-sm text-[#49454F] mb-3">
            O Palavra Cadabra está em fase de testes. Em breve estará disponível na
            Google Play Store e Apple App Store. Enquanto isso, você pode instalar diretamente
            usando os métodos acima.
          </p>
          <p className="text-sm text-[#49454F]">
            Encontrou algum problema?{" "}
            <a href="mailto:contato@palavracadabra.com.br" className="text-[#6750A4] underline">
              contato@palavracadabra.com.br
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1D1B20] text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>© 2026 Palavra Cadabra — Tecnologia Assistiva</p>
          <div className="mt-3 flex justify-center gap-4">
            <Link href="/privacidade" className="hover:underline">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:underline">
              Termos
            </Link>
            <a href="mailto:contato@palavracadabra.com.br" className="hover:underline">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
