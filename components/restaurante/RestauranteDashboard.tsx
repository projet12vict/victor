import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Wine,
  DollarSign,
  Users,
  Truck,
  Plus
} from 'lucide-react';
import { Company, Table as TableType, Order, OrderItem } from '../../types';
import { mockTables, mockProductsRestaurante } from '../../mockData';

interface RestauranteDashboardProps {
  company: Company;
  currentModule: string;
}

const RestauranteDashboard: React.FC<RestauranteDashboardProps> = ({ company, currentModule }) => {
  const [tables, setTables] = useState<TableType[]>(mockTables);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const stats = {
    mesasOcupadas: tables.filter(t => t.status === 'ocupada').length,
    mesasLivres: tables.filter(t => t.status === 'livre').length,
    pedidosPendentes: orders.filter(o => o.status === 'pendente').length,
    receitaDia: company.currency + ' 2,450'
  };

  const renderDashboard = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Dashboard - Restaurante
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8" />
            <UtensilsCrossed className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Mesas Ocupadas</h3>
          <p className="text-3xl font-bold mt-2">{stats.mesasOcupadas}</p>
          <p className="text-xs opacity-75 mt-1">de {tables.length} mesas</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <UtensilsCrossed className="w-8 h-8" />
            <CheckCircle className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Mesas Livres</h3>
          <p className="text-3xl font-bold mt-2">{stats.mesasLivres}</p>
          <p className="text-xs opacity-75 mt-1">disponíveis agora</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
            <ChefHat className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Pedidos Pendentes</h3>
          <p className="text-3xl font-bold mt-2">{stats.pedidosPendentes}</p>
          <p className="text-xs opacity-75 mt-1">em preparo</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <CheckCircle className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Receita Hoje</h3>
          <p className="text-3xl font-bold mt-2">{stats.receitaDia}</p>
          <p className="text-xs opacity-75 mt-1">+18% vs ontem</p>
        </div>
      </div>

      {/* Mesas - Vista Rápida */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Status das Mesas</h2>
          <button
            onClick={() => {}}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            Ver Todas
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`
                aspect-square rounded-xl p-4 flex flex-col items-center justify-center
                cursor-pointer transition-all transform hover:scale-105
                ${table.status === 'livre' ? 'bg-green-100 border-2 border-green-300' :
                  table.status === 'ocupada' ? 'bg-red-100 border-2 border-red-300' :
                  'bg-yellow-100 border-2 border-yellow-300'}
              `}
              onClick={() => setSelectedTable(table)}
            >
              <UtensilsCrossed className={`w-8 h-8 mb-2 ${
                table.status === 'livre' ? 'text-green-600' :
                table.status === 'ocupada' ? 'text-red-600' :
                'text-yellow-600'
              }`} />
              <span className="text-2xl font-bold text-gray-800">
                {table.number}
              </span>
              <span className="text-xs text-gray-600 mt-1">
                {table.capacity} pessoas
              </span>
              <span className={`text-xs font-semibold mt-2 px-2 py-1 rounded-full ${
                table.status === 'livre' ? 'bg-green-200 text-green-800' :
                table.status === 'ocupada' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {table.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pedidos em Andamento</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>Nenhum pedido em andamento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    order.status === 'pronto' ? 'bg-green-500' :
                    order.status === 'em-preparo' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Pedido #{order.id.slice(-6)}
                      {order.tableId && ` - Mesa ${tables.find(t => t.id === order.tableId)?.number}`}
                    </p>
                    <p className="text-sm text-gray-600">{order.items.length} itens - {company.currency}{order.total.toFixed(2)}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMesas = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Gestão de Mesas
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm">
            Todas Livres
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Mesa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className={`p-4 ${
              table.status === 'livre' ? 'bg-gradient-to-r from-green-500 to-green-600' :
              table.status === 'ocupada' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              'bg-gradient-to-r from-yellow-500 to-yellow-600'
            } text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Mesa {table.number}</h3>
                    <p className="text-sm opacity-90">{table.capacity} pessoas</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-white bg-opacity-30 rounded-full">
                  {table.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-4">
              {table.status === 'livre' ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">Mesa disponível</p>
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                    Abrir Mesa
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pedidos:</span>
                    <span className="font-semibold">{table.orders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-green-600">
                      {company.currency}{table.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                      Novo Pedido
                    </button>
                    <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                      Fechar Conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPedidos = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Gestão de Pedidos
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Pedidos em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderCozinha = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        <ChefHat className="inline w-8 h-8 mr-2" />
        Cozinha
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Cozinha em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderBalcao = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        <Wine className="inline w-8 h-8 mr-2" />
        Balcão / Bar
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Balcão em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderCardapio = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Cardápio
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Cardápio em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        <Truck className="inline w-8 h-8 mr-2" />
        Delivery
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Delivery em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderEstoque = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Estoque
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Estoque em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderFuncionarios = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Funcionários
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
    case 'mesas':
      return renderMesas();
    case 'pedidos':
      return renderPedidos();
    case 'cozinha':
      return renderCozinha();
    case 'balcao':
      return renderBalcao();
    case 'cardapio':
      return renderCardapio();
    case 'delivery':
      return renderDelivery();
    case 'estoque':
      return renderEstoque();
    case 'funcionarios':
      return renderFuncionarios();
    case 'relatorios':
      return renderRelatorios();
    default:
      return renderDashboard();
  }
};

export default RestauranteDashboard;
