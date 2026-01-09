// ====================================
// PADARIA - LOGÍSTICA COMPLETA
// ====================================

class Padaria {
    constructor() {
        this.currentUser = AuthManager.requireAuth();
        this.currentCompany = AuthManager.requireCompany();

        if (!this.currentCompany || this.currentCompany.type !== 'padaria') {
            window.location.href = 'index.html';
            return;
        }

        this.cart = [];
        this.init();
    }

    init() {
        this.renderCompanyInfo();
        this.renderUserMenu();
        this.loadDashboard();
    }

    renderCompanyInfo() {
        document.getElementById('companyInfo').innerHTML = `
            <h3>${this.currentCompany.name}</h3>
            <p>${this.currentCompany.type.toUpperCase()}</p>
            <span class="company-badge">${this.currentCompany.currency} ${this.currentCompany.status === 'active' ? 'Ativa' : 'Inativa'}</span>
        `;
    }

    renderUserMenu() {
        document.getElementById('userMenu').innerHTML = `
            <div class="user-avatar">${this.currentUser.name.charAt(0).toUpperCase()}</div>
            <div class="user-info">
                <h4>${this.currentUser.name}</h4>
                <p>Administrador</p>
            </div>
        `;
    }

    loadDashboard() {
        const productions = storage.getAll('production', this.currentCompany.id);
        const sales = storage.getAll('sales', this.currentCompany.id);
        const stock = storage.getAll('stock', this.currentCompany.id);

        // Produção hoje
        const today = new Date().toDateString();
        const todayProduction = productions.filter(p => 
            new Date(p.createdAt).toDateString() === today
        ).length;

        // Vendas hoje
        const todaySales = sales.filter(s => 
            new Date(s.createdAt).toDateString() === today
        ).reduce((sum, s) => sum + s.total, 0);

        // Produtos em estoque
        const stockProducts = stock.length;

        // Pendentes de aprovação
        const pendingApproval = productions.filter(p => p.status === 'packaged').length;

        document.getElementById('todayProduction').textContent = todayProduction;
        document.getElementById('todaySales').textContent = Utils.formatCurrency(todaySales, this.currentCompany.currency);
        document.getElementById('stockProducts').textContent = stockProducts;
        document.getElementById('pendingApproval').textContent = pendingApproval;

        // Produção em andamento
        this.renderProductionProgress(productions);
    }

    renderProductionProgress(productions) {
        const inProgress = productions.filter(p => 
            p.status !== 'completed' && p.status !== 'approved'
        );

        const container = document.getElementById('productionProgress');
        
        if (inProgress.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Nenhuma produção em andamento</p>';
            return;
        }

        container.innerHTML = inProgress.map(prod => `
            <div style="padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h4 style="margin: 0; font-size: 16px;">${prod.product} - Lote #${prod.lot}</h4>
                        <p style="margin: 5px 0 0 0; color: var(--text-secondary); font-size: 13px;">
                            Quantidade: ${prod.quantity} unidades
                        </p>
                    </div>
                    <span class="badge badge-${this.getStatusColor(prod.status)}">${this.getStatusText(prod.status)}</span>
                </div>
                <div style="background: var(--bg-color); padding: 10px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 13px;">Progresso: ${this.getProgressPercentage(prod.status)}%</span>
                        <span style="font-size: 13px;">${this.getCurrentStageText(prod.status)}</span>
                    </div>
                    <div style="background: white; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: var(--primary-color); height: 100%; width: ${this.getProgressPercentage(prod.status)}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    ${this.getNextActionButton(prod)}
                </div>
            </div>
        `).join('');
    }

    getStatusColor(status) {
        const colors = {
            'raw_material_entry': 'info',
            'storage': 'info',
            'preparation': 'warning',
            'production': 'warning',
            'packaged': 'primary',
            'approved': 'success',
            'in_stock': 'success'
        };
        return colors[status] || 'secondary';
    }

    getStatusText(status) {
        const texts = {
            'raw_material_entry': 'Entrada Matéria-Prima',
            'storage': 'Armazenamento',
            'preparation': 'Preparação',
            'production': 'Produção',
            'packaged': 'Embalado',
            'approved': 'Aprovado',
            'in_stock': 'Em Estoque'
        };
        return texts[status] || status;
    }

    getProgressPercentage(status) {
        const percentages = {
            'raw_material_entry': 14,
            'storage': 28,
            'preparation': 42,
            'production': 56,
            'packaged': 70,
            'approved': 85,
            'in_stock': 100
        };
        return percentages[status] || 0;
    }

    getCurrentStageText(status) {
        const stages = {
            'raw_material_entry': '1/7 Etapas',
            'storage': '2/7 Etapas',
            'preparation': '3/7 Etapas',
            'production': '4/7 Etapas',
            'packaged': '5/7 Etapas',
            'approved': '6/7 Etapas',
            'in_stock': '7/7 Completo'
        };
        return stages[status] || '';
    }

    getNextActionButton(prod) {
        const nextStages = {
            'raw_material_entry': { status: 'storage', text: 'Armazenar', icon: 'warehouse' },
            'storage': { status: 'preparation', text: 'Iniciar Preparação', icon: 'cog' },
            'preparation': { status: 'production', text: 'Iniciar Produção', icon: 'industry' },
            'production': { status: 'packaged', text: 'Embalar', icon: 'box' },
            'packaged': { status: 'approved', text: 'Aprovar', icon: 'check' },
            'approved': { status: 'in_stock', text: 'Adicionar ao Estoque', icon: 'boxes' }
        };

        const next = nextStages[prod.status];
        if (!next) return '';

        return `
            <button class="btn btn-sm btn-primary" onclick="advanceProductionStage('${prod.id}', '${next.status}')">
                <i class="fas fa-${next.icon}"></i> ${next.text}
            </button>
            <button class="btn btn-sm btn-secondary" onclick="viewProductionDetails('${prod.id}')">
                <i class="fas fa-eye"></i> Detalhes
            </button>
        `;
    }

    loadProductionTable() {
        const productions = storage.getAll('production', this.currentCompany.id);
        const tbody = document.getElementById('productionTable');

        if (productions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <i class="fas fa-industry" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                        <p style="color: var(--text-secondary);">Nenhuma produção registrada</p>
                        <button class="btn btn-primary mt-20" onclick="openProductionModal()">
                            <i class="fas fa-plus"></i> Iniciar Primeira Produção
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = productions.map(prod => `
            <tr>
                <td><strong>#${prod.lot}</strong></td>
                <td>${prod.product}</td>
                <td>${prod.quantity} un</td>
                <td><span class="badge badge-${this.getStatusColor(prod.status)}">${this.getStatusText(prod.status)}</span></td>
                <td>${this.getCurrentStageText(prod.status)}</td>
                <td>${prod.employeeName || 'N/A'}</td>
                <td>${Utils.formatDateTime(prod.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewProductionDetails('${prod.id}')" title="Ver Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadRawMaterialTable() {
        const rawMaterials = storage.getAll('rawMaterial', this.currentCompany.id) || [];
        const tbody = document.getElementById('rawMaterialTable');

        if (rawMaterials.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-wheat" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                        <p style="color: var(--text-secondary);">Nenhuma matéria-prima cadastrada</p>
                        <button class="btn btn-primary mt-20" onclick="openRawMaterialModal()">
                            <i class="fas fa-plus"></i> Cadastrar Primeira Matéria-Prima
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = rawMaterials.map(rm => {
            const stockStatus = rm.quantity <= rm.minQuantity ? 'danger' : 'success';
            return `
                <tr>
                    <td><strong>${rm.name}</strong></td>
                    <td><span class="badge badge-info">${rm.category}</span></td>
                    <td>${rm.quantity}</td>
                    <td>${rm.unit}</td>
                    <td>${rm.minQuantity}</td>
                    <td><span class="badge badge-${stockStatus}">${stockStatus === 'danger' ? 'Baixo' : 'OK'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editRawMaterial('${rm.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRawMaterial('${rm.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadStockTable() {
        const stock = storage.getAll('stock', this.currentCompany.id);
        const tbody = document.getElementById('stockTable');

        if (stock.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        Nenhum produto em estoque
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = stock.map(item => `
            <tr>
                <td><strong>${item.product}</strong></td>
                <td>${item.quantity} un</td>
                <td>${Utils.formatCurrency(item.price, this.currentCompany.currency)}</td>
                <td><strong>${Utils.formatCurrency(item.quantity * item.price, this.currentCompany.currency)}</strong></td>
                <td>${Utils.formatDate(item.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adjustStock('${item.id}')">
                        <i class="fas fa-edit"></i> Ajustar
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadSalesProducts() {
        const stock = storage.getAll('stock', this.currentCompany.id);
        const container = document.getElementById('salesProducts');

        if (stock.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">Nenhum produto disponível para venda</p>';
            return;
        }

        container.innerHTML = stock.map(item => `
            <div class="card" style="cursor: pointer; text-align: center;" onclick="addToCart('${item.id}')">
                <div class="card-body">
                    <i class="fas fa-bread-slice" style="font-size: 36px; color: var(--primary-color); margin-bottom: 10px;"></i>
                    <h4 style="font-size: 14px; margin: 8px 0;">${item.product}</h4>
                    <p style="font-size: 18px; font-weight: bold; color: var(--success-color); margin: 0;">
                        ${Utils.formatCurrency(item.price, this.currentCompany.currency)}
                    </p>
                    <p style="font-size: 11px; color: var(--text-secondary); margin: 5px 0 0 0;">
                        Estoque: ${item.quantity}
                    </p>
                </div>
            </div>
        `).join('');

        this.renderCart();
    }

    renderCart() {
        const container = document.getElementById('salesCart');
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; background: var(--bg-color); border-radius: 10px;">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                    <p style="color: var(--text-secondary);">Carrinho vazio</p>
                </div>
            `;
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

        container.innerHTML = `
            <div style="background: var(--bg-color); border-radius: 10px; padding: 15px;">
                ${this.cart.map((item, index) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                        <div style="flex: 1;">
                            <strong style="font-size: 13px;">${item.product}</strong><br>
                            <small style="color: var(--text-secondary);">${Utils.formatCurrency(item.price, this.currentCompany.currency)}</small>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button class="btn btn-sm" onclick="updateCartQuantity(${index}, -1)" style="padding: 4px 8px;">-</button>
                            <span style="font-weight: bold;">${item.cartQuantity}</span>
                            <button class="btn btn-sm" onclick="updateCartQuantity(${index}, 1)" style="padding: 4px 8px;">+</button>
                            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})" style="padding: 4px 8px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <strong>Total:</strong>
                        <strong style="font-size: 24px; color: var(--success-color);">
                            ${Utils.formatCurrency(total, this.currentCompany.currency)}
                        </strong>
                    </div>
                    <button class="btn btn-success btn-block" onclick="completeSale()">
                        <i class="fas fa-check"></i> Finalizar Venda
                    </button>
                    <button class="btn btn-secondary btn-block mt-10" onclick="clearCart()">
                        <i class="fas fa-times"></i> Limpar Carrinho
                    </button>
                </div>
            </div>
        `;
    }

    loadEmployeesTable() {
        const employees = storage.getAll('employees', this.currentCompany.id);
        const tbody = document.getElementById('employeesTable');

        if (employees.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <i class="fas fa-users" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                        <p style="color: var(--text-secondary);">Nenhum funcionário cadastrado</p>
                        <button class="btn btn-primary mt-20" onclick="openEmployeeModal()">
                            <i class="fas fa-plus"></i> Cadastrar Primeiro Funcionário
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = employees.map(emp => `
            <tr>
                <td><strong>${emp.name}</strong></td>
                <td><span class="badge badge-info">${emp.role}</span></td>
                <td>${emp.email}</td>
                <td>${emp.phone || 'N/A'}</td>
                <td><span class="badge badge-${emp.status === 'active' ? 'success' : 'danger'}">${emp.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editEmployee('${emp.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${emp.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Funções globais
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    
    document.getElementById(sectionName + 'Section').classList.remove('hidden');
    event.target.closest('.menu-item').classList.add('active');

    const titles = {
        dashboard: 'Dashboard Padaria',
        production: 'Gestão de Produção',
        rawMaterial: 'Matéria-Prima',
        recipes: 'Receitas e Fórmulas',
        packaging: 'Embalagem',
        approval: 'Aprovação de Produtos',
        stock: 'Estoque',
        sales: 'Ponto de Venda',
        employees: 'Funcionários',
        reports: 'Relatórios'
    };

    document.getElementById('pageTitle').textContent = titles[sectionName];

    const padaria = window.padariaInstance;
    switch(sectionName) {
        case 'dashboard':
            padaria.loadDashboard();
            break;
        case 'production':
            padaria.loadProductionTable();
            break;
        case 'rawMaterial':
            padaria.loadRawMaterialTable();
            break;
        case 'stock':
            padaria.loadStockTable();
            break;
        case 'sales':
            padaria.loadSalesProducts();
            break;
        case 'employees':
            padaria.loadEmployeesTable();
            break;
    }
}

function openProductionModal() {
    ModalManager.show('productionModal');
}

function closeModal(modalId) {
    ModalManager.hide(modalId);
}

function saveProduction() {
    const product = document.getElementById('productionProduct').value.trim();
    const quantity = parseInt(document.getElementById('productionQuantity').value);

    if (!product || !quantity) {
        Utils.showNotification('Preencha todos os campos obrigatórios', 'danger');
        return;
    }

    const production = {
        lot: 'LOT' + Date.now(),
        product,
        quantity,
        status: 'raw_material_entry',
        employeeName: window.padariaInstance.currentUser.name
    };

    storage.create('production', production, window.padariaInstance.currentCompany.id);
    Utils.showNotification('Produção iniciada com sucesso!', 'success');
    closeModal('productionModal');
    window.padariaInstance.loadDashboard();
}

function advanceProductionStage(productionId, newStatus) {
    storage.update('production', productionId, { status: newStatus }, window.padariaInstance.currentCompany.id);
    
    // Se chegou ao estoque, criar item no estoque
    if (newStatus === 'in_stock') {
        const production = storage.getById('production', productionId);
        storage.create('stock', {
            product: production.product,
            quantity: production.quantity,
            price: 2.50 // Preço padrão, pode ser configurável
        }, window.padariaInstance.currentCompany.id);
        Utils.showNotification('Produto adicionado ao estoque!', 'success');
    } else {
        Utils.showNotification('Etapa avançada com sucesso!', 'success');
    }
    
    window.padariaInstance.loadDashboard();
}

function viewProductionDetails(productionId) {
    const production = storage.getById('production', productionId);
    Utils.showNotification(`Detalhes: ${production.product} - Lote ${production.lot}`, 'info');
}

function openRawMaterialModal() {
    const content = `
        <form id="rawMaterialForm">
            <div class="form-group">
                <label>Nome *</label>
                <input type="text" id="rmName" required>
            </div>
            <div class="form-group">
                <label>Categoria *</label>
                <select id="rmCategory" required>
                    <option value="">Selecione...</option>
                    <option value="Farinha">Farinha</option>
                    <option value="Fermento">Fermento</option>
                    <option value="Açúcar">Açúcar</option>
                    <option value="Sal">Sal</option>
                    <option value="Manteiga">Manteiga</option>
                    <option value="Ovos">Ovos</option>
                    <option value="Leite">Leite</option>
                    <option value="Outros">Outros</option>
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Quantidade *</label>
                    <input type="number" id="rmQuantity" required min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Unidade *</label>
                    <select id="rmUnit" required>
                        <option value="kg">Kg</option>
                        <option value="g">g</option>
                        <option value="L">L</option>
                        <option value="ml">ml</option>
                        <option value="un">Unidades</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Quantidade Mínima *</label>
                <input type="number" id="rmMinQuantity" required min="0" step="0.01">
            </div>
        </form>
    `;

    ModalManager.create('Nova Matéria-Prima', content, [
        {
            text: 'Salvar',
            type: 'primary',
            onclick: 'saveRawMaterial()'
        }
    ]);
}

function saveRawMaterial() {
    const rawMaterial = {
        name: document.getElementById('rmName').value.trim(),
        category: document.getElementById('rmCategory').value,
        quantity: parseFloat(document.getElementById('rmQuantity').value),
        unit: document.getElementById('rmUnit').value,
        minQuantity: parseFloat(document.getElementById('rmMinQuantity').value)
    };

    if (!rawMaterial.name || !rawMaterial.category) {
        Utils.showNotification('Preencha todos os campos obrigatórios', 'danger');
        return;
    }

    storage.create('rawMaterial', rawMaterial, window.padariaInstance.currentCompany.id);
    Utils.showNotification('Matéria-prima cadastrada com sucesso!', 'success');
    document.querySelectorAll('.modal').forEach(m => m.remove());
    window.padariaInstance.loadRawMaterialTable();
}

function addToCart(stockId) {
    const stockItem = storage.getById('stock', stockId);
    if (!stockItem) return;

    const existingIndex = window.padariaInstance.cart.findIndex(item => item.id === stockId);
    
    if (existingIndex >= 0) {
        if (window.padariaInstance.cart[existingIndex].cartQuantity < stockItem.quantity) {
            window.padariaInstance.cart[existingIndex].cartQuantity++;
        } else {
            Utils.showNotification('Quantidade máxima em estoque atingida', 'warning');
            return;
        }
    } else {
        window.padariaInstance.cart.push({
            ...stockItem,
            cartQuantity: 1
        });
    }

    window.padariaInstance.renderCart();
}

function updateCartQuantity(index, change) {
    const item = window.padariaInstance.cart[index];
    const newQuantity = item.cartQuantity + change;

    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }

    if (newQuantity > item.quantity) {
        Utils.showNotification('Quantidade máxima em estoque atingida', 'warning');
        return;
    }

    item.cartQuantity = newQuantity;
    window.padariaInstance.renderCart();
}

function removeFromCart(index) {
    window.padariaInstance.cart.splice(index, 1);
    window.padariaInstance.renderCart();
}

function clearCart() {
    Utils.confirmDialog('Deseja limpar o carrinho?', () => {
        window.padariaInstance.cart = [];
        window.padariaInstance.renderCart();
    });
}

function completeSale() {
    if (window.padariaInstance.cart.length === 0) return;

    const total = window.padariaInstance.cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

    // Criar venda
    const sale = {
        items: window.padariaInstance.cart.map(item => ({
            product: item.product,
            quantity: item.cartQuantity,
            price: item.price,
            subtotal: item.price * item.cartQuantity
        })),
        total,
        paymentMethod: 'Dinheiro' // Pode ser configurável
    };

    storage.create('sales', sale, window.padariaInstance.currentCompany.id);

    // Atualizar estoque
    window.padariaInstance.cart.forEach(item => {
        storage.update('stock', item.id, {
            quantity: item.quantity - item.cartQuantity
        }, window.padariaInstance.currentCompany.id);
    });

    Utils.showNotification(`Venda finalizada! Total: ${Utils.formatCurrency(total, window.padariaInstance.currentCompany.currency)}`, 'success');
    window.padariaInstance.cart = [];
    window.padariaInstance.loadSalesProducts();
}

function openEmployeeModal() {
    const content = `
        <form id="employeeForm">
            <div class="form-group">
                <label>Nome Completo *</label>
                <input type="text" id="empName" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Função *</label>
                    <select id="empRole" required>
                        <option value="">Selecione...</option>
                        <option value="Padeiro">Padeiro</option>
                        <option value="Auxiliar">Auxiliar</option>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Caixa">Caixa</option>
                        <option value="Gerente">Gerente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status *</label>
                    <select id="empStatus" required>
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="empEmail">
                </div>
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="tel" id="empPhone">
                </div>
            </div>
        </form>
    `;

    ModalManager.create('Novo Funcionário', content, [
        {
            text: 'Salvar',
            type: 'primary',
            onclick: 'saveEmployee()'
        }
    ]);
}

function saveEmployee() {
    const employee = {
        name: document.getElementById('empName').value.trim(),
        role: document.getElementById('empRole').value,
        status: document.getElementById('empStatus').value,
        email: document.getElementById('empEmail').value.trim(),
        phone: document.getElementById('empPhone').value.trim()
    };

    if (!employee.name || !employee.role) {
        Utils.showNotification('Preencha todos os campos obrigatórios', 'danger');
        return;
    }

    storage.create('employees', employee, window.padariaInstance.currentCompany.id);
    Utils.showNotification('Funcionário cadastrado com sucesso!', 'success');
    document.querySelectorAll('.modal').forEach(m => m.remove());
    window.padariaInstance.loadEmployeesTable();
}

function generateReport(type) {
    Utils.showNotification(`Gerando relatório de ${type}...`, 'info');
}

// Inicializar
const padariaInstance = new Padaria();
window.padariaInstance = padariaInstance;
