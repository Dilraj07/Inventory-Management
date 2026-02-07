import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { LiveTerminal, addTerminalLog } from './components/LiveTerminal';
import { Card } from './components/Card';
import { InventoryTable } from './components/InventoryTable';
import { ShipmentQueueViewer } from './components/ShipmentQueueViewer';
import { OrdersTable } from './components/OrdersTable';
import { Modal } from './components/Modal';
import { AddProductForm } from './components/AddProductForm';
import { AddOrderForm } from './components/AddOrderForm';
import { AlertCircle, CheckCircle2, TrendingUp, Package, Plus, Terminal as TerminalIcon } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';


// Configure Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

// Constants
const DATA_REFRESH_INTERVAL = 10000; // 10 seconds for better performance

function App() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [priority, setPriority] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Set up axios interceptor for terminal logging with detailed messages
  useEffect(() => {
    const getDetailedMessage = (endpoint, method, isRequest = true) => {
      const cleanEndpoint = endpoint.replace('/api', '');
      
      if (isRequest) {
        if (cleanEndpoint.includes('dashboard/summary')) return 'Loading dashboard summary with KPIs';
        if (cleanEndpoint.includes('priority/top')) return 'Fetching top priority item from Min-Heap';
        if (cleanEndpoint.includes('inventory/stability')) return 'Analyzing inventory stability using BST';
        if (cleanEndpoint.includes('inventory/bst-filter')) return 'Applying BST filter for inventory sorting';
        if (cleanEndpoint.includes('orders/history')) return 'Retrieving customer order history';
        if (cleanEndpoint.includes('shipment')) return 'Loading shipment queue (FIFO)';
        if (cleanEndpoint.includes('audit')) return 'Fetching audit schedule (Circular List)';
        if (cleanEndpoint.includes('products') && method === 'POST') return 'Creating new product entry';
        if (cleanEndpoint.includes('products') && method === 'PUT') return 'Updating product information';
        if (cleanEndpoint.includes('products') && method === 'DELETE') return 'Removing product from inventory';
        return `${method} ${cleanEndpoint}`;
      } else {
        if (cleanEndpoint.includes('dashboard/summary')) return 'Dashboard metrics loaded successfully';
        if (cleanEndpoint.includes('priority/top')) return 'Priority item retrieved (Min-Heap root)';
        if (cleanEndpoint.includes('inventory/stability')) return 'Inventory analysis complete (BST traversal)';
        if (cleanEndpoint.includes('inventory/bst-filter')) return 'BST filter applied successfully';
        if (cleanEndpoint.includes('orders/history')) return 'Order history loaded';
        if (cleanEndpoint.includes('shipment')) return 'Shipment queue ready';
        if (cleanEndpoint.includes('audit')) return 'Audit schedule retrieved';
        if (method === 'POST') return 'Item created successfully';
        if (method === 'PUT') return 'Item updated successfully';
        if (method === 'DELETE') return 'Item deleted successfully';
        return `${method} completed`;
      }
    };

    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const method = config.method.toUpperCase();
        const message = getDetailedMessage(config.url, method, true);
        addTerminalLog('API', message);
        return config;
      },
      (error) => {
        addTerminalLog('ERROR', `Request failed: ${error.message}`);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        const method = response.config.method.toUpperCase();
        const message = getDetailedMessage(response.config.url, method, false);
        addTerminalLog('SUCCESS', message);
        return response;
      },
      (error) => {
        const method = error.config?.method?.toUpperCase() || 'REQUEST';
        const endpoint = error.config?.url?.replace('/api', '') || 'unknown';
        const status = error.response?.status;
        addTerminalLog('ERROR', `${method} ${endpoint} failed - ${status || 'Network error'}`);
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [sumRes, priRes, invRes, audRes, ordRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/priority/top'),
        api.get('/inventory/stability'),
        api.get('/audit/next'),
        api.get('/orders/history') // Assuming this endpoint exists now or use empty
      ]);

      setSummary(sumRes.data);
      setPriority(priRes.data);
      setInventory(invRes.data);
      setAudit(audRes.data.audit_sequence);
      setOrders(ordRes.data); // Mocked or real
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
      // Even if data fails, we might want to stop loading to show UI
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Start fetching data immediately
    fetchData();
    const interval = setInterval(fetchData, DATA_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleProductAdded = () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleOrderAdded = () => {
    setIsOrderModalOpen(false);
    fetchData();
  };

  // Custom Loading Screen only for invalid initial state, 
  // but since we have Intro, we can load data BEHIND the intro.
  // We won't block render with "Loading..." text anymore if Intro is up.
  // But for safety:
  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium">{t('loading')}</div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{t('inventoryManagement')}</h2>
                <p className="text-slate-500 text-sm">Sorted by stability score</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 shadow-sm transition-all">
                <Plus size={16} /> {t('addProduct')}
              </button>
            </div>
            <Card title={t('rawDataView')}>
              <InventoryTable data={inventory} onUpdate={fetchData} />
            </Card>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Customer Orders</h2>
                <p className="text-slate-500 text-sm">Real-time Order History</p>
              </div>
              <button onClick={() => setIsOrderModalOpen(true)} className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 shadow-sm transition-all">
                <Plus size={16} /> Add Order
              </button>
            </div>
            <Card title={null}>
              <OrdersTable data={orders} />
            </Card>
          </div>
        );
      case 'shipments':
        return (
          <div className="space-y-6">
            <ShipmentQueueViewer />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="space-y-8">
            {/* Dashboard Hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Priority Alert */}
              <div className={`md:col-span-2 relative overflow-hidden p-6 rounded-[2rem] shadow-sm border transition-all ${priority?.days_remaining < 7 ? 'bg-rose-50/80 border-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.15)] backdrop-blur-md' : 'bg-white border-slate-200'
                } flex items-center justify-between group`}>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${priority?.days_remaining < 7 ? 'bg-white text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                      {priority?.days_remaining < 7 ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                      {priority?.days_remaining < 7 ? t('priorityHeapRoot') : t('systemHealthy')}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-1">{priority?.name || "Unknown Product"}</h2>
                  <p className="text-slate-500 text-sm">{t('forecastedStockout')}: <strong className={priority?.days_remaining < 7 ? "text-rose-600" : "text-slate-700"}>{Math.round(priority?.days_remaining)} {t('daysRemaining')}</strong></p>
                </div>
                <div className={`text-right px-6 py-4 rounded-2xl border ${priority?.days_remaining < 7 ? 'bg-white/80 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">{t('stock')}</span>
                  <span className="text-4xl font-bold text-slate-900 tracking-tight">{priority?.current_stock}</span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="space-y-4">
                <Card className="flex-row items-center gap-4 py-4" title={null} action={null}>
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-auto">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('skusTracked')}</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{summary?.total_sku_count}</p>
                  </div>
                </Card>
                <Card className="flex-row items-center gap-4 py-4" title={null} action={null}>
                  <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 mb-auto">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('criticalAlerts')}</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{summary?.critical_stock_alert}</p>
                  </div>
                </Card>
              </div>
            </div>


            <div className="flex justify-between items-center mt-8 mb-4">
              <h3 className="text-xl font-bold text-slate-900">{t('quickInventoryManagement')}</h3>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 shadow-sm transition-all">
                <Plus size={16} /> {t('addProduct')}
              </button>
            </div>

            {/* Quick Inventory Table */}
            <Card title={t('recentInventoryItems')}>
              <div className="max-h-96 overflow-y-auto">
                <InventoryTable data={inventory} onUpdate={fetchData} />
              </div>
            </Card>

          </div>

        );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-[#F1F5F9]">
      <div className="flex flex-col h-screen bg-[#F1F5F9]">
        {/* Top Navbar */}
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Split View: Content + Live Terminal */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Content Area */}
          <main className={`flex-1 p-6 overflow-y-auto transition-all ${terminalVisible ? '' : 'mr-0'}`}>
            {renderContent()}

            {/* Modals */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('addNewProduct')}>
              <AddProductForm onSuccess={handleProductAdded} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Create New Order">
              <AddOrderForm onSuccess={handleOrderAdded} onCancel={() => setIsOrderModalOpen(false)} />
            </Modal>
          </main>

          {/* Terminal Toggle Button */}
          <button
            onClick={() => setTerminalVisible(!terminalVisible)}
            className={`fixed right-6 bottom-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg font-medium shadow-lg transition-all ${
              terminalVisible 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            title={terminalVisible ? 'Hide Terminal' : 'Show Terminal'}
          >
            <TerminalIcon size={20} />
            <span className="text-sm">{terminalVisible ? 'Hide' : 'Show'} Terminal</span>
          </button>

          {/* Live Terminal Sidebar */}
          {terminalVisible && (
            <aside className="w-[500px] p-6 border-l border-slate-200 bg-slate-50 transition-all">
              <LiveTerminal />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
