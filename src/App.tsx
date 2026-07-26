// @ts-nocheck
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';

// --- AQUÍ ESTÁN TUS CLAVES REALES DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyB7JCVoZFMiVVMra5xe0sbKzPcmcDk8avE",
  authDomain: "ventas-stock-a8f8c.firebaseapp.com",
  projectId: "ventas-stock-a8f8c",
  storageBucket: "ventas-stock-a8f8c.firebasestorage.app",
  messagingSenderId: "123319376369",
  appId: "1:123319376369:web:fb75868540027035ed0c50",
  measurementId: "G-PED6PV4DVB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Iconos SVG ---
const UsersIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const UserIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const PlusIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const CalculatorIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>;
const ChartIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const ClipboardIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const CloudIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
const LoaderIcon = ({ className, ...props }) => <svg className={`animate-spin ${className}`} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>;
const LockIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const WifiOffIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
const PrinterIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const StoreIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>;
const AlertIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [sellers, setSellers] = useState([]);
  const [sales, setSales] = useState([]);
  
  const [currentSellerId, setCurrentSellerId] = useState('');
  const [currentMonth, setCurrentMonth] = useState('2026-03');
  const [commissionRate, setCommissionRate] = useState(5); 

  const [activeTab, setActiveTab] = useState('registro'); 
  const [reportSellerId, setReportSellerId] = useState('all');
  const [reportGroupBy, setReportGroupBy] = useState('daily'); 
  const [reportStartDate, setReportStartDate] = useState('2026-03-01');
  const [reportEndDate, setReportEndDate] = useState('2026-06-30');

  const [newSellerName, setNewSellerName] = useState('');
  const [saleDate, setSaleDate] = useState('2026-03-09');
  const [saleAmount, setSaleAmount] = useState('');
  const [saleNote, setSaleNote] = useState('');

  // Perfiles de acceso y estado híbrido
  const [role, setRole] = useState(null); // 'admin' | 'cajero'
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Estados de Modales
  const [showSellerPrintModal, setShowSellerPrintModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetKeyword, setResetKeyword] = useState('');
  const [resetError, setResetError] = useState('');

  const hasSeededData = useRef(false);

  // 1. Autenticar Usuario
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Error authenticating:", error);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Obtener Datos en Tiempo Real
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!user) return;

    const sellersRef = collection(db, 'usuarios', user.uid, 'vendedores');
    const salesRef = collection(db, 'usuarios', user.uid, 'ventas');

    const unsubSellers = onSnapshot(sellersRef, (snapshot) => {
      const fetchedSellers = [];
      snapshot.forEach(doc => fetchedSellers.push({ id: doc.id, ...doc.data() }));
      setSellers(fetchedSellers);
      if (fetchedSellers.length > 0 && !currentSellerId) {
         setCurrentSellerId(fetchedSellers[0].id);
      }
    });

    const unsubSales = onSnapshot(salesRef, (snapshot) => {
      const fetchedSales = [];
      snapshot.forEach(doc => fetchedSales.push({ id: doc.id, ...doc.data() }));
      setSales(fetchedSales);
      setIsLoading(false);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubSellers();
      unsubSales();
    };
  }, [user, currentSellerId]); 

  const filteredSales = useMemo(() => {
    return sales
      .filter(sale => sale.sellerId === currentSellerId && sale.date.startsWith(currentMonth))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [sales, currentSellerId, currentMonth]);

  const totalSales = useMemo(() => {
    return filteredSales.reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0);
  }, [filteredSales]);

  const totalCommission = useMemo(() => {
    return (totalSales * (commissionRate / 100));
  }, [totalSales, commissionRate]);

  const generatedReport = useMemo(() => {
    const filtered = sales.filter(s => {
      const isDateInRange = s.date >= reportStartDate && s.date <= reportEndDate;
      const isSellerMatch = reportSellerId === 'all' || s.sellerId === reportSellerId;
      return isDateInRange && isSellerMatch;
    });

    const grouped = {};
    
    filtered.forEach(sale => {
      let groupKey = '';
      const dateObj = new Date(sale.date);
      
      if (reportGroupBy === 'daily') {
        groupKey = sale.date;
      } else if (reportGroupBy === 'monthly') {
        groupKey = sale.date.substring(0, 7);
      } else if (reportGroupBy === 'weekly') {
        const d = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        groupKey = `${d.getUTCFullYear()}-Semana ${weekNo.toString().padStart(2, '0')}`;
      }

      const finalKey = `${groupKey}_${sale.sellerId}`;

      if (!grouped[finalKey]) {
        grouped[finalKey] = {
          period: groupKey,
          sellerId: sale.sellerId,
          sellerName: sellers.find(s => s.id === sale.sellerId)?.name || 'Desconocido',
          totalAmount: 0,
          commission: 0,
          salesCount: 0
        };
      }
      
      grouped[finalKey].totalAmount += Number(sale.amount) || 0;
      grouped[finalKey].salesCount += 1;
      grouped[finalKey].commission = grouped[finalKey].totalAmount * (commissionRate / 100);
    });

    return Object.values(grouped).sort((a, b) => {
       if (a.period > b.period) return -1;
       if (a.period < b.period) return 1;
       return 0;
    });
  }, [sales, reportStartDate, reportEndDate, reportSellerId, reportGroupBy, sellers, commissionRate]);
  
  const reportTotalSales = useMemo(() => generatedReport.reduce((acc, curr) => acc + curr.totalAmount, 0), [generatedReport]);
  const reportTotalCommission = useMemo(() => generatedReport.reduce((acc, curr) => acc + curr.commission, 0), [generatedReport]);

  const comparativeStats = useMemo(() => {
    const todayDate = new Date();
    const todayStr = todayDate.toISOString().split('T')[0];
    const startOfWeek = new Date(todayDate);
    startOfWeek.setDate(todayDate.getDate() - (todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1));
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
    const startOfMonthStr = todayStr.substring(0, 7) + '-01';
    const currentMonthNum = todayDate.getMonth() + 1;
    const startOfTrimesterMonth = Math.floor((currentMonthNum - 1) / 3) * 3 + 1;
    const startOfTrimesterStr = `${todayDate.getFullYear()}-${String(startOfTrimesterMonth).padStart(2, '0')}-01`;

    return sellers.map(seller => {
        let sToday = 0, sWeek = 0, sMonth = 0, sTrim = 0;
        sales.filter(s => s.sellerId === seller.id).forEach(sale => {
            const amt = Number(sale.amount) || 0;
            if (sale.date === todayStr) sToday += amt;
            if (sale.date >= startOfWeekStr && sale.date <= todayStr) sWeek += amt;
            if (sale.date >= startOfMonthStr && sale.date <= todayStr) sMonth += amt;
            if (sale.date >= startOfTrimesterStr && sale.date <= todayStr) sTrim += amt;
        });
        return { name: seller.name, sToday, sWeek, sMonth, sTrim };
    }).sort((a, b) => b.sMonth - a.sMonth);
  }, [sellers, sales]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  const executeReset = async () => {
    if (resetKeyword !== 'BORRAR_TODO') {
      setResetError('Palabra clave incorrecta');
      return;
    }
    setIsResetting(true);
    setResetError('');
    try {
      const collectionsToDelete = ['vendedores', 'ventas', 'caja_tienda', 'productos', 'tienda_turnos'];
      for (const colName of collectionsToDelete) {
        const colRef = collection(db, 'usuarios', user.uid, colName);
        const snapshot = await getDocs(colRef);
        const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, 'usuarios', user.uid, colName, document.id)));
        await Promise.all(deletePromises);
      }
      setShowResetModal(false);
      setResetKeyword('');
      alert('¡Base de datos formateada con éxito! Sistema como nuevo.');
    } catch (error) {
      console.error(error);
      setResetError('Error al intentar borrar los datos.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleAddSeller = async (e) => {
    e.preventDefault();
    if (!newSellerName.trim() || !user) return;
    
    const newId = Date.now().toString();
    const newSeller = {
      name: newSellerName.trim(),
      createdAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'usuarios', user.uid, 'vendedores', newId), newSeller);
      setNewSellerName('');
      setCurrentSellerId(newId);
    } catch (error) {
      console.error("Error guardando vendedor:", error);
    }
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    if (!saleDate || !user || !currentSellerId) return;
    
    const amount = parseFloat(saleAmount) || 0;
    if (amount === 0 && !saleNote.trim()) return; 

    const newId = Date.now().toString();
    const newSale = {
      sellerId: currentSellerId,
      date: saleDate,
      amount: amount,
      note: saleNote.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'usuarios', user.uid, 'ventas', newId), newSale);
      
      const nextDay = new Date(saleDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSaleDate(nextDay.toISOString().split('T')[0]);
      setSaleAmount('');
      setSaleNote('');
    } catch (error) {
      console.error("Error guardando venta:", error);
    }
  };

  const handleDeleteSale = async (id) => {
    if(!user) return;
    try {
      await deleteDoc(doc(db, 'usuarios', user.uid, 'ventas', id));
    } catch (error) {
      console.error("Error eliminando venta:", error);
    }
  };

  if (!user || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-indigo-600 flex-col gap-4">
        <LoaderIcon className="w-8 h-8" />
        <p className="font-medium">Conectando con la nube...</p>
      </div>
    );
  }

  // --- Pantalla de Acceso (Perfiles) ---
  if (!role) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50 font-sans p-4">
        <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-4 rounded-2xl shadow-lg transform rotate-3 mb-4">
              <StoreIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-center text-slate-800 tracking-tight">Sistema ERP</h2>
          </div>
          <p className="text-center text-slate-500 mb-10 text-sm font-medium">Fundación Vida Sana Redensión</p>

          {!showPinDialog ? (
            <div className="space-y-4">
              <button 
                onClick={() => { setRole('cajero'); setActiveTab('registro'); }}
                className="group w-full py-4 px-4 bg-white hover:bg-slate-50 border-2 border-slate-100 hover:border-indigo-100 text-slate-700 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-3"
              >
                <div className="bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 p-2 rounded-xl transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                Entrar como Cajero
              </button>
              <button 
                onClick={() => setShowPinDialog(true)}
                className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                <div className="bg-white/20 p-2 rounded-xl">
                  <LockIcon className="w-5 h-5 text-white" />
                </div>
                Entrar como Administrador
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in zoom-in duration-200">
              <p className="text-sm font-semibold text-slate-700 text-center">Ingresa el PIN de Administrador</p>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                  className="w-full text-center tracking-[0.5em] text-2xl px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-indigo-500 outline-none transition-colors font-mono"
                  autoFocus
                />
              </div>
              {pinError && <p className="text-red-500 text-sm text-center font-semibold bg-red-50 p-2 rounded-xl">PIN Incorrecto. Intenta con 1234</p>}
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => { setShowPinDialog(false); setPinError(false); setPinInput(''); }}
                  className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition-colors"
                >
                  Volver
                </button>
                <button 
                  onClick={() => {
                    if (pinInput === '1234') { setRole('admin'); setPinError(false); }
                    else { setPinError(true); setPinInput(''); }
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg rounded-xl font-semibold transition-all"
                >
                  Ingresar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentSeller = sellers.find(s => s.id === currentSellerId);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 print:h-auto print:overflow-visible print:block print:bg-white print:w-full">
      
      {/* INYECCIÓN DE ESTILOS PARA IMPRESORA */}
      <style>{`
        @media print {
          body { background-color: white !important; }
          .print-hidden { display: none !important; }
          .modal-print-wrapper { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; margin: 0 !important; padding: 0 !important; background: white !important; }
          .modal-print-wrapper ~ * { display: none !important; }
          body > #root > div > *:not(.modal-print-wrapper) { display: none !important; }
          @page { margin: 1cm; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
        }
      `}</style>

      {/* Sidebar - Panel de Vendedores (Dark Mode) */}
      <div className="w-72 bg-slate-900 flex-col hidden md:flex shadow-2xl z-20 print-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 text-indigo-400 p-2 rounded-xl">
              <CalculatorIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-white">Cuentas</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">{role}</span>
            </div>
          </div>
          <span className={`p-2 rounded-full ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`} title={isOnline ? "Conectado a la nube" : "Modo Local Activo"}>
             {isOnline ? <CloudIcon className="w-4 h-4" /> : <WifiOffIcon className="w-4 h-4" />}
          </span>
        </div>
        
        {/* --- Menú Principal --- */}
        <div className="p-4 border-b border-slate-800 space-y-1">
           <button 
             onClick={() => setActiveTab('registro')} 
             className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-semibold ${activeTab === 'registro' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
           >
             <ClipboardIcon className="w-5 h-5" /> Registro Diario
           </button>
           {role === 'admin' && (
             <>
               <button 
                 onClick={() => setActiveTab('historial')} 
                 className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-semibold ${activeTab === 'historial' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
               >
                 <ChartIcon className="w-5 h-5" /> Estadísticas 🏆
               </button>
               
               <button onClick={() => setShowResetModal(true)} className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 mt-4 border border-rose-500/20">
                 <AlertIcon className="w-5 h-5"/> Resetear Sistema
               </button>
             </>
           )}
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {activeTab === 'registro' ? (
            <>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 pl-2">
                <UsersIcon className="w-4 h-4" /> Vendedores
              </h2>
              <ul className="space-y-1.5">
                {sellers.length === 0 && <li className="text-xs text-slate-500 italic pl-2">No hay vendedores</li>}
                {sellers.map(seller => (
                  <li key={seller.id} className="group relative">
                    <button
                      onClick={() => setCurrentSellerId(seller.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 text-sm font-medium
                        ${currentSellerId === seller.id 
                          ? 'bg-white/10 text-white shadow-sm' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                    >
                      <UserIcon className="w-4 h-4" /> {seller.name}
                    </button>
                    {role === 'admin' && (
                      <button onClick={() => { if(window.confirm(`¿Borrar al vendedor ${seller.name}?`)) deleteDoc(doc(db, 'usuarios', user.uid, 'vendedores', seller.id)); }} className="absolute right-2 top-2 p-1 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"> 
                        <TrashIcon className="w-4 h-4"/> 
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-sm text-slate-500 p-4 text-center mt-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p>Usa los filtros del panel principal para organizar tu historial.</p>
            </div>
          )}
        </div>

        {/* Agregar Nuevo Vendedor */}
        {activeTab === 'registro' && role === 'admin' && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <form onSubmit={handleAddSeller} className="flex gap-2">
              <input
                type="text"
                placeholder="Nuevo vendedor..."
                value={newSellerName}
                onChange={(e) => setNewSellerName(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-800 border-none text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="submit"
                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors shadow-md"
                title="Agregar Vendedor"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative print:h-auto print:overflow-visible print:block print:w-full">
        
        {/* Fondo sutil azul en la cabecera */}
        <div className="absolute top-0 left-0 w-full h-64 bg-indigo-600 z-0 print-hidden"></div>
        
        {activeTab === 'registro' ? (
          <div className="z-10 flex flex-col h-full print:h-auto print:overflow-visible print:block print:w-full">
            {/* Cabecera Principal - Modo Registro */}
            <header className="p-6 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print-hidden">
               <div>
                  <h2 className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
                     {currentSeller?.name || 'Selecciona un vendedor'}
                  </h2>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-xs font-medium backdrop-blur-sm">
                     {isOnline ? <CloudIcon className="w-3 h-3"/> : <WifiOffIcon className="w-3 h-3"/>} 
                     {isOnline ? "Sincronizado" : "Guardando localmente"}
                  </div>
               </div>
               <div className="flex items-center gap-3 bg-white/10 p-1.5 rounded-xl backdrop-blur-sm border border-white/10">
                  <button onClick={() => setShowSellerPrintModal(true)} className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-black shadow-md hover:bg-indigo-50 flex items-center gap-2">
                    <PrinterIcon className="w-4 h-4"/> Imprimir Historial
                  </button>
                  <input
                    type="month"
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(e.target.value)}
                    className="px-4 py-2 bg-white text-slate-800 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                  />
               </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:px-10 pb-10 print:p-0 print:overflow-visible print:h-auto print:block print:w-full">
              {currentSellerId ? (
                <div className="max-w-6xl mx-auto space-y-6 print-hidden">
                  
                  {/* Totales Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><ClipboardIcon className="w-5 h-5" /></div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Ventas Mes</h3>
                      </div>
                      <div className="text-4xl font-extrabold text-slate-800 mt-2">{formatCurrency(totalSales)}</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl border-none p-8 shadow-lg shadow-indigo-200 flex flex-col justify-center text-white relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                      {/* Decorative Circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                      <div className="absolute bottom-0 right-10 w-24 h-24 bg-indigo-900/20 rounded-full blur-xl transform translate-y-10"></div>
                      
                      <div className="flex items-center gap-3 mb-2 z-10">
                        <div className="bg-white/20 text-white p-2 rounded-lg backdrop-blur-sm"><CalculatorIcon className="w-5 h-5 text-white" /></div>
                        <h3 className="text-sm font-bold text-indigo-100 uppercase tracking-widest flex items-center gap-2">
                          Comisión
                          {role === 'admin' ? (
                            <div className="flex items-center bg-white/20 rounded-md px-2 py-0.5 ml-2 backdrop-blur-md hover:bg-white/30 transition-colors">
                              <input
                                type="number"
                                value={commissionRate}
                                onChange={(e) => setCommissionRate(Number(e.target.value))}
                                className="w-10 bg-transparent text-white text-center text-sm font-bold focus:outline-none"
                                title="Editar porcentaje"
                              />
                              <span className="text-white text-sm font-bold">%</span>
                            </div>
                          ) : (
                            <span className="bg-white/20 rounded-md px-2 py-0.5 ml-2 backdrop-blur-md font-bold">{commissionRate}%</span>
                          )}
                        </h3>
                      </div>
                      <div className="text-4xl font-extrabold mt-2 z-10">{formatCurrency(totalCommission)}</div>
                    </div>
                  </div>

                  {/* Formulario */}
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                    <form onSubmit={handleAddSale} className="flex flex-wrap gap-4 items-end">
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha</label>
                        <input
                          type="date"
                          value={saleDate}
                          onChange={(e) => setSaleDate(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Venta</label>
                        <input
                          type="number"
                          placeholder="Ej: 150000"
                          value={saleAmount}
                          onChange={(e) => setSaleAmount(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nota (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Ej: Sábado, No vendió..."
                          value={saleNote}
                          onChange={(e) => setSaleNote(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg flex items-center gap-2 h-[46px]"
                      >
                        <PlusIcon className="w-5 h-5" /> Agregar
                      </button>
                    </form>
                  </div>

                  {/* Tabla */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto p-1">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100">
                            <th className="p-5 font-bold w-1/4">Día</th>
                            <th className="p-5 font-bold text-right w-1/3">Venta</th>
                            <th className="p-5 font-bold">Nota</th>
                            <th className="p-5 font-bold text-center w-20">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredSales.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="p-12 text-center">
                                <div className="inline-flex flex-col items-center justify-center text-slate-400">
                                  <ClipboardIcon className="w-8 h-8" />
                                  <p className="mt-2 font-medium">No hay ventas registradas en este mes.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredSales.map((sale) => {
                              const isZero = sale.amount === 0;
                              return (
                                <tr key={sale.id} className="hover:bg-indigo-50/50 transition-colors group">
                                  <td className="p-4 px-5 text-slate-600 font-medium">
                                    <div className="bg-slate-50 inline-block px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                                      {new Date(sale.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', timeZone: 'UTC' })}
                                    </div>
                                  </td>
                                  <td className="p-4 px-5 text-right font-mono font-bold text-slate-700 text-lg">
                                    {isZero ? <span className="text-slate-300">-</span> : formatCurrency(sale.amount)}
                                  </td>
                                  <td className="p-4 px-5 text-sm text-slate-500">
                                    {sale.note && (
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-200 shadow-sm">
                                        {sale.note}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-4 px-5 text-center">
                                    {role === 'admin' ? (
                                      <button
                                        onClick={() => handleDeleteSale(sale.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Eliminar"
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                      </button>
                                    ) : (
                                      <span className="text-slate-200 text-xs font-medium" title="Solo admin puede eliminar">-</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                        {filteredSales.length > 0 && (
                           <tfoot className="bg-slate-50/50 border-t border-slate-100">
                             <tr>
                               <td className="p-5 font-black text-slate-500 uppercase text-xs tracking-widest">Total</td>
                               <td className="p-5 text-right font-black text-indigo-600 font-mono text-xl">
                                 {formatCurrency(totalSales)}
                               </td>
                               <td colSpan="2"></td>
                             </tr>
                           </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 flex-col gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-10 m-4 print-hidden">
                  <div className="bg-slate-50 p-6 rounded-full">
                    <UsersIcon className="w-10 h-10" />
                  </div>
                  <p className="font-medium text-lg text-slate-500">Por favor, agrega o selecciona un vendedor en el menú lateral.</p>
                </div>
              )}
            </main>
          </div>
        ) : (
          <div className="z-10 flex flex-col h-full print:h-auto print:overflow-visible print:block print:w-full">
            {/* --- Modo Historial y Reportes --- */}
            <header className="p-6 md:px-10 flex flex-col gap-5 print-hidden">
               <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Estadísticas y Reportes</h2>
                <p className="text-indigo-100 mt-1 font-medium">Consulta de ventas y comparativos acumulados</p>
               </div>
               
               {/* Panel de Filtros */}
               <div className="flex flex-wrap gap-4 items-end bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="flex-1 min-w-[150px]">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Vendedor</label>
                   <select 
                     value={reportSellerId} 
                     onChange={(e) => setReportSellerId(e.target.value)} 
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                   >
                     <option value="all">Todos los vendedores</option>
                     {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                 </div>
                 <div className="flex-1 min-w-[150px]">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Agrupar por</label>
                   <select 
                     value={reportGroupBy} 
                     onChange={(e) => setReportGroupBy(e.target.value)} 
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                   >
                     <option value="daily">Días (Detallado)</option>
                     <option value="weekly">Semanas</option>
                     <option value="monthly">Meses</option>
                   </select>
                 </div>
                 <div className="flex-1 min-w-[140px]">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Desde</label>
                   <input 
                     type="date" 
                     value={reportStartDate} 
                     onChange={(e) => setReportStartDate(e.target.value)} 
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer" 
                   />
                 </div>
                 <div className="flex-1 min-w-[140px]">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hasta</label>
                   <input 
                     type="date" 
                     value={reportEndDate} 
                     onChange={(e) => setReportEndDate(e.target.value)} 
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer" 
                   />
                 </div>
               </div>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 md:px-10 pb-10 print:p-0 print:overflow-visible print:h-auto print:block print:w-full">
              <div className="max-w-6xl mx-auto space-y-6 print-hidden">
                
                {/* Resumen Total del Reporte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg"><ChartIcon className="w-5 h-5" /></div>
                       <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Ventas (Filtradas)</h3>
                    </div>
                    <div className="text-4xl font-extrabold text-slate-800 mt-2">{formatCurrency(reportTotalSales)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl border-none p-8 shadow-lg shadow-violet-200 flex flex-col justify-center text-white relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                     {/* Decorative Circles */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                     <div className="absolute bottom-0 right-10 w-24 h-24 bg-violet-900/20 rounded-full blur-xl transform translate-y-10"></div>

                    <div className="flex items-center gap-3 mb-2 z-10">
                       <div className="bg-white/20 text-white p-2 rounded-lg backdrop-blur-sm"><CalculatorIcon className="w-5 h-5 text-white" /></div>
                       <h3 className="text-sm font-bold text-violet-100 uppercase tracking-widest">Comisión ({commissionRate}%)</h3>
                    </div>
                    <div className="text-4xl font-extrabold mt-2 z-10">{formatCurrency(reportTotalCommission)}</div>
                  </div>
                </div>

                {/* Cuadro Comparativo de Vendedores */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mt-8">
                   <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">Cuadro Comparativo: Vendedores</h2>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                       <thead>
                         <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                           <th className="p-4 font-bold border-b border-slate-100">Vendedor</th>
                           <th className="p-4 font-bold border-b border-slate-100 text-right">Hoy</th>
                           <th className="p-4 font-bold border-b border-slate-100 text-right">Esta Semana</th>
                           <th className="p-4 font-bold border-b border-slate-100 text-right text-indigo-600">Este Mes</th>
                           <th className="p-4 font-bold border-b border-slate-100 text-right">Este Trimestre</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 text-sm font-medium">
                         {comparativeStats.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-slate-400">No hay datos suficientes</td></tr>}
                         {comparativeStats.map((stat, i) => (
                           <tr key={i} className="hover:bg-slate-50">
                             <td className="p-4 font-bold text-slate-700">{stat.name}</td>
                             <td className="p-4 text-right font-mono">{formatCurrency(stat.sToday)}</td>
                             <td className="p-4 text-right font-mono">{formatCurrency(stat.sWeek)}</td>
                             <td className="p-4 text-right font-mono font-black text-indigo-700 bg-indigo-50/30">{formatCurrency(stat.sMonth)}</td>
                             <td className="p-4 text-right font-mono">{formatCurrency(stat.sTrim)}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>

                {/* Tabla de Resultados Dinámicos (Filtro Superior) */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-1 mt-8">
                   <div className="p-6 border-b border-slate-100">
                     <h2 className="text-xl font-black text-slate-800">Resultados del Filtro</h2>
                   </div>
                   <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100">
                          <th className="p-5 font-bold">Periodo</th>
                          <th className="p-5 font-bold">Vendedor</th>
                          <th className="p-5 font-bold text-center">N° Registros</th>
                          <th className="p-5 font-bold text-right">Total Ventas</th>
                          <th className="p-5 font-bold text-right">Comisión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {generatedReport.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-12 text-center">
                              <div className="inline-flex flex-col items-center justify-center text-slate-400">
                                <ChartIcon className="w-8 h-8" />
                                <p className="mt-2 font-medium">No hay datos de ventas en este rango de fechas.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          generatedReport.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 px-5 font-bold text-slate-700">{row.period}</td>
                              <td className="p-4 px-5 text-slate-600 font-medium">
                                <span className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                  <div className="bg-white p-1 rounded"><UserIcon className="w-4 h-4" /></div>
                                  {row.sellerName}
                                </span>
                              </td>
                              <td className="p-4 px-5 text-center font-bold text-slate-400">{row.salesCount}</td>
                              <td className="p-4 px-5 text-right font-mono font-bold text-slate-700 text-lg">
                                {row.totalAmount > 0 ? formatCurrency(row.totalAmount) : <span className="text-slate-300">-</span>}
                              </td>
                              <td className="p-4 px-5 text-right font-mono font-extrabold text-violet-700 bg-violet-50/50 rounded-r-xl text-lg">
                                {row.commission > 0 ? formatCurrency(row.commission) : <span className="text-slate-300">-</span>}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                   </div>
                </div>

              </div>
            </main>
          </div>
        )}
      </div>

      {/* MODAL IMPRIMIR HISTORIAL INDIVIDUAL VENDEDOR */}
      {showSellerPrintModal && (
        <div className="fixed inset-0 print:static print:inset-auto bg-slate-900/80 z-50 flex items-center justify-center p-4 overflow-y-auto print:overflow-visible modal-print-wrapper print:bg-white print:p-0 print:block">
          <div className="bg-white max-w-4xl w-full my-8 print:my-0 print:max-w-none print:w-full print:shadow-none shadow-2xl relative print:h-auto print:overflow-visible print:block rounded-2xl print:rounded-none">
            <div className="p-8 text-black font-sans bg-white print:bg-white">
               <div className="text-center font-bold mb-6 border-b-2 border-black pb-4">
                 <h2 className="text-2xl uppercase font-black text-black">REPORTE MENSUAL DE VENTAS Y LIQUIDACIONES</h2>
                 <h3 className="text-xl text-slate-800 mt-1 uppercase font-bold">{currentSeller?.name}</h3>
                 <p className="text-sm mt-2 text-black">Mes de proceso: {currentMonth} | Impreso el: {new Date().toLocaleString('es-CO')}</p>
               </div>
               
               <table className="w-full text-left border-collapse border border-black text-sm mt-4 text-black">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-black p-2 text-center font-bold">Fecha</th>
                      <th className="border border-black p-2 text-right font-bold">Venta Bruta</th>
                      <th className="border border-black p-2 text-right font-bold">Comisión ({commissionRate}%)</th>
                      <th className="border border-black p-2 text-left font-bold">Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.length === 0 ? (
                      <tr><td colSpan="4" className="border border-black p-4 text-center">No hay liquidaciones en este mes.</td></tr>
                    ) : (
                      filteredSales.map(sale => (
                        <tr key={sale.id}>
                          <td className="border border-black p-2 text-center font-bold">{sale.date}</td>
                          <td className="border border-black p-2 text-right">{formatCurrency(sale.amount || 0)}</td>
                          <td className="border border-black p-2 text-right font-bold">{formatCurrency((sale.amount || 0) * (commissionRate / 100))}</td>
                          <td className="border border-black p-2 text-left">{sale.note}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-slate-200 font-black">
                     <tr>
                       <td className="border border-black p-2 text-right">TOTALES ACUMULADOS</td>
                       <td className="border border-black p-2 text-right">{formatCurrency(totalSales)}</td>
                       <td className="border border-black p-2 text-right">{formatCurrency(totalCommission)}</td>
                       <td className="border border-black p-2"></td>
                     </tr>
                  </tfoot>
               </table>
               
               <div className="flex justify-between mt-24 px-16">
                  <div className="w-64 border-t-2 border-black text-center font-bold text-black">Firma Vendedor</div>
                  <div className="w-64 border-t-2 border-black text-center font-bold text-black">Firma Administrador / Caja</div>
               </div>
            </div>
            <div className="p-4 bg-slate-100 flex gap-4 print-hidden border-t rounded-b-2xl">
              <button onClick={() => setShowSellerPrintModal(false)} className="flex-1 py-4 bg-white text-slate-700 font-bold rounded-xl border hover:bg-slate-50">Cerrar</button>
              <button onClick={() => window.print()} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-md hover:bg-indigo-700 flex justify-center items-center gap-2"><PrinterIcon className="w-5 h-5"/> Imprimir Historial Individual</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESETEAR BASE DE DATOS */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 print-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border-2 border-rose-500">
            <div className="bg-rose-600 p-6 text-white text-center">
              <div className="flex justify-center mb-2"><AlertIcon className="w-10 h-10 text-white"/></div>
              <h2 className="text-xl font-black">¡Zona de Peligro!</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm font-bold text-slate-700 text-center">Esta acción eliminará TODOS los vendedores y ventas de manera IRREVERSIBLE.</p>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-2 text-center">Escribe "BORRAR_TODO" para confirmar</label>
                <input type="text" value={resetKeyword} onChange={(e) => {setResetKeyword(e.target.value); setResetError('');}} className="w-full px-4 py-3 bg-slate-50 border-2 border-rose-200 focus:border-rose-500 rounded-xl font-bold text-center outline-none" placeholder="Escribe aquí..." disabled={isResetting} />
                {resetError && <p className="text-rose-500 text-xs font-bold text-center mt-2">{resetError}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => {setShowResetModal(false); setResetKeyword(''); setResetError('');}} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200" disabled={isResetting}>Cancelar</button>
                <button onClick={executeReset} className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl shadow-md hover:bg-rose-700 disabled:opacity-50 flex justify-center items-center" disabled={isResetting}>{isResetting ? 'Borrando...' : 'Formatear'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
