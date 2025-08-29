import {
  Package, Users, AlertTriangle,
   DollarSign, BarChart3
} from 'lucide-react';
import { useData } from './DataContext';

export default function OverviewModule() {
  const { 
    products, customers, sales, suppliers,
    getLowStockProducts, getTopProducts, getTopCustomers, getMonthlySales
  } = useData();

  const lowStockProducts = getLowStockProducts();
  const topProducts = getTopProducts();
  const topCustomers = getTopCustomers();
  const monthlySales = getMonthlySales();

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const averageSale = sales.length > 0 ? totalSales / sales.length : 0;

  const stats = [
    {
      title: 'Total Productos',
      value: products.length,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Clientes Activos',
      value: customers.length,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Ventas del Mes',
      value: `$${totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Stock Bajo',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
        <p className="text-gray-600 mt-2">Resumen ejecutivo de tu negocio</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className={`${stat.bgColor} p-6 rounded-xl border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Productos</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {topProducts.map((item, index) => (
              <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Stock: {item.product.stock}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.sold} vendidos</p>
                  <p className="text-sm text-gray-500">${item.product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clientes más valiosos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Clientes</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${customer.totalPurchases.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total compras</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas de stock bajo */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">Alerta: Stock Bajo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">Stock actual: {product.stock}</p>
                <p className="text-sm text-gray-600">Mínimo: {product.minStock}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico de ventas mensuales simplificado */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Mensuales</h3>
        <div className="grid grid-cols-6 gap-4">
          {monthlySales.map((month) => (
            <div key={month.month} className="text-center">
              <div className="bg-blue-100 rounded-lg p-3 mb-2">
                <div 
                  className="bg-blue-600 rounded" 
                  style={{ height: `${(month.sales / 10000) * 60}px`, minHeight: '20px' }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-900">{month.month}</p>
              <p className="text-xs text-gray-500">${month.sales}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}