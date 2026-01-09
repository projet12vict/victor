import { Company, User, Product, Employee, Table, Order } from './types';

// Empresas Mockadas
export const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'Padaria Pão Quente',
    logo: '/logo.png',
    type: 'padaria',
    currency: '€',
    active: true,
    planActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    lastPayment: '2026-01-01T10:00:00Z',
    nextPayment: '2026-02-01T10:00:00Z',
    monthlyFee: 50
  },
  {
    id: 'company-2',
    name: 'Restaurante Sabor da Terra',
    logo: '/logo.png',
    type: 'restaurante',
    currency: '€',
    active: true,
    planActive: true,
    createdAt: '2024-02-10T10:00:00Z',
    lastPayment: '2026-01-01T10:00:00Z',
    nextPayment: '2026-02-01T10:00:00Z',
    monthlyFee: 75
  },
  {
    id: 'company-3',
    name: 'Minimercado Central',
    logo: '/logo.png',
    type: 'minimercado',
    currency: '$',
    active: true,
    planActive: true,
    createdAt: '2024-03-05T10:00:00Z',
    lastPayment: '2026-01-01T10:00:00Z',
    nextPayment: '2026-02-01T10:00:00Z',
    monthlyFee: 60
  }
];

// Usuários Mockados
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin Padaria',
    email: 'admin@padaria.com',
    password: 'padaria123',
    role: 'admin',
    companyId: 'company-1',
    createdAt: '2024-01-15T10:00:00Z',
    active: true
  },
  {
    id: 'user-2',
    name: 'Admin Restaurante',
    email: 'admin@restaurante.com',
    password: 'restaurante123',
    role: 'admin',
    companyId: 'company-2',
    createdAt: '2024-02-10T10:00:00Z',
    active: true
  },
  {
    id: 'user-3',
    name: 'Admin Minimercado',
    email: 'admin@mercado.com',
    password: 'mercado123',
    role: 'admin',
    companyId: 'company-3',
    createdAt: '2024-03-05T10:00:00Z',
    active: true
  },
  {
    id: 'user-4',
    name: 'João Silva',
    email: 'joao@padaria.com',
    password: 'funcionario123',
    role: 'employee',
    companyId: 'company-1',
    createdAt: '2024-01-20T10:00:00Z',
    active: true
  }
];

// Produtos Mockados - Padaria
export const mockProductsPadaria: Product[] = [
  {
    id: 'prod-p-1',
    companyId: 'company-1',
    name: 'Pão Francês',
    description: 'Pão crocante tradicional',
    code: 'PAO-001',
    category: 'Pães',
    price: 0.50,
    cost: 0.20,
    stock: 150,
    minStock: 50,
    unit: 'unidade',
    active: true,
    isRawMaterial: false,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'prod-p-2',
    companyId: 'company-1',
    name: 'Croissant',
    description: 'Croissant de manteiga',
    code: 'PAO-002',
    category: 'Pães',
    price: 1.50,
    cost: 0.60,
    stock: 80,
    minStock: 30,
    unit: 'unidade',
    active: true,
    isRawMaterial: false,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'prod-p-3',
    companyId: 'company-1',
    name: 'Farinha de Trigo',
    description: 'Farinha tipo 55',
    code: 'MP-001',
    category: 'Matéria-Prima',
    price: 0,
    cost: 15.00,
    stock: 500,
    minStock: 100,
    unit: 'kg',
    active: true,
    isRawMaterial: true,
    createdAt: '2024-01-15T10:00:00Z'
  }
];

// Produtos Mockados - Restaurante
export const mockProductsRestaurante: Product[] = [
  {
    id: 'prod-r-1',
    companyId: 'company-2',
    name: 'Bacalhau à Brás',
    description: 'Tradicional prato português',
    code: 'COM-001',
    category: 'Pratos Principais',
    price: 12.50,
    cost: 5.00,
    stock: 0,
    minStock: 0,
    unit: 'porção',
    active: true,
    createdAt: '2024-02-10T10:00:00Z'
  },
  {
    id: 'prod-r-2',
    companyId: 'company-2',
    name: 'Coca-Cola',
    description: 'Refrigerante 330ml',
    code: 'BEB-001',
    category: 'Bebidas',
    price: 2.00,
    cost: 0.80,
    stock: 200,
    minStock: 50,
    unit: 'unidade',
    active: true,
    createdAt: '2024-02-10T10:00:00Z'
  }
];

// Produtos Mockados - Minimercado
export const mockProductsMinimercado: Product[] = [
  {
    id: 'prod-m-1',
    companyId: 'company-3',
    name: 'Arroz Branco 1kg',
    code: 'ALI-001',
    category: 'Mercearia',
    price: 1.50,
    cost: 0.90,
    stock: 150,
    minStock: 30,
    unit: 'unidade',
    active: true,
    createdAt: '2024-03-05T10:00:00Z'
  },
  {
    id: 'prod-m-2',
    companyId: 'company-3',
    name: 'Leite UHT 1L',
    code: 'LAT-001',
    category: 'Lacticínios',
    price: 0.90,
    cost: 0.60,
    stock: 200,
    minStock: 40,
    unit: 'unidade',
    active: true,
    createdAt: '2024-03-05T10:00:00Z'
  }
];

// Mesas Mockadas - Restaurante
export const mockTables: Table[] = [
  {
    id: 'table-1',
    companyId: 'company-2',
    number: 1,
    capacity: 4,
    status: 'livre',
    orders: []
  },
  {
    id: 'table-2',
    companyId: 'company-2',
    number: 2,
    capacity: 2,
    status: 'livre',
    orders: []
  },
  {
    id: 'table-3',
    companyId: 'company-2',
    number: 3,
    capacity: 6,
    status: 'livre',
    orders: []
  },
  {
    id: 'table-4',
    companyId: 'company-2',
    number: 4,
    capacity: 4,
    status: 'livre',
    orders: []
  },
  {
    id: 'table-5',
    companyId: 'company-2',
    number: 5,
    capacity: 2,
    status: 'livre',
    orders: []
  },
  {
    id: 'table-6',
    companyId: 'company-2',
    number: 6,
    capacity: 8,
    status: 'livre',
    orders: []
  }
];

// Funcionários Mockados
export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    companyId: 'company-1',
    name: 'João Silva',
    email: 'joao@padaria.com',
    phone: '+238 9876543',
    role: 'Padeiro',
    permissions: ['producao', 'vendas'],
    salary: 25000,
    active: true,
    createdAt: '2024-01-20T10:00:00Z',
    timeRecords: []
  },
  {
    id: 'emp-2',
    companyId: 'company-2',
    name: 'Maria Santos',
    email: 'maria@restaurante.com',
    phone: '+238 9876544',
    role: 'Cozinheira',
    permissions: ['cozinha'],
    salary: 30000,
    active: true,
    createdAt: '2024-02-15T10:00:00Z',
    timeRecords: []
  },
  {
    id: 'emp-3',
    companyId: 'company-3',
    name: 'Pedro Costa',
    email: 'pedro@mercado.com',
    phone: '+238 9876545',
    role: 'Caixa',
    permissions: ['vendas', 'caixa'],
    salary: 22000,
    active: true,
    createdAt: '2024-03-10T10:00:00Z',
    timeRecords: []
  }
];
