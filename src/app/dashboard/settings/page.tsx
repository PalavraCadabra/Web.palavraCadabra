'use client';

import { useState } from 'react';
import { Save, Download, Shield, Bell, Globe } from 'lucide-react';
import Header from '@/components/header';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [notifications, setNotifications] = useState({
    email_sessions: true,
    email_weekly: true,
    email_alerts: false,
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `palavracadabra-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setExporting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  };

  return (
    <div>
      <Header title="Configuracoes" subtitle="Preferencias e conta" />

      <div className="p-6 space-y-6 max-w-3xl">
        {/* Profile section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900">Conta</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  defaultValue={user?.full_name || ''}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funcao
              </label>
              <input
                type="text"
                value={
                  user?.role === 'therapist'
                    ? 'Terapeuta'
                    : user?.role === 'admin'
                      ? 'Administrador'
                      : user?.role || ''
                }
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed max-w-xs"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900">Notificacoes</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Resumo de sessoes
                </p>
                <p className="text-xs text-gray-400">
                  Receber e-mail apos cada sessao do paciente
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email_sessions}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    email_sessions: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Relatorio semanal
                </p>
                <p className="text-xs text-gray-400">
                  Resumo semanal de progresso dos pacientes
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email_weekly}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    email_weekly: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Alertas de inatividade
                </p>
                <p className="text-xs text-gray-400">
                  Notificar quando um paciente ficar sem usar por 7 dias
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email_alerts}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    email_alerts: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
            </label>
          </div>
        </section>

        {/* Language / region */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900">
              Idioma e regiao
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idioma
              </label>
              <select
                defaultValue="pt-BR"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="pt-BR">Portugues (Brasil)</option>
                <option value="en">English</option>
                <option value="es">Espanol</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuso horario
              </label>
              <select
                defaultValue="America/Sao_Paulo"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="America/Sao_Paulo">
                  Brasilia (GMT-3)
                </option>
                <option value="America/Manaus">Manaus (GMT-4)</option>
                <option value="America/Belem">Belem (GMT-3)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data export */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-bold text-gray-900">
              Exportar dados
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Exporte todos os dados dos seus pacientes em formato JSON para
            backup ou analise externa.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exportando...' : 'Exportar JSON'}
          </button>
        </section>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar alteracoes'}
          </button>
        </div>
      </div>
    </div>
  );
}
