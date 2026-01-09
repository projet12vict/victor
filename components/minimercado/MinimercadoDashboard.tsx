import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ShoppingBag,
  Truck,
  Store,
  Plus,
  Search,
  Minus,
  X
} from 'lucide-react';
import { Company, Product, Order, Customer } from '../../types';
import { mockProductsMinimercado } from '../../mockData';

interface MinimercadoDashboardProps {
  company: Company;
  currentModule: string;
}

const MinimercadoDashboard: React.FC<MinimercadoDashboardProps> = ({ company, currentModule }) => {
  const [products] = useState<Product[]>(mockProductsMinimercado);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    vendasHoje: company.currency + ' 3,450',
    produtosVendidos: 127,
    clientesHoje: 45,
    estoqueTotal: products.reduce((sum, p) => sum + p.stock, 0)
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const existing = cart.find(item => item.product.id === productId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.product.id !== productId));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const renderDashboard = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Dashboard - Minimercado
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Vendas Hoje</h3>
          <p className="text-3xl font-bold mt-2">{stats.vendasHoje}</p>
          <p className="text-xs opacity-75 mt-1">+22% vs ontem</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Produtos Vendidos</h3>
          <p className="text-3xl font-bold mt-2">{stats.produtosVendidos}</p>
          <p className="text-xs opacity-75 mt-1">itens hoje</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Clientes Hoje</h3>
          <p className="text-3xl font-bold mt-2">{stats.clientesHoje}</p>
          <p className="text-xs opacity-75 mt-1">+8 novos</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8" />
            <ShoppingBag className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-sm font-medium opacity-90">Estoque Total</h3>
          <p className="text-3xl font-bold mt-2">{stats.estoqueTotal}</p>
          <p className="text-xs opacity-75 mt-1">unidades</p>
        </div>
      </div>

      {/* Produtos Mais Vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Produtos Mais Vendidos</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{company.currency}{product.price}</p>
                  <p className="text-xs text-gray-500">{product.stock} em estoque</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ação Rápida</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition border-2 border-blue-200">
              <ShoppingCart className="w-10 h-10 text-blue-600 mb-2" />
              <span className="font-semibold text-gray-800">Nova Venda</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition border-2 border-green-200">
              <Plus className="w-10 h-10 text-green-600 mb-2" />
              <span className="font-semibold text-gray-800">Novo Produto</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition border-2 border-purple-200">
              <Package className="w-10 h-10 text-purple-600 mb-2" />
              <span className="font-semibold text-gray-800">Entrada Estoque</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition border-2 border-orange-200">
              <Users className="w-10 h-10 text-orange-600 mb-2" />
              <span className="font-semibold text-gray-800">Novo Cliente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPDV = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Frente de Caixa - PDV
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produtos */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar produto..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
            {products
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{product.code}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock > product.minStock
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock} un
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                  <p className="text-xl font-bold text-blue-600">
                    {company.currency}{product.price.toFixed(2)}
                  </p>
                </button>
              ))}
          </div>
        </div>

        {/* Carrinho */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Carrinho</h2>
          
          <div className="flex-1 overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart className="w-16 h-16 mb-3" />
                <p className="text-sm">Carrinho vazio</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-gray-800">{item.product.name}</h4>
                      <button
                        onClick={() => setCart(cart.filter(i => i.product.id !== item.product.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-800 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="w-7 h-7 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-bold text-blue-600">
                        {company.currency}{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-800">{company.currency}{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-blue-600">{company.currency}{cartTotal.toFixed(2)}</span>
            </div>
            <button
              disabled={cart.length === 0}
              className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition text-lg"
            >
              Finalizar Venda
            </button>
            <button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              className="w-full py-2 border-2 border-red-500 text-red-500 hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed font-semibold rounded-lg transition"
            >
              Limpar Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProdutos = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Gestão de Produtos
        </h1>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.code}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {company.currency}{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      product.stock > product.minStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

  const renderEcommerce = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        <Store className="inline w-8 h-8 mr-2" />
        E-commerce
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de E-commerce em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderPedidosOnline = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        <Truck className="inline w-8 h-8 mr-2" />
        Pedidos Online
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Pedidos Online em desenvolvimento...</p>
      </div>
    </div>
  );

  const renderClientes = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Clientes
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo de Clientes em desenvolvimento...</p>
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

  const renderFinanceiro = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Financeiro
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">Módulo Financeiro em desenvolvimento...</p>
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
    case 'produtos':
      return renderProdutos();
    case 'estoque':
      return renderEstoque();
    case 'pdv':
      return renderPDV();
    case 'ecommerce':
      return renderEcommerce();
    case 'pedidos-online':
      return renderPedidosOnline();
    case 'clientes':
      return renderClientes();
    case 'funcionarios':
      return renderFuncionarios();
    case 'financeiro':
      return renderFinanceiro();
    case 'relatorios':
      return renderRelatorios();
    default:
      return renderDashboard();
  }
};

export default MinimercadoDashboard;
