import React, { useState } from 'react';
import {
  Building2,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Users as UsersIcon,
  Settings,
  Search
} from 'lucide-react';
import { User, Company, CompanyType, Currency } from '../types';
import { mockCompanies } from '../mockData';

interface SuperAdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ user, onLogout }) => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'padaria' as CompanyType,
    currency: '€' as Currency,
    monthlyFee: 50,
    active: true,
    planActive: true
  });

  const stats = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.active && c.planActive).length,
    inactiveCompanies: companies.filter(c => !c.active || !c.planActive).length,
    monthlyRevenue: companies
      .filter(c => c.active && c.planActive)
      .reduce((sum, c) => sum + c.monthlyFee, 0)
  };

  const handleCreateCompany = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      type: 'padaria',
      currency: '€',
      monthlyFee: 50,
      active: true,
      planActive: true
    });
    setShowModal(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      type: company.type,
      currency: company.currency,
      monthlyFee: company.monthlyFee,
      active: company.active,
      planActive: company.planActive
    });
    setShowModal(true);
  };

  const handleSaveCompany = () => {
    if (!formData.name.trim()) {
      alert('Nome da empresa é obrigatório');
      return;
    }

    if (editingCompany) {
      // Editar empresa existente
      setCompanies(companies.map(c =>
        c.id === editingCompany.id
          ? { ...c, ...formData }
          : c
      ));
    } else {
      // Criar nova empresa
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        ...formData,
        logo: '/logo.png',
        createdAt: new Date().toISOString(),
        lastPayment: new Date().toISOString(),
        nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      setCompanies([...companies, newCompany]);
    }
    
    setShowModal(false);
  };

  const handleDeleteCompany = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  const toggleCompanyStatus = (id: string) => {
    setCompanies(companies.map(c =>
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  const togglePlanStatus = (id: string) => {
    setCompanies(companies.map(c =>
      c.id === id ? { ...c, planActive: !c.planActive } : c
    ));
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Super Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Gestão de Empresas</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-8 h-8" />
              <UsersIcon className="w-6 h-6 opacity-75" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Total Empresas</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalCompanies}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8" />
              <TrendingUp className="w-6 h-6 opacity-75" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Empresas Ativas</h3>
            <p className="text-3xl font-bold mt-2">{stats.activeCompanies}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8" />
              <EyeOff className="w-6 h-6 opacity-75" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Empresas Inativas</h3>
            <p className="text-3xl font-bold mt-2">{stats.inactiveCompanies}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
              <TrendingUp className="w-6 h-6 opacity-75" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Receita Mensal</h3>
            <p className="text-3xl font-bold mt-2">€{stats.monthlyRevenue}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleCreateCompany}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nova Empresa
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar empresas..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Companies List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moeda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mensalidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-xs text-gray-500">ID: {company.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        company.type === 'padaria' ? 'bg-yellow-100 text-yellow-800' :
                        company.type === 'restaurante' ? 'bg-orange-100 text-orange-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {company.type.charAt(0).toUpperCase() + company.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.currency}{company.monthlyFee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCompanyStatus(company.id)}
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                          company.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition`}
                      >
                        {company.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {company.active ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePlanStatus(company.id)}
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                          company.planActive
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } transition`}
                      >
                        {company.planActive ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {company.planActive ? 'Ativo' : 'Expirado'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Negócio
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CompanyType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="padaria">Padaria</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="minimercado">Minimercado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moeda
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="€">€ (Euro)</option>
                  <option value="$">$ (CVE)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensalidade
                </label>
                <input
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Empresa Ativa</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.planActive}
                    onChange={(e) => setFormData({ ...formData, planActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Plano Ativo</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCompany}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {editingCompany ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
