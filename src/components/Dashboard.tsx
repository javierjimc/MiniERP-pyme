import { useAuth } from '../context/AuthContext';
import LoginForm from './auth/LoginForm';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import OverviewModule from './modules/OverviewModule';
import InventoryModule from './modules/InventoryModule';
import CustomersModule from './modules/CustomersModule';
import SuppliersModule from './modules/SuppliersModule';
import SalesModule from './modules/SalesModule';
import PurchasesModule from './modules/PurchasesModule';
import ReportsModule from './modules/ReportsModule';
import {useState} from "react";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState('overview');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewModule />;
      case 'inventory': return <InventoryModule />;
      case 'customers': return <CustomersModule />;
      case 'suppliers': return <SuppliersModule />;
      case 'sales': return <SalesModule />;
      case 'purchases': return <PurchasesModule />;
      case 'reports': return <ReportsModule />;
      default: return <OverviewModule />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}