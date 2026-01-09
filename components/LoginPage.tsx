import React, { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { User, Company } from '../types';
import { mockCompanies, mockUsers } from '../mockData';

interface LoginPageProps {
  onLogin: (user: User, company?: Company) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Verificar Super Admin
      if (email === 'victorallissson@gmail.com' && password === 'H1victoria@02') {
        const superAdmin: User = {
          id: 'super-admin-1',
          name: 'Victor Allisson',
          email: email,
          password: password,
          role: 'super-admin',
          createdAt: new Date().toISOString(),
          active: true
        };
        onLogin(superAdmin);
        setLoading(false);
        return;
      }

      // Verificar usuários de empresas
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        if (!user.active) {
          setError('Sua conta está inativa. Contacte o administrador.');
          setLoading(false);
          return;
        }

        if (user.companyId) {
          const company = mockCompanies.find(c => c.id === user.companyId);
          if (company) {
            if (!company.active) {
              setError('Empresa inativa. Contacte o suporte.');
              setLoading(false);
              return;
            }
            if (!company.planActive) {
              setError('Plano da empresa expirado. Contacte o suporte.');
              setLoading(false);
              return;
            }
            onLogin(user, company);
            setLoading(false);
            return;
          }
        }
      }

      setError('Email ou senha incorretos');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="V&C Logo" 
              className="h-24 md:h-28 w-auto object-contain"
            />
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Sistema Multiempresas
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Padaria, Restaurante e Minimercado
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Informação */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Apenas o Super Admin pode criar empresas.<br />
              Contacte o administrador para obter acesso.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6 drop-shadow-lg">
          © 2026 V_MILLION Consultoria, LDA - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
