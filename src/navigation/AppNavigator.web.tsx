import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { authService } from '../services/authService';
import {
  addTransaction,
  selectTotalBalance,
  selectTransactions,
  selectAccounts,
  selectRecurringRules,
  selectOverdueBills,
  selectWalletSettings,
  markRecurringPaid,
} from '../store/slices/walletSlice';
import {
  selectActiveGoals,
  selectCompletedGoals,
  addToGoal,
} from '../store/slices/goalsSlice';
import {
  selectUnreadCount,
} from '../store/slices/notificationsSlice';

// Core Tab Names
type TabName = 'Home' | 'Reports' | 'Accounts' | 'Goals' | 'Profile';

// Outline SVG renderers for Quick Log matching mockups
const renderQuickLogIcon = (category: string) => {
  const strokeColor = '#005994';
  switch (category) {
    case 'coffee':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      );
    case 'transport':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="16" rx="2" ry="2" />
          <line x1="5" y1="10" x2="19" y2="10" />
          <line x1="9" y1="18" x2="9" y2="18.01" />
          <line x1="15" y1="18" x2="15" y2="18.01" />
          <path d="M19 14H5" />
          <path d="M4 22h3" />
          <path d="M17 22h3" />
        </svg>
      );
    case 'dining':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <line x1="7" y1="2" x2="7" y2="8" />
          <line x1="21" y1="2" x2="21" y2="22" />
          <path d="M21 2c-3 0-5 2-5 5v5c0 1 1 2 2 2h3" />
          <line x1="7" y1="11" x2="7" y2="22" />
        </svg>
      );
    case 'utility':
    case 'utilities':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'retail':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const { user, signIn, signUp, signOut, isLoading } = useAuth();
  const { showToast } = useToast();

  // ---- Real Redux selectors ----
  const totalBalance = useSelector(selectTotalBalance);
  const transactions = useSelector(selectTransactions);
  const accounts = useSelector(selectAccounts);
  const recurringRules = useSelector(selectRecurringRules);
  const overdueBills = useSelector(selectOverdueBills);
  const settings = useSelector(selectWalletSettings);
  const activeGoals = useSelector(selectActiveGoals);
  const completedGoals = useSelector(selectCompletedGoals);
  const unreadNotifCount = useSelector(selectUnreadCount);

  const currency = settings.currency || 'DT';

  // Unified Active Tab State for Web SPA feel
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [txFilter, setTxFilter] = useState<'all'|'sent'|'received'>('all');

  // Form states for transaction add modal
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txLabel, setTxLabel] = useState('');
  const [txCategory, setTxCategory] = useState('food');
  const [txEmoji, setTxEmoji] = useState('🍽️');
  const [txAccountId, setTxAccountId] = useState(settings.defaultAccountId || 'acc_cash');

  // Add-to-goal modal
  const [showAddToGoal, setShowAddToGoal] = useState(false);
  const [goalFundId, setGoalFundId] = useState('');
  const [goalFundAmount, setGoalFundAmount] = useState('');

  // Auth form states (when user is null)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Shortcuts from real settings
  const quickLogShortcuts = settings.shortcuts.slice(0, 4).map(s => ({
    id: s.id,
    label: s.customLabel || s.i18nKey?.split('.')[1] || 'Item',
    emoji: s.emoji,
    category: s.category,
    amount: s.defaultAmount,
    accountId: s.accountId,
  }));

  const quickLogMobile = settings.shortcuts.slice(0, 5).map(s => ({
    id: s.id,
    label: s.customLabel || s.i18nKey?.split('.')[1] || 'Item',
    emoji: s.emoji,
    category: s.category,
    amount: s.defaultAmount,
    accountId: s.accountId,
  }));

  // ---- Auth handlers ----
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const u = await authService.login(authEmail, authPassword);
      await signIn(u);
      showToast(`Welcome back, ${u.name}!`, 'success');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const u = await authService.register(authName, authEmail, authPassword);
      await signUp(u);
      showToast(`Welcome, ${u.name}!`, 'success');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // ---- Transaction handlers ----
  const handleQuickLog = (shortcut: typeof quickLogShortcuts[0]) => {
    dispatch(
      addTransaction({
        type: 'expense',
        amount: shortcut.amount,
        label: shortcut.label,
        category: shortcut.category as any,
        emoji: shortcut.emoji,
        accountId: shortcut.accountId || settings.defaultAccountId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        tags: [],
        isRecurring: false,
        isPaid: true,
        status: 'cleared',
      })
    );
    showToast(`Logged ${shortcut.amount.toFixed(2)} ${currency} for ${shortcut.label}`, 'success');
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(txAmount);
    if (!txAmount || isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    dispatch(
      addTransaction({
        type: txType,
        amount: amt,
        label: txLabel || (txType === 'income' ? 'Income' : 'Expense'),
        category: txCategory as any,
        emoji: txEmoji,
        accountId: txAccountId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        tags: [],
        isRecurring: false,
        isPaid: true,
        status: 'cleared',
      })
    );
    showToast(`Added ${txType}: ${amt.toFixed(2)} ${currency}`, 'success');
    setShowAddTx(false);
    setTxAmount('');
    setTxLabel('');
  };

  const handlePayBill = (ruleId: string, label: string) => {
    dispatch(markRecurringPaid(ruleId));
    showToast(`Paid "${label}" successfully!`, 'success');
  };

  const handleAddToGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(goalFundAmount);
    if (!goalFundAmount || isNaN(amt) || amt <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }
    dispatch(addToGoal({ id: goalFundId, amount: amt }));
    showToast(`Added ${amt.toFixed(2)} ${currency} to goal!`, 'success');
    setShowAddToGoal(false);
    setGoalFundAmount('');
  };

  // ---- Loading state ----
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F6FA]">
        <div className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-wider">Loading Plombier...</div>
      </div>
    );
  }

  // ---- AUTH SCREEN (when user is null) ----
  if (!user) {
    return (
      <div className="flex h-screen w-screen bg-[#F4F6FA] items-center justify-center font-sans antialiased">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-left mx-4">
          {/* Logo */}
          <div className="flex items-center justify-center gap-1.5 mb-6 select-none">
            <span className="text-2xl font-extrabold tracking-tight text-[#A80000] leading-none">ST★UCHI</span>
            <span className="text-xl font-bold text-[#005994] leading-none mt-[-8px]">*</span>
          </div>

          <h1 className="text-2xl font-black text-slate-850 text-center mb-1">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xs text-slate-400 font-semibold text-center mb-6">
            {authMode === 'login' ? 'Sign in to your wallet' : 'Start your financial journey'}
          </p>

          {authError && (
            <div className="bg-[#FFF1F1] border border-red-200 text-[#A80000] text-xs font-bold rounded-xl p-3 mb-4 text-center">{authError}</div>
          )}

          <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Ahmed Ben Ali"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005994] bg-slate-50" />
              </div>
            )}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
              <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@demo.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005994] bg-slate-50" />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
              <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005994] bg-slate-50" />
            </div>
            <button type="submit" disabled={authLoading}
              className="w-full bg-[#005994] hover:bg-[#004775] text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-sm uppercase tracking-wider disabled:opacity-60">
              {authLoading ? 'Loading...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo credentials quick fill */}
          {authMode === 'login' && (
            <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Demo Access</p>
              <div className="flex gap-2">
                <button onClick={() => { setAuthEmail('admin@demo.com'); setAuthPassword('admin123'); }}
                  className="flex-1 bg-white border border-slate-200 hover:border-[#005994] text-slate-700 font-bold text-[10px] py-2 rounded-lg transition">
                  Admin
                </button>
                <button onClick={() => { setAuthEmail('user@demo.com'); setAuthPassword('user123'); }}
                  className="flex-1 bg-white border border-slate-200 hover:border-[#005994] text-slate-700 font-bold text-[10px] py-2 rounded-lg transition">
                  User
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-5">
            <span className="text-xs text-slate-400">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
              className="text-xs font-bold text-[#005994] hover:underline">
              {authMode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- DASHBOARD (when user is authenticated) ----
  // Computed values from real data
  const overdueTotal = overdueBills.reduce((s, b) => s + b.amount, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const monthStr = todayStr.slice(0, 7);
  const monthExpenses = transactions.filter(t => t.date.startsWith(monthStr) && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthIncome = transactions.filter(t => t.date.startsWith(monthStr) && t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const budgetUsed = settings.monthlyBudget > 0 ? Math.min(100, Math.round((monthExpenses / settings.monthlyBudget) * 100)) : 0;
  const unpaidBills = recurringRules.filter(r => !r.isPaid && r.type === 'expense');
  const goalsTotalSaved = activeGoals.reduce((s, g) => s + g.currentAmount, 0);

  // Common inner screen render switcher based on activeTab
  const renderActiveScreenContent = () => {
    switch (activeTab) {
      case 'Reports':
        return renderWebReportsTab(transactions, accounts, settings, monthStr, currency);
      case 'Accounts':
        return renderWebAccountsTab(accounts, transactions, unpaidBills, currency, dispatch, handlePayBill, () => { setTxType('expense'); setShowAddTx(true); }, showToast, setActiveTab, txFilter, setTxFilter);
      case 'Goals':
        return renderWebGoalsTab(activeGoals, completedGoals, goalsTotalSaved, currency, dispatch, showToast, (id: string) => { setGoalFundId(id); setShowAddToGoal(true); });
      case 'Profile':
        return renderWebProfileTab(user, signOut, showToast);
      default:
        return null;
    }
  };

  // Determine sidebar visibility
  const isSidebarVisible = activeTab === 'Home' || activeTab === 'Goals';

  return (
    <div className="w-full h-full relative">
      {/* ----------------------------------------------------
          DESKTOP CONTAINER (Visible >= 1024px)
          ---------------------------------------------------- */}
      <div className="hidden lg:flex h-screen w-screen overflow-hidden bg-[#F4F6FA] text-[#404751] font-sans antialiased">
        
        {/* Dynamic Sidebar Left (Only visible on Home and Goals) */}
        {isSidebarVisible && (
          <aside className="w-72 flex-shrink-0 flex flex-col justify-between border-r border-[#E2E8F0] bg-white px-8 py-10">
            <div>
              {/* ST)UCHI* Vector-rendered Star Logo matching mockup */}
              <div className="flex items-center gap-1.5 mb-10 pl-2 select-none">
                <span className="text-2xl font-extrabold tracking-tight text-[#A80000] leading-none flex items-center">
                  ST
                  <span className="w-5.5 h-5.5 rounded-full bg-[#A80000] flex items-center justify-center mx-0.5">
                    <MaterialIcons name="star" size={14} color="#FFFFFF" />
                  </span>
                  UCHI
                </span>
                <span className="text-xl font-bold text-[#A80000] leading-none mt-[-8px]">*</span>
              </div>

              {/* Sidebar navigation items */}
              <div className="space-y-2">
                {[
                  { name: 'Home', icon: 'home', label: 'Portfolio' },
                  { name: 'Accounts', icon: 'account-balance-wallet', label: 'Accounts' },
                  { name: 'Reports', icon: 'bar-chart', label: 'Reports' },
                  { name: 'Goals', icon: 'track-changes', label: 'Goals' },
                  { name: 'Profile', icon: 'person', label: 'Actions' },
                ].map((item) => {
                  const isActive = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name as TabName)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 text-left font-bold text-sm ${
                        isActive
                          ? 'bg-[#005994] text-white shadow-[0_6px_20px_rgba(0,89,148,0.18)]'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <MaterialIcons name={item.icon} size={18} color={isActive ? '#FFFFFF' : '#8E9CAE'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom user profile card inside sidebar - Ahmed Ben Ali for Goals, Sami for Home */}
            <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-slate-100"
              />
              <div className="text-left select-none">
                <div className="text-xs font-black text-slate-800 leading-none mb-0.5">
                  {activeTab === 'Goals' ? 'Ahmed Ben Ali' : 'Sami Admin'}
                </div>
                <div className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">
                  {activeTab === 'Goals' ? 'Premium Member' : 'Admin'}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Center/Main Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Bar Header (Hidden only on Goals, custom clean header on Goals) */}
          {activeTab !== 'Goals' && (
            <header className="h-20 flex-shrink-0 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-12 z-10">
              
              {/* STOUCHI Header Logo on Left for Reports/Accounts tabs */}
              {!isSidebarVisible ? (
                <div className="flex items-center gap-1.5 select-none">
                  <span className="text-2xl font-extrabold tracking-tight text-[#A80000] leading-none flex items-center">
                    ST
                    <span className="w-5.5 h-5.5 rounded-full bg-[#A80000] flex items-center justify-center mx-0.5">
                      <MaterialIcons name="star" size={14} color="#FFFFFF" />
                    </span>
                    UCHI
                  </span>
                  <span className="text-xl font-bold text-[#A80000] leading-none mt-[-8px]">*</span>
                </div>
              ) : <div />}

              {/* Navigation Tabs in the middle for top bar view */}
              <div className="flex items-center gap-8 font-extrabold text-sm select-none">
                {[
                  { name: 'Home', label: 'Portfolio' },
                  { name: 'Accounts', label: 'Accounts' },
                  { name: 'Reports', label: 'Reports' },
                  { name: 'Goals', label: 'Goals' }
                ].map((tab) => {
                  const isActive = activeTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name as TabName)}
                      className={`py-2 transition-colors relative font-bold text-sm ${
                        isActive ? 'text-[#005994]' : 'text-slate-500 hover:text-slate-850'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#005994] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Header Right Controls */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => showToast('No new notifications', 'info')}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 relative hover:bg-slate-100 transition-colors"
                >
                  <MaterialIcons name="notifications" size={18} color="#5A6578" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A80000] rounded-full" />
                </button>
                <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                  />
                  <div className="text-left hidden xl:block select-none">
                    <div className="text-xs font-black text-slate-800 leading-none mb-0.5">Sami Admin</div>
                    <button onClick={() => signOut()} className="text-[10px] text-slate-400 font-bold hover:text-slate-600">Sign Out</button>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Tab Screen Content wrapper */}
          <main className="flex-1 overflow-y-auto px-12 py-10 bg-[#F4F6FA]">
            {activeTab === 'Home' ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto animate-fade-in">
                {/* Columns 1 & 2: Middle Content Cards */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Balance Card (Ocean Blue Gradient) */}
                  <div className="rounded-[24px] bg-gradient-to-r from-[#005994] to-[#007CBF] p-8 text-white relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[200px] text-left">
                    <div className="absolute right-[-30px] top-[-30px] w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
                    <div>
                      <div className="text-[10px] font-extrabold tracking-[2px] text-white/75 uppercase mb-1">TOTAL LIQUIDITY BALANCE</div>
                      <div className="text-4xl font-extrabold tracking-tight">
                        {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-2xl font-bold opacity-90">{currency}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between mt-6 gap-4 z-10">
                      <div className="bg-white/15 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase">
                        ↗ +4.2% this month
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setTxType('income');
                            setShowAddTx(true);
                          }}
                          className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-white/10"
                        >
                          <MaterialIcons name="transfer" size={14} color="#FFFFFF" />
                          <span>Transfer Funds</span>
                        </button>
                        <button
                          onClick={() => showToast('Statement generated!', 'success')}
                          className="bg-white text-[#005994] hover:bg-slate-50 transition px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <MaterialIcons name="statement" size={14} color="#005994" />
                          <span>Statement</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Overdue Card & Budget Health side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overdue Card */}
                    <div className="border border-red-500/10 border-l-4 border-l-[#A80000] bg-[#FFF1F1] rounded-2xl p-5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.01)] text-left">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#A80000] text-white">
                          <MaterialIcons name="priority-high" size={20} color="#FFFFFF" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">{overdueBills.length > 0 ? `${overdueBills.length} Overdue Bills` : 'No Overdue Bills'}</h4>
                          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{overdueTotal > 0 ? `${overdueTotal.toFixed(2)} ${currency} pending` : 'All bills paid'}</p>
                        </div>
                      </div>
                      {overdueBills.length > 0 && <button
                        onClick={() => setActiveTab('Accounts')}
                        className="bg-[#A80000] hover:bg-[#8B0000] text-white font-extrabold text-[10px] tracking-wider uppercase px-3 py-2 rounded-xl transition shadow-sm"
                      >
                        Pay Now
                      </button>}
                    </div>

                    {/* Budget Health Card */}
                    <div className="border border-slate-200 bg-white rounded-2xl p-5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-slate-850 text-sm">Budget Health</h4>
                        <span className={`text-xs font-bold ${budgetUsed > 80 ? 'text-[#A80000]' : 'text-[#008A5D]'}`}>{budgetUsed}% Used</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                        <div className={`h-full rounded-full ${budgetUsed > 80 ? 'bg-[#A80000]' : 'bg-[#005994]'}`} style={{ width: `${budgetUsed}%` }} />
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <MaterialIcons name="info" size={11} color="#94A3B8" />
                        <span>{monthExpenses > 0 ? `${monthExpenses.toFixed(0)} ${currency} SPENT / ${settings.monthlyBudget} ${currency} BUDGET` : 'NO EXPENSES THIS MONTH'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Log section with curated outline blue SVG icons */}
                  <div className="text-left">
                    <h3 className="text-base font-extrabold text-slate-800 tracking-wide mb-4">Quick Log</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {quickLogShortcuts.map((shortcut) => (
                        <button
                          key={shortcut.id}
                          onClick={() => handleQuickLog(shortcut)}
                          className="bg-white border border-[#E2E8F0] hover:border-[#005994] hover:shadow-sm transition-all duration-200 p-5 rounded-2xl text-center group flex flex-col items-center justify-center"
                        >
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#005994]/5 group-hover:bg-[#E6F0FA] transition mb-3">
                            {renderQuickLogIcon(shortcut.category)}
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 tracking-wide uppercase">{shortcut.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 3: Right Sidebar widgets */}
                <div className="space-y-8">
                  {/* Recent Activity List */}
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Recent Activity</h3>
                      <button
                        onClick={() => showToast('Opening history...', 'info')}
                        className="text-xs font-bold text-[#005994] hover:underline uppercase"
                      >
                        See All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {transactions.slice(0, 4).map((tx: any) => {
                        const isExpense = tx.amount < 0;
                        return (
                          <div key={tx.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                                <span className="text-base">{tx.emoji}</span>
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-800 leading-tight">{tx.label}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{tx.date}</div>
                              </div>
                            </div>
                            <span className={`text-xs font-black ${isExpense ? 'text-[#A80000]' : 'text-[#008A5D]'}`}>
                              {isExpense ? '' : '+'}{tx.amount.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Portfolio Growth graphics card */}
                  <div className="bg-gradient-to-br from-[#0B2545] to-[#134074] rounded-2xl p-6 text-white text-left relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[200px]">
                    <div className="absolute inset-0 z-0 opacity-30 flex items-end pointer-events-none">
                      <svg viewBox="0 0 1440 320" className="w-full h-24" preserveAspectRatio="none">
                        <path
                          fill="#00E5FF"
                          fillOpacity="1"
                          d="M0,224L48,197.3C96,171,192,117,288,112C384,107,480,149,576,149.3C672,149,768,107,864,117.3C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                        <path
                          fill="#005994"
                          fillOpacity="0.5"
                          d="M0,96L48,117.3C96,139,192,181,288,176C384,171,480,117,576,128C672,139,768,213,864,229.3C960,245,1056,203,1152,197.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        />
                      </svg>
                    </div>

                    <div className="z-10">
                      <h4 className="text-[10px] font-bold tracking-[2px] text-sky-300 uppercase">Portfolio Growth</h4>
                      <p className="text-[9px] text-slate-400 mt-1">Real-time asset projection values.</p>
                    </div>

                    <div className="z-10 flex items-baseline justify-between mt-12">
                      <span className="text-xl font-bold tracking-tight">PORTFOLIO GROWTH</span>
                      <span className="bg-[#00E5FF]/20 text-[#00E5FF] font-bold text-[9px] px-2.5 py-0.5 rounded-full border border-[#00E5FF]/30 leading-none">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">{renderActiveScreenContent()}</div>
            )}
          </main>
        </div>
      </div>

      {/* ----------------------------------------------------
          MOBILE CONTAINER (Visible < 1024px)
          ---------------------------------------------------- */}
      <div className="lg:hidden flex h-screen w-screen flex-col overflow-hidden bg-[#F4F6FA] text-[#404751] font-sans antialiased pb-24">
        {/* Mobile Top Bar Header */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between bg-white px-5 border-b border-[#E2E8F0] shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-100"
            />
            <span className="text-lg font-extrabold text-[#005994] select-none">Plombier</span>
          </div>
          <button
            onClick={() => showToast('No notifications', 'info')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 border border-slate-100"
          >
            <MaterialIcons name="notifications" size={16} color="#5A6578" />
          </button>
        </header>

        {/* Scrollable Mobile Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {activeTab === 'Home' ? (
            <>
              {/* Greetings */}
              <div className="text-left px-0.5">
                <h2 className="text-2xl font-black text-slate-800 leading-tight">Good Morning, Sami</h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Your artisan portfolio is looking stable today.</p>
              </div>

              {/* Liquidity Card (Clean layout, NO statement/transfer buttons) */}
              <div className="rounded-[24px] bg-gradient-to-b from-[#005994] to-[#007CBF] p-6 text-white relative overflow-hidden shadow-sm min-h-[140px] flex flex-col justify-between text-left">
                <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div className="text-[9px] font-extrabold tracking-[2px] text-white/75 uppercase">TOTAL LIQUIDITY</div>
                  <MaterialIcons name="account-balance-wallet" size={18} color="rgba(255,255,255,0.4)" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold tracking-tight mb-2">
                    {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                  </div>
                  <div className="inline-block bg-white/20 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase leading-none">
                    ↗ +4.2% THIS MONTH
                  </div>
                </div>
              </div>

              {/* Overdue Badge */}
              <div className="border border-red-500/10 border-l-4 border-l-[#A80000] bg-[#FFF1F1] rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.01)] text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#A80000] text-white">
                    <MaterialIcons name="priority-high" size={16} color="#FFFFFF" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs">{overdueBills.length > 0 ? `${overdueBills.length} Overdue` : 'Bills OK'}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{overdueTotal > 0 ? `${overdueTotal.toFixed(2)} ${currency} pending` : 'All paid'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('Accounts')}
                  className="bg-[#A80000] hover:bg-[#8B0000] text-white font-extrabold text-[9px] px-3 py-2 rounded-xl uppercase tracking-wider transition shadow-sm leading-none"
                >
                  PAY NOW
                </button>
              </div>

              {/* Quick Log Horizontal Slider */}
              <div className="text-left">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-0.5">Quick Log</h3>
                <div className="flex overflow-x-auto gap-3.5 no-scrollbar pb-1">
                  {quickLogMobile.map((shortcut) => (
                    <button
                      key={shortcut.id}
                      onClick={() => handleQuickLog(shortcut)}
                      className="flex-shrink-0 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] p-4 rounded-2xl w-20 text-center shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#005994]/5 mb-2.5">
                        {renderQuickLogIcon(shortcut.category)}
                      </div>
                      <span className="text-[9px] font-extrabold tracking-wide text-slate-800 uppercase">{shortcut.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setTxType('expense');
                      setShowAddTx(true);
                    }}
                    className="flex-shrink-0 flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 p-4 rounded-2xl w-20 text-center"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 mb-2.5 text-slate-400">
                      <MaterialIcons name="add" size={16} color="currentColor" />
                    </div>
                    <span className="text-[9px] font-extrabold tracking-wide text-slate-400 uppercase">Custom</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity mobile list */}
              <div className="text-left">
                <div className="flex justify-between items-center mb-4 px-0.5">
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                  <button onClick={() => showToast('Opening history...', 'info')} className="text-[10px] font-extrabold text-[#005994] uppercase tracking-wide">VIEW ALL</button>
                </div>

                <div className="space-y-2.5">
                  {transactions.slice(0, 3).map((tx: any) => {
                    const isExpense = tx.amount < 0;
                    return (
                      <div key={tx.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                            <span className="text-base">{tx.emoji}</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 leading-tight">{tx.label}</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">{tx.date || 'Today'}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs font-black ${isExpense ? 'text-[#A80000]' : 'text-[#008A5D]'}`}>
                            {isExpense ? '' : '+'}${Math.abs(tx.amount).toFixed(2)}
                          </span>
                          <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase leading-none ${
                            tx.status === 'completed' || tx.status === 'cleared'
                              ? 'bg-[#EBFDF5] text-[#008A5D]'
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            {tx.status || 'Cleared'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="pb-10">{renderActiveScreenContent()}</div>
          )}
        </div>

        {/* Floating Bottom Tab Bar Navigation (Perfectly Proportioned) */}
        <nav className="fixed bottom-6 left-6 right-6 h-18 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex items-center justify-around px-2.5 z-50">
          {[
            { name: 'Home', icon: 'home', label: 'Home' },
            { name: 'Reports', icon: 'bar-chart', label: 'Reports' },
            { name: 'Accounts', icon: 'account-balance', label: 'Accounts' },
            { name: 'Goals', icon: 'track-changes', label: 'Goals' },
            { name: 'Profile', icon: 'person', label: 'Profile' },
          ].map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name as TabName)}
                className="flex flex-col items-center justify-center w-12 h-12 relative"
              >
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition ${
                  isActive ? 'bg-[#005994] text-white shadow-sm' : 'text-slate-400'
                }`}>
                  <MaterialIcons name={tab.icon} size={16} color="currentColor" />
                </div>
                <span className={`text-[7px] font-bold tracking-wider uppercase mt-1 transition ${
                  isActive ? 'text-[#005994]' : 'text-slate-400'
                }`}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Add Transaction Modal Box */}
      {showAddTx && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5 z-[99999] backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 max-w-sm w-full shadow-2xl text-left">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-extrabold text-lg text-slate-800">Add Transaction</h3>
              <button
                onClick={() => setShowAddTx(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Type</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTxType('expense')}
                    className={`py-2 rounded-lg font-bold text-xs text-center border transition ${
                      txType === 'expense'
                        ? 'bg-[#A80000]/10 border-[#A80000] text-[#A80000]'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('income')}
                    className={`py-2 rounded-lg font-bold text-xs text-center border transition ${
                      txType === 'income'
                        ? 'bg-[#008A5D]/10 border-[#008A5D] text-[#008A5D]'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Amount ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005994]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zara City Mall"
                  value={txLabel}
                  onChange={(e) => setTxLabel(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005994]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-850 focus:outline-none focus:border-[#005994]"
                  >
                    <option value="dining">Dining</option>
                    <option value="retail">Retail</option>
                    <option value="transport">Transport</option>
                    <option value="utility">Utility</option>
                    <option value="fuel">Fuel</option>
                    <option value="salary">Salary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Emoji</label>
                  <select
                    value={txEmoji}
                    onChange={(e) => setTxEmoji(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-850 focus:outline-none focus:border-[#005994]"
                  >
                    <option value="🍽️">🍽️ Dining</option>
                    <option value="🛍️">🛍️ Retail</option>
                    <option value="🚌">🚌 Transport</option>
                    <option value="🧾">🧾 Utility</option>
                    <option value="⛽">⛽ Fuel</option>
                    <option value="🏦">🏦 Salary</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#005994] hover:bg-[#004775] transition text-white font-extrabold text-xs py-3 rounded-lg shadow-sm mt-5 uppercase tracking-wider"
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add To Goal Modal */}
      {showAddToGoal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5 z-[99999] backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 max-w-sm w-full shadow-2xl text-left">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-extrabold text-lg text-slate-800">Add Funds to Goal</h3>
              <button
                onClick={() => setShowAddToGoal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddToGoal} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Amount ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={goalFundAmount}
                  onChange={(e) => setGoalFundAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005994]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#005994] hover:bg-[#004775] transition text-white font-extrabold text-xs py-3 rounded-lg shadow-sm mt-5 uppercase tracking-wider"
              >
                Add Funds
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// HIGH-FIDELITY WEB TAB RENDERING HELPER: REPORTS TAB
// ----------------------------------------------------
const renderWebReportsTab = (transactions: any[], accounts: any[], settings: any, monthStr: string, currency: string) => {
  const monthExpenses = transactions.filter((t: any) => t.date.startsWith(monthStr) && t.type === 'expense').reduce((s: number, t: any) => s + t.amount, 0);
  const monthIncome = transactions.filter((t: any) => t.date.startsWith(monthStr) && t.type === 'income').reduce((s: number, t: any) => s + t.amount, 0);
  const activeAccounts = accounts.filter((a: any) => !a.isArchived);
  const totalBal = activeAccounts.reduce((s: number, a: any) => s + a.balance, 0);
  const catSpend: Record<string, number> = {};
  transactions.filter((t: any) => t.date.startsWith(monthStr) && t.type === 'expense').forEach((t: any) => { catSpend[t.category] = (catSpend[t.category] || 0) + t.amount; });
  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left animate-fade-in">
      {/* Title Header area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase">ARCHITECTURAL INSIGHTS</span>
          <h1 className="text-3xl font-black text-slate-850 mt-1">Financial Reports</h1>
        </div>
        
        {/* Monthly/Quarterly/Yearly toggle & Date */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner">
            {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
              <button
                key={period}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  period === 'Monthly'
                    ? 'bg-white text-[#005994] shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          <button className="bg-white border border-slate-200 hover:bg-slate-50 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <MaterialIcons name="calendar-today" size={14} color="#8E9CAE" />
            <span>Aug 2024</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (xl:col-span-2) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Cash Flow Overview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-850">Cash Flow Overview</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Net inflows remained positive with 12% growth</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold tracking-wide uppercase">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005994]" /> INCOME
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A80000]" /> EXPENSES
                </span>
              </div>
            </div>
            
            {/* SVG Bars Chart */}
            <div className="h-64 w-full flex items-end justify-between pt-4 px-2">
              {[
                { m: 'JAN', inc: 45, exp: 25 },
                { m: 'FEB', inc: 60, exp: 30 },
                { m: 'MAR', inc: 55, exp: 35 },
                { m: 'APR', inc: 70, exp: 40 },
                { m: 'MAY', inc: 85, exp: 45 },
                { m: 'JUN', inc: 90, exp: 50 },
                { m: 'JUL', inc: 80, exp: 40 },
                { m: 'AUG', inc: 95, exp: 35 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full flex items-end justify-center gap-1 h-48 relative">
                    {/* Expense Bar */}
                    <div 
                      className="w-3 rounded-t-md bg-[#A80000] hover:opacity-90 transition-all duration-300 relative group-hover:scale-y-105 origin-bottom" 
                      style={{ height: `${item.exp}%` }}
                    >
                      <div className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 shadow">
                        ${(item.exp * 40).toLocaleString()}
                      </div>
                    </div>
                    {/* Income Bar */}
                    <div 
                      className="w-3 rounded-t-md bg-[#005994] hover:opacity-90 transition-all duration-300 relative group-hover:scale-y-105 origin-bottom" 
                      style={{ height: `${item.inc}%` }}
                    >
                      <div className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 shadow">
                        ${(item.inc * 40).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 tracking-wider">{item.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spending Velocity & Active Budgets side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Spending Velocity */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[320px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">Spending Velocity</h3>
                <span className="text-[10px] font-extrabold text-[#A80000] bg-[#FFF1F1] px-2.5 py-1 rounded-full border border-red-500/10 leading-none">
                  ↗ +4.2%
                </span>
              </div>
              
              {/* Smooth Line Chart Graphic */}
              <div className="h-32 w-full relative overflow-hidden flex items-end">
                <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A80000" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#A80000" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Filled area */}
                  <path
                    d="M0,80 Q50,70 100,50 T200,30 T300,10 L300,100 L0,100 Z"
                    fill="url(#velocityGrad)"
                  />
                  {/* Stroke path */}
                  <path
                    d="M0,80 Q50,70 100,50 T200,30 T300,10"
                    fill="none"
                    stroke="#A80000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Highlight point */}
                  <circle cx="200" cy="30" r="4.5" fill="#A80000" stroke="#FFFFFF" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Detail Metrics */}
              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-4">
                <div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">PEAK DAY</div>
                  <div className="text-xs font-black text-slate-800 mt-1.5">Aug 14</div>
                </div>
                <div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">AVG DAILY</div>
                  <div className="text-xs font-black text-slate-800 mt-1.5">$142.00</div>
                </div>
                <div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">STATUS</div>
                  <div className="text-xs font-black text-[#A80000] mt-1.5">Accelerating</div>
                </div>
              </div>
            </div>

            {/* Active Budgets list */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[320px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">Active Budgets</h3>
                <button className="text-xs font-extrabold text-[#005994] hover:underline uppercase tracking-wide">
                  Adjust Limits &gt;
                </button>
              </div>

              <div className="space-y-5">
                {[
                  { name: 'Sidi Bou Said Restoration', val: 8450, total: 12000, color: '#005994', note: 'On track • 22 days remaining', percent: 70, isDanger: false },
                  { name: 'Mediterranean Tour', val: 3890, total: 4000, color: '#A80000', note: 'Critical: 97% utilized • Alert active', percent: 97, isDanger: true },
                  { name: 'Lifestyle & Dining', val: 1200, total: 2500, color: '#005994', note: 'Under budget • Trending lower', percent: 48, isDanger: false },
                ].map((b, idx) => (
                  <div key={idx} className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800">{b.name}</span>
                      <span className="text-slate-700">${b.val.toLocaleString()} <span className="text-slate-400">/ ${b.total / 1000}k</span></span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${b.percent}%`, backgroundColor: b.color }} />
                    </div>
                    <p className={`text-[9px] font-semibold ${b.isDanger ? 'text-[#A80000]' : 'text-slate-400'}`}>{b.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Asset Allocation Donut Chart */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] min-h-[420px] flex flex-col justify-between">
            <h3 className="text-sm font-extrabold text-slate-855 uppercase tracking-wider text-left mb-6">Asset Allocation</h3>
            
            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center h-48 my-4">
              <svg width="180" height="180" viewBox="0 0 36 36" className="transform -rotate-90">
                {/* Real Estate: 60% (#005994) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#005994" strokeWidth="3" strokeDasharray="60 40" strokeDashoffset="0" />
                {/* Liquid Equities: 25% (#134074) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#134074" strokeWidth="3.2" strokeDasharray="25 75" strokeDashoffset="-60" />
                {/* Commodities: 15% (#A80000) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#A80000" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-85" />
              </svg>
              
              {/* Inner wealth labels */}
              <div className="absolute text-center select-none">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none">TOTAL WEALTH</div>
                <div className="text-2xl font-black text-slate-850 mt-1 leading-none">$242k</div>
              </div>
            </div>

            {/* Legends */}
            <div className="space-y-3.5 border-t border-slate-100 pt-6 mt-4 text-left">
              {[
                { label: 'Real Estate', pct: '60%', color: 'bg-[#005994]' },
                { label: 'Liquid Equities', pct: '25%', color: 'bg-[#134074]' },
                { label: 'Commodities', pct: '15%', color: 'bg-[#A80000]' },
              ].map((lg, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${lg.color}`} />
                    <span className="text-slate-500">{lg.label}</span>
                  </div>
                  <span className="text-slate-850">{lg.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Expert Insight Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#134074] rounded-3xl p-8 text-white text-left relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
        {/* Background circular vectors */}
        <div className="absolute right-[-30px] top-[-30px] w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        
        <div className="space-y-3 max-w-3xl z-10">
          <span className="bg-[#A80000] text-white font-extrabold text-[9px] px-3 py-1 rounded-full uppercase tracking-widest leading-none">
            EXPERT INSIGHT
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">Portfolio Efficiency is currently at 94%</h2>
          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
            Based on your recent architectural investments in the Northern Coast, we recommend re-balancing 5% of your liquid assets into emerging commodities.
          </p>
        </div>

        <button 
          onClick={() => alert('Strategy loaded!')}
          className="bg-white hover:bg-slate-50 text-[#0B2545] font-black text-xs px-6 py-3.5 rounded-2xl shadow-md transition whitespace-nowrap z-10"
        >
          View Recommended Strategy
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// HIGH-FIDELITY WEB TAB RENDERING HELPER: ACCOUNTS TAB
// ----------------------------------------------------
const renderWebAccountsTab = (accounts: any[], transactions: any[], unpaidBills: any[], currency: string, dispatch: any, handlePayBill: (id: string, label: string) => void, openAddTx: () => void, showToast: any, setActiveTab: any, txFilter: 'all'|'sent'|'received', setTxFilter: React.Dispatch<React.SetStateAction<'all'|'sent'|'received'>>) => {
  const primaryAccount = accounts.find((a: any) => a.type === 'cash' && !a.isArchived) || accounts[0];
  const otherAccounts = accounts.filter((a: any) => a.id !== primaryAccount?.id && !a.isArchived);
  const filteredTx = transactions.filter((t: any) => {
    if (txFilter === 'sent') return t.type === 'expense';
    if (txFilter === 'received') return t.type === 'income';
    return true;
  });
  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left animate-fade-in">
      {/* Title Header area matching Accounts mockup */}
      <div>
        <span className="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase">MANAGING {accounts.filter((a: any) => !a.isArchived).length} ACCOUNTS</span>
        <h1 className="text-3xl font-black text-slate-850 mt-1">Accounts Overview</h1>
      </div>

      {/* Main Grid: Sidi Bou Said Card & Savings on Left, Recurring on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Area (xl:col-span-2) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Primary Account Card */}
          <div className="rounded-3xl bg-gradient-to-r from-[#005994] to-[#007CBF] p-8 text-white relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-[-20px] top-[-20px] w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-[9px] font-bold tracking-[2px] text-white/70 uppercase">PRIMARY {primaryAccount?.type?.toUpperCase()} ACCOUNT</span>
                <h3 className="text-xl font-extrabold tracking-tight mt-1">{primaryAccount?.emoji} {primaryAccount?.name}</h3>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 text-white">
                <MaterialIcons name="account-balance-wallet" size={20} color="#FFFFFF" />
              </div>
            </div>

            <div className="z-10 mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[9px] font-bold text-white/60 tracking-wider">Available Balance</span>
                <div className="text-4xl font-extrabold tracking-tight mt-1">
                  {primaryAccount?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-2xl font-bold opacity-90">{currency}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => alert('Funds transfer screen loaded')}
                  className="bg-white hover:bg-slate-50 text-[#005994] font-black text-xs px-5 py-3 rounded-2xl shadow-sm transition"
                >
                  Transfer Funds
                </button>
                <button
                  onClick={() => alert('Viewing transaction history...')}
                  className="bg-white/10 hover:bg-white/20 text-white font-black text-xs px-5 py-3 rounded-2xl border border-white/15 transition"
                >
                  History
                </button>
              </div>
            </div>
          </div>

          {/* Other Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherAccounts.map((acc: any) => (
              <button key={acc.id}
                onClick={() => showToast(`Viewing ${acc.name} details`, 'info')}
                className="bg-white border border-slate-200 hover:border-[#005994] p-5 rounded-2xl flex items-center justify-between transition shadow-[0_4px_15px_rgba(0,0,0,0.005)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center rounded-2xl text-xl" style={{ backgroundColor: acc.color + '15' }}>
                    {acc.emoji}
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{acc.name}</span>
                    <div className="text-base font-extrabold text-slate-850 mt-1.5 leading-none">{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}</div>
                  </div>
                </div>
                <MaterialIcons name="chevron-right" size={18} color="#8E9CAE" />
              </button>
            ))}
          </div>

          {/* Recent Transactions List Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">Recent Transactions</h3>
              
              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-0.5">
                  {['All', 'Sent', 'Received'].map((filter) => {
                    const filterKey = filter.toLowerCase() as 'all' | 'sent' | 'received';
                    return (
                    <button
                      key={filter}
                      onClick={() => setTxFilter(filterKey)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all duration-200 ${
                        txFilter === filterKey
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {filter}
                    </button>
                    );
                  })}
                </div>
                <button className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100">
                  <MaterialIcons name="filter-list" size={14} color="currentColor" />
                </button>
              </div>
            </div>

            {/* Transactions items matching table design exactly */}
            <div className="space-y-4">
              {filteredTx.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No transactions found.</p>
              ) : filteredTx.map((tx: any) => (
                <div key={tx.id} className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 text-lg">
                      {tx.emoji}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-tight">{tx.label || 'Transaction'}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {tx.accountId ? accounts.find((a: any) => a.id === tx.accountId)?.name : 'Account'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-10 flex-1">
                    <span className="bg-slate-100 text-slate-500 text-[8.5px] font-black px-2.5 py-0.5 rounded-full uppercase leading-none">
                      {tx.categoryId || 'GENERAL'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className={`text-xs font-black tracking-tight text-right w-24 ${tx.type === 'expense' ? 'text-[#A80000]' : 'text-[#008A5D]'}`}>
                      {tx.type === 'expense' ? '-' : '+'}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* View All link */}
            <button 
              onClick={() => alert('Opening transactions registry...')}
              className="w-full text-center text-xs font-black text-[#005994] hover:underline uppercase border-t border-slate-50 pt-5 mt-5 tracking-wider block"
            >
              View All Transactions
            </button>
          </div>

        </div>

        {/* Right Area (xl:col-span-1) */}
        <div className="space-y-8">
          
          {/* Recurring Bills list */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] relative min-h-[360px] flex flex-col justify-between text-left">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-extrabold text-slate-850 uppercase tracking-wider">Recurring Bills</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {unpaidBills.length} UNPAID
                </span>
              </div>

              <div className="space-y-5">
                {unpaidBills.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">All bills are paid! 🎉</p>
                ) : unpaidBills.map((rule: any) => {
                  const isOverdue = rule.nextDueDate < new Date().toISOString().split('T')[0];
                  return (
                  <div key={rule.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-855">{rule.emoji} {rule.label}</span>
                      <span className={isOverdue ? 'text-[#A80000]' : 'text-slate-700'}>{rule.amount.toFixed(2)} {currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-[9px] font-extrabold uppercase leading-none ${isOverdue ? 'text-[#A80000]' : 'text-slate-400'}`}>
                        {isOverdue ? 'OVERDUE' : `Due: ${rule.nextDueDate}`}
                      </p>
                      <button
                        onClick={() => handlePayBill(rule.id, rule.label)}
                        className={`text-[8px] font-black px-2.5 py-1 rounded-lg uppercase leading-none transition ${isOverdue ? 'bg-[#A80000] text-white hover:bg-[#8B0000]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Plus red floating button */}
            <div className="flex justify-end mt-4">
              <button 
                onClick={openAddTx}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-[#A80000] text-white hover:bg-[#8B0000] shadow-md transition"
              >
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
              </button>
            </div>
          </div>

          {/* Spending Analytics Projector */}
          <div className="bg-gradient-to-br from-[#0B2545] to-[#134074] rounded-3xl p-6 text-white text-left relative overflow-hidden min-h-[220px] flex flex-col justify-between shadow-sm">
            <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
            
            <div>
              <span className="text-[8px] font-bold tracking-[2.5px] text-sky-200 uppercase">SPENDING ANALYTICS</span>
              <h3 className="text-base font-extrabold tracking-tight mt-2">Monthly Projection</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5 font-semibold">
                Based on your recurring bills, you will spend 1,240 TND more this month.
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('Reports')}
              className="w-full bg-[#005994] hover:bg-[#004775] text-white font-extrabold text-xs py-3.5 rounded-xl transition text-center shadow-sm"
            >
              Review Budget
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// HIGH-FIDELITY WEB TAB RENDERING HELPER: GOALS TAB
// ----------------------------------------------------
const renderWebGoalsTab = (activeGoals: any[], completedGoals: any[], totalSaved: number, currency: string, dispatch: any, showToast: any, onAddFunds: (goalId: string) => void) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left animate-fade-in">
      {/* Title Header area matching Goals mockup */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase">PORTFOLIO OVERVIEW</span>
          <h1 className="text-3xl font-black text-slate-850 mt-1">Wealth Horizons</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => alert('Add funds screen loaded')}
            className="bg-[#005994] hover:bg-[#004775] text-white font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
          >
            <MaterialIcons name="add" size={14} color="#FFFFFF" />
            <span>Add Funds</span>
          </button>
          
          <button 
            onClick={() => alert('Viewing notifications...')}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
          >
            <MaterialIcons name="notifications" size={18} color="#5A6578" />
          </button>
        </div>
      </div>

      {/* Aggregate Progress Overview & Insight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left aggregate info */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-[9px] font-extrabold tracking-[2px] text-slate-400 uppercase">AGGREGATE PROGRESS</span>
            <div className="text-3xl font-extrabold text-slate-850 mt-1">{totalSaved.toLocaleString('en-US')} <span className="text-xl font-bold opacity-80">{currency}</span></div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-4 font-semibold">
            Your total architectural capital is currently optimized across 4 primary objectives. You are 68% towards your quarterly milestone.
          </p>
        </div>

        {/* Right Optimization Insight banner */}
        <div className="bg-[#005994] text-white rounded-3xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[160px]">
          {/* Circular decorations */}
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-2 text-sky-200">
            <MaterialIcons name="insights" size={18} color="currentColor" />
            <h4 className="text-xs font-black uppercase tracking-wider">Optimization Insight</h4>
          </div>
          
          <p className="text-xs leading-relaxed mt-3 text-slate-100 font-semibold">
            Allocating an additional 450 TND to 'Summer Retreat' this month would reach your target 12 days early.
          </p>
        </div>
      </div>

      {/* Active Ambitions */}
      <div>
        <div className="flex items-center gap-3.5 mb-6">
          <h3 className="text-lg font-extrabold text-slate-855 tracking-wide uppercase">Active Ambitions</h3>
          <span className="bg-slate-200 text-slate-700 font-extrabold text-[9px] px-2.5 py-0.5 rounded-full leading-none">
            4 Active
          </span>
          <span className="bg-[#FFF1F1] text-[#A80000] border border-red-500/10 font-extrabold text-[9px] px-2.5 py-0.5 rounded-full leading-none">
            1 Urgent
          </span>
        </div>

        {/* Goals cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {activeGoals.map((goal: any) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isUrgent = goal.deadline && new Date(goal.deadline) < new Date(new Date().setDate(new Date().getDate() + 30));
            return (
              <div key={goal.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between text-left min-h-[260px]">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#E6F0FA] text-[#005994] text-xl">
                      {goal.emoji}
                    </div>
                    {isUrgent ? (
                      <span className="bg-[#FFF1F1] text-[#A80000] border border-red-500/10 font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider leading-none">
                        Urgent
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 tracking-wider">{goal.deadline || 'No Deadline'}</span>
                    )}
                  </div>
                  
                  <h4 className="text-base font-extrabold text-slate-855 mt-4">{goal.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1 font-semibold line-clamp-2">
                    {goal.description || 'Saving towards your goal.'}
                  </p>
                </div>

                <div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden my-4">
                    <div className={`h-full rounded-full ${isUrgent ? 'bg-gradient-to-r from-purple-600 to-[#A80000]' : 'bg-[#005994]'}`} style={{ width: `${pct}%` }} />
                  </div>
                  
                  <div className="flex justify-between border-t border-slate-50 pt-3 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    <div>
                      <div>SAVED AMOUNT</div>
                      <div className="text-xs font-black text-slate-800 mt-1">{goal.currentAmount.toLocaleString()} <span className="text-[10px]">{currency}</span></div>
                    </div>
                    <div className="text-right">
                      <div>OBJECTIVE</div>
                      <div className="text-xs font-black text-slate-800 mt-1">{goal.targetAmount.toLocaleString()} <span className="text-[10px]">{currency}</span></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-3 text-[9px] font-extrabold uppercase leading-none">
                    <span className={isUrgent ? 'text-[#A80000]' : 'text-[#005994]'}>{pct}% Completed</span>
                    <button onClick={() => onAddFunds(goal.id)} className={`px-3 py-1.5 rounded-lg text-white ${isUrgent ? 'bg-[#A80000] hover:bg-[#8B0000]' : 'bg-[#005994] hover:bg-[#004775]'}`}>
                      Add Funds
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Victories Section */}
      <div>
        <h3 className="text-lg font-extrabold text-slate-850 tracking-wide uppercase mb-4">Victories</h3>
        <div className="space-y-3">
          {completedGoals.length === 0 ? (
            <p className="text-xs text-slate-400 text-left py-2">No completed goals yet. Keep saving!</p>
          ) : completedGoals.map((item: any) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.005)]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-[#005994] text-xl">
                  {item.emoji}
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-slate-800 text-xs">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Completed • {item.targetAmount.toLocaleString()} {currency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Inspiration Backdrop Banner */}
      <div className="rounded-3xl min-h-[160px] relative overflow-hidden flex flex-col justify-end p-8 text-white text-left shadow-sm bg-[#0B2545]">
        {/* Simulated Mediterranean Backdrop with deep rich colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(0,181,204,0.1),transparent)] z-0" />
        
        <div className="z-20 max-w-lg space-y-1">
          <span className="text-[9px] font-bold tracking-[2.5px] text-sky-200 uppercase">ARCHITECTURAL INSPIRATION</span>
          <h2 className="text-xl font-black tracking-tight mt-1">Building wealth with the same precision as Mediterranean masters.</h2>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// PROFILE TAB WITH REAL USER DATA
// ----------------------------------------------------
const renderWebProfileTab = (user: any, signOut: () => void, showToast: any) => (
  <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in">
    <div>
      <h2 className="text-xl font-extrabold text-slate-850">Profile Settings</h2>
      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Manage your account, security, and preferences</p>
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#005994] flex items-center justify-center text-white text-2xl font-black">
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="font-extrabold text-base text-slate-850">{user.name}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{user.email}</p>
          <span className="inline-block mt-1 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase leading-none bg-[#E6F0FA] text-[#005994]">{user.role}</span>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-semibold">Status</span>
          <span className="font-bold text-[#008A5D]">{user.status || 'Active'}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-semibold">Currency</span>
          <span className="font-bold text-slate-800">{user.preferredCurrency || 'DT'}</span>
        </div>
      </div>
      <button
        onClick={() => { signOut(); showToast('Signed out successfully', 'info'); }}
        className="w-full bg-[#A80000] hover:bg-[#8B0000] text-white font-extrabold text-xs py-3 rounded-xl transition shadow-sm uppercase tracking-wider"
      >
        Sign Out
      </button>
    </div>
  </div>
);
