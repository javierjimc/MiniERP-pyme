import React from 'react';
import { 
  Home, Package, Users, Truck, ShoppingCart, 
  ShoppingBag, BarChart3, LogOut, Store 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Panel Principal', icon: Home },
  { id: 'inventory', label: 'Inventario', icon: Package },
  { id: 'customers', label: 'Clientes (CRM)', icon: Users },
  { id: 'suppliers', label: 'Proveedores (SCM)', icon: Truck },
  { id: 'sales', label: 'Ventas', icon: ShoppingCart },
  { id: 'purchases', label: 'Compras', icon: ShoppingBag },
  { id: 'reports', label: 'Reportes (BI)', icon: BarChart3 },
];

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <div className="bg-blue-900 text-white w-64 flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Store className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MiniERP</h1>
            <p className="text-blue-300 text-sm">Sistema PyME</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeModule === item.id
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-800 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}