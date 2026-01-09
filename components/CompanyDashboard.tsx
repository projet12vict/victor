import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  ChefHat,
  UtensilsCrossed,
  Store,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { User, Company } from '../types';

// Importar módulos específicos
import PadariaDashboard from './padaria/PadariaDashboard';
import RestauranteDashboard from './restaurante/RestauranteDashboard';
import MinimercadoDashboard from './minimercado/MinimercadoDashboard';

interface CompanyDashboardProps {
  user: User;
  company: Company;
  onLogout: () => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ user, company, onLogout }) => {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Menus específicos por tipo de empresa
  const getMenuItems = (): MenuItem[] => {
    switch (company.type) {
      case 'padaria':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'producao', label: 'Produção', icon: <ChefHat className="w-5 h-5" /> },
          { id: 'materia-prima', label: 'Matéria-Prima', icon: <Package className="w-5 h-5" /> },
          { id: 'receitas', label: 'Receitas', icon: <FileText className="w-5 h-5" /> },
          { id: 'estoque', label: 'Estoque', icon: <Store className="w-5 h-5" /> },
          { id: 'vendas', label: 'Vendas / PDV', icon: <ShoppingCart className="w-5 h-5" /> },
          { id: 'funcionarios', label: 'Funcionários', icon: <Users className="w-5 h-5" /> },
          { id: 'relatorios', label: 'Relatórios', icon: <FileText className="w-5 h-5" /> },
        ];
      
      case 'restaurante':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'mesas', label: 'Mesas', icon: <UtensilsCrossed className="w-5 h-5" /> },
          { id: 'pedidos', label: 'Pedidos', icon: <FileText className="w-5 h-5" /> },
          { id: 'cozinha', label: 'Cozinha', icon: <ChefHat className="w-5 h-5" /> },
          { id: 'balcao', label: 'Balcão / Bar', icon: <Store className="w-5 h-5" /> },
          { id: 'cardapio', label: 'Cardápio', icon: <FileText className="w-5 h-5" /> },
          { id: 'delivery', label: 'Delivery', icon: <Truck className="w-5 h-5" /> },
          { id: 'estoque', label: 'Estoque', icon: <Package className="w-5 h-5" /> },
          { id: 'funcionarios', label: 'Funcionários', icon: <Users className="w-5 h-5" /> },
          { id: 'relatorios', label: 'Relatórios', icon: <FileText className="w-5 h-5" /> },
        ];
      
      case 'minimercado':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'produtos', label: 'Produtos', icon: <ShoppingBag className="w-5 h-5" /> },
          { id: 'estoque', label: 'Estoque', icon: <Package className="w-5 h-5" /> },
          { id: 'pdv', label: 'Frente de Caixa', icon: <ShoppingCart className="w-5 h-5" /> },
          { id: 'ecommerce', label: 'E-commerce', icon: <Store className="w-5 h-5" /> },
          { id: 'pedidos-online', label: 'Pedidos Online', icon: <Truck className="w-5 h-5" /> },
          { id: 'clientes', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
          { id: 'funcionarios', label: 'Funcionários', icon: <Users className="w-5 h-5" /> },
          { id: 'financeiro', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" /> },
          { id: 'relatorios', label: 'Relatórios', icon: <FileText className="w-5 h-5" /> },
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const renderContent = () => {
    switch (company.type) {
      case 'padaria':
        return <PadariaDashboard company={company} currentModule={currentModule} />;
      case 'restaurante':
        return <RestauranteDashboard company={company} currentModule={currentModule} />;
      case 'minimercado':
        return <MinimercadoDashboard company={company} currentModule={currentModule} />;
      default:
        return <div>Tipo de empresa não suportado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo e Nome da Empresa */}
          <div className="p-6 border-b border-blue-600">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={company.logo || '/logo.png'}
                alt={company.name}
                className="w-12 h-12 rounded-lg object-cover bg-white p-1"
              />
              <div className="flex-1">
                <h2 className="font-bold text-lg leading-tight">{company.name}</h2>
                <p className="text-xs text-blue-200">
                  {company.type.charAt(0).toUpperCase() + company.type.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-200">Usuário:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentModule(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 mb-1
                  ${currentModule === item.id
                    ? 'bg-white text-blue-900 shadow-lg font-semibold'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-blue-600">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header Mobile */}
        <header className="lg:hidden bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="font-bold text-gray-800">{company.name}</h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanyDashboard;
