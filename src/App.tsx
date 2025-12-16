import React, { useState, useMemo, useEffect } from 'react';
import { 
    LayoutDashboard, 
    UtensilsCrossed, 
    ShoppingCart, 
    Settings, 
    Users, 
    ChefHat, 
    LogOut,
    Building2,
    Store,
    Menu,
    X,
    Search,
    Plus,
    Minus,
    Receipt,
    CreditCard,
    Upload,
    Image,
    Pencil,
    Save,
    User as UserIcon,
    Mail,
    Lock,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Trash2,
    Package,
    Tag,
    Square,
    Printer,
    Banknote,
    Coins,
    Bell,
    CheckCircle,
    Info,
    Camera,
    Wine,
    Utensils,
    Divide,
    CheckSquare,
    Square as SquareIcon,
    Power,
    AlertTriangle,
    Filter,
    ShieldCheck,
    Key
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { Logo } from './components/Logo';
import { StatCard } from './components/StatCard';
import { Company, CompanyType, Order, OrderItem, Product, Table, TableStatus, UserRole, User, OrderStatus, ActivationCode } from './types';
import { MOCK_COMPANIES, MOCK_PRODUCTS, MOCK_TABLES, MOCK_USERS } from './constants';

// --- Helpers ---
const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-CV', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ECV';
};

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Interface auxiliar para o estado dos pedidos
interface OrderItemDetail {
    product: Product;
    qty: number;
    paid: boolean; // Controla se o item já foi pago
    observation?: string;
}

interface ActiveOrder {
    items: OrderItemDetail[];
    kitchenStatus: OrderStatus; // Status independente da cozinha
    barStatus: OrderStatus;     // Status independente do bar
    waiterId: number;
    guests: number;
    startTime: Date;
}

interface Transaction {
    companyId: number;
    amount: number;
    date: Date;
}

// --- View Definitions ---
type View = 'SUPER_ADMIN' | 'SUPER_ADMIN_CONFIG' | 'LOGIN' | 'DASHBOARD' | 'RESTAURANT_POS' | 'KITCHEN' | 'BAR' | 'SUPERMARKET_POS' | 'SETTINGS';

// --- Components ---

// 0. Login Screen
const LoginScreen: React.FC<{
    company?: Company | null; // Made optional for Global Admin Login
    companies: Company[]; // Needed to validate user company status during global login
    onLogin: (user: User) => void;
    onBack?: () => void;
    users: User[];
}> = ({ company, companies, onLogin, onBack, users }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Find User Globally
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (!user) {
            setError('Credenciais inválidas. Verifique o email e a senha.');
            return;
        }

        // 2. Validation Logic based on Role
        if (user.role === UserRole.SUPER_ADMIN) {
            // Super Admin always passes
            onLogin(user);
        } else {
            // Company User
            const userCompany = companies.find(c => c.id === user.companyId);

            if (!userCompany) {
                setError('Erro de sistema: Empresa não encontrada para este utilizador.');
                return;
            }

            // If we are on a Specific Company Login Page (e.g. redirected from Admin), ensure match
            if (company && company.id !== userCompany.id) {
                setError(`Este utilizador não pertence a ${company.name}.`);
                return;
            }

            // Check if Company is Active
            if (!userCompany.isActive) {
                setError(`A empresa "${userCompany.name}" encontra-se suspensa. Contacte o administrador.`);
                return;
            }

            onLogin(user);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background geometric shapes for "mesclado cores" feel without darkness */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-3xl opacity-60"></div>
            </div>

            {company && onBack && (
                <button 
                    onClick={onBack}
                    className="absolute top-8 left-8 text-slate-600 hover:text-black flex items-center gap-2 transition-colors z-20 font-medium"
                >
                    <ArrowLeft size={20} /> Voltar ao Admin
                </button>
            )}

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden z-10 border border-slate-100 animate-in fade-in zoom-in duration-300">
                <div className="p-8 pb-6 bg-slate-50 border-b border-slate-100 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white shadow-md mb-4 flex items-center justify-center overflow-hidden border-4 border-white">
                        {company ? (
                            company.logoUrl ? (
                                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                            ) : (
                                <Store className="text-brand-600" size={40} />
                            )
                        ) : (
                            <Logo size="sm" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-black text-center">
                        {company ? company.name : 'Portal de Acesso'}
                    </h2>
                    <p className="text-sm text-slate-600 font-medium">
                        {company ? 'Acesso Restrito' : 'Sistema de Gestão Integrado'}
                    </p>
                    {company && !company.isActive && (
                        <div className="mt-2 px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center gap-1">
                            <AlertTriangle size={12} /> CONTA SUSPENSA
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100 text-center font-bold">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-black font-medium placeholder-slate-400"
                                placeholder={company ? "ex: gerente@empresa.com" : "email@exemplo.com"}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Palavra-passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-black font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit"
                            disabled={company ? !company.isActive : false}
                            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-brand-700 shadow-lg shadow-brand-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {company ? 'Entrar na Empresa' : 'Entrar'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-slate-600 font-medium">
                            Esqueceu a senha? Contacte o Suporte Técnico.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 0.1 Payment Modal
const PaymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    tableNumber: number;
    guests: number;
    items: OrderItemDetail[]; // Recebe todos os itens
    onConfirm: (method: 'CASH' | 'CARD', paidAmount: number, change: number, selectedItemIndices: number[]) => void;
}> = ({ isOpen, onClose, tableNumber, guests, items, onConfirm }) => {
    const [method, setMethod] = useState<'CASH' | 'CARD'>('CARD');
    const [billType, setBillType] = useState<'JOINT' | 'INDIVIDUAL'>('JOINT');
    const [cashReceived, setCashReceived] = useState<string>('');
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    // Inicializa selecionando todos os itens não pagos se for conta conjunta, ou limpa se for individual
    useEffect(() => {
        if (isOpen) {
            const unpaidIndices = items.map((_, i) => i).filter(i => !items[i].paid);
            setSelectedIndices(unpaidIndices);
            setBillType('JOINT');
            setCashReceived('');
        }
    }, [isOpen, items]);

    useEffect(() => {
        if (billType === 'JOINT') {
            const unpaidIndices = items.map((_, i) => i).filter(i => !items[i].paid);
            setSelectedIndices(unpaidIndices);
        } else {
            setSelectedIndices([]); // Começa vazio no modo individual para obrigar seleção
        }
    }, [billType]);

    const toggleItemSelection = (index: number) => {
        if (billType === 'JOINT') return; // Não permite desmarcar em conta conjunta total
        setSelectedIndices(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };
    
    if (!isOpen) return null;

    // Filter unpaid items for display
    const unpaidItems = items.map((item, index) => ({ ...item, originalIndex: index })).filter(item => !item.paid);

    // Calculate totals based on selection
    const calculateTotal = () => {
        return selectedIndices.reduce((acc, index) => {
            const item = items[index];
            return acc + (item ? item.product.price * item.qty : 0);
        }, 0);
    };

    const effectiveTotal = calculateTotal();
    const cashValue = Number(cashReceived);
    const change = method === 'CASH' ? Math.max(0, cashValue - effectiveTotal) : 0;
    const canConfirm = effectiveTotal > 0 && (method === 'CARD' || (method === 'CASH' && cashValue >= effectiveTotal));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 bg-slate-100 border-b border-slate-200 text-center shrink-0">
                    <h2 className="text-xl font-bold text-black">Pagamento - Mesa {tableNumber}</h2>
                    <div className="flex justify-center items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-brand-600">{formatCurrency(effectiveTotal)}</span>
                        {billType === 'INDIVIDUAL' && <span className="text-sm text-slate-600 font-medium">(Selecionado)</span>}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left Column: Items Selection */}
                    <div className="flex-1 p-6 border-r border-slate-100 overflow-y-auto bg-white">
                        <div className="flex bg-slate-100 p-1 rounded-lg mb-4 border border-slate-200">
                            <button 
                                onClick={() => setBillType('JOINT')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${billType === 'JOINT' ? 'bg-white text-black shadow-sm border border-slate-200' : 'text-slate-600 hover:text-black'}`}
                            >
                                Conta Total
                            </button>
                            <button 
                                onClick={() => setBillType('INDIVIDUAL')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${billType === 'INDIVIDUAL' ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-black'}`}
                            >
                                <UserIcon size={14} /> Dividir
                            </button>
                        </div>

                        <h3 className="font-bold text-black mb-3 text-sm uppercase border-b border-slate-100 pb-2">Itens a Pagar</h3>
                        <div className="space-y-2">
                            {unpaidItems.length === 0 ? (
                                <p className="text-slate-500 italic text-sm font-medium">Todos os itens já foram pagos.</p>
                            ) : (
                                unpaidItems.map((item) => (
                                    <div 
                                        key={item.originalIndex}
                                        onClick={() => toggleItemSelection(item.originalIndex)}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                            selectedIndices.includes(item.originalIndex) 
                                            ? 'bg-blue-50 border-blue-400 shadow-sm' 
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        } ${billType === 'JOINT' ? 'opacity-75 pointer-events-none' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {selectedIndices.includes(item.originalIndex) ? 
                                                <CheckSquare className="text-blue-600" size={20} /> : 
                                                <SquareIcon className="text-slate-400" size={20} />
                                            }
                                            <div>
                                                <div className="font-bold text-black text-sm">{item.product.name}</div>
                                                <div className="text-xs text-slate-600 font-medium">{item.qty}x un.</div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-black">
                                            {formatCurrency(item.product.price * item.qty)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Payment Method */}
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50">
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setMethod('CARD')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'CARD' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-black'}`}
                            >
                                <CreditCard size={32} />
                                <span className="font-bold">Vinte4</span>
                            </button>
                            <button 
                                onClick={() => {
                                    setMethod('CASH');
                                    setCashReceived(effectiveTotal.toString());
                                }}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'CASH' ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-black'}`}
                            >
                                <Banknote size={32} />
                                <span className="font-bold">Dinheiro</span>
                            </button>
                        </div>

                        {method === 'CASH' && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 animate-in slide-in-from-top-2 shadow-sm">
                                <div>
                                    <label className="block text-sm font-bold text-black mb-1">Valor Entregue</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input 
                                            type="number" 
                                            autoFocus
                                            className="w-full pl-8 pr-4 py-3 text-lg font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-black"
                                            placeholder="0.00"
                                            value={cashReceived}
                                            onChange={e => setCashReceived(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                    <span className="text-black font-medium">Troco a devolver:</span>
                                    <span className={`text-xl font-bold ${change > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                        {formatCurrency(change)}
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        <div className="pt-4">
                            <button 
                                disabled={!canConfirm}
                                onClick={() => onConfirm(method, method === 'CASH' ? cashValue : effectiveTotal, change, selectedIndices)}
                                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-200 flex items-center justify-center gap-2"
                            >
                                <Receipt size={20} /> Confirmar Pagamento
                            </button>
                            <button 
                                onClick={onClose}
                                className="w-full mt-3 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-white hover:border-slate-400 bg-transparent transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 1. Sidebar (Responsive - Light Theme)
const Sidebar: React.FC<{
    view: View;
    setView: (view: View) => void;
    activeCompany: Company | null;
    role: UserRole;
    onLogout: () => void;
    currentUser: User | null;
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}> = ({ view, setView, activeCompany, role, onLogout, currentUser, isOpen, setIsOpen }) => {
    if (view === 'LOGIN') return null;

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container - Now Light Theme */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white text-slate-800 flex flex-col shadow-2xl z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-slate-200`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-center relative bg-slate-50">
                    {/* Close button for mobile */}
                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 lg:hidden text-slate-500 hover:text-black">
                        <X size={20} />
                    </button>

                    {activeCompany ? (
                        <div className="flex flex-col items-center gap-2">
                            {activeCompany.logoUrl ? (
                                <div className="w-16 h-16 rounded-full bg-white p-1 overflow-hidden border border-slate-200 shadow-sm">
                                    <img src={activeCompany.logoUrl} alt={activeCompany.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                            ) : (
                                <Store className="w-12 h-12 text-brand-600" />
                            )}
                            <span className="font-bold text-black text-center leading-tight">{activeCompany.name}</span>
                        </div>
                    ) : (
                        <Logo size="sm" />
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {role === UserRole.SUPER_ADMIN && (
                        <>
                            <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 mt-2">
                                Administração Global
                            </div>
                            <button
                                onClick={() => { setView('SUPER_ADMIN'); setIsOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === 'SUPER_ADMIN' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                            >
                                <Building2 size={20} className={view === 'SUPER_ADMIN' ? 'text-brand-600' : 'text-slate-500'} />
                                <span>Empresas</span>
                            </button>
                            <button
                                onClick={() => { setView('SUPER_ADMIN_CONFIG'); setIsOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === 'SUPER_ADMIN_CONFIG' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                            >
                                <ShieldCheck size={20} className={view === 'SUPER_ADMIN_CONFIG' ? 'text-brand-600' : 'text-slate-500'} />
                                <span>Configurações Globais</span>
                            </button>
                        </>
                    )}

                    {activeCompany && (
                        <>
                            <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 mt-2">
                                Módulos
                            </div>
                            
                            <button
                                onClick={() => { setView('DASHBOARD'); setIsOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === 'DASHBOARD' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                            >
                                <LayoutDashboard size={20} className={view === 'DASHBOARD' ? 'text-brand-600' : 'text-slate-500'} />
                                <span>Dashboard</span>
                            </button>

                            {(activeCompany.type === CompanyType.RESTAURANT || activeCompany.type === CompanyType.MIXED) && (
                                <>
                                    <button
                                        onClick={() => { setView('RESTAURANT_POS'); setIsOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === 'RESTAURANT_POS' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                                    >
                                        <UtensilsCrossed size={20} className={view === 'RESTAURANT_POS' ? 'text-brand-600' : 'text-slate-500'} />
                                        <span>Sala / Mesas</span>
                                    </button>
                                    <button
                                        onClick={() => { setView('KITCHEN'); setIsOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === 'KITCHEN' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                                    >
                                        <ChefHat size={20} className={view === 'KITCHEN' ? 'text-brand-600' : 'text-slate-500'} />
                                        <span>Cozinha (KDS)</span>
                                    </button>
                                    <button
                                        onClick={() => { setView('BAR'); setIsOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === 'BAR' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                                    >
                                        <Wine size={20} className={view === 'BAR' ? 'text-brand-600' : 'text-slate-500'} />
                                        <span>Bar / Copa</span>
                                    </button>
                                </>
                            )}

                            {(activeCompany.type === CompanyType.SUPERMARKET || activeCompany.type === CompanyType.MIXED) && (
                                <button
                                    onClick={() => { setView('SUPERMARKET_POS'); setIsOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === 'SUPERMARKET_POS' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                                >
                                    <ShoppingCart size={20} className={view === 'SUPERMARKET_POS' ? 'text-brand-600' : 'text-slate-500'} />
                                    <span>Caixa / POS</span>
                                </button>
                            )}

                            <button
                                onClick={() => { setView('SETTINGS'); setIsOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${view === 'SETTINGS' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                            >
                                <Settings size={20} className={view === 'SETTINGS' ? 'text-brand-600' : 'text-slate-500'} />
                                <span>Configurações</span>
                            </button>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    {currentUser ? (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold shadow-sm">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-bold text-black truncate">{currentUser.name}</div>
                                <div className="text-xs text-slate-600 font-medium truncate">{currentUser.email}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">S</div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-bold text-black truncate">Super Admin</div>
                            </div>
                        </div>
                    )}
                
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 rounded-lg transition-colors text-sm font-bold shadow-sm"
                    >
                        <LogOut size={16} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

// 2. SuperAdminView
const SuperAdminView: React.FC<{
    companies: Company[];
    onSelectCompany: (id: number) => void;
    onSaveCompany: (company: Company, adminUser: any, code: string) => void;
    onToggleStatus: (id: number) => void;
    onDeleteCompany: (id: number) => void;
}> = ({ companies, onSelectCompany, onSaveCompany, onToggleStatus, onDeleteCompany }) => {
    const [isCreating, setIsCreating] = useState(false);
    // Form states
    const [name, setName] = useState('');
    const [type, setType] = useState<CompanyType>(CompanyType.RESTAURANT);
    const [logoUrl, setLogoUrl] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [activationCode, setActivationCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveCompany(
            { id: 0, name, type, logoUrl, isActive: true, plan: 'BASIC', createdAt: '' },
            { name: adminName, email: adminEmail, password: adminPassword },
            activationCode
        );
        setIsCreating(false);
        // Reset form
        setName(''); setAdminName(''); setAdminEmail(''); setAdminPassword(''); setActivationCode('');
    };

    return (
        <div className="p-8 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-black">Gestão de Empresas</h1>
                <button onClick={() => setIsCreating(true)} className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm">
                    <Plus size={20} /> Nova Empresa
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-4 text-black">Nova Empresa</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Nome da Empresa" value={name} onChange={e => setName(e.target.value)} className="border border-slate-300 p-2 rounded text-black placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none" required />
                        <select value={type} onChange={e => setType(e.target.value as CompanyType)} className="border border-slate-300 p-2 rounded text-black focus:ring-2 focus:ring-brand-500 outline-none">
                            <option value={CompanyType.RESTAURANT}>Restaurante</option>
                            <option value={CompanyType.SUPERMARKET}>Supermercado</option>
                            <option value={CompanyType.MIXED}>Misto</option>
                        </select>
                        <input placeholder="URL do Logo" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="border border-slate-300 p-2 rounded text-black placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none" />
                        <input placeholder="Código de Ativação" value={activationCode} onChange={e => setActivationCode(e.target.value)} className="border border-slate-300 p-2 rounded text-black placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none" required />
                        
                        <div className="col-span-full mt-2 border-t border-slate-100 pt-4">
                            <h4 className="text-sm font-bold text-black mb-2">Administrador da Empresa</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input placeholder="Nome Admin" value={adminName} onChange={e => setAdminName(e.target.value)} className="border border-slate-300 p-2 rounded text-black placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none" required />
                                <input placeholder="Email Admin" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="border border-slate-300 p-2 rounded text-black placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none" type="email" required />
                                <input placeholder="Senha Admin" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="border border-slate-300 p-2 rounded text-black placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none" type="password" required />
                            </div>
                        </div>

                        <div className="col-span-full flex justify-end gap-2 mt-4">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded">Cancelar</button>
                            <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded font-bold shadow-sm">Criar Empresa</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map(company => (
                    <div key={company.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-50 overflow-hidden border border-slate-100">
                                {company.logoUrl ? <img src={company.logoUrl} className="w-full h-full object-cover" /> : <Store className="m-2 text-slate-400" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-black">{company.name}</h3>
                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">{company.type}</span>
                            </div>
                        </div>
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                            <button onClick={() => onSelectCompany(company.id)} className="text-brand-600 font-bold text-sm hover:underline">Aceder ao Painel</button>
                            <div className="flex gap-2">
                                <button onClick={() => onToggleStatus(company.id)} title={company.isActive ? "Suspender" : "Ativar"} className={`${company.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                    <Power size={18} />
                                </button>
                                <button onClick={() => onDeleteCompany(company.id)} className="text-slate-400 hover:text-red-600">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. SuperAdminConfig
const SuperAdminConfig: React.FC<{
    codes: ActivationCode[];
    onCreateCode: (plan: 'BASIC' | 'PREMIUM') => void;
    onDeleteCode: (id: number) => void;
}> = ({ codes, onCreateCode, onDeleteCode }) => {
    return (
        <div className="p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-black mb-8">Configurações Globais</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black"><Key size={24} /> Códigos de Ativação</h2>
                <div className="flex gap-4 mb-6">
                    <button onClick={() => onCreateCode('BASIC')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-bold text-slate-800">
                        Gerar Código Basic
                    </button>
                    <button onClick={() => onCreateCode('PREMIUM')} className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 text-yellow-800 rounded-lg font-bold">
                        Gerar Código Premium
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-black uppercase font-bold">
                            <tr>
                                <th className="p-3 border-b border-slate-200">Código</th>
                                <th className="p-3 border-b border-slate-200">Plano</th>
                                <th className="p-3 border-b border-slate-200">Status</th>
                                <th className="p-3 border-b border-slate-200">Gerado em</th>
                                <th className="p-3 border-b border-slate-200">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {codes.map(code => (
                                <tr key={code.id}>
                                    <td className="p-3 font-mono font-bold text-black text-lg">{code.code}</td>
                                    <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${code.plan === 'PREMIUM' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>{code.plan}</span></td>
                                    <td className="p-3">
                                        {code.status === 'USED' ? <span className="text-red-600 font-bold">Usado</span> : <span className="text-green-600 font-bold">Disponível</span>}
                                    </td>
                                    <td className="p-3 text-black font-medium">{new Date(code.generatedAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <button onClick={() => onDeleteCode(code.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            {codes.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-500 italic">Nenhum código gerado</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// 4. Dashboard (Unchanged visually, already consistent)
const Dashboard: React.FC<{ companyId?: number; transactions: Transaction[] }> = ({ companyId, transactions }) => {
    // Filter transactions
    const filteredTx = companyId ? transactions.filter(t => t.companyId === companyId) : transactions;
    
    // Aggregations
    const totalRevenue = filteredTx.reduce((sum, t) => sum + t.amount, 0);
    const txCount = filteredTx.length;
    
    // Chart data (mock distribution over last 7 days or simpler)
    const chartData = [
        { name: 'Seg', value: 0 }, { name: 'Ter', value: 0 }, { name: 'Qua', value: 0 },
        { name: 'Qui', value: 0 }, { name: 'Sex', value: 0 }, { name: 'Sab', value: 0 }, { name: 'Dom', value: 0 }
    ];
    // Populate with some random variation of total revenue for visualization
    const filledChartData = chartData.map(d => ({ ...d, value: Math.floor(Math.random() * (totalRevenue / 2)) }));

    return (
        <div className="p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-black mb-8">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Faturação Total" value={formatCurrency(totalRevenue)} icon={Banknote} color="green" trend="+12% vs mês passado" />
                <StatCard title="Transações" value={txCount.toString()} icon={Receipt} color="blue" />
                <StatCard title="Ticket Médio" value={formatCurrency(txCount ? totalRevenue / txCount : 0)} icon={Divide} color="orange" />
                <StatCard title="Clientes" value="--" icon={Users} color="purple" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
                <h3 className="text-lg font-bold text-black mb-4">Vendas da Semana</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filledChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748b" />
                        <YAxis axisLine={false} tickLine={false} stroke="#64748b" />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// 5. RestaurantPOS
const RestaurantPOS: React.FC<{
    activeCompany: Company;
    tables: Table[];
    products: Product[];
    users: User[];
    currentUser: User | null;
    onUpdateTableStatus: (id: number, status: TableStatus) => void;
    orders: Record<number, ActiveOrder>;
    onUpdateOrder: (tableId: number, order: ActiveOrder | null) => void;
    onAddTransaction: (amount: number) => void;
}> = ({ activeCompany, tables, products, onUpdateTableStatus, orders, onUpdateOrder, onAddTransaction }) => {
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    
    // Product Search in POS
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
    const filteredProducts = products.filter(p => 
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeOrder = selectedTableId ? orders[selectedTableId] : null;

    const handleTableClick = (table: Table) => {
        setSelectedTableId(table.id);
        if (!orders[table.id]) {
            // New order if free
            // If we wanted to enforce "Open Table" first, we could. assuming click opens order.
        }
    };

    const handleAddItem = (product: Product) => {
        if (!selectedTableId) return;
        
        const currentOrder = orders[selectedTableId] || {
            items: [],
            kitchenStatus: OrderStatus.PENDING,
            barStatus: OrderStatus.PENDING,
            waiterId: 0, // current user id ideally
            guests: 1,
            startTime: new Date()
        };

        const existingItemIndex = currentOrder.items.findIndex(i => i.product.id === product.id && !i.paid);
        
        let newItems = [...currentOrder.items];
        if (existingItemIndex >= 0) {
            newItems[existingItemIndex] = { ...newItems[existingItemIndex], qty: newItems[existingItemIndex].qty + 1 };
        } else {
            newItems.push({ product, qty: 1, paid: false });
        }

        onUpdateOrder(selectedTableId, { ...currentOrder, items: newItems });
        if (tables.find(t => t.id === selectedTableId)?.status === TableStatus.FREE) {
            onUpdateTableStatus(selectedTableId, TableStatus.OCCUPIED);
        }
    };

    const handlePaymentConfirm = (method: 'CASH' | 'CARD', paidAmount: number, change: number, indices: number[]) => {
        if (!selectedTableId || !activeOrder) return;

        // Mark items as paid
        const newItems = [...activeOrder.items];
        let totalPaid = 0;
        indices.forEach(idx => {
            if (newItems[idx]) {
                newItems[idx].paid = true;
                totalPaid += newItems[idx].product.price * newItems[idx].qty;
            }
        });

        // Add transaction
        onAddTransaction(totalPaid);

        // Check if all paid
        const allPaid = newItems.every(i => i.paid);
        
        if (allPaid) {
            // Close Table
            onUpdateOrder(selectedTableId, null);
            onUpdateTableStatus(selectedTableId, TableStatus.FREE);
            setSelectedTableId(null);
        } else {
            // Update Order with paid items
            onUpdateOrder(selectedTableId, { ...activeOrder, items: newItems });
            onUpdateTableStatus(selectedTableId, TableStatus.PAYMENT);
        }
        setIsPaymentOpen(false);
    };

    return (
        <div className="flex h-full overflow-hidden">
            {/* Payment Modal */}
            {selectedTableId && activeOrder && (
                <PaymentModal 
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    tableNumber={tables.find(t => t.id === selectedTableId)?.number || 0}
                    guests={activeOrder.guests}
                    items={activeOrder.items}
                    onConfirm={handlePaymentConfirm}
                />
            )}

            {/* Left: Tables Grid */}
            <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                <h1 className="text-2xl font-bold text-black mb-6">Sala / Mesas</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {tables.map(table => {
                         let statusColor = 'bg-white border-slate-200 text-slate-700';
                         if (table.status === TableStatus.OCCUPIED) statusColor = 'bg-red-50 border-red-300 text-red-700';
                         if (table.status === TableStatus.PAYMENT) statusColor = 'bg-yellow-50 border-yellow-300 text-yellow-700';
                         if (table.status === TableStatus.RESERVED) statusColor = 'bg-purple-50 border-purple-300 text-purple-700';
                         
                         const order = orders[table.id];
                         const total = order ? order.items.reduce((sum, i) => sum + (i.product.price * i.qty), 0) : 0;

                         return (
                            <button 
                                key={table.id}
                                onClick={() => handleTableClick(table)}
                                className={`p-4 rounded-xl border-2 shadow-sm flex flex-col justify-between aspect-square transition-all hover:shadow-md ${statusColor} ${selectedTableId === table.id ? 'ring-4 ring-brand-200 border-brand-500' : ''}`}
                            >
                                <div className="flex justify-between items-start w-full">
                                    <span className="font-bold text-xl">Mesa {table.number}</span>
                                    <span className="text-xs font-bold uppercase opacity-80">{table.status}</span>
                                </div>
                                {order && (
                                    <div className="mt-auto text-right">
                                        <div className="text-xs opacity-80 font-medium">{order.items.length} itens</div>
                                        <div className="font-bold text-lg">{formatCurrency(total)}</div>
                                    </div>
                                )}
                            </button>
                         );
                    })}
                </div>
            </div>

            {/* Right: Order Detail & Product Selector */}
            {selectedTableId && (
                <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-10">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                            <h2 className="font-bold text-lg text-black">Mesa {tables.find(t => t.id === selectedTableId)?.number}</h2>
                            <span className="text-xs text-slate-600 font-bold">Pedido #{selectedTableId}99</span>
                        </div>
                        <button onClick={() => setSelectedTableId(null)} className="text-slate-400 hover:text-black"><X size={20} /></button>
                    </div>

                    {/* Order Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {!activeOrder ? (
                            <div className="text-center text-slate-500 mt-10 font-medium">Mesa Livre<br/>Adicione itens para abrir pedido</div>
                        ) : (
                            <div className="space-y-3">
                                {activeOrder.items.map((item, idx) => (
                                    <div key={idx} className={`flex justify-between items-start pb-2 border-b border-slate-50 ${item.paid ? 'opacity-50 grayscale' : ''}`}>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-black">{item.product.name}</div>
                                            <div className="text-xs text-slate-600 font-medium">{formatCurrency(item.product.price)} x {item.qty}</div>
                                        </div>
                                        <div className="font-bold text-sm text-black">{formatCurrency(item.product.price * item.qty)}</div>
                                        {item.paid && <CheckCircle size={14} className="ml-2 text-green-600" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Totals & Actions */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                        {activeOrder && (
                            <div className="mb-4">
                                <div className="flex justify-between text-lg font-bold text-black">
                                    <span>Total</span>
                                    <span>{formatCurrency(activeOrder.items.reduce((sum, i) => sum + (i.product.price * i.qty), 0))}</span>
                                </div>
                                <div className="flex justify-between text-xs text-green-600 font-bold">
                                    <span>Pago</span>
                                    <span>{formatCurrency(activeOrder.items.filter(i => i.paid).reduce((sum, i) => sum + (i.product.price * i.qty), 0))}</span>
                                </div>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2 mb-2">
                             {/* Mock Send to Kitchen */}
                             <button 
                                onClick={() => {
                                    if(activeOrder) {
                                        onUpdateOrder(selectedTableId, { ...activeOrder, kitchenStatus: OrderStatus.PREPARING, barStatus: OrderStatus.PREPARING });
                                        alert('Pedido enviado para cozinha/bar');
                                    }
                                }}
                                disabled={!activeOrder}
                                className="bg-orange-100 text-orange-800 border border-orange-200 py-2 rounded-lg font-bold text-sm hover:bg-orange-200 disabled:opacity-50"
                             >
                                 Enviar Cozinha
                             </button>
                             <button 
                                onClick={() => setIsPaymentOpen(true)}
                                disabled={!activeOrder}
                                className="bg-green-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-50 shadow-sm"
                             >
                                 Pagamento
                             </button>
                        </div>
                    </div>

                    {/* Product Selector (Mini) */}
                    <div className="h-1/3 border-t border-slate-200 flex flex-col">
                        <div className="p-2 border-b flex gap-2 overflow-x-auto bg-white">
                            {categories.map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setSelectedCategory(c)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${selectedCategory === c ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
                                >{c}</button>
                            ))}
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 grid grid-cols-3 gap-2 bg-slate-50">
                            {filteredProducts.map(p => (
                                <button 
                                    key={p.id} 
                                    onClick={() => handleAddItem(p)}
                                    className="bg-white p-2 rounded border border-slate-200 text-center shadow-sm hover:shadow-md transition-all active:scale-95"
                                >
                                    <div className="text-[10px] font-bold line-clamp-2 text-black">{p.name}</div>
                                    <div className="text-[10px] font-bold text-brand-600">{p.price}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 6. SupermarketPOS
const SupermarketPOS: React.FC<{
    products: Product[];
    onAddTransaction: (amount: number) => void;
}> = ({ products, onAddTransaction }) => {
    const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm));

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { product, qty: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(i => i.product.id !== productId));
    };

    const total = cart.reduce((sum, i) => sum + (i.product.price * i.qty), 0);

    const handleCheckout = () => {
        if (total === 0) return;
        onAddTransaction(total);
        setCart([]);
        alert('Venda registada com sucesso!');
    };

    return (
        <div className="flex h-full">
            {/* Products List */}
            <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-black placeholder-slate-500 font-medium bg-white shadow-sm"
                        placeholder="Procurar produto (nome ou código de barras)..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(p => (
                        <button 
                            key={p.id}
                            onClick={() => addToCart(p)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-left group hover:border-brand-300"
                        >
                            <div className="font-bold text-black group-hover:text-brand-700 transition-colors">{p.name}</div>
                            <div className="text-sm text-slate-600 font-medium mb-2">{p.category}</div>
                            <div className="font-bold text-brand-600 text-lg">{formatCurrency(p.price)}</div>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Cart / Checkout */}
            <div className="w-96 bg-white shadow-2xl flex flex-col z-20 border-l border-slate-200">
                <div className="p-6 bg-white border-b border-slate-100">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-black"><ShoppingCart className="text-brand-600" /> Caixa</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
                    {cart.length === 0 ? (
                        <div className="text-center text-slate-500 mt-10 font-medium">Carrinho vazio</div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div>
                                    <div className="font-bold text-black">{item.product.name}</div>
                                    <div className="text-sm text-slate-600 font-medium">{item.qty} x {formatCurrency(item.product.price)}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-black">{formatCurrency(item.product.price * item.qty)}</span>
                                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 bg-white">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-slate-600 font-bold">Total a Pagar</span>
                        <span className="text-3xl font-bold text-black">{formatCurrency(total)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 disabled:opacity-50 transition-all shadow-lg shadow-brand-200"
                    >
                        Finalizar Venda
                    </button>
                </div>
            </div>
        </div>
    );
};

// 7. SettingsView
const SettingsView: React.FC<{
    activeCompany: Company;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    tables: Table[];
    setTables: React.Dispatch<React.SetStateAction<Table[]>>;
    updateCompany: (c: Company) => void;
    currentUser: User | null;
}> = ({ activeCompany, products, setProducts, users, setUsers, tables, setTables, updateCompany, currentUser }) => {
    const [tab, setTab] = useState<'GENERAL' | 'PRODUCTS' | 'USERS'>('GENERAL');
    
    // Quick Add Product State
    const [newProdName, setNewProdName] = useState('');
    const [newProdPrice, setNewProdPrice] = useState('');
    
    const handleAddProduct = () => {
        const id = Date.now();
        const newProd: Product = {
            id,
            companyId: activeCompany.id,
            name: newProdName,
            price: Number(newProdPrice),
            category: 'General'
        };
        setProducts(prev => [...prev, newProd]);
        setNewProdName('');
        setNewProdPrice('');
    };

    return (
        <div className="p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-black mb-8">Configurações</h1>
            
            <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
                <button onClick={() => setTab('GENERAL')} className={`pb-3 px-2 font-bold transition-colors ${tab === 'GENERAL' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-500 hover:text-black'}`}>Geral</button>
                <button onClick={() => setTab('PRODUCTS')} className={`pb-3 px-2 font-bold transition-colors ${tab === 'PRODUCTS' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-500 hover:text-black'}`}>Produtos</button>
                <button onClick={() => setTab('USERS')} className={`pb-3 px-2 font-bold transition-colors ${tab === 'USERS' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-500 hover:text-black'}`}>Utilizadores</button>
            </div>

            {tab === 'GENERAL' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-2xl">
                    <h3 className="font-bold text-lg mb-4 text-black">Dados da Empresa</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-black">Nome da Empresa</label>
                            <input 
                                value={activeCompany.name} 
                                onChange={e => updateCompany({...activeCompany, name: e.target.value})}
                                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black">URL do Logo</label>
                            <input 
                                value={activeCompany.logoUrl || ''} 
                                onChange={e => updateCompany({...activeCompany, logoUrl: e.target.value})}
                                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-black focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {tab === 'PRODUCTS' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <input placeholder="Nome Produto" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="border border-slate-300 p-2 rounded text-black placeholder-slate-500" />
                        <input placeholder="Preço" type="number" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="border border-slate-300 p-2 rounded w-24 text-black placeholder-slate-500" />
                        <button onClick={handleAddProduct} className="bg-brand-600 text-white px-4 py-2 rounded font-bold shadow-sm hover:bg-brand-700">Adicionar</button>
                    </div>
                    <table className="w-full text-left text-black">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="pb-2 p-2 font-bold">Nome</th>
                                <th className="pb-2 p-2 font-bold">Preço</th>
                                <th className="pb-2 p-2 font-bold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                    <td className="py-2 p-2 font-medium">{p.name}</td>
                                    <td className="py-2 p-2 font-bold">{formatCurrency(p.price)}</td>
                                    <td className="py-2 p-2">
                                        <button onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {tab === 'USERS' && (
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-600 mb-4 font-medium">Gestão de utilizadores (Exibição apenas)</p>
                    <table className="w-full text-left text-black">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="pb-2 p-2 font-bold">Nome</th>
                                <th className="pb-2 p-2 font-bold">Email</th>
                                <th className="pb-2 p-2 font-bold">Função</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                    <td className="py-2 p-2 font-medium">{u.name}</td>
                                    <td className="py-2 p-2">{u.email}</td>
                                    <td className="py-2 p-2"><span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs font-bold border border-slate-200">{u.role}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// --- Main App Logic ---
export default function App() {
    // Start at LOGIN screen
    const [view, setView] = useState<View>('LOGIN');
    // Start with no Role
    const [role, setRole] = useState<UserRole | null>(null);
    const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock State for "Database" - Initialize with empty arrays to satisfy user request for no pre-registered companies
    const [companies, setCompanies] = useState<Company[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [users, setUsers] = useState<User[]>([
        { id: 1, companyId: undefined, name: 'Super Admin', email: 'victorallissson@gmail.com', role: UserRole.SUPER_ADMIN, password: 'H1vitoria@12' }
    ]);
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activationCodes, setActivationCodes] = useState<ActivationCode[]>([]);
    
    // Persistent Orders State: { tableId: ActiveOrder }
    const [tableOrders, setTableOrders] = useState<Record<number, ActiveOrder>>({});

    const activeCompany = useMemo(() => 
        companies.find(c => c.id === activeCompanyId) || null
    , [activeCompanyId, companies]);

    // ... (Filter Data Logic remains same) ...
    const activeProducts = useMemo(() => 
        products.filter(p => p.companyId === activeCompanyId)
    , [activeCompanyId, products]);

    const activeTables = useMemo(() => 
        tables.filter(t => t.companyId === activeCompanyId)
    , [activeCompanyId, tables]);

    const activeUsers = useMemo(() => 
        users.filter(u => u.companyId === activeCompanyId)
    , [activeCompanyId, users]);

    const handleCompanySelect = (id: number) => {
        setActiveCompanyId(id);
        setView('LOGIN');
    };

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setRole(user.role);

        if (user.role === UserRole.SUPER_ADMIN) {
            setView('SUPER_ADMIN');
        } else {
            const company = companies.find(c => c.id === user.companyId);
            if (company) {
                if (company.type === 'SUPERMARKET') {
                    setView('SUPERMARKET_POS');
                } else if (company.type === 'RESTAURANT') {
                    setView('RESTAURANT_POS');
                } else {
                    setView('DASHBOARD');
                }
            }
        }
    };

    const handleBackToAdmin = () => {
        setActiveCompanyId(null);
        setView('SUPER_ADMIN');
        setCurrentUser(users.find(u => u.role === UserRole.SUPER_ADMIN) || null); // Re-instate super admin if moving back
    };

    // ... (Company/Code Save Logic remains same) ...
    const handleSaveCompany = (company: Company, adminUser: {name: string, email: string, password: string}, activationCode: string) => {
        // Validate Activation Code
        const code = activationCodes.find(c => c.code === activationCode);
        
        if (!code) {
            alert('Código de ativação inválido.');
            return;
        }

        if (code.status === 'USED') {
            alert('Este código de ativação já foi utilizado.');
            return;
        }

        if (companies.some(c => c.id === company.id)) {
            // Update logic (existing company) - rarely hit from "Create" flow but kept for safety
            setCompanies(prev => prev.map(c => c.id === company.id ? company : c));
        } else {
            // New Company Logic
            const newCompanyId = Math.max(...companies.map(c => c.id), 0) + 1;
            const newCompany: Company = { 
                ...company, 
                id: newCompanyId,
                plan: code.plan, // Assign plan from code
                createdAt: new Date().toISOString().split('T')[0] 
            };
            
            // 1. Create Company
            setCompanies(prev => [...prev, newCompany]);

            // 2. Mark Code as USED
            setActivationCodes(prev => prev.map(c => c.id === code.id ? { ...c, status: 'USED' } : c));

            // 3. Create Admin User
            if (adminUser) {
                setUsers(prevUsers => {
                    const newUserId = Math.max(...prevUsers.map(u => u.id), 0) + 1;
                    const newUser: User = {
                        id: newUserId,
                        companyId: newCompanyId,
                        name: adminUser.name,
                        email: adminUser.email,
                        role: UserRole.COMPANY_ADMIN,
                        password: adminUser.password
                    };
                    return [...prevUsers, newUser];
                });
                alert(`Empresa "${newCompany.name}" ativada com sucesso (Plano ${code.plan})!`);
            }
        }
    };

    const handleUpdateActiveCompany = (updatedCompany: Company) => {
        setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    };

    const handleLogout = () => {
        // Correct logout logic: Reset everything and go to Global Login
        setCurrentUser(null);
        setActiveCompanyId(null);
        setRole(null as any);
        setView('LOGIN');
    };

    // ... (Rest of handlers: handleTableStatusUpdate, handleOrderUpdate, etc. remain same) ...
    const handleTableStatusUpdate = (tableId: number, status: TableStatus) => {
        setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
    };

    const handleOrderUpdate = (tableId: number, orderData: ActiveOrder | null) => {
        if (orderData === null) {
            // Delete order
            const newOrders = {...tableOrders};
            delete newOrders[tableId];
            setTableOrders(newOrders);
        } else {
            setTableOrders(prev => ({
                ...prev,
                [tableId]: orderData
            }));
        }
    };

    const handleKitchenStatusUpdate = (tableId: number, newStatus: OrderStatus) => {
        setTableOrders(prev => {
            const current = prev[tableId];
            if (!current) return prev;
            return {
                ...prev,
                [tableId]: { ...current, kitchenStatus: newStatus }
            };
        });
    };

    const handleBarStatusUpdate = (tableId: number, newStatus: OrderStatus) => {
         setTableOrders(prev => {
            const current = prev[tableId];
            if (!current) return prev;
            return {
                ...prev,
                [tableId]: { ...current, barStatus: newStatus }
            };
        });
    };

    const handleToggleCompanyStatus = (id: number) => {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    };

    const handleDeleteCompany = (id: number) => {
        if (confirm('ATENÇÃO: Tem certeza que deseja eliminar esta empresa? Todos os dados (usuários, produtos, histórico) serão perdidos permanentemente.')) {
            setCompanies(prev => prev.filter(c => c.id !== id));
            setUsers(prev => prev.filter(u => u.companyId !== id));
            setProducts(prev => prev.filter(p => p.companyId !== id));
            setTables(prev => prev.filter(t => t.companyId !== id));
        }
    };
    
    const handleAddTransaction = (companyId: number, amount: number) => {
        setTransactions(prev => [...prev, {
            companyId,
            amount,
            date: new Date()
        }]);
    };

    const handleCreateCode = (plan: 'BASIC' | 'PREMIUM') => {
        const newCode: ActivationCode = {
            id: Date.now(),
            code: generateRandomCode(),
            plan,
            status: 'UNUSED',
            generatedAt: new Date()
        };
        setActivationCodes(prev => [...prev, newCode]);
    };

    const handleDeleteCode = (id: number) => {
        if(confirm('Apagar este código?')) {
            setActivationCodes(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Mobile Header for Sidebar Toggle */}
            {view !== 'LOGIN' && (
                <div className="fixed top-4 left-4 z-50 lg:hidden">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white text-slate-800 rounded-full shadow-lg border border-slate-200"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            )}

            <Sidebar 
                view={view} 
                setView={setView} 
                activeCompany={activeCompany}
                role={role as UserRole}
                onLogout={handleLogout}
                currentUser={currentUser}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <main className={`flex-1 h-full overflow-hidden relative transition-all duration-300 ${view !== 'LOGIN' ? 'lg:ml-64' : ''} w-full`}>
                
                {view === 'LOGIN' && (
                    <LoginScreen 
                        company={activeCompany} 
                        companies={companies}
                        onLogin={handleLogin} 
                        users={users}
                        onBack={activeCompany ? handleBackToAdmin : undefined}
                    />
                )}

                {view === 'SUPER_ADMIN' && (
                    <SuperAdminView 
                        companies={companies} 
                        onSelectCompany={handleCompanySelect}
                        onSaveCompany={handleSaveCompany}
                        onToggleStatus={handleToggleCompanyStatus}
                        onDeleteCompany={handleDeleteCompany}
                    />
                )}

                {view === 'SUPER_ADMIN_CONFIG' && role === UserRole.SUPER_ADMIN && (
                    <SuperAdminConfig 
                        codes={activationCodes}
                        onCreateCode={handleCreateCode}
                        onDeleteCode={handleDeleteCode}
                    />
                )}

                {view === 'DASHBOARD' && <Dashboard companyId={activeCompanyId || undefined} transactions={transactions} />}

                {view === 'RESTAURANT_POS' && activeCompany && (
                    <RestaurantPOS 
                        activeCompany={activeCompany}
                        tables={activeTables} 
                        products={activeProducts}
                        users={activeUsers}
                        currentUser={currentUser}
                        onUpdateTableStatus={handleTableStatusUpdate}
                        orders={tableOrders}
                        onUpdateOrder={handleOrderUpdate}
                        onAddTransaction={(amount) => handleAddTransaction(activeCompany.id, amount)}
                    />
                )}

                {view === 'SUPERMARKET_POS' && (
                    <SupermarketPOS 
                        products={activeProducts} 
                        onAddTransaction={(amount) => activeCompanyId && handleAddTransaction(activeCompanyId, amount)}
                    />
                )}

                {view === 'KITCHEN' && (
                     <div className="p-8 h-full bg-slate-100 overflow-y-auto">
                         <h1 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
                             <ChefHat size={32} /> KDS - Cozinha (Comidas)
                         </h1>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Filter active orders that are NOT completed */}
                            {(Object.entries(tableOrders) as [string, ActiveOrder][])
                                .filter(([_, order]) => order.kitchenStatus !== OrderStatus.DELIVERED && order.kitchenStatus !== OrderStatus.COMPLETED)
                                .map(([tableId, order]) => {
                                    // Split items into Kitchen and Bar
                                    const kitchenItems = order.items.filter(i => !['Drinks', 'Bebidas'].includes(i.product.category));
                                    
                                    // Only show card if there are kitchen items
                                    if (kitchenItems.length === 0) return null;

                                    return (
                                    <div key={tableId} className={`bg-white rounded-lg shadow-md border-l-8 overflow-hidden flex flex-col ${order.kitchenStatus === OrderStatus.READY ? 'border-green-500' : 'border-yellow-500'}`}>
                                        <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${order.kitchenStatus === OrderStatus.READY ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                            <span className="font-bold text-lg text-black">Mesa {tables.find(t => t.id === Number(tableId))?.number}</span>
                                            <span className="text-sm font-mono text-black font-bold">{order.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        
                                        <div className="p-4 space-y-4 flex-1">
                                            {/* Kitchen Items Section */}
                                            <div>
                                                <h4 className="text-xs font-bold text-orange-700 uppercase flex items-center gap-1 mb-2 border-b border-orange-100 pb-1">
                                                    <Utensils size={12} /> Pratos
                                                </h4>
                                                <div className="space-y-3">
                                                    {kitchenItems.map((item, i) => (
                                                        <div key={i} className="flex flex-col border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="font-bold text-black">{item.qty}x {item.product.name}</span>
                                                            </div>
                                                            {item.observation && (
                                                                <span className="text-xs text-red-600 font-bold italic pl-2 border-l-2 border-red-200">
                                                                    Obs: {item.observation}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-50 border-t border-slate-100 mt-auto">
                                            {order.kitchenStatus === OrderStatus.PREPARING ? (
                                                <button 
                                                    onClick={() => handleKitchenStatusUpdate(Number(tableId), OrderStatus.READY)}
                                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <CheckCircle size={20} /> Marcar Pronto
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleKitchenStatusUpdate(Number(tableId), OrderStatus.DELIVERED)}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Bell size={20} /> Entregar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )})}
                            {(Object.entries(tableOrders) as [string, ActiveOrder][]).filter(([_, order]) => order.kitchenStatus !== OrderStatus.DELIVERED && order.items.some(i => !['Drinks', 'Bebidas'].includes(i.product.category))).length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-12">
                                    <ChefHat size={64} className="mb-4 opacity-50" />
                                    <p className="text-xl font-bold text-slate-500">Cozinha livre!</p>
                                </div>
                            )}
                         </div>
                     </div>
                )}

                {view === 'BAR' && (
                     <div className="p-8 h-full bg-slate-100 overflow-y-auto">
                         <h1 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
                             <Wine size={32} /> KDS - Bar / Copa
                         </h1>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Filter active orders that are NOT delivered */}
                            {(Object.entries(tableOrders) as [string, ActiveOrder][])
                                .filter(([_, order]) => order.barStatus !== OrderStatus.DELIVERED && order.barStatus !== OrderStatus.COMPLETED)
                                .map(([tableId, order]) => {
                                    // Split items into Kitchen and Bar
                                    const barItems = order.items.filter(i => ['Drinks', 'Bebidas'].includes(i.product.category));
                                    
                                    // Only show card if there are bar items
                                    if (barItems.length === 0) return null;

                                    return (
                                    <div key={tableId} className={`bg-white rounded-lg shadow-md border-l-8 overflow-hidden flex flex-col ${order.barStatus === OrderStatus.READY ? 'border-green-500' : 'border-blue-500'}`}>
                                        <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${order.barStatus === OrderStatus.READY ? 'bg-green-50' : 'bg-blue-50'}`}>
                                            <span className="font-bold text-lg text-black">Mesa {tables.find(t => t.id === Number(tableId))?.number}</span>
                                            <span className="text-sm font-mono text-black font-bold">{order.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        
                                        <div className="p-4 space-y-4 flex-1">
                                            {/* Bar Items Section */}
                                            <div>
                                                <h4 className="text-xs font-bold text-blue-700 uppercase flex items-center gap-1 mb-2 border-b border-blue-100 pb-1">
                                                    <Wine size={12} /> Bebidas
                                                </h4>
                                                <div className="space-y-3">
                                                    {barItems.map((item, i) => (
                                                        <div key={i} className="flex flex-col border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="font-bold text-black">{item.qty}x {item.product.name}</span>
                                                            </div>
                                                            {item.observation && (
                                                                <span className="text-xs text-red-600 font-bold italic pl-2 border-l-2 border-red-200">
                                                                    Obs: {item.observation}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-50 border-t border-slate-100 mt-auto">
                                            {order.barStatus === OrderStatus.PREPARING ? (
                                                <button 
                                                    onClick={() => handleBarStatusUpdate(Number(tableId), OrderStatus.READY)}
                                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <CheckCircle size={20} /> Marcar Pronto
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleBarStatusUpdate(Number(tableId), OrderStatus.DELIVERED)}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <Bell size={20} /> Entregar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )})}
                            {(Object.entries(tableOrders) as [string, ActiveOrder][]).filter(([_, order]) => order.barStatus !== OrderStatus.DELIVERED && order.items.some(i => ['Drinks', 'Bebidas'].includes(i.product.category))).length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-12">
                                    <Wine size={64} className="mb-4 opacity-50" />
                                    <p className="text-xl font-bold text-slate-500">Bar livre!</p>
                                </div>
                            )}
                         </div>
                     </div>
                )}
                
                {view === 'SETTINGS' && activeCompany && (
                    <SettingsView 
                        activeCompany={activeCompany}
                        products={activeProducts}
                        setProducts={setProducts}
                        users={activeUsers}
                        setUsers={setUsers}
                        tables={activeTables}
                        setTables={setTables}
                        updateCompany={handleUpdateActiveCompany}
                        currentUser={currentUser}
                    />
                )}
            </main>
        </div>
    );
}