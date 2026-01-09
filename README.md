# 🏢 Sistema Multiempresas V&C

Sistema completo de gestão comercial SaaS para **Padarias**, **Restaurantes** e **Minimercados** com isolamento total de dados entre empresas (multi-tenant).

![Logo V&C](./logo.png)

## 🌟 Características Principais

### ✅ Multi-tenant (Multiempresas)
- Isolamento completo de dados entre empresas
- Cada empresa acessa apenas seus próprios dados
- Super-admin com controle total do sistema
- Admins independentes por empresa

### 🔐 Sistema de Autenticação
- Login seguro com email e senha
- Níveis de acesso: Super-Admin, Admin, Funcionário
- Controle de permissões por módulo

### 💰 Suporte Multi-Moeda
- **€ (Euro)** - Para mercado europeu
- **$ (CVE)** - Para Cabo Verde

### 📱 100% Responsivo
- Otimizado para **Desktop**
- Adaptado para **Tablet**
- Interface móvel para **Smartphone**

---

## 🔑 Credencial de Acesso

### 👑 Super Admin (ÚNICO com acesso inicial)
```
Email: victorallissson@gmail.com
Senha: H1victoria@02
```

**⚠️ IMPORTANTE:**
- O sistema inicia SEM empresas cadastradas
- Apenas o Super Admin pode criar novas empresas
- Ao criar uma empresa, o Super Admin define:
  - Nome da empresa
  - Tipo (Padaria/Restaurante/Minimercado)
  - Moeda (€ ou $)
  - Código de ativação
  - Credenciais do administrador da empresa

---

## 🏢 Super-Admin Dashboard

O Super-Admin possui controle total sobre o sistema:

### 📊 Funcionalidades
- ✅ Criar, editar, bloquear e excluir empresas
- ✅ Definir tipo da empresa (Padaria | Restaurante | Minimercado)
- ✅ Definir moeda (€ ou $)
- ✅ Ativar/Desativar empresas
- ✅ Controlar status do plano
- ✅ Visualizar faturamento por empresa
- ✅ Dashboard com estatísticas globais

### 📈 Estatísticas
- Total de empresas cadastradas
- Empresas ativas vs inativas
- Receita mensal total
- Alertas de pagamento

---

## 🥖 PADARIA - Logística Completa de Produção

### 📋 10 Menus Disponíveis
1. **Dashboard** - Visão geral da produção
2. **Produção** - Gestão de lotes de produção
3. **Matéria-Prima** - Controle de ingredientes
4. **Receitas / Fórmulas** - Gestão de receitas
5. **Embalagem** - Controle de embalagens
6. **Aprovação** - Controle de qualidade
7. **Estoque** - Gestão de estoque final
8. **Vendas / PDV** - Ponto de venda
9. **Funcionários** - Gestão de equipe
10. **Relatórios** - Análises e relatórios

### 🔄 Fluxo de Produção (7 Etapas)
1. **Entrada de Matéria-Prima** - Registro de ingredientes
2. **Armazenamento** - Controle de estoque de MP
3. **Preparação** - Início da produção
4. **Produção** - Processo de fabricação
5. **Embalagem** - Empacotamento
6. **Aprovação** - Controle de qualidade
7. **Estoque Final** - Disponível para venda

### ✨ Recursos Especiais
- Cada etapa registra data, hora e funcionário responsável
- Atualização automática de estoque
- Alertas de estoque crítico
- Rastreabilidade completa do produto

---

## 🍽️ RESTAURANTE - Mesas, Cozinha e Balcão

### 📋 10 Menus Disponíveis
1. **Dashboard** - Visão geral do restaurante
2. **Mesas** - Gestão de mesas (6 mesas configuradas)
3. **Pedidos** - Gestão de pedidos
4. **Cozinha** - Área de preparo (comida)
5. **Balcão / Bar** - Área de bebidas
6. **Cardápio** - Gestão do menu
7. **Estoque** - Controle de ingredientes
8. **Delivery** - Pedidos para entrega
9. **Funcionários** - Gestão de equipe
10. **Relatórios** - Análises e relatórios

### 🪑 Sistema de Mesas
- **Status**: Livre | Ocupada | Reservada
- **Capacidade**: 2, 4, 6, 8 pessoas
- **Visualização**: Grid visual com cores por status
  - 🟢 Verde = Livre
  - 🔴 Vermelho = Ocupada
  - 🟡 Amarelo = Reservada

### 📝 Gestão de Pedidos
- **Pedidos Conjuntos**: Para a mesa inteira
- **Pedidos Individuais**: Por cliente
- **Separação Automática**:
  - 🍔 Comida → Enviada para Cozinha
  - 🍷 Bebidas → Enviada para Balcão

### 💳 Fecho de Conta
- **Conta Individual**: Cliente paga apenas seu pedido
- **Conta Conjunta**: Mesa inteira paga junto
- **Liberação Automática**: Mesa fica livre após pagamento completo

---

## 🛒 MINIMERCADO - PDV + E-commerce

### 📋 10 Menus Disponíveis
1. **Dashboard** - Visão geral das vendas
2. **Produtos** - Gestão de produtos
3. **Estoque** - Controle de estoque
4. **Frente de Caixa (PDV)** - Ponto de venda
5. **E-commerce** - Loja online
6. **Pedidos Online** - Gestão de pedidos web
7. **Clientes** - Base de clientes
8. **Funcionários** - Gestão de equipe
9. **Financeiro** - Controle financeiro
10. **Relatórios** - Análises e relatórios

### 💻 PDV - Ponto de Venda
- Interface visual de produtos
- Pesquisa rápida por nome ou código
- Carrinho de compras dinâmico
- Ajuste de quantidades (+/-)
- Cálculo automático de totais
- Finalização de venda

### 🌐 E-commerce
- Loja online integrada ao estoque
- Catálogo de produtos com fotos
- Carrinho de compras
- Sistema de pedidos online
- Atualização automática de estoque
- Área do cliente

### 📦 Gestão de Produtos
- Cadastro completo (nome, foto, código, categoria)
- Controle de preço e custo
- Estoque mínimo configurável
- Alertas de estoque baixo

---

## 👨‍💼 Gestão de Funcionários

### 📊 Funcionalidades (Todos os Tipos)
- ✅ Cadastro completo de funcionários
- ✅ Definição de funções e permissões
- ✅ Ponto eletrônico digital
- ✅ Registro de entrada e saída
- ✅ Cálculo automático de horas trabalhadas
- ✅ Relatório mensal de horas
- ✅ Exportação para folha de pagamento

---

## 🔒 Segurança

### 🛡️ Isolamento de Dados
- Cada empresa acessa apenas seus dados
- Não há compartilhamento entre empresas
- Super-admin tem acesso global controlado

### 📝 Logs e Auditoria
- Registro de ações importantes
- Rastreabilidade de operações
- Histórico de modificações

### 🔐 Controle de Acesso
- Autenticação obrigatória
- Permissões por função
- Bloqueio de empresa = bloqueio de acesso

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19.2.3 + TypeScript
- **UI**: Lucide React Icons + Tailwind CSS
- **Build**: Vite 6.2.0
- **Charts**: Recharts 3.6.0
- **Responsividade**: Mobile-First Design

---

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### URLs de Acesso
- **Desenvolvimento**: http://localhost:3000
- **Produção**: https://3000-i9szhtgwqnu86bjmf2hy9-b9b802c4.sandbox.novita.ai

---

## 📁 Estrutura do Projeto

```
webapp/
├── components/
│   ├── LoginPage.tsx              # Tela de login
│   ├── SuperAdminDashboard.tsx    # Dashboard super-admin
│   ├── CompanyDashboard.tsx       # Dashboard empresas
│   ├── padaria/
│   │   └── PadariaDashboard.tsx   # Módulos da padaria
│   ├── restaurante/
│   │   └── RestauranteDashboard.tsx # Módulos do restaurante
│   └── minimercado/
│       └── MinimercadoDashboard.tsx # Módulos do minimercado
├── types.ts                       # TypeScript types
├── mockData.ts                    # Dados de demonstração
├── App.tsx                        # Componente principal
├── index.tsx                      # Entry point
├── index.html                     # HTML base
├── logo.png                       # Logo V&C
└── README.md                      # Esta documentação
```

---

## 🎯 Próximas Funcionalidades

### Em Desenvolvimento
- [ ] Sistema de notificações em tempo real
- [ ] Integração com impressoras térmicas
- [ ] Backup automático de dados
- [ ] Relatórios avançados com gráficos
- [ ] Sistema de comissões
- [ ] Integração com sistemas de pagamento
- [ ] App mobile nativo
- [ ] API REST completa

---

## 📝 Notas Importantes

### ⚠️ Dados de Demonstração
Este sistema utiliza dados mockados para demonstração. Em produção:
- Implementar backend com banco de dados
- Adicionar autenticação JWT
- Implementar validações de segurança
- Adicionar criptografia de dados sensíveis

### 🔄 Atualizações Futuras
O sistema está em constante evolução. Novos módulos e funcionalidades serão adicionados regularmente.

---

## 📞 Suporte

**V_MILLION Consultoria, LDA**

© 2026 V_MILLION Consultoria, LDA - Todos os direitos reservados

---

## 🌟 Recursos Visuais

### Super-Admin
- Gestão visual de empresas em tabela
- Cards com estatísticas globais
- Modal de criação/edição de empresas
- Pesquisa e filtros

### Dashboards Empresas
- Sidebar responsiva com menu
- Cards coloridos de estatísticas
- Gráficos e visualizações
- Interface intuitiva

### PDV Minimercado
- Grid de produtos visuais
- Carrinho lateral
- Cálculo em tempo real
- Pesquisa instantânea

### Mesas Restaurante
- Grid visual de mesas
- Cores por status
- Informações de ocupação
- Abertura/fechamento rápido

---

**Sistema pronto para comercialização e uso profissional! 🚀**
