// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7JCVoZFMiVVMra5xe0sbKzPcmcDk8avE",
  authDomain: "ventas-stock-a8f8c.firebaseapp.com",
  projectId: "ventas-stock-a8f8c",
  storageBucket: "ventas-stock-a8f8c.firebasestorage.app",
  messagingSenderId: "123319376369",
  appId: "1:123319376369:web:fb75868540027035ed0c50",
  measurementId: "G-PED6PV4DVB"
};

const isConfigValid = firebaseConfig.apiKey !== "TU_API_KEY" && firebaseConfig.apiKey !== "";

let app, auth, db;
if (isConfigValid) {
  if (!getApps().length) app = initializeApp(firebaseConfig);
  else app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

const UsersIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const PlusIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const StoreIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>;
const PackageIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const ChartIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
const MenuIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const XIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const PrinterIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const MedalIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="M13 12l5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><polyline points="12 18 12 15.5 11 16"/></svg>;
const StarIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const AlertIcon = ({ className, ...props }) => <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

// Categorías oficiales de la planilla K-Lendula
const CATEGORIAS_PLANILLA = ['Panadería', 'Colportaje', 'Restaurante', 'Terapia', 'Escuela', 'Seminario', 'Productos', 'Otros'];

export default function App() {
  if (!isConfigValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="bg-red-500/20 p-6 rounded-2xl border border-red-500 max-w-md text-center"><h2 className="text-xl font-bold mb-2">Faltan tus claves</h2></div>
      </div>
    );
  }

  // Estados Base
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('tienda');
  const [commissionRate] = useState(5);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Datos Firebase
  const [sellers, setSellers] = useState([]);
  const [sales, setSales] = useState([]); 
  const [storeTransactions, setStoreTransactions] = useState([]);
  const [storeShifts, setStoreShifts] = useState([]); 
  const [products, setProducts] = useState([]);
  
  const activeStoreShift = useMemo(() => storeShifts.find(t => t.status === 'abierta'), [storeShifts]);

  // Estados Formularios
  const [currentSellerId, setCurrentSellerId] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7));
  const [newSellerName, setNewSellerName] = useState('');

  // Estados Caja Tienda
  const [storeType, setStoreType] = useState('ingreso');
  const [storeCategory, setStoreCategory] = useState('Panadería');
  const [storeAmount, setStoreAmount] = useState('');
  const [storeConcept, setStoreConcept] = useState('');
  const [storeQty, setStoreQty] = useState(''); 
  const [storePaymentMethod, setStorePaymentMethod] = useState('efectivo');
  const [searchStoreTerm, setSearchStoreTerm] = useState('');
  const [showStoreSuggestions, setShowStoreSuggestions] = useState(false);

  // Estados Productos
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Panadería');
  const [prodPrice, setProdPrice] = useState('');
  const [searchProductTerm, setSearchProductTerm] = useState('');

  // Estados Rutas
  const [routeBase, setRouteBase] = useState('');
  const [routeInventory, setRouteInventory] = useState([]);
  const [routeSearchTerm, setRouteSearchTerm] = useState('');
  const [routeShowSuggestions, setRouteShowSuggestions] = useState(false);
  const [routeSelectedProd, setRouteSelectedProd] = useState(null);
  const [routeQty, setRouteQty] = useState('');

  // Estados Estadísticas, Cierre y Reset
  const [statMonth, setStatMonth] = useState(new Date().toISOString().substring(0, 7));
  const [consolidateDate, setConsolidateDate] = useState(new Date().toISOString().split('T')[0]);
  
  // MODALES
  const [showStoreCloseModal, setShowStoreCloseModal] = useState(false);
  const [storePhysicalCash, setStorePhysicalCash] = useState('');
  const [selectedClosedShift, setSelectedClosedShift] = useState(null); 
  const [showSellerPrintModal, setShowSellerPrintModal] = useState(false); 
  const [showRouteCloseModal, setShowRouteCloseModal] = useState(false);
  const [routeClosingData, setRouteClosingData] = useState(null);
  const [routeReturns, setRouteReturns] = useState({});
  const [routeExpenses, setRouteExpenses] = useState('');
  const [routeDigitalPayments, setRouteDigitalPayments] = useState('');
  
  // Modal de Reset de Fábrica
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetKeyword, setResetKeyword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

  useEffect(() => {
    const initAuth = async () => { try { await signInAnonymously(auth); } catch (error) { console.error(error); } };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const path = `usuarios/${user.uid}`;
    const unsub1 = onSnapshot(collection(db, `${path}/vendedores`), snap => { const d=[]; snap.forEach(doc=>d.push({id:doc.id,...doc.data()})); setSellers(d); if(d.length>0&&!currentSellerId)setCurrentSellerId(d[0].id);});
    const unsub2 = onSnapshot(collection(db, `${path}/ventas`), snap => { const d=[]; snap.forEach(doc=>d.push({id:doc.id,...doc.data()})); setSales(d); });
    const unsub3 = onSnapshot(collection(db, `${path}/caja_tienda`), snap => { const d=[]; snap.forEach(doc=>d.push({id:doc.id,...doc.data()})); setStoreTransactions(d); });
    const unsub4 = onSnapshot(collection(db, `${path}/productos`), snap => { const d=[]; snap.forEach(doc=>d.push({id:doc.id,...doc.data()})); setProducts(d); });
    const unsub5 = onSnapshot(collection(db, `${path}/tienda_turnos`), snap => { const d=[]; snap.forEach(doc=>d.push({id:doc.id,...doc.data()})); setStoreShifts(d); });

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); };
  }, [user, currentSellerId]);

  const shiftStoreTransactions = useMemo(() => {
    if (!activeStoreShift) return [];
    return storeTransactions.filter(t => t.turnoId === activeStoreShift.id).sort((a, b) => b.timestamp - a.timestamp);
  }, [storeTransactions, activeStoreShift]);

  const storeTotals = useMemo(() => {
    let ingresos = 0, gastos = 0, efectivoRealEsperado = 0, digital = 0;
    const base = activeStoreShift ? Number(activeStoreShift.baseAmount) : 0;
    efectivoRealEsperado += base;

    shiftStoreTransactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'ingreso') {
        ingresos += amt;
        if (t.paymentMethod === 'efectivo') efectivoRealEsperado += amt;
        else digital += amt;
      } else {
        gastos += amt;
        if (t.paymentMethod === 'efectivo') efectivoRealEsperado -= amt;
      }
    });
    return { ingresos, gastos, neto: ingresos - gastos, efectivoRealEsperado, digital, base };
  }, [shiftStoreTransactions, activeStoreShift]);

  const handleOpenStoreShift = async (e) => {
    e.preventDefault();
    if (!user) return;
    const base = prompt("Ingresa la Base de Caja en Efectivo (Ej: 50000):");
    if (base === null || isNaN(base) || base === '') return;
    await setDoc(doc(db, 'usuarios', user.uid, 'tienda_turnos', Date.now().toString()), { status: 'abierta', baseAmount: parseFloat(base), startTime: Date.now(), startDate: new Date().toISOString().split('T')[0] });
  };

  const handleCloseStoreShift = async () => {
    if (!activeStoreShift || !user) return;
    const efecFisico = parseFloat(storePhysicalCash) || 0;
    const diferencia = efecFisico - storeTotals.efectivoRealEsperado;
    await setDoc(doc(db, 'usuarios', user.uid, 'tienda_turnos', activeStoreShift.id), {
      ...activeStoreShift, status: 'cerrada', endTime: Date.now(), totalIngresos: storeTotals.ingresos, totalGastos: storeTotals.gastos, totalDigital: storeTotals.digital, efectivoEsperado: storeTotals.efectivoRealEsperado, efectivoFisico: efecFisico, diferencia: diferencia
    });
    setShowStoreCloseModal(false); setStorePhysicalCash('');
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
      alert('¡Base de datos reiniciada con éxito! Sistema como nuevo.');
    } catch (error) {
      console.error(error);
      setResetError('Error al intentar borrar los datos.');
    } finally {
      setIsResetting(false);
    }
  };

  // Buscadores y Filtros
  const filteredStoreProducts = useMemo(() => products.filter(p => p.name.toLowerCase().includes(searchStoreTerm.toLowerCase()) || (p.category && p.category.toLowerCase().includes(searchStoreTerm.toLowerCase()))), [products, searchStoreTerm]);
  const handleSelectStoreProduct = (p) => { setStoreConcept(p.name); setStoreAmount(p.price.toString()); setStoreCategory(p.category || 'Otros'); setSearchStoreTerm(p.name); setStoreQty('1'); setShowStoreSuggestions(false); };
  const filteredRouteProducts = useMemo(() => products.filter(p => p.name.toLowerCase().includes(routeSearchTerm.toLowerCase())), [products, routeSearchTerm]);

  const currentSellerSales = useMemo(() => sales.filter(s => s.sellerId === currentSellerId && s.date.startsWith(currentMonth)).sort((a, b) => b.timestamp - a.timestamp), [sales, currentSellerId, currentMonth]);
  const sellerTotalSales = useMemo(() => currentSellerSales.filter(s => s.status === 'cerrada' || !s.status).reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0), [currentSellerSales]);

  const gamificationStats = useMemo(() => {
    let topSeller = { name: '-', total: 0 };
    let topProduct = { name: '-', qty: 0 };
    let worstProduct = { name: '-', qty: Infinity };
    
    // Vendedor del mes
    const sellerTotals = {};
    sales.filter(s => s.status !== 'abierta' && s.date.startsWith(statMonth)).forEach(sale => {
       if(!sellerTotals[sale.sellerId]) sellerTotals[sale.sellerId] = 0;
       sellerTotals[sale.sellerId] += (Number(sale.amount) || 0);
    });
    Object.entries(sellerTotals).forEach(([id, total]) => {
      if(total > topSeller.total) topSeller = { name: sellers.find(s=>s.id===id)?.name || 'Desconocido', total };
    });

    // Producto estrella y Producto congelado (Tienda)
    const productTotals = {};
    products.forEach(p => { productTotals[p.name] = 0; }); 

    storeTransactions.filter(t => t.type === 'ingreso' && t.date && t.date.startsWith(statMonth)).forEach(tx => {
       if(productTotals[tx.concept] === undefined) productTotals[tx.concept] = 0;
       productTotals[tx.concept] += (Number(tx.qty) || 1);
    });

    Object.entries(productTotals).forEach(([name, qty]) => {
      if(qty > topProduct.qty) topProduct = { name, qty };
      if(qty < worstProduct.qty) worstProduct = { name, qty };
    });

    if (worstProduct.qty === Infinity) worstProduct = { name: '-', qty: 0 };
    return { topSeller, topProduct, worstProduct };
  }, [sales, storeTransactions, statMonth, sellers, products]);

  // Consolidado Diario
  const dailyConsolidated = useMemo(() => {
    const tiendaDelDia = storeShifts.filter(s => s.startDate === consolidateDate && s.status === 'cerrada');
    const rutasDelDia = sales.filter(s => s.date === consolidateDate && s.status !== 'abierta');

    const totalTiendaEfectivo = tiendaDelDia.reduce((sum, s) => sum + (s.efectivoFisico || 0), 0);
    const totalRutasEfectivo = rutasDelDia.reduce((sum, s) => sum + (s.cashExpected || 0), 0);
    const granTotalEfectivo = totalTiendaEfectivo + totalRutasEfectivo;

    return { tiendaDelDia, rutasDelDia, totalTiendaEfectivo, totalRutasEfectivo, granTotalEfectivo };
  }, [storeShifts, sales, consolidateDate]);

  const comparativeStats = useMemo(() => {
    const todayDate = new Date();
    const todayStr = todayDate.toISOString().split('T')[0];
    
    // Calcular inicio de semana (Lunes)
    const startOfWeek = new Date(todayDate);
    startOfWeek.setDate(todayDate.getDate() - (todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1));
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    const startOfMonthStr = todayStr.substring(0, 7) + '-01';

    const currentMonthNum = todayDate.getMonth() + 1;
    const startOfTrimesterMonth = Math.floor((currentMonthNum - 1) / 3) * 3 + 1;
    const startOfTrimesterStr = `${todayDate.getFullYear()}-${String(startOfTrimesterMonth).padStart(2, '0')}-01`;

    return sellers.map(seller => {
        let sToday = 0, sWeek = 0, sMonth = 0, sTrim = 0;
        sales.filter(s => s.sellerId === seller.id && s.status === 'cerrada').forEach(sale => {
            const amt = Number(sale.amount) || 0;
            if (sale.date === todayStr) sToday += amt;
            if (sale.date >= startOfWeekStr && sale.date <= todayStr) sWeek += amt;
            if (sale.date >= startOfMonthStr && sale.date <= todayStr) sMonth += amt;
            if (sale.date >= startOfTrimesterStr && sale.date <= todayStr) sTrim += amt;
        });
        return { name: seller.name, sToday, sWeek, sMonth, sTrim };
    }).sort((a, b) => b.sMonth - a.sMonth);
  }, [sellers, sales]);

  const renderPlanillaTable = (title, transactions) => (
    <div className="mb-3 break-inside-avoid">
      <h4 className="font-bold text-center border border-black border-b-0 uppercase text-[10px] bg-slate-200 py-0.5">{title}</h4>
      <table className="w-full border-collapse border border-black text-[10px] bg-white">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-black p-0.5 w-10 text-center">{title === 'FACTURAS-VALES' ? 'FACT.' : 'CANT.'}</th>
            <th className="border border-black p-0.5">DETALLE</th>
            <th className="border border-black p-0.5 w-16 text-center">{title === 'FACTURAS-VALES' ? '' : 'VR UNIT.'}</th>
            <th className="border border-black p-0.5 w-20 text-center">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
             <tr><td className="border border-black p-0.5 h-4"></td><td className="border border-black p-0.5"></td><td className="border border-black p-0.5"></td><td className="border border-black p-0.5"></td></tr>
          ) : (
            transactions.map((t, i) => (
              <tr key={i} className="break-inside-avoid">
                <td className="border border-black p-0.5 text-center">{t.qty || ''}</td>
                <td className="border border-black p-0.5 truncate max-w-[120px]">{t.concept}</td>
                <td className="border border-black p-0.5 text-right">{title === 'FACTURAS-VALES' ? '' : formatCurrency(t.amount / (t.qty || 1))}</td>
                <td className="border border-black p-0.5 text-right font-bold">{formatCurrency(t.amount)}</td>
              </tr>
            ))
          )}
          <tr className="bg-slate-50 break-inside-avoid">
            <td colSpan="3" className="border border-black p-0.5 font-bold text-right">TOTAL</td>
            <td className="border border-black p-0.5 font-black text-right">{formatCurrency(transactions.reduce((acc, t) => acc + (Number(t.amount)||0), 0))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* AQUÍ SE APLICÓ LA SOLUCIÓN DEL TITULO BLANCO Y EL ICONO CENTRADO */}
          <div className="bg-indigo-600 p-8 text-center flex flex-col items-center">
            <StoreIcon className="w-16 h-16 mb-4 text-white opacity-90" />
            <h1 className="text-3xl font-black tracking-tight text-white">Sistema ERP</h1>
            <p className="text-indigo-200 mt-2 font-medium">Fundación Vida Sana Redensión</p>
          </div>
          <div className="p-8">
            {!showPinDialog ? (
              <div className="space-y-4">
                <button onClick={() => { setRole('cajero'); setActiveTab('tienda'); }} className="w-full py-4 bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100"> Entrar como Cajero Tienda </button>
                <button onClick={() => setShowPinDialog(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md hover:bg-indigo-700"> Entrar como Administrador </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input type="password" value={pinInput} onChange={e => {setPinInput(e.target.value); setPinError(false);}} className="w-full text-center tracking-[0.5em] text-3xl px-4 py-4 bg-slate-50 border-2 rounded-2xl font-mono outline-none focus:border-indigo-500" autoFocus onKeyDown={e => { if(e.key==='Enter'){if(pinInput==='1234'){setRole('admin');setActiveTab('registro');}else{setPinError(true);setPinInput('');}} }} />
                {pinError && <p className="text-red-500 text-center font-bold text-sm">PIN Incorrecto</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowPinDialog(false); setPinInput(''); }} className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold">Volver</button>
                  <button onClick={() => { if (pinInput === '1234') {setRole('admin');setActiveTab('registro');} else {setPinError(true);setPinInput('');} }} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md">Ingresar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const changeTab = (tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 print:h-auto print:overflow-visible print:block print:bg-white">
      
      {/* INYECCIÓN DE ESTILOS PARA IMPRESORA MEJORADOS */}
      <style>{`
        @media print {
          body { background-color: white !important; }
          .print-hidden { display: none !important; }
          
          /* Oculta los elementos extra de la aplicación cuando el Modal está abierto */
          .modal-print-wrapper {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          /* Oculta la app base para que la tirilla suba hasta el tope */
          .modal-print-wrapper ~ * {
             display: none !important; 
          }
          body > #root > div > *:not(.modal-print-wrapper) {
             display: none !important;
          }

          @page { margin: 1cm; }
          
          /* Solución al salto de página para tablas largas */
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
        }
      `}</style>

      {/* OVERLAY MÓVIL */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden print-hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* SIDEBAR LATERAL */}
      <aside className={`print-hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex shadow-2xl md:shadow-none`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div><h2 className="text-xl font-black text-white">ERP Control</h2><p className="text-emerald-400 text-xs font-bold mt-1 uppercase tracking-wider">{role}</p></div>
          <button className="md:hidden text-slate-400" onClick={() => setIsMobileMenuOpen(false)}><XIcon className="w-6 h-6" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => changeTab('tienda')} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-bold ${activeTab === 'tienda' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}> <StoreIcon className="w-5 h-5"/> Caja K-Lendula </button>
          <button onClick={() => changeTab('registro')} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-bold ${activeTab === 'registro' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}> <UsersIcon className="w-5 h-5"/> Ventas Calle </button>
          {role === 'admin' && (
            <>
              <button onClick={() => changeTab('productos')} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-bold ${activeTab === 'productos' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}> <PackageIcon className="w-5 h-5"/> Catálogo Global </button>
              <button onClick={() => changeTab('estadisticas')} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-bold ${activeTab === 'estadisticas' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}> <ChartIcon className="w-5 h-5"/> Estadísticas 🏆 </button>
              
              <button onClick={() => { setShowResetModal(true); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 mt-4 border border-rose-500/20">
                <AlertIcon className="w-5 h-5"/> Resetear Sistema
              </button>
            </>
          )}

          {/* LISTA DE VENDEDORES (Con botón borrar) */}
          {activeTab === 'registro' && (
            <div className="pt-6 mt-6 border-t border-slate-800">
              <p className="px-4 text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Vendedores</p>
              <div className="space-y-1">
                {sellers.length === 0 && <p className="text-slate-500 text-xs px-4">No hay vendedores</p>}
                {sellers.map(seller => (
                  <div key={seller.id} className={`group flex items-center justify-between rounded-xl transition-all ${currentSellerId === seller.id ? 'bg-white/10' : 'hover:bg-slate-800'}`}>
                    <button onClick={() => {setCurrentSellerId(seller.id); setIsMobileMenuOpen(false);}} className={`flex-1 text-left px-4 py-2.5 text-sm font-bold ${currentSellerId === seller.id ? 'text-white' : 'text-slate-400'}`}> {seller.name} </button>
                    {role === 'admin' && <button onClick={() => { if(window.confirm(`¿Borrar al vendedor ${seller.name}?`)) deleteDoc(doc(db, 'usuarios', user.uid, 'vendedores', seller.id)); }} className="p-2 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"> <TrashIcon className="w-4 h-4"/> </button>}
                  </div>
                ))}
              </div>
              {role === 'admin' && (
                <form className="mt-4 px-2" onSubmit={async (e) => { e.preventDefault(); if(!newSellerName.trim()) return; const id = Date.now().toString(); await setDoc(doc(db, 'usuarios', user.uid, 'vendedores', id), {name: newSellerName.trim()}); setNewSellerName(''); setCurrentSellerId(id); }}>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Nuevo vendedor..." value={newSellerName} onChange={(e) => setNewSellerName(e.target.value)} className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg text-sm outline-none border border-slate-700 focus:border-indigo-500" />
                    <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"><PlusIcon className="w-4 h-4"/></button>
                  </div>
                </form>
              )}
            </div>
          )}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative print:h-auto print:overflow-visible print:block print:w-full">
        <header className="md:hidden bg-white shadow-sm px-4 py-3 flex justify-between items-center z-30 print-hidden">
          <h1 className="font-black text-lg text-indigo-900 capitalize flex items-center gap-2"> {activeTab.replace('_', ' ')} </h1>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-700"> <MenuIcon className="w-6 h-6"/> </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 print:p-0 print:overflow-visible print:h-auto print:block print:w-full">
          
          {}
          {activeTab === 'tienda' && (
            <div className="max-w-4xl mx-auto space-y-6 print-hidden">
              {!activeStoreShift ? (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><StoreIcon className="w-10 h-10"/></div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Caja Cerrada</h2>
                  <button onClick={handleOpenStoreShift} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg hover:-translate-y-1 transition-all"> Abrir Turno de Caja </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">K-Lendula <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full uppercase">Abierto</span></h2>
                      <p className="text-sm text-slate-500 mt-1">Base: <b>{formatCurrency(activeStoreShift.baseAmount)}</b></p>
                    </div>
                    <button onClick={() => setShowStoreCloseModal(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-slate-800"> Cerrar y Cuadrar </button>
                  </div>

                  {/* Resumen de Caja en Vivo */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl"><p className="text-emerald-600 text-sm font-bold mb-1">Ingresos</p><p className="text-2xl font-black text-emerald-900">{formatCurrency(storeTotals.ingresos)}</p></div>
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl"><p className="text-rose-600 text-sm font-bold mb-1">Gastos</p><p className="text-2xl font-black text-rose-900">{formatCurrency(storeTotals.gastos)}</p></div>
                    <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl"><p className="text-indigo-600 text-sm font-bold mb-1">Pagos Digitales</p><p className="text-2xl font-black text-indigo-900">{formatCurrency(storeTotals.digital)}</p></div>
                    <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden"><p className="text-slate-300 text-sm font-bold mb-1">Efectivo en Gaveta</p><p className="text-2xl font-black text-white">{formatCurrency(storeTotals.efectivoRealEsperado)}</p></div>
                  </div>

                  {/* Formulario Tienda */}
                  <form onSubmit={async (e) => { 
                    e.preventDefault(); if (!storeAmount || !storeConcept) return; 
                    const qtyParsed = storeQty === '' ? 0 : parseInt(storeQty, 10);
                    const totalAmt = storeType === 'ingreso' ? (parseFloat(storeAmount) * qtyParsed) : parseFloat(storeAmount);
                    await setDoc(doc(db, 'usuarios', user.uid, 'caja_tienda', Date.now().toString()), { turnoId: activeStoreShift.id, date: activeStoreShift.startDate, type: storeType, category: storeType === 'ingreso' ? storeCategory : 'Gastos', amount: totalAmt, concept: storeConcept, qty: qtyParsed, paymentMethod: storePaymentMethod, timestamp: Date.now() }); 
                    setStoreAmount(''); setStoreConcept(''); setSearchStoreTerm(''); setStoreQty(''); 
                  }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    
                    <div className="flex gap-4 mb-6">
                      <label className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer font-bold text-center transition-all ${storeType === 'ingreso' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200'}`}><input type="radio" name="stype" className="hidden" checked={storeType === 'ingreso'} onChange={() => setStoreType('ingreso')} /> 🟢 Ingreso</label>
                      <label className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer font-bold text-center transition-all ${storeType === 'gasto' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-slate-50 border-slate-200'}`}><input type="radio" name="stype" className="hidden" checked={storeType === 'gasto'} onChange={() => {setStoreType('gasto'); setStorePaymentMethod('efectivo');}} /> 🔴 Gasto (Facturas)</label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-5 relative">
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">{storeType === 'ingreso' ? 'Categoría y Producto' : 'Concepto de Gasto'}</label>
                        {storeType === 'ingreso' ? (
                          <div className="flex gap-2">
                            <select value={storeCategory} onChange={e=>setStoreCategory(e.target.value)} className="w-1/3 px-2 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-indigo-500">{CATEGORIAS_PLANILLA.map(c=><option key={c} value={c}>{c}</option>)}</select>
                            <div className="relative w-2/3">
                              <input type="text" value={searchStoreTerm} onChange={(e) => {setSearchStoreTerm(e.target.value); setStoreConcept(e.target.value); setShowStoreSuggestions(true);}} onFocus={() => setShowStoreSuggestions(true)} onBlur={() => setTimeout(() => setShowStoreSuggestions(false), 200)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl font-bold outline-none" placeholder="Buscar..." required />
                              {showStoreSuggestions && filteredStoreProducts.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                                  {filteredStoreProducts.map(p => (<div key={p.id} onMouseDown={() => handleSelectStoreProduct(p)} className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100"><p className="font-bold">{p.name}</p></div>))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <input type="text" value={storeConcept} onChange={(e) => setStoreConcept(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-rose-300 rounded-xl font-bold outline-none" placeholder="Ej: Pago..." required />
                        )}
                      </div>
                      {storeType === 'ingreso' && (
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Cant.</label>
                          <input type="number" value={storeQty} onChange={(e) => setStoreQty(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl font-bold text-center outline-none" placeholder="1" />
                        </div>
                      )}
                      <div className={storeType === 'ingreso' ? "md:col-span-3" : "md:col-span-5"}>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">{storeType === 'ingreso' ? 'Valor Unidad' : 'Valor Total'}</label>
                        <input type="number" value={storeAmount} onChange={(e) => setStoreAmount(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl font-black outline-none" placeholder="$..." required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-transparent block mb-2">.</label>
                        <button type="submit" className={`w-full py-3 text-white font-black rounded-xl shadow-md ${storeType === 'ingreso' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}> Agregar </button>
                      </div>
                    </div>

                    {storeType === 'ingreso' && (
                      <div className="mt-4 flex gap-3">
                        <label className={`flex-1 p-3 rounded-xl border font-bold text-center text-sm cursor-pointer transition-all ${storePaymentMethod === 'efectivo' ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'}`}><input type="radio" name="spay" className="hidden" checked={storePaymentMethod === 'efectivo'} onChange={() => setStorePaymentMethod('efectivo')} /> 💵 Efectivo</label>
                        <label className={`flex-1 p-3 rounded-xl border font-bold text-center text-sm cursor-pointer transition-all ${storePaymentMethod === 'nequi' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-500 border-slate-200'}`}><input type="radio" name="spay" className="hidden" checked={storePaymentMethod === 'nequi'} onChange={() => setStorePaymentMethod('nequi')} /> 📱 Nequi/Transf.</label>
                        <label className={`flex-1 p-3 rounded-xl border font-bold text-center text-sm cursor-pointer transition-all ${storePaymentMethod === 'tarjeta' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-500 border-slate-200'}`}><input type="radio" name="spay" className="hidden" checked={storePaymentMethod === 'tarjeta'} onChange={() => setStorePaymentMethod('tarjeta')} /> 💳 Tarjeta</label>
                      </div>
                    )}
                  </form>

                  {/* Tabla de Movimientos */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><th className="p-4 font-bold border-b border-slate-100">Cat/Concepto</th><th className="p-4 font-bold border-b border-slate-100 text-center">Medio</th><th className="p-4 font-bold border-b border-slate-100 text-right">Valor</th><th className="p-4 border-b border-slate-100 w-16"></th></tr></thead>
                        <tbody className="divide-y divide-slate-50 text-sm font-medium">
                          {shiftStoreTransactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-slate-50">
                              <td className="p-4"><p className="font-bold">{tx.concept} {tx.type === 'ingreso' && tx.qty > 1 && <span className="text-slate-400 text-xs ml-1">(x{tx.qty})</span>}</p><span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${tx.type==='ingreso'?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700'}`}>{tx.type==='ingreso'?tx.category:'Gasto'}</span></td>
                              <td className="p-4 text-center">{tx.type === 'ingreso' ? <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] uppercase font-black">{tx.paymentMethod}</span> : '-'}</td>
                              <td className={`p-4 text-right font-black ${tx.type === 'ingreso' ? 'text-slate-700' : 'text-rose-600'}`}>{tx.type === 'gasto' ? '- ' : ''}{formatCurrency(tx.amount)}</td>
                              <td className="p-4 text-center">{role === 'admin' && <button onClick={() => deleteDoc(doc(db,'usuarios',user.uid,'caja_tienda',tx.id))} className="text-slate-300 hover:text-red-500 p-1"><TrashIcon className="w-4 h-4"/></button>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* HISTORIAL TURNOS TIENDA */}
              <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                 <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><StoreIcon className="w-5 h-5"/> Historial de Planillas K-Lendula</h3>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                     <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><th className="p-4 font-bold border-b border-slate-100">Fecha</th><th className="p-4 font-bold border-b border-slate-100 text-right">Ideal</th><th className="p-4 font-bold border-b border-slate-100 text-center">Cuadre</th><th className="p-4 border-b border-slate-100"></th></tr></thead>
                     <tbody className="divide-y divide-slate-50 text-sm font-medium">
                       {storeShifts.filter(s => s.status === 'cerrada').sort((a,b) => b.endTime - a.endTime).map(shift => (
                         <tr key={shift.id} className="hover:bg-slate-50">
                           <td className="p-4 font-bold">{shift.startDate}</td>
                           <td className="p-4 text-right font-black text-slate-700">{formatCurrency(shift.efectivoEsperado)}</td>
                           <td className="p-4 text-center"><span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${shift.diferencia === 0 ? 'bg-emerald-100 text-emerald-700' : shift.diferencia > 0 ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>{shift.diferencia === 0 ? 'Exacto' : shift.diferencia > 0 ? `+${formatCurrency(shift.diferencia)}` : `-${formatCurrency(Math.abs(shift.diferencia))}`}</span></td>
                           <td className="p-4 text-center"><button onClick={() => setSelectedClosedShift(shift)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold rounded-lg text-xs hover:bg-indigo-100 flex items-center gap-1 transition-colors"><PrinterIcon className="w-4 h-4"/> Ver Tirilla</button></td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            </div>
          )}

          {}
          {activeTab === 'registro' && (
            <div className="max-w-4xl mx-auto space-y-6 print-hidden">
              {!currentSellerId ? (
                <div className="text-center p-12 bg-white rounded-3xl border border-slate-200"><UsersIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" /><h3 className="text-xl font-bold text-slate-600">Selecciona un vendedor en el menú</h3></div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-between bg-indigo-600 p-6 rounded-3xl shadow-lg text-white gap-4">
                    <div><h2 className="text-2xl font-black">{sellers.find(s=>s.id===currentSellerId)?.name}</h2><p className="text-indigo-200 font-medium">Liquidaciones de {currentMonth}</p></div>
                    <div className="flex gap-2">
                       <button onClick={() => setShowSellerPrintModal(true)} className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-sm font-black shadow-md hover:bg-indigo-50 flex items-center gap-2"><PrinterIcon className="w-4 h-4"/> Imprimir Historial</button>
                       <input type="month" value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)} className="px-4 py-2 bg-indigo-800 rounded-xl text-sm font-bold outline-none" />
                    </div>
                  </div>
                  
                  {/* Despachar Ruta */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-lg text-slate-800 mb-4">Despachar Ruta (Apertura)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="text-xs font-bold text-slate-500 uppercase block mb-2">Base de Caja Fija</label><input type="number" value={routeBase} onChange={(e) => setRouteBase(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold outline-none focus:border-indigo-500" placeholder="$..." /></div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Inventario a entregar</label>
                        <div className="flex gap-2">
                           <div className="relative flex-1">
                             <input type="text" value={routeSearchTerm} onChange={(e) => {setRouteSearchTerm(e.target.value); setRouteShowSuggestions(true);}} onFocus={()=>setRouteShowSuggestions(true)} onBlur={()=>setTimeout(()=>setRouteShowSuggestions(false), 200)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-indigo-500" placeholder="Buscar..." />
                             {routeShowSuggestions && filteredRouteProducts.length > 0 && (
                               <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                                 {filteredRouteProducts.map(p => (<div key={p.id} onMouseDown={() => {setRouteSelectedProd(p); setRouteSearchTerm(p.name); setRouteShowSuggestions(false); setRouteQty('');}} className="px-3 py-2 hover:bg-indigo-50 cursor-pointer font-bold text-slate-700 text-sm border-b border-slate-50">{p.name}</div>))}
                               </div>
                             )}
                           </div>
                           <input type="number" value={routeQty} onChange={(e) => setRouteQty(e.target.value)} className="w-16 px-2 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-center outline-none focus:border-indigo-500" placeholder="Cant" />
                           <button onClick={() => { if(!routeSelectedProd || !routeQty)return; const qtyParsed = routeQty === '' ? 0 : parseInt(routeQty, 10); setRouteInventory([...routeInventory, { ...routeSelectedProd, qty: qtyParsed }]); setRouteSearchTerm(''); setRouteSelectedProd(null); setRouteQty(''); }} className="px-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700"><PlusIcon className="w-5 h-5"/></button>
                        </div>
                      </div>
                    </div>
                    {routeInventory.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {routeInventory.map((item, idx) => ( <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 px-3 rounded-lg border font-bold text-slate-700 text-sm"><span>{item.name} <span className="text-slate-400 font-normal">(x{item.qty})</span></span><button onClick={()=>setRouteInventory(routeInventory.filter((_,i)=>i!==idx))} className="text-rose-400 hover:text-rose-600"><XIcon className="w-4 h-4"/></button></div> ))}
                      </div>
                    )}
                    <button onClick={async () => { if(routeInventory.length === 0 && !routeBase) return; await setDoc(doc(db, 'usuarios', user.uid, 'ventas', Date.now().toString()), { sellerId: currentSellerId, date: new Date().toISOString().split('T')[0], status: 'abierta', base: parseFloat(routeBase)||0, inventory: routeInventory, timestamp: Date.now() }); setRouteBase(''); setRouteInventory([]); }} className="mt-6 w-full py-3 bg-amber-500 text-white font-black rounded-xl shadow-md hover:bg-amber-600 transition-all">Despachar Ruta</button>
                  </div>

                  {/* Historial Rutas */}
                  <div className="space-y-4">
                    {currentSellerSales.map(sale => (
                      <div key={sale.id} className={`p-6 rounded-3xl border shadow-sm ${sale.status === 'abierta' ? 'bg-amber-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-4">
                          <div><p className="text-sm font-bold text-slate-500">{sale.date}</p>{sale.status === 'abierta' ? <h4 className="text-lg font-black text-amber-900">Ruta Abierta</h4> : <h4 className="text-lg font-black text-slate-800">Venta: {formatCurrency(sale.amount)}</h4>}</div>
                          {sale.status === 'abierta' && <button onClick={() => { setRouteClosingData(sale); setShowRouteCloseModal(true); setRouteReturns({}); setRouteExpenses(''); setRouteDigitalPayments(''); }} className="px-6 py-2 bg-emerald-500 text-white font-black rounded-xl shadow-md hover:bg-emerald-600">Cierre Tarde</button>}
                          {role === 'admin' && sale.status !== 'abierta' && <button onClick={() => { if(window.confirm('¿Borrar?')) deleteDoc(doc(db,'usuarios',user.uid,'ventas',sale.id)) }} className="text-rose-400 hover:bg-rose-50 p-2 rounded-lg transition-colors"><TrashIcon className="w-5 h-5"/></button>}
                        </div>
                        {sale.status !== 'abierta' && (
                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
                             <div><p className="text-[10px] uppercase font-black text-slate-400">Comisión (5%)</p><p className="font-bold text-indigo-600">{formatCurrency((sale.amount||0)*(commissionRate/100))}</p></div>
                             <div><p className="text-[10px] uppercase font-black text-slate-400">Gastos</p><p className="font-bold text-rose-600">{formatCurrency(sale.expenses||0)}</p></div>
                             <div><p className="text-[10px] uppercase font-black text-slate-400">Nequi/Digital</p><p className="font-bold text-purple-600">{formatCurrency(sale.digital||0)}</p></div>
                             <div><p className="text-[10px] uppercase font-black text-slate-400">Efectivo Entregado</p><p className="font-black text-slate-800">{formatCurrency(sale.cashExpected||0)}</p></div>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {}
          {activeTab === 'productos' && role === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-6 print-hidden">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><PackageIcon className="w-6 h-6"/> Nuevo Producto</h2>
                <form onSubmit={async(e)=>{e.preventDefault(); if(!prodName||!prodPrice)return; await setDoc(doc(db,'usuarios',user.uid,'productos',Date.now().toString()),{name:prodName, category:prodCategory||'Otros', price:parseFloat(prodPrice)}); setProdName(''); setProdPrice('');}} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div className="sm:col-span-3">
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Sección Planilla</label>
                     <select value={prodCategory} onChange={e=>setProdCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 rounded-xl font-bold outline-none focus:border-indigo-500">{CATEGORIAS_PLANILLA.map(c=><option key={c} value={c}>{c}</option>)}</select>
                  </div>
                  <div className="sm:col-span-5"><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nombre</label><input type="text" value={prodName} onChange={e=>setProdName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 rounded-xl font-bold outline-none focus:border-indigo-500" required /></div>
                  <div className="sm:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Precio</label><input type="number" value={prodPrice} onChange={e=>setProdPrice(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 rounded-xl font-black outline-none focus:border-indigo-500" required /></div>
                  <div className="sm:col-span-2"><button type="submit" className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-md">Crear</button></div>
                </form>
              </div>
              <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                <div className="p-4 bg-slate-50 border-b"><input type="text" placeholder="Buscar producto..." value={searchProductTerm} onChange={e=>setSearchProductTerm(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg font-bold outline-none focus:border-indigo-500" /></div>
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y text-sm font-medium text-slate-700">
                    {products.filter(p=>p.name.toLowerCase().includes(searchProductTerm.toLowerCase())).map(p=>(
                      <tr key={p.id} className="hover:bg-slate-50"><td className="p-4 font-bold">{p.name}</td><td className="p-4 text-xs font-bold text-slate-400 uppercase">{p.category}</td><td className="p-4 text-right font-black text-indigo-700">{formatCurrency(p.price)}</td><td className="p-4 text-center"><button onClick={()=>{if(window.confirm('¿Borrar?'))deleteDoc(doc(db,'usuarios',user.uid,'productos',p.id))}} className="text-rose-400 hover:text-rose-600 p-1"><TrashIcon className="w-4 h-4"/></button></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {}
          {activeTab === 'estadisticas' && role === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-6 print-hidden">
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2"><ChartIcon className="w-6 h-6 text-white"/> Rendimiento Mensual</h2>
                  <input type="month" value={statMonth} onChange={e=>setStatMonth(e.target.value)} className="px-4 py-2 bg-slate-800 text-white border-none rounded-xl text-sm font-bold outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-20"><MedalIcon className="w-24 h-24"/></div>
                    <p className="text-amber-100 font-bold text-sm uppercase tracking-wider mb-1">Vendedor del Mes</p>
                    <p className="text-3xl font-black truncate">{gamificationStats.topSeller.name}</p>
                    <p className="font-bold text-amber-100 mt-2">{formatCurrency(gamificationStats.topSeller.total)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-20"><StarIcon className="w-24 h-24"/></div>
                    <p className="text-indigo-100 font-bold text-sm uppercase tracking-wider mb-1">Producto Estrella</p>
                    <p className="text-3xl font-black truncate">{gamificationStats.topProduct.name}</p>
                    <p className="font-bold text-indigo-100 mt-2">{gamificationStats.topProduct.qty} unidades</p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-500 to-red-600 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-20"><AlertIcon className="w-24 h-24"/></div>
                    <p className="text-rose-100 font-bold text-sm uppercase tracking-wider mb-1">Producto Congelado</p>
                    <p className="text-3xl font-black truncate">{gamificationStats.worstProduct.name}</p>
                    <p className="font-bold text-rose-100 mt-2">{gamificationStats.worstProduct.qty} unidades (No rota)</p>
                  </div>
                </div>
              </div>

              {/* Cierre Consolidado Diario */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                    <div>
                      <h2 className="text-2xl font-black text-slate-800">Cierre Consolidado Diario</h2>
                      <p className="text-slate-500 text-sm">Suma total de Tienda + Vendedores</p>
                    </div>
                    <input type="date" value={consolidateDate} onChange={e=>setConsolidateDate(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-50 p-4 rounded-2xl">
                      <p className="text-emerald-700 text-sm font-bold mb-1">Efectivo Cajas Tienda</p>
                      <p className="text-2xl font-black text-emerald-900">{formatCurrency(dailyConsolidated.totalTiendaEfectivo)}</p>
                      <p className="text-xs text-emerald-600 mt-1">{dailyConsolidated.tiendaDelDia.length} turnos cerrados</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <p className="text-blue-700 text-sm font-bold mb-1">Efectivo Rutas Calles</p>
                      <p className="text-2xl font-black text-blue-900">{formatCurrency(dailyConsolidated.totalRutasEfectivo)}</p>
                      <p className="text-xs text-blue-600 mt-1">{dailyConsolidated.rutasDelDia.length} rutas liquidadas</p>
                    </div>
                 </div>
                 
                 <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-1">Gran Total Efectivo (Cierre General)</p>
                      <p className="text-4xl font-black">{formatCurrency(dailyConsolidated.granTotalEfectivo)}</p>
                    </div>
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
            </div>
          )}

        </div>
      </main>

      {}
      
      {/* MODAL CIERRE TIENDA */}
      {showStoreCloseModal && activeStoreShift && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden my-8">
            <div className="bg-slate-900 p-6 text-white text-center"><h2 className="text-2xl font-black">Cierre K-Lendula</h2></div>
            <div className="p-6 space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4"><p className="text-sm font-bold text-indigo-800">Efectivo Físico Esperado</p><p className="text-xl font-black text-indigo-900">{formatCurrency(storeTotals.efectivoRealEsperado)}</p></div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-2">Efectivo físico real en gaveta:</label>
                <input type="number" value={storePhysicalCash} onChange={(e) => setStorePhysicalCash(e.target.value)} className="w-full px-4 py-4 bg-white border-2 border-indigo-200 rounded-xl font-black text-2xl text-center outline-none focus:border-indigo-500" autoFocus placeholder="$0" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => {setShowStoreCloseModal(false); setStorePhysicalCash('');}} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Cancelar</button>
                <button onClick={handleCloseStoreShift} disabled={storePhysicalCash === ''} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-xl shadow-lg hover:bg-rose-700 disabled:opacity-50">Guardar Cierre</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IMPRIMIR PLANILLA K-LENDULA (A4 Físico - Idéntica al Word) */}
      {selectedClosedShift && (
        <div className="fixed inset-0 print:static print:inset-auto bg-slate-900/80 z-50 flex items-center justify-center p-4 overflow-y-auto print:overflow-visible modal-print-wrapper print:bg-white print:p-0 print:block">
          <div className="bg-white max-w-3xl w-full my-8 print:my-0 print:max-w-none print:w-full print:shadow-none shadow-2xl relative print:h-auto print:overflow-visible print:block">
            
            <div className="p-8 print:p-0 text-black text-[11px] font-sans bg-white print:bg-white">
               <div className="text-center font-bold mb-4">
                 <p className="text-sm">FUNDACION VIDA SANA REDENSIÒN</p>
                 <p className="text-sm">NIT:900.410.418-9</p>
                 <p className="text-base mt-1">PLANILLA DIARIA PANADERIA K-LENDULA</p>
                 <p className="text-left mt-4 border-b border-black inline-block pr-12">FECHA: {selectedClosedShift.startDate}</p>
               </div>

               {(() => {
                 const shiftTxs = storeTransactions.filter(t => t.turnoId === selectedClosedShift.id);
                 const getGroup = (cat) => shiftTxs.filter(t => t.type === 'ingreso' && t.category === cat);
                 const sumCat = (cat) => getGroup(cat).reduce((a,b)=>a+(Number(b.amount)||0),0);
                 const gastosTxs = shiftTxs.filter(t => t.type === 'gasto');
                 
                 // RUTAS DEL DIA
                 const rutasDelDia = sales.filter(s => s.date === selectedClosedShift.startDate && s.status === 'cerrada');
                 const totalRutasEfectivo = rutasDelDia.reduce((sum, s) => sum + (Number(s.cashExpected) || 0), 0);

                 const totalIngresosBrutos = shiftTxs.filter(t=>t.type==='ingreso').reduce((a,b)=>a+(Number(b.amount)||0),0) + totalRutasEfectivo;

                 return (
                   <>
                     {renderPlanillaTable('PANADERIA', getGroup('Panadería'))}
                     
                     <div className="grid grid-cols-2 gap-4 mt-2">
                       {renderPlanillaTable('COLPORTAJE', getGroup('Colportaje'))}
                       {renderPlanillaTable('RESTAURANTE', getGroup('Restaurante'))}
                       {renderPlanillaTable('TERAPIA', getGroup('Terapia'))}
                       {renderPlanillaTable('ESCUELA REDENSION', getGroup('Escuela'))}
                       {renderPlanillaTable('OTROS', getGroup('Otros'))}
                       {renderPlanillaTable('SEMINARIO', getGroup('Seminario'))}
                       {renderPlanillaTable('PRODUCTOS', getGroup('Productos'))}
                       {renderPlanillaTable('FACTURAS-VALES', gastosTxs)}
                     </div>

                     <div className="border border-black p-3 mt-4 text-[11px] break-inside-avoid">
                        <p className="font-bold border-b border-black mb-3 text-sm">CUADRE DIARIO DE CAJA K-LENDULA</p>
                        <div className="grid grid-cols-2 gap-12">
                          <div>
                            <div className="flex justify-between mb-1"><span>Base caja</span> <span>{formatCurrency(selectedClosedShift.baseAmount)}</span></div>
                            <p className="font-bold mt-2">INGRESOS PANADERIA</p>
                            <div className="flex justify-between pl-2"><span>Panadería</span> <span>{formatCurrency(sumCat('Panadería'))}</span></div>
                            <div className="flex justify-between pl-2"><span>Colportaje</span> <span>{formatCurrency(sumCat('Colportaje'))}</span></div>
                            <div className="flex justify-between pl-2"><span>Terapia</span> <span>{formatCurrency(sumCat('Terapia'))}</span></div>
                            <div className="flex justify-between pl-2"><span>Otros</span> <span>{formatCurrency(sumCat('Otros'))}</span></div>
                            <div className="flex justify-between pl-2"><span>Productos</span> <span>{formatCurrency(sumCat('Productos'))}</span></div>
                            <div className="flex justify-between pl-2"><span>Restaurante</span> <span>{formatCurrency(sumCat('Restaurante'))}</span></div>
                            <div className="flex justify-between pl-2"><span>Escuela</span> <span>{formatCurrency(sumCat('Escuela'))}</span></div>
                            <div className="flex justify-between pl-2"><span>Seminario</span> <span>{formatCurrency(sumCat('Seminario'))}</span></div>
                            <div className="flex justify-between pl-2 font-bold text-indigo-700"><span>Rutas Calle (Vend.)</span> <span>{formatCurrency(totalRutasEfectivo)}</span></div>
                            <div className="flex justify-between font-bold border-t border-black mt-2 pt-1"><span>TOTAL INGRESOS DIA</span> <span>{formatCurrency(totalIngresosBrutos)}</span></div>
                          </div>
                          <div>
                            <div className="flex justify-between font-bold text-sm"><span>TOTAL PLANILLA</span> <span>{formatCurrency(selectedClosedShift.baseAmount + totalIngresosBrutos)}</span></div>
                            <div className="flex justify-between font-bold text-sm mt-4"><span>TOTAL EFECTIVO (Físico)</span> <span>{formatCurrency(selectedClosedShift.efectivoFisico)}</span></div>
                            <div className="flex justify-between mt-2 text-rose-700"><span>FACTURAS Y NEQUI</span> <span>(-) {formatCurrency((selectedClosedShift.totalGastos||0) + (selectedClosedShift.totalDigital||0))}</span></div>
                            <div className="flex justify-between font-bold mt-2 border-t border-black pt-2"><span>DIFERENCIA (Sob/Fal)</span> <span>{formatCurrency(selectedClosedShift.diferencia)}</span></div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-12 pt-4 px-8">
                           <div className="w-48 border-t border-black text-center font-bold">ENTREGA</div>
                           <div className="w-48 border-t border-black text-center font-bold">RECIBE</div>
                        </div>
                     </div>
                   </>
                 );
               })()}
            </div>

            <div className="p-4 bg-slate-100 flex gap-4 print-hidden border-t">
              <button onClick={() => setSelectedClosedShift(null)} className="flex-1 py-4 bg-white text-slate-700 font-bold rounded-xl border hover:bg-slate-50">Cerrar</button>
              <button onClick={() => window.print()} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-md hover:bg-indigo-700 flex justify-center items-center gap-2"><PrinterIcon className="w-5 h-5"/> Imprimir Planilla A4</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CIERRE DE RUTA (VENDEDOR CALLE) */}
      {showRouteCloseModal && routeClosingData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden my-8">
            <div className="bg-amber-500 p-6 text-white text-center"><h2 className="text-2xl font-black">Cerrar Ruta</h2><p className="text-amber-100 font-medium">{routeClosingData.date}</p></div>
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Inventario Retornado (Devoluciones)</p>
                <div className="space-y-3">
                  {routeClosingData.inventory && routeClosingData.inventory.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                      <p className="font-bold text-slate-700 text-sm">{item.name} <span className="text-xs text-slate-400 font-normal">(Llevó: {item.qty})</span></p>
                      <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-400">Devuelve:</span><input type="number" min="0" max={item.qty} value={routeReturns[idx] !== undefined ? routeReturns[idx] : ''} onChange={(e) => { const val = e.target.value; setRouteReturns({...routeReturns, [idx]: val === '' ? '' : parseInt(val, 10)}); }} className="w-16 px-2 py-1 bg-white border-2 border-slate-200 rounded-lg text-center font-bold text-slate-800 outline-none focus:border-amber-500" placeholder="0" /></div>
                    </div>
                  ))}
                  {(!routeClosingData.inventory || routeClosingData.inventory.length === 0) && <p className="text-sm text-slate-500 italic">Sin inventario detallado.</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Gastos (Gasolina, etc)</label><input type="number" value={routeExpenses} onChange={(e)=>setRouteExpenses(e.target.value)} className="w-full px-4 py-3 bg-rose-50 border-2 border-rose-100 rounded-xl font-bold text-rose-700 outline-none" placeholder="$0" /></div>
                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Nequi/Tarjeta</label><input type="number" value={routeDigitalPayments} onChange={(e)=>setRouteDigitalPayments(e.target.value)} className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-100 rounded-xl font-bold text-purple-700 outline-none" placeholder="$0" /></div>
              </div>
              {(() => {
                let ventaTotal = 0;
                if (routeClosingData.inventory && routeClosingData.inventory.length > 0) { 
                  routeClosingData.inventory.forEach((item, idx) => { const devuelto = routeReturns[idx] === '' ? 0 : (routeReturns[idx] || 0); const vendidos = item.qty - devuelto; ventaTotal += (vendidos * item.price); }); 
                } else {
                  ventaTotal = parseFloat(routeExpenses || 0); 
                }
                const base = routeClosingData.base || 0;
                const gastos = parseFloat(routeExpenses) || 0;
                const digital = parseFloat(routeDigitalPayments) || 0;
                const efectivoEsperado = base + ventaTotal - gastos - digital;

                return (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                    <div className="text-center pt-2">
                      <p className="text-xs font-black text-indigo-500 uppercase tracking-wider mb-1">Efectivo Físico a Recibir</p>
                      <p className="text-3xl font-black text-indigo-900">{formatCurrency(efectivoEsperado)}</p>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={()=>{setShowRouteCloseModal(false);}} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Cancelar</button>
                      <button onClick={async () => { const updatedData = { status: 'cerrada', amount: ventaTotal, expenses: gastos, digital: digital, cashExpected: efectivoEsperado, returns: routeReturns, closeTimestamp: Date.now() }; await setDoc(doc(db, 'usuarios', user.uid, 'ventas', routeClosingData.id), updatedData, { merge: true }); setShowRouteCloseModal(false); }} className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-xl shadow-lg hover:bg-emerald-600">Guardar Ruta</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL IMPRIMIR HISTORIAL INDIVIDUAL VENDEDOR */}
      {showSellerPrintModal && (
        <div className="fixed inset-0 print:static print:inset-auto bg-slate-900/80 z-50 flex items-center justify-center p-4 overflow-y-auto print:overflow-visible modal-print-wrapper print:bg-white print:p-0 print:block">
          <div className="bg-white max-w-4xl w-full my-8 print:my-0 print:max-w-none print:w-full print:shadow-none shadow-2xl relative print:h-auto print:overflow-visible print:block rounded-2xl print:rounded-none">
            <div className="p-8 text-black font-sans bg-white print:bg-white">
               <div className="text-center font-bold mb-6 border-b-2 border-black pb-4">
                 <h2 className="text-2xl uppercase">REPORTE MENSUAL DE VENTAS Y LIQUIDACIONES</h2>
                 <h3 className="text-xl text-slate-600 mt-1 uppercase">{sellers.find(s=>s.id===currentSellerId)?.name}</h3>
                 <p className="text-sm mt-2">Mes de proceso: {currentMonth} | Impreso el: {new Date().toLocaleString('es-CO')}</p>
               </div>
               
               <table className="w-full text-left border-collapse border border-black text-sm mt-4">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-black p-2 text-center">Fecha</th>
                      <th className="border border-black p-2 text-right">Venta Bruta</th>
                      <th className="border border-black p-2 text-right">Gastos/Vales</th>
                      <th className="border border-black p-2 text-right">Transf./Nequi</th>
                      <th className="border border-black p-2 text-right">Comisión</th>
                      <th className="border border-black p-2 text-right bg-indigo-50">Efectivo Entregado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSellerSales.filter(s => s.status === 'cerrada').length === 0 ? (
                      <tr><td colSpan="6" className="border border-black p-4 text-center">No hay liquidaciones cerradas en este mes.</td></tr>
                    ) : (
                      currentSellerSales.filter(s => s.status === 'cerrada').map(sale => (
                        <tr key={sale.id}>
                          <td className="border border-black p-2 text-center font-bold">{sale.date}</td>
                          <td className="border border-black p-2 text-right">{formatCurrency(sale.amount || 0)}</td>
                          <td className="border border-black p-2 text-right text-rose-600">{formatCurrency(sale.expenses || 0)}</td>
                          <td className="border border-black p-2 text-right text-purple-600">{formatCurrency(sale.digital || 0)}</td>
                          <td className="border border-black p-2 text-right text-indigo-600">{formatCurrency((sale.amount || 0) * (commissionRate / 100))}</td>
                          <td className="border border-black p-2 text-right font-black bg-indigo-50">{formatCurrency(sale.cashExpected || 0)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-slate-200 font-black">
                     <tr>
                       <td className="border border-black p-2 text-right">TOTALES ACUMULADOS</td>
                       <td className="border border-black p-2 text-right">{formatCurrency(currentSellerSales.filter(s=>s.status==='cerrada').reduce((sum, s)=>sum+(s.amount||0), 0))}</td>
                       <td className="border border-black p-2 text-right text-rose-600">{formatCurrency(currentSellerSales.filter(s=>s.status==='cerrada').reduce((sum, s)=>sum+(s.expenses||0), 0))}</td>
                       <td className="border border-black p-2 text-right text-purple-600">{formatCurrency(currentSellerSales.filter(s=>s.status==='cerrada').reduce((sum, s)=>sum+(s.digital||0), 0))}</td>
                       <td className="border border-black p-2 text-right text-indigo-600">{formatCurrency(currentSellerSales.filter(s=>s.status==='cerrada').reduce((sum, s)=>sum+(s.amount||0), 0) * (commissionRate/100))}</td>
                       <td className="border border-black p-2 text-right bg-indigo-100">{formatCurrency(currentSellerSales.filter(s=>s.status==='cerrada').reduce((sum, s)=>sum+(s.cashExpected||0), 0))}</td>
                     </tr>
                  </tfoot>
               </table>
               
               <div className="flex justify-between mt-24 px-16">
                  <div className="w-64 border-t-2 border-black text-center font-bold">Firma Vendedor</div>
                  <div className="w-64 border-t-2 border-black text-center font-bold">Firma Administrador / Caja</div>
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
              <div className="flex justify-center mb-2"><AlertIcon className="w-10 h-10"/></div>
              <h2 className="text-xl font-black">¡Zona de Peligro!</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm font-bold text-slate-700 text-center">Esta acción eliminará TODOS los vendedores, turnos, productos y ventas de manera IRREVERSIBLE.</p>
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