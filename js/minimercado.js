// ====================================
// MINIMERCADO - PDV + E-COMMERCE
// ====================================

class Minimercado {
    constructor() {
        this.currentUser = AuthManager.requireAuth();
        this.currentCompany = AuthManager.requireCompany();

        if (!this.currentCompany || this.currentCompany.type !== 'minimercado') {
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

    loadDashboard() {
        const products = storage.getAll('products', this.currentCompany.id);
        const sales = storage.getAll('sales', this.currentCompany.id);
        const onlineOrders = storage.getAll('onlineOrders', this.currentCompany.id);

        // Vendas hoje
        const today = new Date().toDateString();
        const todaySales = sales.filter(s => 
            new Date(s.createdAt).toDateString() === today
        );
        const todaySalesTotal = todaySales.reduce((sum, s) => sum + s.total, 0);

        // Pedidos hoje
        const todayOrders = todaySales.length + onlineOrders.filter(o => 
            new Date(o.createdAt).toDateString() === today
        ).length;

        // Produtos em estoque
        const productsInStock = products.filter(p => p.stock > 0).length;

        // Estoque baixo
        const lowStock = products.filter(p => p.stock <= p.minStock).length;

        document.getElementById('todaySales').textContent = 
            Utils.formatCurrency(todaySalesTotal, this.currentCompany.currency);
        document.getElementById('todayOrders').textContent = todayOrders;
        document.getElementById('productsInStock').textContent = productsInStock;
        document.getElementById('lowStockProducts').textContent = lowStock;

        // Badges
        document.getElementById('productsCount').textContent = products.length;
        document.getElementById('onlineOrdersCount').textContent = 
            onlineOrders.filter(o => o.status !== 'completed').length;

        // Produtos mais vendidos
        this.renderTopProducts(products, sales);

        // Pedidos recentes
        this.renderRecentOrders(sales, onlineOrders);
    }

    renderTopProducts(products, sales) {
        const container = document.getElementById('topProducts');
        
        // Contar vendas por produto
        const productSales = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (productSales[item.productId]) {
                    productSales[item.productId] += item.quantity;
                } else {
                    productSales[item.productId] = item.quantity;
                }
            });
        });

        // Ordenar produtos mais vendidos
        const sortedProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        if (sortedProducts.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">Nenhuma venda registrada</p>';
            return;
        }

        container.innerHTML = sortedProducts.map(([productId, quantity]) => {
            const product = products.find(p => p.id === productId);
            if (!product) return '';
            
            return `
                <div style="padding: 15px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${product.name}</strong>
                        <p style="margin: 5px 0 0 0; color: var(--text-secondary); font-size: 12px;">
                            ${product.category}
                        </p>
                    </div>
                    <span class="badge badge-success">${quantity} vendidos</span>
                </div>
            `;
        }).join('');
    }

    renderRecentOrders(sales, onlineOrders) {
        const container = document.getElementById('recentOrders');
        
        // Combinar todos os pedidos
        const allOrders = [
            ...sales.map(s => ({...s, type: 'loja', orderNumber: s.id.substr(0, 8)})),
            ...onlineOrders.map(o => ({...o, type: 'online'}))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
         .slice(0, 10);

        if (allOrders.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">Nenhum pedido registrado</p>';
            return;
        }

        container.innerHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Pedido</th>
                            <th>Itens</th>
                            <th>Total</th>
                            <th>Data/Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allOrders.map(order => `
                            <tr>
                                <td>
                                    <span class="badge badge-${order.type === 'online' ? 'primary' : 'success'}">
                                        ${order.type === 'online' ? 'Online' : 'Loja'}
                                    </span>
                                </td>
                                <td>#${order.orderNumber}</td>
                                <td>${order.items.length} itens</td>
                                <td><strong>${Utils.formatCurrency(order.total, this.currentCompany.currency)}</strong></td>
                                <td>${Utils.formatDateTime(order.createdAt)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    loadProductsTable() {
        const products = storage.getAll('products', this.currentCompany.id);
        const tbody = document.getElementById('productsTable');

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-box" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                        <p style="color: var(--text-secondary);">Nenhum produto cadastrado</p>
                        <button class="btn btn-primary mt-20" onclick="openProductModal()">
                            <i class="fas fa-plus"></i> Cadastrar Primeiro Produto
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = products.map(product => {
            const stockStatus = product.stock <= product.minStock ? 'danger' : 'success';
            return `
                <tr>
                    <td><strong>${product.code}</strong></td>
                    <td>${product.name}</td>
                    <td><span class="badge badge-info">${product.category}</span></td>
                    <td><strong>${Utils.formatCurrency(product.price, this.currentCompany.currency)}</strong></td>
                    <td>
                        <span class="badge badge-${stockStatus}">
                            ${product.stock} un
                        </span>
                    </td>
                    <td>
                        <span class="badge badge-${product.active ? 'success' : 'secondary'}">
                            ${product.active ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadStockTable() {
        const products = storage.getAll('products', this.currentCompany.id);
        const tbody = document.getElementById('stockTable');

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        Nenhum produto no estoque
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = products.map(product => {
            const stockStatus = product.stock <= product.minStock ? 'danger' : 'success';
            const statusText = product.stock <= product.minStock ? 'Crítico' : 'OK';
            
            return `
                <tr>
                    <td><strong>${product.name}</strong><br><small style="color: var(--text-secondary);">${product.code}</small></td>
                    <td><strong>${product.stock}</strong></td>
                    <td>${product.minStock}</td>
                    <td><span class="badge badge-${stockStatus}">${statusText}</span></td>
                    <td>${Utils.formatDateTime(product.updatedAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="adjustStock('${product.id}')">
                            <i class="fas fa-edit"></i> Ajustar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadPOSProducts() {
        const products = storage.getAll('products', this.currentCompany.id)
            .filter(p => p.active && p.stock > 0);
        const container = document.getElementById('posProducts');

        if (products.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">Nenhum produto disponível</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="card" style="cursor: pointer; text-align: center;" onclick="addToPOSCart('${product.id}')">
                <div class="card-body">
                    ${product.photo ? 
                        `<img src="${product.photo}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;" onerror="this.style.display='none'">` : 
                        `<i class="fas fa-box" style="font-size: 36px; color: var(--primary-color); margin-bottom: 10px;"></i>`
                    }
                    <h4 style="font-size: 13px; margin: 8px 0;">${product.name}</h4>
                    <p style="font-size: 18px; font-weight: bold; color: var(--success-color); margin: 0;">
                        ${Utils.formatCurrency(product.price, this.currentCompany.currency)}
                    </p>
                    <p style="font-size: 11px; color: var(--text-secondary); margin: 5px 0 0 0;">
                        Estoque: ${product.stock}
                    </p>
                </div>
            </div>
        `).join('');

        this.renderPOSCart();
    }

    renderPOSCart() {
        const container = document.getElementById('posCart');
        
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
            <div style="background: var(--bg-color); border-radius: 10px; padding: 15px; max-height: 400px; overflow-y: auto;">
                ${this.cart.map((item, index) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                        <div style="flex: 1;">
                            <strong style="font-size: 13px;">${item.name}</strong><br>
                            <small style="color: var(--text-secondary);">${Utils.formatCurrency(item.price, this.currentCompany.currency)}</small>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button class="btn btn-sm" onclick="updatePOSCartQuantity(${index}, -1)" style="padding: 4px 8px;">-</button>
                            <span style="font-weight: bold; min-width: 30px; text-align: center;">${item.cartQuantity}</span>
                            <button class="btn btn-sm" onclick="updatePOSCartQuantity(${index}, 1)" style="padding: 4px 8px;">+</button>
                            <button class="btn btn-sm btn-danger" onclick="removeFromPOSCart(${index})" style="padding: 4px 8px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <strong>Total:</strong>
                    <strong style="font-size: 24px; color: var(--success-color);">
                        ${Utils.formatCurrency(total, this.currentCompany.currency)}
                    </strong>
                </div>
                <button class="btn btn-success btn-block" onclick="completePOSSale()">
                    <i class="fas fa-check"></i> Finalizar Venda
                </button>
                <button class="btn btn-secondary btn-block mt-10" onclick="clearPOSCart()">
                    <i class="fas fa-times"></i> Limpar Carrinho
                </button>
            </div>
        `;
    }

    loadEcommerceProducts() {
        const products = storage.getAll('products', this.currentCompany.id)
            .filter(p => p.active && p.stock > 0);
        const container = document.getElementById('ecommerceProducts');

        if (products.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">Nenhum produto disponível na loja online</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="card">
                <div class="card-body">
                    ${product.photo ? 
                        `<img src="${product.photo}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;" onerror="this.style.display='none'">` : 
                        `<div style="width: 100%; height: 150px; background: var(--bg-color); border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-box" style="font-size: 48px; color: var(--text-secondary);"></i>
                        </div>`
                    }
                    <h4 style="font-size: 14px; margin: 0 0 5px 0;">${product.name}</h4>
                    <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 10px 0;">${product.category}</p>
                    <p style="font-size: 20px; font-weight: bold; color: var(--success-color); margin: 0 0 10px 0;">
                        ${Utils.formatCurrency(product.price, this.currentCompany.currency)}
                    </p>
                    <span class="badge badge-${product.stock > 10 ? 'success' : 'warning'}">
                        ${product.stock} em estoque
                    </span>
                </div>
            </div>
        `).join('');
    }

    loadOnlineOrdersTable() {
        const onlineOrders = storage.getAll('onlineOrders', this.currentCompany.id);
        const tbody = document.getElementById('onlineOrdersTable');

        if (onlineOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        Nenhum pedido online registrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = onlineOrders.map(order => {
            const statusColors = {
                'pending': 'warning',
                'confirmed': 'info',
                'preparing': 'primary',
                'ready': 'success',
                'completed': 'success',
                'cancelled': 'danger'
            };

            const statusTexts = {
                'pending': 'Pendente',
                'confirmed': 'Confirmado',
                'preparing': 'Preparando',
                'ready': 'Pronto',
                'completed': 'Concluído',
                'cancelled': 'Cancelado'
            };

            return `
                <tr>
                    <td><strong>#${order.orderNumber}</strong></td>
                    <td>${order.customerName}</td>
                    <td>${order.items.length} itens</td>
                    <td><strong>${Utils.formatCurrency(order.total, this.currentCompany.currency)}</strong></td>
                    <td><span class="badge badge-${statusColors[order.status]}">${statusTexts[order.status]}</span></td>
                    <td>${Utils.formatDateTime(order.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewOnlineOrder('${order.id}')" title="Ver Detalhes">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${order.status !== 'completed' && order.status !== 'cancelled' ? `
                            <button class="btn btn-sm btn-success" onclick="completeOnlineOrder('${order.id}')" title="Concluir">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadCustomersTable() {
        const customers = storage.getAll('customers', this.currentCompany.id);
        const tbody = document.getElementById('customersTable');

        if (customers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <i class="fas fa-users" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
                        <p style="color: var(--text-secondary);">Nenhum cliente cadastrado</p>
                        <button class="btn btn-primary mt-20" onclick="openCustomerModal()">
                            <i class="fas fa-plus"></i> Cadastrar Primeiro Cliente
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = customers.map(customer => {
            const totalPurchases = customer.totalPurchases || 0;
            return `
                <tr>
                    <td><strong>${customer.name}</strong></td>
                    <td>${customer.email}</td>
                    <td>${customer.phone || 'N/A'}</td>
                    <td><strong>${Utils.formatCurrency(totalPurchases, this.currentCompany.currency)}</strong></td>
                    <td>${Utils.formatDate(customer.createdAt)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editCustomer('${customer.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer.id}')">
                            <i class="fas fa-trash"></i>
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
                        <i class="fas fa-user-tie" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 10px;"></i>
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

    loadFinancial() {
        const sales = storage.getAll('sales', this.currentCompany.id);
        const onlineOrders = storage.getAll('onlineOrders', this.currentCompany.id)
            .filter(o => o.status === 'completed');

        // Faturamento mensal
        const currentMonth = new Date().getMonth();
        const monthlyRevenue = [...sales, ...onlineOrders]
            .filter(s => new Date(s.createdAt).getMonth() === currentMonth)
            .reduce((sum, s) => sum + s.total, 0);

        // Vendas hoje
        const today = new Date().toDateString();
        const todayRevenue = [...sales, ...onlineOrders]
            .filter(s => new Date(s.createdAt).toDateString() === today)
            .reduce((sum, s) => sum + s.total, 0);

        // Ticket médio
        const totalOrders = sales.length + onlineOrders.length;
        const totalRevenue = [...sales, ...onlineOrders].reduce((sum, s) => sum + s.total, 0);
        const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        document.getElementById('monthlyRevenue').textContent = 
            Utils.formatCurrency(monthlyRevenue, this.currentCompany.currency);
        document.getElementById('todayRevenue').textContent = 
            Utils.formatCurrency(todayRevenue, this.currentCompany.currency);
        document.getElementById('averageTicket').textContent = 
            Utils.formatCurrency(averageTicket, this.currentCompany.currency);
    }
}

// Funções globais
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    
    document.getElementById(sectionName + 'Section').classList.remove('hidden');
    event.target.closest('.menu-item').classList.add('active');

    const titles = {
        dashboard: 'Dashboard Minimercado',
        products: 'Gestão de Produtos',
        stock: 'Controle de Estoque',
        pos: 'Ponto de Venda (PDV)',
        ecommerce: 'Loja Online',
        onlineOrders: 'Pedidos Online',
        customers: 'Gestão de Clientes',
        employees: 'Funcionários',
        financial: 'Financeiro',
        reports: 'Relatórios'
    };

    document.getElementById('pageTitle').textContent = titles[sectionName];

    const minimercado = window.minimercadoInstance;
    switch(sectionName) {
        case 'dashboard':
            minimercado.loadDashboard();
            break;
        case 'products':
            minimercado.loadProductsTable();
            break;
        case 'stock':
            minimercado.loadStockTable();
            break;
        case 'pos':
            minimercado.loadPOSProducts();
            break;
        case 'ecommerce':
            minimercado.loadEcommerceProducts();
            break;
        case 'onlineOrders':
            minimercado.loadOnlineOrdersTable();
            break;
        case 'customers':
            minimercado.loadCustomersTable();
            break;
        case 'employees':
            minimercado.loadEmployeesTable();
            break;
        case 'financial':
            minimercado.loadFinancial();
            break;
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    form.reset();

    if (productId) {
        const product = storage.getById('products', productId);
        if (product) {
            document.getElementById('productModalTitle').textContent = 'Editar Produto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productCode').value = product.code;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productMinStock').value = product.minStock;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productPhoto').value = product.photo || '';
        }
    } else {
        document.getElementById('productModalTitle').textContent = 'Novo Produto';
        document.getElementById('productId').value = '';
    }

    modal.classList.add('active');
}

function saveProduct() {
    const productId = document.getElementById('productId').value;
    const productData = {
        code: document.getElementById('productCode').value.trim(),
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        minStock: parseInt(document.getElementById('productMinStock').value),
        description: document.getElementById('productDescription').value.trim(),
        photo: document.getElementById('productPhoto').value.trim(),
        active: true
    };

    // Validar
    if (!productData.code || !productData.name || !productData.category || !productData.price) {
        Utils.showNotification('Preencha todos os campos obrigatórios', 'danger');
        return;
    }

    if (productId) {
        storage.update('products', productId, productData, window.minimercadoInstance.currentCompany.id);
        Utils.showNotification('Produto atualizado com sucesso!', 'success');
    } else {
        storage.create('products', productData, window.minimercadoInstance.currentCompany.id);
        Utils.showNotification('Produto cadastrado com sucesso!', 'success');
    }

    closeModal('productModal');
    window.minimercadoInstance.loadProductsTable();
    window.minimercadoInstance.loadDashboard();
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    const product = storage.getById('products', productId);
    Utils.confirmDialog(`Deseja realmente excluir o produto "${product.name}"?`, () => {
        storage.delete('products', productId, window.minimercadoInstance.currentCompany.id);
        Utils.showNotification('Produto excluído com sucesso!', 'success');
        window.minimercadoInstance.loadProductsTable();
        window.minimercadoInstance.loadDashboard();
    });
}

function searchProducts() {
    const searchTerm = document.getElementById('searchProduct').value.toLowerCase();
    const rows = document.querySelectorAll('#productsTable tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function adjustStock(productId) {
    const product = storage.getById('products', productId);
    const newStock = prompt(`Ajustar estoque de "${product.name}"\nEstoque atual: ${product.stock}\n\nNova quantidade:`, product.stock);
    
    if (newStock !== null && !isNaN(newStock) && parseInt(newStock) >= 0) {
        storage.update('products', productId, { stock: parseInt(newStock) }, window.minimercadoInstance.currentCompany.id);
        Utils.showNotification('Estoque atualizado!', 'success');
        window.minimercadoInstance.loadStockTable();
        window.minimercadoInstance.loadDashboard();
    }
}

// PDV Functions
function addToPOSCart(productId) {
    const product = storage.getById('products', productId);
    if (!product) return;

    const existingIndex = window.minimercadoInstance.cart.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
        if (window.minimercadoInstance.cart[existingIndex].cartQuantity < product.stock) {
            window.minimercadoInstance.cart[existingIndex].cartQuantity++;
        } else {
            Utils.showNotification('Quantidade máxima em estoque atingida', 'warning');
            return;
        }
    } else {
        window.minimercadoInstance.cart.push({
            ...product,
            cartQuantity: 1
        });
    }

    window.minimercadoInstance.renderPOSCart();
}

function updatePOSCartQuantity(index, change) {
    const item = window.minimercadoInstance.cart[index];
    const newQuantity = item.cartQuantity + change;

    if (newQuantity <= 0) {
        removeFromPOSCart(index);
        return;
    }

    if (newQuantity > item.stock) {
        Utils.showNotification('Quantidade máxima em estoque atingida', 'warning');
        return;
    }

    item.cartQuantity = newQuantity;
    window.minimercadoInstance.renderPOSCart();
}

function removeFromPOSCart(index) {
    window.minimercadoInstance.cart.splice(index, 1);
    window.minimercadoInstance.renderPOSCart();
}

function clearPOSCart() {
    Utils.confirmDialog('Deseja limpar o carrinho?', () => {
        window.minimercadoInstance.cart = [];
        window.minimercadoInstance.renderPOSCart();
    });
}

function completePOSSale() {
    if (window.minimercadoInstance.cart.length === 0) {
        Utils.showNotification('Adicione produtos ao carrinho', 'warning');
        return;
    }

    const total = window.minimercadoInstance.cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

    const sale = {
        items: window.minimercadoInstance.cart.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.cartQuantity,
            price: item.price,
            subtotal: item.price * item.cartQuantity
        })),
        total,
        paymentMethod: 'Dinheiro'
    };

    storage.create('sales', sale, window.minimercadoInstance.currentCompany.id);

    // Atualizar estoque
    window.minimercadoInstance.cart.forEach(item => {
        storage.update('products', item.id, {
            stock: item.stock - item.cartQuantity
        }, window.minimercadoInstance.currentCompany.id);
    });

    Utils.showNotification(`Venda finalizada! Total: ${Utils.formatCurrency(total, window.minimercadoInstance.currentCompany.currency)}`, 'success');
    window.minimercadoInstance.cart = [];
    window.minimercadoInstance.loadPOSProducts();
    window.minimercadoInstance.loadDashboard();
}

function searchPOS() {
    const searchTerm = document.getElementById('posSearch').value.toLowerCase();
    const products = document.querySelectorAll('#posProducts .card');
    
    products.forEach(product => {
        const text = product.textContent.toLowerCase();
        product.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function viewOnlineStore() {
    Utils.showNotification('Visualização da loja online em desenvolvimento', 'info');
}

function viewOnlineOrder(orderId) {
    const order = storage.getById('onlineOrders', orderId);
    const content = `
        <div>
            <h3>Pedido #${order.orderNumber}</h3>
            <p><strong>Cliente:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
            <p><strong>Status:</strong> <span class="badge badge-info">${order.status}</span></p>
            <hr>
            <h4>Itens:</h4>
            ${order.items.map(item => `
                <div style="padding: 10px; background: var(--bg-color); border-radius: 8px; margin: 5px 0;">
                    <strong>${item.quantity}x ${item.name}</strong>
                    <p style="margin: 0; color: var(--text-secondary);">
                        ${Utils.formatCurrency(item.price, window.minimercadoInstance.currentCompany.currency)} cada
                    </p>
                </div>
            `).join('')}
            <hr>
            <div style="text-align: right;">
                <h3>Total: ${Utils.formatCurrency(order.total, window.minimercadoInstance.currentCompany.currency)}</h3>
            </div>
        </div>
    `;

    ModalManager.create('Detalhes do Pedido', content, []);
}

function completeOnlineOrder(orderId) {
    Utils.confirmDialog('Marcar pedido como concluído?', () => {
        storage.update('onlineOrders', orderId, { status: 'completed' }, window.minimercadoInstance.currentCompany.id);
        Utils.showNotification('Pedido concluído!', 'success');
        window.minimercadoInstance.loadOnlineOrdersTable();
        window.minimercadoInstance.loadDashboard();
    });
}

function openCustomerModal() {
    const content = `
        <form id="customerForm">
            <div class="form-group">
                <label>Nome Completo *</label>
                <input type="text" id="customerName" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" id="customerEmail" required>
                </div>
                <div class="form-group">
                    <label>Telefone *</label>
                    <input type="tel" id="customerPhone" required>
                </div>
            </div>
            <div class="form-group">
                <label>Endereço</label>
                <textarea id="customerAddress" rows="3"></textarea>
            </div>
        </form>
    `;

    ModalManager.create('Novo Cliente', content, [
        {
            text: 'Salvar',
            type: 'primary',
            onclick: 'saveCustomer()'
        }
    ]);
}

function saveCustomer() {
    const customer = {
        name: document.getElementById('customerName').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        address: document.getElementById('customerAddress').value.trim(),
        totalPurchases: 0
    };

    if (!customer.name || !customer.email || !customer.phone) {
        Utils.showNotification('Preencha todos os campos obrigatórios', 'danger');
        return;
    }

    storage.create('customers', customer, window.minimercadoInstance.currentCompany.id);
    Utils.showNotification('Cliente cadastrado com sucesso!', 'success');
    document.querySelectorAll('.modal').forEach(m => m.remove());
    window.minimercadoInstance.loadCustomersTable();
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
                        <option value="Caixa">Caixa</option>
                        <option value="Repositor">Repositor</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Açougueiro">Açougueiro</option>
                        <option value="Padeiro">Padeiro</option>
                        <option value="Atendente">Atendente</option>
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

    storage.create('employees', employee, window.minimercadoInstance.currentCompany.id);
    Utils.showNotification('Funcionário cadastrado com sucesso!', 'success');
    document.querySelectorAll('.modal').forEach(m => m.remove());
    window.minimercadoInstance.loadEmployeesTable();
}

function generateReport(type) {
    Utils.showNotification(`Gerando relatório de ${type}...`, 'info');
}

// Inicializar
const minimercadoInstance = new Minimercado();
window.minimercadoInstance = minimercadoInstance;
