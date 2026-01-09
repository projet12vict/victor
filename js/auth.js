// ====================================
// SISTEMA DE AUTENTICAÇÃO
// ====================================

class AuthManager {
    constructor() {
        this.setupLoginForm();
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Limpar erro anterior
        this.hideError();

        // Validar campos
        if (!email || !password) {
            this.showError('Por favor, preencha todos os campos');
            return;
        }

        // Verificar se é super-admin
        if (email === CONFIG.superAdmin.email && password === CONFIG.superAdmin.password) {
            this.loginSuperAdmin();
            return;
        }

        // Verificar login de empresa
        this.loginCompany(email, password);
    }

    loginSuperAdmin() {
        const user = {
            id: 'super_admin',
            name: 'Super Administrador',
            email: CONFIG.superAdmin.email,
            role: 'super_admin',
            loginAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        Utils.showNotification('Login realizado com sucesso!', 'success');
        
        setTimeout(() => {
            window.location.href = 'super-admin.html';
        }, 500);
    }

    loginCompany(email, password) {
        const companies = JSON.parse(localStorage.getItem('companies') || '[]');
        
        // Procurar empresa com esse email e senha
        const company = companies.find(c => 
            c.email === email && 
            c.password === password && 
            c.status === 'active'
        );

        if (!company) {
            this.showError('Email ou senha incorretos, ou empresa inativa');
            return;
        }

        // Criar sessão da empresa
        const user = {
            id: company.id,
            name: company.adminName,
            email: company.email,
            role: 'admin',
            companyId: company.id,
            loginAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentCompany', JSON.stringify(company));
        
        Utils.showNotification('Login realizado com sucesso!', 'success');
        
        // Redirecionar para dashboard da empresa
        setTimeout(() => {
            this.redirectToDashboard(company.type);
        }, 500);
    }

    redirectToDashboard(companyType) {
        switch(companyType) {
            case 'padaria':
                window.location.href = 'padaria.html';
                break;
            case 'restaurante':
                window.location.href = 'restaurante.html';
                break;
            case 'minimercado':
                window.location.href = 'minimercado.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    static logout() {
        Utils.confirmDialog('Deseja realmente sair?', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentCompany');
            window.location.href = 'index.html';
        });
    }

    static requireAuth() {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            window.location.href = 'index.html';
            return null;
        }
        return JSON.parse(user);
    }

    static requireCompany() {
        const company = localStorage.getItem('currentCompany');
        if (!company) {
            window.location.href = 'index.html';
            return null;
        }
        return JSON.parse(company);
    }

    static isSuperAdmin() {
        const user = this.requireAuth();
        return user && user.role === 'super_admin';
    }

    static isCompanyAdmin() {
        const user = this.requireAuth();
        return user && user.role === 'admin';
    }
}

// Inicializar autenticação se estiver na página de login
if (document.getElementById('loginForm')) {
    new AuthManager();
}

// Expor globalmente
window.AuthManager = AuthManager;
