import { Company, CompanyType, Product, Table, TableStatus, User, UserRole } from './types';

// Mock Companies (Tenants)
export const MOCK_COMPANIES: Company[] = [
    {
        id: 1,
        name: 'V&C Bistro & Grill',
        type: CompanyType.RESTAURANT,
        isActive: true,
        plan: 'PREMIUM',
        createdAt: '2023-01-15',
        logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 2,
        name: 'Supermercado Central',
        type: CompanyType.SUPERMARKET,
        isActive: true,
        plan: 'BASIC',
        createdAt: '2023-03-10',
        logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 3,
        name: 'Gourmet Market & Café',
        type: CompanyType.MIXED,
        isActive: true,
        plan: 'PREMIUM',
        createdAt: '2023-05-22',
        logoUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 4,
        name: 'Tia Maria Petiscos',
        type: CompanyType.RESTAURANT,
        isActive: true,
        plan: 'BASIC',
        createdAt: '2023-06-10',
        logoUrl: ''
    },
    {
        id: 5,
        name: 'Minimercado da Esquina',
        type: CompanyType.SUPERMARKET,
        isActive: true,
        plan: 'BASIC',
        createdAt: '2023-07-01',
        logoUrl: ''
    },
    {
        id: 6,
        name: 'Sushi Lounge Premium',
        type: CompanyType.RESTAURANT,
        isActive: false,
        plan: 'PREMIUM',
        createdAt: '2023-08-15',
        logoUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 7,
        name: 'Padaria Pão Quente',
        type: CompanyType.MIXED,
        isActive: true,
        plan: 'BASIC',
        createdAt: '2023-09-05',
        logoUrl: ''
    },
    {
        id: 8,
        name: 'Burger King Clone',
        type: CompanyType.RESTAURANT,
        isActive: true,
        plan: 'PREMIUM',
        createdAt: '2023-10-20',
        logoUrl: ''
    },
    {
        id: 9,
        name: 'Hipermercado Global',
        type: CompanyType.SUPERMARKET,
        isActive: true,
        plan: 'PREMIUM',
        createdAt: '2023-11-11',
        logoUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 10,
        name: 'Gelataria Fina',
        type: CompanyType.RESTAURANT,
        isActive: true,
        plan: 'BASIC',
        createdAt: '2023-12-01',
        logoUrl: ''
    }
];

// Mock Users
export const MOCK_USERS: User[] = [
    { id: 1, companyId: undefined, name: 'Super Admin', email: 'admin@system.com', role: UserRole.SUPER_ADMIN, password: '123' },
    { id: 2, companyId: 1, name: 'Gerente Bistro', email: 'gerente@bistro.com', role: UserRole.COMPANY_ADMIN, password: '123' },
    { id: 3, companyId: 2, name: 'Gerente Mercado', email: 'gerente@mercado.com', role: UserRole.COMPANY_ADMIN, password: '123' },
];

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
    // Restaurant Products (Company 1)
    { id: 101, companyId: 1, name: 'Bife à Portuguesa', price: 18.50, category: 'Main', description: 'Com molho de cerveja e ovo', image: 'https://picsum.photos/200/200?random=1' },
    { id: 102, companyId: 1, name: 'Bacalhau à Brás', price: 16.00, category: 'Main', description: 'Clássico tradicional', image: 'https://picsum.photos/200/200?random=2' },
    { id: 103, companyId: 1, name: 'Vinho Tinto Douro', price: 22.00, category: 'Drinks', description: 'Garrafa 750ml', image: 'https://picsum.photos/200/200?random=3' },
    { id: 104, companyId: 1, name: 'Mousse de Chocolate', price: 4.50, category: 'Dessert', description: 'Caseira', image: 'https://picsum.photos/200/200?random=4' },

    // Supermarket Products (Company 2)
    { id: 201, companyId: 2, name: 'Arroz Carolino 1kg', price: 1.25, category: 'Grocery', stock: 50, barcode: '560123001' },
    { id: 202, companyId: 2, name: 'Leite Meio Gordo 1L', price: 0.95, category: 'Dairy', stock: 120, barcode: '560123002' },
    { id: 203, companyId: 2, name: 'Azeite Virgem Extra', price: 6.50, category: 'Grocery', stock: 30, barcode: '560123003' },
    { id: 204, companyId: 2, name: 'Detergente Roupa', price: 12.99, category: 'Cleaning', stock: 15, barcode: '560123004' },
    { id: 205, companyId: 2, name: 'Maçã Golden (kg)', price: 1.99, category: 'Fresh', stock: 200, barcode: '560123005' },
];

// Mock Tables (for Restaurants)
export const MOCK_TABLES: Table[] = [
    { id: 1, companyId: 1, number: 1, capacity: 2, status: TableStatus.FREE },
    { id: 2, companyId: 1, number: 2, capacity: 4, status: TableStatus.OCCUPIED, currentOrderId: 901 },
    { id: 3, companyId: 1, number: 3, capacity: 4, status: TableStatus.FREE },
    { id: 4, companyId: 1, number: 4, capacity: 6, status: TableStatus.RESERVED },
    { id: 5, companyId: 1, number: 5, capacity: 2, status: TableStatus.PAYMENT, currentOrderId: 902 },
    { id: 6, companyId: 1, number: 6, capacity: 8, status: TableStatus.FREE },
];