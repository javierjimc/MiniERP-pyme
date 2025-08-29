import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../modules/DataContext';

export default function Header() {
  const { user } = useAuth();
  const { getLowStockProducts } = useData();
  const lowStockProducts = getLowStockProducts();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Bienvenido, {user?.name}
          </h2>
          <p className="text-gray-600 text-sm">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {lowStockProducts.length > 0 && (
            <div className="relative">
              <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {lowStockProducts.length}
                </span>
              </button>
            </div>
          )}

          <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}