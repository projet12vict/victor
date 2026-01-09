import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertCircle,
  ChefHat,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Company, ProductionBatch, Product } from '../../types';
import { mockProductsPadaria } from '../../mockData';

interface PadariaDashboardProps {
  company: Company;
  currentModule: string;
}

const PadariaDashboard: React.FC<PadariaDashboardProps> = ({ company, currentModule }) => {
  const [products] = useState<Product[]>(mockProductsPadaria);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Dashboard Stats
  const stats = {
    dailyProduction: 450,
    dailySales: company.currency + ' 1,250',
    lowStock: products.filter(p => p.stock <= p.minStock).length,
    inProduction: productionBatches.filter(b => b.status !== 'disponivel').length
  };

  const renderDashboard = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Dashboard - Padaria
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ChefHat className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Produção Hoje</h3>
          <p className="text-3xl font-bold mt-2">{stats.dailyProduction}</p>
          <p className="text-xs opacity-75 mt-1">unidades</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Vendas Hoje</h3>
          <p className="text-3xl font-bold mt-2">{stats.dailySales}</p>
          <p className="text-xs opacity-75 mt-1">+15% vs ontem</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8" />
            <Package className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Estoque Baixo</h3>
          <p className="text-3xl font-bold mt-2">{stats.lowStock}</p>
          <p className="text-xs opacity-75 mt-1">produtos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
            <ChefHat className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Em Produção</h3>
          <p className="text-3xl font-bold mt-2">{stats.inProduction}</p>
          <p className="text-xs opacity-75 mt-1">lotes</p>
        </div>
      </div>

      {/* Produção Recente */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Produção em Andamento</h2>
        
        {productionBatches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ChefHat className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>Nenhuma produção em andamento</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Iniciar Produção
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {productionBatches.slice(0, 5).map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    batch.status === 'disponivel' ? 'bg-green-500' :
                    batch.status === 'producao' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-semibold text-gray-800">Lote #{batch.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{batch.quantity} unidades</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                  {batch.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produtos com Estoque Baixo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          Estoque Crítico
        </h2>
        
        <div className="space-y-3">
          {products.filter(p => p.stock <= p.minStock).map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600">
                  Estoque: <span className="text-red-600 font-bold">{product.stock}</span> / Min: {product.minStock} {product.unit}
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold">
                Repor
              </button>
            </div>
          ))}
          {products.filter(p => p.stock <= p.minStock).length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>Todos os produtos com estoque adequado!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProducao = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Gestão de Produção
        </h1>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
          <Plus className="w-5 h-5" />
          Novo Lote de Produção
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Fluxo de Produção</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { label: 'Matéria-Prima', color: 'bg-gray-100 text-gray-800' },
              { label: 'Armazenamento', color: 'bg-blue-100 text-blue-800' },
              { label: 'Preparação', color: 'bg-yellow-100 text-yellow-800' },
              { label: 'Produção', color: 'bg-orange-100 text-orange-800' },
              { label: 'Embalagem', color: 'bg-purple-100 text-purple-800' },
              { label: 'Aprovação', color: 'bg-pink-100 text-pink-800' },
              { label: 'Estoque', color: 'bg-green-100 text-green-800' }
            ].map((stage, index) => (
              <div key={index} className={`${stage.color} rounded-lg p-3 text-center text-xs font-semibold`}>
                <div className="mb-1 text-lg font-bold">{index + 1}</div>
                {stage.label}
              </div>
            ))}
          </div>
        </div>

        {productionBatches.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum lote de produção registado
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando um novo lote de produção
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              Criar Primeiro Lote
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lote</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Conteúdo da tabela */}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderMateriaPrima = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Matéria-Prima
        </h1>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
          <Plus className="w-5 h-5" />
          Adicionar Matéria-Prima
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar matéria-prima..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.filter(p => p.isRawMaterial).map((material) => (
            <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{material.name}</h3>
                  <p className="text-sm text-gray-600">{material.code}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  material.stock > material.minStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {material.stock > material.minStock ? 'OK' : 'Baixo'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estoque:</span>
                  <span className="font-semibold">{material.stock} {material.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mínimo:</span>
                  <span className="font-semibold">{material.minStock} {material.unit}</span>
                </div>
                {material.cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Custo:</span>
                    <span className="font-semibold">{company.currency}{material.cost}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-semibold">
                  Entrada
                </button>
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition font-semibold">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEstoque = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Gestão de Estoque
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Estoque em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderVendas = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        PDV - Ponto de Venda
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Vendas em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderReceitas = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Receitas e Fórmulas
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Receitas em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderFuncionarios = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Gestão de Funcionários
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Funcionários em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderRelatorios = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Relatórios
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Relatórios em desenvolvimento...</p>
      </div>
    </div>
  );

  switch (currentModule) {
    case 'dashboard':
      return renderDashboard();
    case 'producao':
      return renderProducao();
    case 'materia-prima':
      return renderMateriaPrima();
    case 'receitas':
      return renderReceitas();
    case 'estoque':
      return renderEstoque();
    case 'vendas':
      return renderVendas();
    case 'funcionarios':
      return renderFuncionarios();
    case 'relatorios':
      return renderRelatorios();
    default:
      return renderDashboard();
  }
};

export default PadariaDashboard;
