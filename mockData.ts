import { Company, User, Product, Employee, Table } from './types';

// Sistema inicia sem empresas - Apenas Super Admin pode criar
export const mockCompanies: Company[] = [];

// Apenas o Super Admin está pré-cadastrado
// Todas as outras contas serão criadas pelo Super Admin
export const mockUsers: User[] = [];

// Produtos serão criados por cada empresa após cadastro
export const mockProductsPadaria: Product[] = [];
export const mockProductsRestaurante: Product[] = [];
export const mockProductsMinimercado: Product[] = [];

// Mesas serão configuradas por cada empresa
export const mockTables: Table[] = [];

// Funcionários serão cadastrados por cada empresa
export const mockEmployees: Employee[] = [];
