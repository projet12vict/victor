
// Enums for Core Logic
export enum CompanyType {
    RESTAURANT = 'RESTAURANT',
    SUPERMARKET = 'SUPERMARKET',
    MIXED = 'MIXED'
}

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    COMPANY_ADMIN = 'COMPANY_ADMIN',
    CASHIER = 'CASHIER',
    WAITER = 'WAITER',
    KITCHEN = 'KITCHEN'
}

export enum TableStatus {
    FREE = 'FREE',
    OCCUPIED = 'OCCUPIED',
    RESERVED = 'RESERVED',
    PAYMENT = 'PAYMENT'
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PREPARING = 'PREPARING', // Na cozinha
    READY = 'READY',         // Pronto na cozinha, aguardando garçom
    DELIVERED = 'DELIVERED', // Entregue na mesa
    COMPLETED = 'COMPLETED'  // Pago
}

// Domain Models
export interface Company {
    id: number;
    name: string;
    type: CompanyType;
    logoUrl?: string;
    isActive: boolean;
    plan: 'BASIC' | 'PREMIUM';
    createdAt: string;
}

export interface Product {
    id: number;
    companyId: number;
    name: string;
    price: number;
    category: string;
    description?: string;
    stock?: number; // Nullable for restaurants effectively, or tracked for ingredients
    barcode?: string;
    image?: string;
}

export interface Table {
    id: number;
    companyId: number;
    number: number;
    status: TableStatus;
    capacity: number;
    currentOrderId?: number; // Link to active order
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    observation?: string;
}

export interface Order {
    id: number;
    companyId: number;
    tableId?: number; // Null for supermarket
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
    type: 'DINE_IN' | 'TAKE_AWAY' | 'RETAIL';
}

export interface User {
    id: number;
    companyId?: number; // Null for Super Admin
    name: string;
    role: UserRole;
    email: string;
    password?: string; // Added for authentication simulation
}

export interface ActivationCode {
    id: number;
    code: string;
    plan: 'BASIC' | 'PREMIUM';
    status: 'UNUSED' | 'USED';
    generatedAt: Date;
}
