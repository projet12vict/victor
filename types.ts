// Sistema Multiempresas - Tipos TypeScript

export type CompanyType = 'padaria' | 'restaurante' | 'minimercado';
export type Currency = '€' | '$';
export type UserRole = 'super-admin' | 'admin' | 'employee';
export type ProductionStatus = 'materia-prima' | 'armazenamento' | 'preparacao' | 'producao' | 'embalagem' | 'aprovacao' | 'estoque' | 'disponivel';
export type OrderStatus = 'pendente' | 'em-preparo' | 'pronto' | 'entregue' | 'cancelado';
export type PaymentMethod = 'dinheiro' | 'cartao' | 'mbway' | 'transferencia';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId?: string;
  createdAt: string;
  active: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  type: CompanyType;
  currency: Currency;
  active: boolean;
  planActive: boolean;
  createdAt: string;
  lastPayment?: string;
  nextPayment?: string;
  monthlyFee: number;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  image?: string;
  code: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  minStock: number;
  unit: string;
  active: boolean;
  isRawMaterial?: boolean;
  createdAt: string;
}

export interface Recipe {
  id: string;
  companyId: string;
  productId: string;
  name: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  prepTime: number;
  yield: number;
  createdAt: string;
}

export interface RecipeIngredient {
  productId: string;
  quantity: number;
  unit: string;
}

export interface ProductionBatch {
  id: string;
  companyId: string;
  recipeId: string;
  productId: string;
  quantity: number;
  status: ProductionStatus;
  startedAt: string;
  completedAt?: string;
  employeeId: string;
  notes?: string;
}

export interface Table {
  id: string;
  companyId: string;
  number: number;
  capacity: number;
  status: 'livre' | 'ocupada' | 'reservada';
  orders: Order[];
}

export interface Order {
  id: string;
  companyId: string;
  tableId?: string;
  customerId?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  isPaid: boolean;
  isDelivery: boolean;
  deliveryAddress?: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  type: 'comida' | 'bebida';
  status: OrderStatus;
  notes?: string;
}

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  salary: number;
  active: boolean;
  createdAt: string;
  timeRecords: TimeRecord[];
}

export interface TimeRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  hoursWorked?: number;
}

export interface Sale {
  id: string;
  companyId: string;
  orderId: string;
  total: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  employeeId: string;
  createdAt: string;
  items: OrderItem[];
}

export interface StockMovement {
  id: string;
  companyId: string;
  productId: string;
  type: 'entrada' | 'saida' | 'ajuste';
  quantity: number;
  reason: string;
  employeeId: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  activeCustomers: number;
  lowStockItems: number;
  pendingOrders: number;
}
