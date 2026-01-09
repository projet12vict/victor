// ====================================
// SISTEMA MULTIEMPRESAS - APP PRINCIPAL
// ====================================

// Configuração do Sistema
const CONFIG = {
    appName: 'Sistema MultiEmpresas',
    version: '1.0.0',
    superAdmin: {
        email: 'victorallissson@gmail.com',
        password: 'H1victoria@02'
    }
};

// Classe principal do App
class App {
    constructor() {
        this.currentUser = null;
        this.currentCompany = null;
        this.init();
    }

    init() {
        // Carregar dados do localStorage
        this.loadUserSession();
        
        // Verificar se está na página de login
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            return; // Não fazer nada na página de login
        }
        
        // Verificar autenticação
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        // Renderizar dashboard apropriado
        this.renderDashboard();
    }

    loadUserSession() {
        const user = localStorage.getItem('currentUser');
        const company = localStorage.getItem('currentCompany');
        
        if (user) {
            this.currentUser = JSON.parse(user);
        }
        
        if (company) {
            this.currentCompany = JSON.parse(company);
        }
    }

    saveUserSession() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        if (this.currentCompany) {
            localStorage.setItem('currentCompany', JSON.stringify(this.currentCompany));
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentCompany');
        window.location.href = 'index.html';
    }

    renderDashboard() {
        // Implementado em cada página específica
    }
}

// Classe de Gerenciamento de Storage (Multi-tenant)
class Storage {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        // Inicializar storage se não existir
        if (!localStorage.getItem('companies')) {
            localStorage.setItem('companies', JSON.stringify([]));
        }
        if (!localStorage.getItem('employees')) {
            localStorage.setItem('employees', JSON.stringify([]));
        }
        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify([]));
        }
        if (!localStorage.getItem('sales')) {
            localStorage.setItem('sales', JSON.stringify([]));
        }
        if (!localStorage.getItem('production')) {
            localStorage.setItem('production', JSON.stringify([]));
        }
        if (!localStorage.getItem('stock')) {
            localStorage.setItem('stock', JSON.stringify([]));
        }
        if (!localStorage.getItem('orders')) {
            localStorage.setItem('orders', JSON.stringify([]));
        }
        if (!localStorage.getItem('tables')) {
            localStorage.setItem('tables', JSON.stringify([]));
        }
        if (!localStorage.getItem('timesheet')) {
            localStorage.setItem('timesheet', JSON.stringify([]));
        }
    }

    // Métodos genéricos para CRUD com isolamento de empresa
    getAll(collection, companyId = null) {
        const data = JSON.parse(localStorage.getItem(collection) || '[]');
        
        // Se for super-admin, retorna tudo
        if (!companyId) {
            return data;
        }
        
        // Filtrar por empresa
        return data.filter(item => item.companyId === companyId);
    }

    getById(collection, id, companyId = null) {
        const data = this.getAll(collection, companyId);
        return data.find(item => item.id === id);
    }

    create(collection, item, companyId) {
        const data = JSON.parse(localStorage.getItem(collection) || '[]');
        
        item.id = this.generateId();
        item.companyId = companyId;
        item.createdAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();
        
        data.push(item);
        localStorage.setItem(collection, JSON.stringify(data));
        
        return item;
    }

    update(collection, id, updates, companyId) {
        const data = JSON.parse(localStorage.getItem(collection) || '[]');
        const index = data.findIndex(item => item.id === id && item.companyId === companyId);
        
        if (index !== -1) {
            data[index] = {
                ...data[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(collection, JSON.stringify(data));
            return data[index];
        }
        
        return null;
    }

    delete(collection, id, companyId) {
        let data = JSON.parse(localStorage.getItem(collection) || '[]');
        data = data.filter(item => !(item.id === id && item.companyId === companyId));
        localStorage.setItem(collection, JSON.stringify(data));
        return true;
    }

    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Classe de Utilidades
class Utils {
    static formatCurrency(value, currency = '€') {
        const formatted = parseFloat(value).toFixed(2);
        return currency === '€' ? `${formatted}€` : `${formatted}$`;
    }

    static formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    static formatDateTime(date) {
        const d = new Date(date);
        const dateStr = this.formatDate(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${dateStr} ${hours}:${minutes}`;
    }

    static showNotification(message, type = 'success') {
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'danger' ? 'exclamation-circle' : 
                     type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static confirmDialog(message, onConfirm) {
        if (confirm(message)) {
            onConfirm();
        }
    }

    static generateRandomColor() {
        const colors = [
            '#2563eb', '#7c3aed', '#10b981', '#ef4444', 
            '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static calculatePercentage(part, total) {
        if (total === 0) return 0;
        return ((part / total) * 100).toFixed(1);
    }

    static searchInArray(array, searchTerm, fields) {
        const term = searchTerm.toLowerCase();
        return array.filter(item => {
            return fields.some(field => {
                const value = item[field];
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    }

    static sortArray(array, field, order = 'asc') {
        return array.sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            
            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    static exportToCSV(data, filename) {
        if (data.length === 0) {
            this.showNotification('Não há dados para exportar', 'warning');
            return;
        }

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    static printElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Impressão</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                        th { background: #f0f0f0; }
                    </style>
                </head>
                <body>
                    ${element.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Validações
class Validator {
    static isEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static isNotEmpty(value) {
        return value && value.trim().length > 0;
    }

    static isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    static isPositive(value) {
        return this.isNumber(value) && parseFloat(value) > 0;
    }

    static minLength(value, min) {
        return value && value.length >= min;
    }

    static maxLength(value, max) {
        return value && value.length <= max;
    }

    static isPhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 9;
    }

    static validateForm(formData, rules) {
        const errors = {};

        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = formData[field];

            if (fieldRules.required && !this.isNotEmpty(value)) {
                errors[field] = 'Campo obrigatório';
                continue;
            }

            if (fieldRules.email && !this.isEmail(value)) {
                errors[field] = 'Email inválido';
                continue;
            }

            if (fieldRules.number && !this.isNumber(value)) {
                errors[field] = 'Deve ser um número';
                continue;
            }

            if (fieldRules.positive && !this.isPositive(value)) {
                errors[field] = 'Deve ser maior que zero';
                continue;
            }

            if (fieldRules.minLength && !this.minLength(value, fieldRules.minLength)) {
                errors[field] = `Mínimo de ${fieldRules.minLength} caracteres`;
                continue;
            }

            if (fieldRules.maxLength && !this.maxLength(value, fieldRules.maxLength)) {
                errors[field] = `Máximo de ${fieldRules.maxLength} caracteres`;
                continue;
            }

            if (fieldRules.phone && !this.isPhone(value)) {
                errors[field] = 'Telefone inválido';
                continue;
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Modal Manager
class ModalManager {
    static show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    static hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    static create(title, content, buttons = []) {
        const modalId = 'modal_' + Date.now();
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        
        const buttonsHTML = buttons.map(btn => 
            `<button class="btn btn-${btn.type || 'primary'}" onclick="${btn.onclick}">${btn.text}</button>`
        ).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="ModalManager.hide('${modalId}')">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttonsHTML}
                    <button class="btn btn-secondary" onclick="ModalManager.hide('${modalId}')">Fechar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.show(modalId);
        
        return modalId;
    }
}

// Instanciar classes globais
const storage = new Storage();
const app = new App();

// Expor globalmente
window.App = App;
window.Storage = Storage;
window.Utils = Utils;
window.Validator = Validator;
window.ModalManager = ModalManager;
window.storage = storage;
window.app = app;
