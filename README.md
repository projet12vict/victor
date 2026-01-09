# 🏪 Sistema MultiEmpresas SaaS

Sistema web completo de gestão comercial multiempresas para **Padarias**, **Restaurantes** e **Minimercados** com isolamento total de dados (multi-tenant).

## 🚀 Características Principais

- ✅ **Multi-tenant** - Isolamento completo de dados entre empresas
- ✅ **Super Admin** único com gestão completa
- ✅ **3 Módulos independentes**: Padaria, Restaurante e Minimercado
- ✅ **Sistema de autenticação** robusto
- ✅ **Responsivo** e moderno
- ✅ **LocalStorage** para persistência de dados
- ✅ **Dashboard** individual para cada tipo de negócio

## 🔐 Acesso Super-Admin

**Email:** `victorallissson@gmail.com`  
**Senha:** `H1victoria@02`

## 📁 Estrutura do Projeto

```
webapp/
├── index.html              # Página de login
├── super-admin.html        # Dashboard do Super Admin
├── padaria.html           # Dashboard da Padaria
├── restaurante.html       # Dashboard do Restaurante (em desenvolvimento)
├── minimercado.html       # Dashboard do Minimercado (em desenvolvimento)
├── css/
│   └── style.css          # Estilos globais
└── js/
    ├── app.js             # Core da aplicação
    ├── auth.js            # Sistema de autenticação
    ├── super-admin.js     # Lógica do Super Admin
    ├── padaria.js         # Lógica da Padaria
    ├── restaurante.js     # Lógica do Restaurante (em desenvolvimento)
    └── minimercado.js     # Lógica do Minimercado (em desenvolvimento)
```

## 🔧 Funcionalidades por Módulo

### 👑 Super Admin
- ✅ Criar, editar, bloquear e excluir empresas
- ✅ Definir tipo de empresa (Padaria/Restaurante/Minimercado)
- ✅ Definir moeda (€ Euro ou $ CVE)
- ✅ Controlar status (Ativo/Inativo)
- ✅ Dashboard com estatísticas gerais
- ✅ Controle de pagamentos

### 🥖 Padaria (10 Menus)
1. **Dashboard** - Visão geral da operação
2. **Produção** - Gestão completa do fluxo produtivo
3. **Matéria-prima** - Controle de ingredientes
4. **Receitas/Fórmulas** - Cadastro de receitas
5. **Embalagem** - Controle de embalagens
6. **Aprovação de Produtos** - Controle de qualidade
7. **Estoque** - Gestão de produtos finais
8. **Vendas/PDV** - Ponto de venda
9. **Funcionários** - Gestão de equipe
10. **Relatórios** - Análises e relatórios

#### Fluxo de Produção da Padaria:
1. Entrada de matéria-prima
2. Armazenamento
3. Preparação
4. Produção
5. Embalagem
6. Aprovação
7. Entrada no estoque

### 🍽️ Restaurante (10 Menus) - Em Desenvolvimento
1. Dashboard
2. Mesas
3. Pedidos
4. Cozinha
5. Balcão/Bar
6. Cardápio
7. Estoque
8. Delivery
9. Funcionários
10. Relatórios

### 🛒 Minimercado (10 Menus) - Em Desenvolvimento
1. Dashboard
2. Produtos
3. Estoque
4. Frente de Caixa (PDV)
5. E-commerce
6. Pedidos Online
7. Clientes
8. Funcionários
9. Financeiro
10. Relatórios

## 💻 Como Usar

### 1. Acessar o Sistema
Abra o arquivo `index.html` no navegador.

### 2. Login como Super Admin
Use as credenciais fornecidas acima para acessar o painel de administração.

### 3. Criar Empresa
1. No painel Super Admin, clique em "Empresas"
2. Clique em "Nova Empresa"
3. Preencha os dados:
   - Nome da empresa
   - Tipo (Padaria/Restaurante/Minimercado)
   - Email de acesso
   - Senha
   - Nome do administrador
   - Moeda (€ ou $)
   - Telefone e endereço (opcionais)
4. Clique em "Salvar"

### 4. Fazer Login na Empresa
1. Faça logout do Super Admin
2. Use o email e senha da empresa criada
3. Você será redirecionado para o dashboard específico do tipo de negócio

## 🎨 Tecnologias Utilizadas

- **HTML5** - Estrutura
- **CSS3** - Estilização moderna com variáveis CSS
- **JavaScript (ES6+)** - Lógica da aplicação
- **Font Awesome 6** - Ícones
- **LocalStorage** - Persistência de dados

## 📊 Sistema de Dados (Multi-tenant)

Todas as operações respeitam o isolamento de dados por empresa:

```javascript
// Exemplo de criação isolada
storage.create('products', productData, companyId);

// Exemplo de listagem isolada
storage.getAll('sales', companyId);
```

### Collections:
- `companies` - Empresas cadastradas
- `employees` - Funcionários por empresa
- `products` - Produtos por empresa
- `sales` - Vendas por empresa
- `production` - Produção (Padaria)
- `stock` - Estoque por empresa
- `orders` - Pedidos (Restaurante/Minimercado)
- `tables` - Mesas (Restaurante)
- `timesheet` - Ponto eletrônico

## 🔒 Segurança

- Autenticação obrigatória para todos os módulos
- Isolamento total de dados entre empresas
- Validação de formulários
- Confirmações para ações críticas

## 🎯 Roadmap

- [x] Sistema de autenticação
- [x] Dashboard Super Admin
- [x] Gestão de empresas
- [x] Módulo Padaria completo
- [ ] Módulo Restaurante (sistema de mesas)
- [ ] Módulo Minimercado (PDV + E-commerce)
- [ ] Sistema de funcionários avançado
- [ ] Ponto eletrônico
- [ ] Relatórios avançados
- [ ] Exportação de dados
- [ ] Integração com APIs de pagamento
- [ ] Modo escuro

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta a:
- 💻 Desktops
- 📱 Tablets
- 📱 Smartphones

## 🤝 Suporte

Para dúvidas ou sugestões, entre em contato através do email do Super Admin.

## 📄 Licença

Sistema proprietário para uso comercial.

---

**Desenvolvido com ❤️ para gestão comercial eficiente**
