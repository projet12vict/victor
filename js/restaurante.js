// ====================================
// RESTAURANTE - SISTEMA COMPLETO
// ====================================

class Restaurante {
    constructor() {
        this.currentUser = AuthManager.requireAuth();
        this.currentCompany = AuthManager.requireCompany();

        if (!this.currentCompany || this.currentCompany.type !== 'restaurante') {
            window.location.href = 'index.html';
            return;
        }

        this.orderCart = [];
        this.currentTable = null;
        this.init();
    }

    init() {
        this.renderCompanyInfo();
        this.renderUserMenu();
        this.loadDashboard();
        this.initializeTables();
    }

    renderCompanyInfo() {
        document.getElementById('companyInfo').innerHTML = `
            <h3>${this.currentCompany.name}</h3>
            <p>${this.currentCompany.type.toUpperCase()}</p>
            <span class="company-badge">${this.currentCompany.currency} ${this.currentCompany.status === 'active' ? 'Ativo' : 'Inativo'}</span>
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

    initializeTables() {
        const tables = storage.getAll('tables', this.currentCompany.id);
        if (tables.length === 0) {
            // Criar mesas padrão
            for (let i = 1; i <= 10; i++) {
                storage.create('tables', {
                    number: i,
                    capacity: 4,
                    status: 'available',
                    currentOrders: []
                }, this.currentCompany.id);
            }
        }
    }

    loadDashboard() {
        const orders = storage.getAll('orders', this.currentCompany.id);
        const tables = storage.getAll('tables', this.currentCompany.id);

        // Pedidos hoje
        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => 
            new Date(o.createdAt).toDateString() === today
        );

        // Faturamento hoje
        const todayRevenue = todayOrders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + o.total, 0);

        // Mesas ocupadas
        const occupiedTables = tables.filter(t => t.status === 'occupied').length;

        // Pedidos pendentes
        const pendingOrders = orders.filter(o => 
            o.status === 'preparing' || o.status === 'pending'
        ).length;

        document.getElementById('todayRevenue').textContent = 
            Utils.formatCurrency(todayRevenue, this.currentCompany.currency);
        document.getElementById('todayOrders').textContent = todayOrders.length;
        document.getElementById('occupiedTablesCount').textContent = occupiedTables;
        document.getElementById('pendingOrdersCount').textContent = pendingOrders;

        // Badges
        document.getElementById('occupiedTables').textContent = occupiedTables;
        document.getElementById('activeOrders').textContent = orders.filter(o => o.status !== 'completed').length;
        
        const kitchenOrders = orders.filter(o => 
            o.items.some(item => item.type === 'food') && 
            (o.status === 'preparing' || o.status === 'pending')
        ).length;
        document.getElementById('kitchenOrders').textContent = kitchenOrders;

        const barOrders = orders.filter(o => 
            o.items.some(item => item.type === 'drink') && 
            (o.status === 'preparing' || o.status === 'pending')
        ).length;
        document.getElementById('barOrders').textContent = barOrders;

        // Renderizar visão geral das mesas
        this.renderTablesOverview(tables);

        // Pedidos em preparo
        this.renderOrdersInProgress(orders);
    }

    renderTablesOverview(tables) {
        const container = document.getElementById('tablesOverview');
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px;">
                ${tables.map(table => `
                    <div class="card" style="cursor: pointer; text-align: center; background: ${table.status === 'occupied' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};" onclick="viewTable('${table.id}')">
                        <div class="card-body">
                            <i class="fas fa-table" style="font-size: 36px; color: ${table.status === 'occupied' ? 'var(--danger-color)' : 'var(--success-color)'};"></i>
                            <h3 style="margin: 10px 0 5px 0;">Mesa ${table.number}</h3>
                            <span class="badge badge-${table.status === 'occupied' ? 'danger' : 'success'}" style="font-size: 11px;">
                                ${table.status === 'occupied' ? 'Ocupada' : 'Livre'}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderOrdersInProgress(orders) {
        const preparing = orders.filter(o => o.status === 'preparing');
        const container = document.getElementById('ordersInProgress');

        if (preparing.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Nenhum pedido em preparo no momento</p>';
            return;
        }

        container.innerHTML = preparing.map(order => `
            <div style="padding: 15px; border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 10px; background: var(--bg-color);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${order.tableNumber ? `Mesa ${order.tableNumber}` : 'Delivery'} - Pedido #${order.orderNumber}</strong>
                        <p style="margin: 5px 0 0 0; color: var(--text-secondary); font-size: 13px;">
                            ${order.items.length} itens - ${Utils.formatDateTime(order.createdAt)}
                        </p>
                    </div>
                    <span class="badge badge-warning">Em Preparo</span>
                </div>
            </div>
        `).join('');
    }

    loadTablesList() {
        const tables = storage.getAll('tables', this.currentCompany.id);
        const container = document.getElementById('tablesList');

        container.innerHTML = tables.map(table => {
            const statusColor = table.status === 'occupied' ? 'danger' : 
                               table.status === 'reserved' ? 'warning' : 'success';
            const statusText = table.status === 'occupied' ? 'Ocupada' : 
                              table.status === 'reserved' ? 'Reservada' : 'Livre';

            return `
                <div class="card" style="cursor: pointer;" onclick="viewTable('${table.id}')">
                    <div class="card-body text-center">
                        <i class="fas fa-table" style="font-size: 48px; color: var(--${statusColor}-color); margin-bottom: 15px;"></i>
                        <h3>Mesa ${table.number}</h3>
                        <p style="color: var(--text-secondary); font-size: 13px; margin: 5px 0;">
                            Capacidade: ${table.capacity} pessoas
                        </p>
                        <span class="badge badge-${statusColor}">${statusText}</span>
                        ${table.status === 'occupied' ? `
                            <div style="margin-top: 15px;">
                                <button class="btn btn-sm btn-primary btn-block" onclick="event.stopPropagation(); openOrderModal('${table.id}')">
                                    <i class="fas fa-plus"></i> Novo Pedido
                                </button>
                                <button class="btn btn-sm btn-success btn-block mt-10" onclick="event.stopPropagation(); closeTable('${table.id}')">
                                    <i class="fas fa-check"></i> Fechar Mesa
                                </button>
                            </div>
                        ` : `
                            <button class="btn btn-sm btn-primary btn-block mt-10" onclick="event.stopPropagation(); openTable('${table.id}')">
                                <i class="fas fa-chair"></i> Abrir Mesa
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadOrdersTable() {
        const orders = storage.getAll('orders', this.currentCompany.id);
        const tbody = document.getElementById('ordersTable');

        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        Nenhum pedido registrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = orders.map(order => {
            const statusColors = {
                'pending': 'warning',
                'preparing': 'info',
                'ready': 'primary',
                'completed': 'success',
                'cancelled': 'danger'
            };

            const statusTexts = {
                'pending': 'Pendente',
                'preparing': 'Preparando',
                'ready': 'Pronto',
                'completed': 'Concluído',
                'cancelled': 'Cancelado'
            };

            return `
                <tr>
                    <td><strong>${order.tableNumber ? `Mesa ${order.tableNumber}` : 'Delivery'}</strong></td>
                    <td>#${order.orderNumber}</td>
                    <td>${order.items.length} itens</td>
                    <td><strong>${Utils.formatCurrency(order.total, this.currentCompany.currency)}</strong></td>
                    <td><span class="badge badge-${statusColors[order.status]}">${statusTexts[order.status]}</span></td>
                    <td>${Utils.formatDateTime(order.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewOrderDetails('${order.id}')" title="Ver Detalhes">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${order.status !== 'completed' && order.status !== 'cancelled' ? `
                            <button class="btn btn-sm btn-success" onclick="completeOrder('${order.id}')" title="Concluir">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadKitchenBoard() {
        const orders = storage.getAll('orders', this.currentCompany.id);
        const kitchenOrders = orders.filter(o => 
            o.items.some(item => item.type === 'food') && 
            (o.status === 'pending' || o.status === 'preparing')
        );

        const container = document.getElementById('kitchenBoard');

        if (kitchenOrders.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-secondary);">
                    <i class="fas fa-fire" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>Nenhum pedido na cozinha</h3>
                    <p>Aguardando novos pedidos de comida...</p>
                </div>
            `;
            return;
        }

        container.innerHTML = kitchenOrders.map(order => {
            const foodItems = order.items.filter(item => item.type === 'food');
            
            return `
                <div class="card" style="border-left: 4px solid var(--danger-color);">
                    <div class="card-header" style="background: var(--bg-color); padding: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h3 style="margin: 0; font-size: 18px;">
                                    ${order.tableNumber ? `Mesa ${order.tableNumber}` : 'Delivery'}
                                </h3>
                                <p style="margin: 5px 0 0 0; color: var(--text-secondary); font-size: 12px;">
                                    Pedido #${order.orderNumber}
                                </p>
                            </div>
                            <span class="badge badge-${order.status === 'preparing' ? 'warning' : 'info'}">
                                ${order.status === 'preparing' ? 'Preparando' : 'Novo'}
                            </span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--text-secondary);">COMIDAS:</h4>
                        ${foodItems.map(item => `
                            <div style="padding: 10px; background: var(--bg-color); border-radius: 8px; margin-bottom: 8px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <strong>${item.quantity}x ${item.name}</strong>
                                </div>
                                ${item.notes ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: var(--text-secondary);">Obs: ${item.notes}</p>` : ''}
                            </div>
                        `).join('')}
                        <div style="margin-top: 15px; text-align: center;">
                            <small style="color: var(--text-secondary);">${Utils.formatDateTime(order.createdAt)}</small>
                        </div>
                    </div>
                    <div class="card-body" style="border-top: 1px solid var(--border-color); padding: 15px;">
                        ${order.status === 'pending' ? `
                            <button class="btn btn-warning btn-block" onclick="startPreparing('${order.id}')">
                                <i class="fas fa-fire"></i> Iniciar Preparo
                            </button>
                        ` : `
                            <button class="btn btn-success btn-block" onclick="markAsReady('${order.id}')">
                                <i class="fas fa-check"></i> Marcar como Pronto
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadBarBoard() {
        const orders = storage.getAll('orders', this.currentCompany.id);
        const barOrders = orders.filter(o => 
            o.items.some(item => item.type === 'drink') && 
            (o.status === 'pending' || o.status === 'preparing')
        );

        const container = document.getElementById('barBoard');

        if (barOrders.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-secondary);">
                    <i class="fas fa-cocktail" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>Nenhum pedido no balcão</h3>
                    <p>Aguardando novos pedidos de bebidas...</p>
                </div>
            `;
            return;
        }

        container.innerHTML = barOrders.map(order => {
            const drinkItems = order.items.filter(item => item.type === 'drink');
            
            return `
                <div class="card" style="border-left: 4px solid var(--info-color);">
                    <div class="card-header" style="background: var(--bg-color); padding: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h3 style="margin: 0; font-size: 18px;">
                                    ${order.tableNumber ? `Mesa ${order.tableNumber}` : 'Delivery'}
                                </h3>
                                <p style="margin: 5px 0 0 0; color: var(--text-secondary); font-size: 12px;">
                                    Pedido #${order.orderNumber}
                                </p>
                            </div>
                            <span class="badge badge-${order.status === 'preparing' ? 'warning' : 'info'}">
                                ${order.status === 'preparing' ? 'Preparando' : 'Novo'}
                            </span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--text-secondary);">BEBIDAS:</h4>
                        ${drinkItems.map(item => `
                            <div style="padding: 10px; background: var(--bg-color); border-radius: 8px; margin-bottom: 8px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <strong>${item.quantity}x ${item.name}</strong>
                                </div>
                            </div>
                        `).join('')}
                        <div style="margin-top: 15px; text-align: center;">
                            <small style="color: var(--text-secondary);">${Utils.formatDateTime(order.createdAt)}</small>
                        </div>
                    </div>
                    <div class="card-body" style="border-top: 1px solid var(--border-color); padding: 15px;">
                        ${order.status === 'pending' ? `
                            <button class="btn btn-warning btn-block" onclick="startPreparing('${order.id}')">
                                <i class="fas fa-cocktail"></i> Iniciar Preparo
                            </button>
                        ` : `
                            <button class="btn btn-success btn-block" onclick="markAsReady('${order.id}')">
                                <i class="fas fa-check"></i> Marcar como Pronto
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadMenuTable() {
        const menuItems = storage.getAll('menuItems', this.currentCompany.id);
        const tbody = document.getElementById('menuTable');

        if (menuItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <i class="fas fa-book-open" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                        <p style="color: var(--text-secondary);">Nenhum item no cardápio</p>
                        <button class="btn btn-primary mt-20" onclick="openMenuItemModal()">
                            <i class="fas fa-plus"></i> Adicionar Primeiro Item
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = menuItems.map(item => `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td><span class="badge badge-info">${item.category}</span></td>
                <td><span class="badge badge-${item.type === 'food' ? 'danger' : 'primary'}">${item.type === 'food' ? 'Comida' : 'Bebida'}</span></td>
                <td><strong>${Utils.formatCurrency(item.price, this.currentCompany.currency)}</strong></td>
                <td><span class="badge badge-${item.available ? 'success' : 'secondary'}">${item.available ? 'Sim' : 'Não'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editMenuItem('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMenuItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadStockTable() {
        const stockItems = storage.getAll('stock', this.currentCompany.id);
        const tbody = document.getElementById('stockTable');

        if (stockItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        Nenhum item em estoque
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = stockItems.map(item => {
            const status = item.quantity <= item.minQuantity ? 'danger' : 'success';
            return `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td>${item.minQuantity}</td>
                    <td><span class="badge badge-${status}">${status === 'danger' ? 'Baixo' : 'OK'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="adjustStock('${item.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadDeliveryTable() {
        const deliveryOrders = storage.getAll('orders', this.currentCompany.id)
            .filter(o => o.isDelivery);
        const tbody = document.getElementById('deliveryTable');

        if (deliveryOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        Nenhum pedido delivery
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = deliveryOrders.map(order => {
            const statusColors = {
                'pending': 'warning',
                'preparing': 'info',
                'ready': 'primary',
                'delivering': 'warning',
                'completed': 'success'
            };

            return `
                <tr>
                    <td><strong>#${order.orderNumber}</strong></td>
                    <td>${order.customerName}</td>
                    <td style="font-size: 12px;">${order.deliveryAddress}</td>
                    <td>${order.items.length} itens</td>
                    <td><strong>${Utils.formatCurrency(order.total, this.currentCompany.currency)}</strong></td>
                    <td><span class="badge badge-${statusColors[order.status]}">${order.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
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
                            <i class="fas fa-plus"></i> Cadastrar Funcionário
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
        dashboard: 'Dashboard Restaurante',
        tables: 'Gestão de Mesas',
        orders: 'Gerenciar Pedidos',
        kitchen: 'Cozinha',
        bar: 'Balcão/Bar',
        menu: 'Cardápio',
        stock: 'Estoque',
        delivery: 'Delivery',
        employees: 'Funcionários',
        reports: 'Relatórios'
    };

    document.getElementById('pageTitle').textContent = titles[sectionName];

    const restaurante = window.restauranteInstance;
    switch(sectionName) {
        case 'dashboard':
            restaurante.loadDashboard();
            break;
        case 'tables':
            restaurante.loadTablesList();
            break;
        case 'orders':
            restaurante.loadOrdersTable();
            break;
        case 'kitchen':
            restaurante.loadKitchenBoard();
            break;
        case 'bar':
            restaurante.loadBarBoard();
            break;
        case 'menu':
            restaurante.loadMenuTable();
            break;
        case 'stock':
            restaurante.loadStockTable();
            break;
        case 'delivery':
            restaurante.loadDeliveryTable();
            break;
        case 'employees':
            restaurante.loadEmployeesTable();
            break;
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openTable(tableId) {
    const table = storage.getById('tables', tableId);
    Utils.confirmDialog(`Abrir Mesa ${table.number}?`, () => {
        storage.update('tables', tableId, { status: 'occupied' }, window.restauranteInstance.currentCompany.id);
        Utils.showNotification(`Mesa ${table.number} aberta!`, 'success');
        window.restauranteInstance.loadTablesList();
        window.restauranteInstance.loadDashboard();
    });
}

function closeTable(tableId) {
    const table = storage.getById('tables', tableId);
    // Verificar se há pedidos pendentes
    const orders = storage.getAll('orders', window.restauranteInstance.currentCompany.id);
    const tablePendingOrders = orders.filter(o => 
        o.tableNumber === table.number && 
        o.status !== 'completed'
    );

    if (tablePendingOrders.length > 0) {
        Utils.showNotification('Ainda há pedidos pendentes nesta mesa!', 'danger');
        return;
    }

    Utils.confirmDialog(`Fechar Mesa ${table.number}?`, () => {
        storage.update('tables', tableId, { 
            status: 'available',
            currentOrders: []
        }, window.restauranteInstance.currentCompany.id);
        Utils.showNotification(`Mesa ${table.number} fechada!`, 'success');
        window.restauranteInstance.loadTablesList();
        window.restauranteInstance.loadDashboard();
    });
}

function viewTable(tableId) {
    const table = storage.getById('tables', tableId);
    const orders = storage.getAll('orders', window.restauranteInstance.currentCompany.id)
        .filter(o => o.tableNumber === table.number && o.status !== 'completed');

    let content = `
        <div style="text-align: center; margin-bottom: 20px;">
            <i class="fas fa-table" style="font-size: 64px; color: var(--primary-color);"></i>
            <h2 style="margin: 15px 0;">Mesa ${table.number}</h2>
            <p>Capacidade: ${table.capacity} pessoas</p>
            <span class="badge badge-${table.status === 'occupied' ? 'danger' : 'success'}">
                ${table.status === 'occupied' ? 'Ocupada' : 'Livre'}
            </span>
        </div>
    `;

    if (orders.length > 0) {
        content += `
            <h3>Pedidos Ativos:</h3>
            ${orders.map(order => `
                <div style="padding: 15px; background: var(--bg-color); border-radius: 10px; margin: 10px 0;">
                    <strong>Pedido #${order.orderNumber}</strong>
                    <p>${order.items.length} itens - ${Utils.formatCurrency(order.total, window.restauranteInstance.currentCompany.currency)}</p>
                    <span class="badge badge-warning">${order.status}</span>
                </div>
            `).join('')}
        `;
    }

    ModalManager.create(`Mesa ${table.number}`, content, []);
}

function openOrderModal(tableId) {
    window.restauranteInstance.currentTable = tableId;
    window.restauranteInstance.orderCart = [];
    
    const menuItems = storage.getAll('menuItems', window.restauranteInstance.currentCompany.id)
        .filter(item => item.available);

    const container = document.getElementById('orderMenuItems');
    container.innerHTML = menuItems.map(item => `
        <div class="card" style="margin-bottom: 10px; cursor: pointer;" onclick="addToOrderCart('${item.id}')">
            <div class="card-body" style="padding: 15px;">
                <div style="display: flex; justify-content: between; align-items: center;">
                    <div>
                        <strong>${item.name}</strong>
                        <p style="margin: 5px 0; color: var(--text-secondary); font-size: 12px;">${item.category}</p>
                    </div>
                    <strong style="color: var(--success-color);">
                        ${Utils.formatCurrency(item.price, window.restauranteInstance.currentCompany.currency)}
                    </strong>
                </div>
            </div>
        </div>
    `).join('');

    renderOrderCart();
    document.getElementById('orderModal').classList.add('active');
}

function addToOrderCart(menuItemId) {
    const menuItem = storage.getById('menuItems', menuItemId);
    const existingIndex = window.restauranteInstance.orderCart.findIndex(item => item.id === menuItemId);

    if (existingIndex >= 0) {
        window.restauranteInstance.orderCart[existingIndex].quantity++;
    } else {
        window.restauranteInstance.orderCart.push({
            ...menuItem,
            quantity: 1
        });
    }

    renderOrderCart();
}

function renderOrderCart() {
    const container = document.getElementById('orderCart');
    const cart = window.restauranteInstance.orderCart;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Carrinho vazio</p>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = `
        ${cart.map((item, index) => `
            <div style="padding: 10px; background: white; border-radius: 8px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <strong style="font-size: 13px;">${item.name}</strong>
                    <button class="btn btn-sm btn-danger" onclick="removeFromOrderCart(${index})" style="padding: 2px 6px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <button class="btn btn-sm" onclick="updateOrderCartQuantity(${index}, -1)" style="padding: 2px 8px;">-</button>
                        <span style="font-weight: bold;">${item.quantity}</span>
                        <button class="btn btn-sm" onclick="updateOrderCartQuantity(${index}, 1)" style="padding: 2px 8px;">+</button>
                    </div>
                    <span style="font-size: 12px;">${Utils.formatCurrency(item.price * item.quantity, window.restauranteInstance.currentCompany.currency)}</span>
                </div>
            </div>
        `).join('')}
        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between;">
                <strong>Total:</strong>
                <strong style="font-size: 20px; color: var(--success-color);">
                    ${Utils.formatCurrency(total, window.restauranteInstance.currentCompany.currency)}
                </strong>
            </div>
        </div>
    `;
}

function updateOrderCartQuantity(index, change) {
    const item = window.restauranteInstance.orderCart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeFromOrderCart(index);
        return;
    }

    item.quantity = newQuantity;
    renderOrderCart();
}

function removeFromOrderCart(index) {
    window.restauranteInstance.orderCart.splice(index, 1);
    renderOrderCart();
}

function confirmOrder() {
    const cart = window.restauranteInstance.orderCart;
    if (cart.length === 0) {
        Utils.showNotification('Adicione itens ao pedido', 'warning');
        return;
    }

    const tableId = window.restauranteInstance.currentTable;
    const table = storage.getById('tables', tableId);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
        orderNumber: 'ORD' + Date.now(),
        tableNumber: table.number,
        tableId: table.id,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            type: item.type,
            category: item.category
        })),
        total,
        status: 'pending',
        isDelivery: false
    };

    storage.create('orders', order, window.restauranteInstance.currentCompany.id);
    Utils.showNotification('Pedido enviado com sucesso!', 'success');
    
    closeModal('orderModal');
    window.restauranteInstance.loadDashboard();
}

function startPreparing(orderId) {
    storage.update('orders', orderId, { status: 'preparing' }, window.restauranteInstance.currentCompany.id);
    Utils.showNotification('Pedido em preparo!', 'info');
    window.restauranteInstance.loadKitchenBoard();
    window.restauranteInstance.loadBarBoard();
    window.restauranteInstance.loadDashboard();
}

function markAsReady(orderId) {
    storage.update('orders', orderId, { status: 'ready' }, window.restauranteInstance.currentCompany.id);
    Utils.showNotification('Pedido pronto!', 'success');
    window.restauranteInstance.loadKitchenBoard();
    window.restauranteInstance.loadBarBoard();
    window.restauranteInstance.loadDashboard();
}

function completeOrder(orderId) {
    Utils.confirmDialog('Marcar pedido como concluído?', () => {
        storage.update('orders', orderId, { status: 'completed' }, window.restauranteInstance.currentCompany.id);
        Utils.showNotification('Pedido concluído!', 'success');
        window.restauranteInstance.loadOrdersTable();
        window.restauranteInstance.loadDashboard();
    });
}

function openMenuItemModal() {
    const content = `
        <form id="menuItemForm">
            <div class="form-group">
                <label>Nome *</label>
                <input type="text" id="itemName" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Categoria *</label>
                    <select id="itemCategory" required>
                        <option value="">Selecione...</option>
                        <option value="Entrada">Entrada</option>
                        <option value="Prato Principal">Prato Principal</option>
                        <option value="Sobremesa">Sobremesa</option>
                        <option value="Bebida">Bebida</option>
                        <option value="Acompanhamento">Acompanhamento</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tipo *</label>
                    <select id="itemType" required>
                        <option value="food">Comida (Cozinha)</option>
                        <option value="drink">Bebida (Balcão)</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Preço *</label>
                    <input type="number" id="itemPrice" required min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Disponível</label>
                    <select id="itemAvailable">
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Descrição</label>
                <textarea id="itemDescription" rows="3"></textarea>
            </div>
        </form>
    `;

    ModalManager.create('Novo Item do Cardápio', content, [
        {
            text: 'Salvar',
            type: 'primary',
            onclick: 'saveMenuItem()'
        }
    ]);
}

function saveMenuItem() {
    const menuItem = {
        name: document.getElementById('itemName').value.trim(),
        category: document.getElementById('itemCategory').value,
        type: document.getElementById('itemType').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        available: document.getElementById('itemAvailable').value === 'true',
        description: document.getElementById('itemDescription').value.trim()
    };

    if (!menuItem.name || !menuItem.category || !menuItem.price) {
        Utils.showNotification('Preencha todos os campos obrigatórios', 'danger');
        return;
    }

    storage.create('menuItems', menuItem, window.restauranteInstance.currentCompany.id);
    Utils.showNotification('Item adicionado ao cardápio!', 'success');
    document.querySelectorAll('.modal').forEach(m => m.remove());
    window.restauranteInstance.loadMenuTable();
}

function openTableModal() {
    const content = `
        <form id="tableForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Número da Mesa *</label>
                    <input type="number" id="tableNumber" required min="1">
                </div>
                <div class="form-group">
                    <label>Capacidade *</label>
                    <input type="number" id="tableCapacity" required min="1" value="4">
                </div>
            </div>
        </form>
    `;

    ModalManager.create('Nova Mesa', content, [
        {
            text: 'Salvar',
            type: 'primary',
            onclick: 'saveTable()'
        }
    ]);
}

function saveTable() {
    const table = {
        number: parseInt(document.getElementById('tableNumber').value),
        capacity: parseInt(document.getElementById('tableCapacity').value),
        status: 'available',
        currentOrders: []
    };

    storage.create('tables', table, window.restauranteInstance.currentCompany.id);
    Utils.showNotification('Mesa adicionada!', 'success');
    document.querySelectorAll('.modal').forEach(m => m.remove());
    window.restauranteInstance.loadTablesList();
}

function generateReport(type) {
    Utils.showNotification(`Gerando relatório de ${type}...`, 'info');
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
                        <option value="Garçom">Garçom</option>
                        <option value="Cozinheiro">Cozinheiro</option>
                        <option value="Barman">Barman</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Caixa">Caixa</option>
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

    storage.create('employees', employee, window.restauranteInstance.currentCompany.id);
    Utils.showNotification('Funcionário cadastrado com sucesso!', 'success');
    document.querySelectorAll('.modal').forEach(m => m.remove());
    window.restauranteInstance.loadEmployeesTable();
}

function viewOrderDetails(orderId) {
    const order = storage.getById('orders', orderId);
    const content = `
        <div>
            <h3>Pedido #${order.orderNumber}</h3>
            <p><strong>${order.tableNumber ? `Mesa ${order.tableNumber}` : 'Delivery'}</strong></p>
            <p>Status: <span class="badge badge-info">${order.status}</span></p>
            <hr>
            <h4>Itens:</h4>
            ${order.items.map(item => `
                <div style="padding: 10px; background: var(--bg-color); border-radius: 8px; margin: 5px 0;">
                    <strong>${item.quantity}x ${item.name}</strong>
                    <p style="margin: 0; color: var(--text-secondary);">
                        ${Utils.formatCurrency(item.price, window.restauranteInstance.currentCompany.currency)} cada
                    </p>
                </div>
            `).join('')}
            <hr>
            <div style="text-align: right;">
                <h3>Total: ${Utils.formatCurrency(order.total, window.restauranteInstance.currentCompany.currency)}</h3>
            </div>
        </div>
    `;

    ModalManager.create('Detalhes do Pedido', content, []);
}

// Inicializar
const restauranteInstance = new Restaurante();
window.restauranteInstance = restauranteInstance;
