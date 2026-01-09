// ====================================
// SUPER ADMIN - GESTÃO DE EMPRESAS
// ====================================

class SuperAdmin {
    constructor() {
        // Verificar autenticação
        this.currentUser = AuthManager.requireAuth();
        if (!this.currentUser || this.currentUser.role !== 'super_admin') {
            window.location.href = 'index.html';
            return;
        }

        this.init();
    }

    init() {
        this.loadDashboard();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Fechar modal ao clicar fora
        document.getElementById('companyModal').addEventListener('click', (e) => {
            if (e.target.id === 'companyModal') {
                closeCompanyModal();
            }
        });
    }

    loadDashboard() {
        const companies = storage.getAll('companies');
        
        // Estatísticas
        const totalCompanies = companies.length;
        const activeCompanies = companies.filter(c => c.status === 'active').length;
        const inactiveCompanies = companies.filter(c => c.status === 'inactive').length;

        document.getElementById('totalCompanies').textContent = totalCompanies;
        document.getElementById('activeCompanies').textContent = activeCompanies;
        document.getElementById('companiesCount').textContent = totalCompanies;

        // Calcular faturamento total (simulado)
        const totalRevenue = companies.reduce((sum, c) => sum + (c.monthlyRevenue || 0), 0);
        document.getElementById('totalRevenue').textContent = Utils.formatCurrency(totalRevenue);

        // Pagamentos pendentes (simulado)
        const pendingPayments = companies.filter(c => c.paymentStatus === 'pending').length;
        document.getElementById('pendingPaymentsCount').textContent = pendingPayments;
        document.getElementById('pendingPayments').textContent = pendingPayments;

        // Carregar empresas por tipo
        this.loadCompaniesByType(companies);

        // Carregar atividades recentes
        this.loadRecentActivities();
    }

    loadCompaniesByType(companies) {
        const byType = {
            padaria: companies.filter(c => c.type === 'padaria').length,
            restaurante: companies.filter(c => c.type === 'restaurante').length,
            minimercado: companies.filter(c => c.type === 'minimercado').length
        };

        const container = document.getElementById('companiesByType');
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
                <div>
                    <div style="font-size: 48px; color: var(--primary-color);">
                        <i class="fas fa-bread-slice"></i>
                    </div>
                    <h3 style="font-size: 32px; margin: 10px 0;">${byType.padaria}</h3>
                    <p style="color: var(--text-secondary);">Padarias</p>
                </div>
                <div>
                    <div style="font-size: 48px; color: var(--success-color);">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <h3 style="font-size: 32px; margin: 10px 0;">${byType.restaurante}</h3>
                    <p style="color: var(--text-secondary);">Restaurantes</p>
                </div>
                <div>
                    <div style="font-size: 48px; color: var(--warning-color);">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 style="font-size: 32px; margin: 10px 0;">${byType.minimercado}</h3>
                    <p style="color: var(--text-secondary);">Minimercados</p>
                </div>
            </div>
        `;
    }

    loadRecentActivities() {
        const companies = storage.getAll('companies');
        const sortedCompanies = companies.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);

        const container = document.getElementById('recentActivities');
        
        if (sortedCompanies.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Nenhuma atividade recente</p>';
            return;
        }

        container.innerHTML = sortedCompanies.map(company => `
            <div style="padding: 15px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-${this.getCompanyIcon(company.type)}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin: 0; font-size: 14px;">${company.name}</h4>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: var(--text-secondary);">
                        Nova empresa criada - ${Utils.formatDateTime(company.createdAt)}
                    </p>
                </div>
                <span class="badge badge-${company.status === 'active' ? 'success' : 'danger'}">
                    ${company.status === 'active' ? 'Ativa' : 'Inativa'}
                </span>
            </div>
        `).join('');
    }

    getCompanyIcon(type) {
        const icons = {
            padaria: 'bread-slice',
            restaurante: 'utensils',
            minimercado: 'shopping-cart'
        };
        return icons[type] || 'building';
    }

    loadCompaniesTable() {
        const companies = storage.getAll('companies');
        const tbody = document.getElementById('companiesTable');

        if (companies.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-building" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                        <p style="color: var(--text-secondary);">Nenhuma empresa cadastrada</p>
                        <button class="btn btn-primary mt-20" onclick="openCompanyModal()">
                            <i class="fas fa-plus"></i> Cadastrar Primeira Empresa
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = companies.map(company => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 35px; height: 35px; border-radius: 8px; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-${this.getCompanyIcon(company.type)}"></i>
                        </div>
                        <strong>${company.name}</strong>
                    </div>
                </td>
                <td>
                    <span class="badge badge-primary">
                        ${company.type.charAt(0).toUpperCase() + company.type.slice(1)}
                    </span>
                </td>
                <td>${company.email}</td>
                <td><strong>${company.currency}</strong></td>
                <td>
                    <span class="badge badge-${company.status === 'active' ? 'success' : 'danger'}">
                        ${company.status === 'active' ? 'Ativa' : 'Inativa'}
                    </span>
                </td>
                <td>${Utils.formatDate(company.createdAt)}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" onclick="editCompany('${company.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-${company.status === 'active' ? 'warning' : 'success'}" 
                                onclick="toggleCompanyStatus('${company.id}')" 
                                title="${company.status === 'active' ? 'Desativar' : 'Ativar'}">
                            <i class="fas fa-${company.status === 'active' ? 'ban' : 'check'}"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCompany('${company.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadPaymentsTable() {
        const companies = storage.getAll('companies');
        const tbody = document.getElementById('paymentsTable');

        if (companies.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        Nenhuma empresa cadastrada
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = companies.map(company => {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
            const amount = 50 + Math.floor(Math.random() * 150);
            const status = Math.random() > 0.3 ? 'paid' : 'pending';

            return `
                <tr>
                    <td>
                        <strong>${company.name}</strong><br>
                        <small style="color: var(--text-secondary);">${company.type}</small>
                    </td>
                    <td><strong>${Utils.formatCurrency(amount, company.currency)}</strong></td>
                    <td>${Utils.formatDate(dueDate)}</td>
                    <td>
                        <span class="badge badge-${status === 'paid' ? 'success' : 'warning'}">
                            ${status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                    </td>
                    <td>
                        ${status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="markAsPaid('${company.id}')">
                                <i class="fas fa-check"></i> Confirmar Pagamento
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-secondary" disabled>
                                <i class="fas fa-check-circle"></i> Pago
                            </button>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Funções globais
function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Remover active de todos os menus
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Mostrar seção selecionada
    document.getElementById(sectionName + 'Section').classList.remove('hidden');

    // Adicionar active ao menu
    event.target.closest('.menu-item').classList.add('active');

    // Carregar dados da seção
    const superAdmin = window.superAdminInstance;
    switch(sectionName) {
        case 'dashboard':
            superAdmin.loadDashboard();
            break;
        case 'companies':
            superAdmin.loadCompaniesTable();
            break;
        case 'payments':
            superAdmin.loadPaymentsTable();
            break;
    }
}

function openCompanyModal(companyId = null) {
    const modal = document.getElementById('companyModal');
    const form = document.getElementById('companyForm');
    form.reset();

    if (companyId) {
        // Editar empresa
        const company = storage.getById('companies', companyId);
        if (company) {
            document.getElementById('modalTitle').textContent = 'Editar Empresa';
            document.getElementById('companyId').value = company.id;
            document.getElementById('companyName').value = company.name;
            document.getElementById('companyType').value = company.type;
            document.getElementById('companyEmail').value = company.email;
            document.getElementById('companyPassword').value = company.password;
            document.getElementById('adminName').value = company.adminName;
            document.getElementById('companyCurrency').value = company.currency;
            document.getElementById('companyPhone').value = company.phone || '';
            document.getElementById('companyAddress').value = company.address || '';
        }
    } else {
        // Nova empresa
        document.getElementById('modalTitle').textContent = 'Nova Empresa';
        document.getElementById('companyId').value = '';
    }

    modal.classList.add('active');
}

function closeCompanyModal() {
    document.getElementById('companyModal').classList.remove('active');
}

function saveCompany() {
    const companyId = document.getElementById('companyId').value;
    const formData = {
        name: document.getElementById('companyName').value.trim(),
        type: document.getElementById('companyType').value,
        email: document.getElementById('companyEmail').value.trim(),
        password: document.getElementById('companyPassword').value,
        adminName: document.getElementById('adminName').value.trim(),
        currency: document.getElementById('companyCurrency').value,
        phone: document.getElementById('companyPhone').value.trim(),
        address: document.getElementById('companyAddress').value.trim(),
        status: 'active',
        paymentStatus: 'paid',
        monthlyRevenue: 0
    };

    // Validar
    const validation = Validator.validateForm(formData, {
        name: { required: true, minLength: 3 },
        type: { required: true },
        email: { required: true, email: true },
        password: { required: true, minLength: 6 },
        adminName: { required: true, minLength: 3 },
        currency: { required: true }
    });

    if (!validation.isValid) {
        const errors = Object.values(validation.errors).join('\n');
        Utils.showNotification(errors, 'danger');
        return;
    }

    if (companyId) {
        // Atualizar empresa existente
        storage.update('companies', companyId, formData, null);
        Utils.showNotification('Empresa atualizada com sucesso!', 'success');
    } else {
        // Criar nova empresa
        storage.create('companies', formData, null);
        Utils.showNotification('Empresa criada com sucesso!', 'success');
    }

    closeCompanyModal();
    window.superAdminInstance.loadCompaniesTable();
    window.superAdminInstance.loadDashboard();
}

function editCompany(companyId) {
    openCompanyModal(companyId);
}

function toggleCompanyStatus(companyId) {
    const company = storage.getById('companies', companyId);
    if (!company) return;

    const newStatus = company.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'ativar' : 'desativar';

    Utils.confirmDialog(`Deseja realmente ${action} a empresa ${company.name}?`, () => {
        storage.update('companies', companyId, { status: newStatus }, null);
        Utils.showNotification(`Empresa ${action === 'ativar' ? 'ativada' : 'desativada'} com sucesso!`, 'success');
        window.superAdminInstance.loadCompaniesTable();
        window.superAdminInstance.loadDashboard();
    });
}

function deleteCompany(companyId) {
    const company = storage.getById('companies', companyId);
    if (!company) return;

    Utils.confirmDialog(
        `ATENÇÃO: Isso excluirá permanentemente a empresa "${company.name}" e todos os seus dados. Confirmar?`,
        () => {
            // Excluir todos os dados da empresa
            ['employees', 'products', 'sales', 'production', 'stock', 'orders', 'tables', 'timesheet'].forEach(collection => {
                const items = storage.getAll(collection, company.id);
                items.forEach(item => storage.delete(collection, item.id, company.id));
            });

            // Excluir empresa
            storage.delete('companies', companyId, null);
            
            Utils.showNotification('Empresa e todos os dados excluídos com sucesso!', 'success');
            window.superAdminInstance.loadCompaniesTable();
            window.superAdminInstance.loadDashboard();
        }
    );
}

function markAsPaid(companyId) {
    Utils.showNotification('Pagamento confirmado com sucesso!', 'success');
    window.superAdminInstance.loadPaymentsTable();
}

// Inicializar
const superAdminInstance = new SuperAdmin();
window.superAdminInstance = superAdminInstance;
