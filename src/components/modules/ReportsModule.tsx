import React, { useState } from 'react';
import { BarChart3, FileText, Users, Package, DollarSign, FileSpreadsheet, } from 'lucide-react';
import { useData } from './DataContext';
import { 
  exportProductsToExcel, 
  exportCustomersToExcel, 
  exportSuppliersToExcel, 
  exportSalesToExcel, 
  exportPurchasesToExcel,
  exportDetailedSalesToExcel,
  exportComprehensiveReport
} from '../../utils/excelExport';


export default function ReportsModule() {
  const { 
    products, customers, suppliers, sales, purchases,
    getTopProducts, getTopCustomers, getMonthlySales, getLowStockProducts
  } = useData();

  const [selectedReport, setSelectedReport] = useState('sales');

  const topProducts = getTopProducts();
  const topCustomers = getTopCustomers();
  const monthlySales = getMonthlySales();
  const lowStockProducts = getLowStockProducts();

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
   const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
   console.log(totalPurchases)


  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ventas</p>
              <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Número de Ventas</p>
              <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Venta Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                ${sales.length > 0 ? (totalSales / sales.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas Mensuales</h3>
        <div className="grid grid-cols-6 gap-4">
          {monthlySales.map((month) => (
            <div key={month.month} className="text-center">
              <div className="bg-blue-100 rounded-lg p-3 mb-2">
                <div 
                  className="bg-blue-600 rounded" 
                  style={{ height: `${(month.sales / 10000) * 100}px`, minHeight: '20px' }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-900">{month.month}</p>
              <p className="text-xs text-gray-500">${month.sales}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
          <Package className="h-5 w-5 text-gray-400" />
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
                  <p className="text-sm text-gray-500">${item.product.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.sold} vendidos</p>
                <p className="text-sm text-gray-500">${(item.sold * item.product.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomersReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clientes por Facturación</h3>
        <div className="space-y-3">
          {topCustomers.map((customer, index) => (
            <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${customer.totalPurchases.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Última compra: {customer.lastPurchase}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <div className="space-y-6">
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-orange-900 mb-4">Productos con Stock Bajo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">Stock actual: {product.stock}</p>
                <p className="text-sm text-gray-600">Mínimo: {product.minStock}</p>
                <p className="text-sm text-orange-600 font-medium">
                  Diferencia: {product.minStock - product.stock} unidades
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Inventario</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            <p className="text-sm text-gray-600">Total Productos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.stock > p.minStock).length}
            </p>
            <p className="text-sm text-gray-600">Stock Adecuado</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
            <p className="text-sm text-gray-600">Stock Bajo</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {products.filter(p => p.stock === 0).length}
            </p>
            <p className="text-sm text-gray-600">Sin Stock</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (selectedReport) {
      case 'sales': return renderSalesReport();
      case 'customers': return renderCustomersReport();
      case 'inventory': return renderInventoryReport();
      default: return renderSalesReport();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">BI - Reportes y Análisis</h1>
          <p className="text-gray-600 mt-2">Inteligencia de negocios y exportación de datos</p>
        </div>
      </div>

      {/* Navegación de reportes */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setSelectedReport('sales')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReport === 'sales'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Reporte de Ventas
          </button>
          <button
            onClick={() => setSelectedReport('customers')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReport === 'customers'
                ? 'bg-green-100 text-green-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Reporte de Clientes
          </button>
          <button
            onClick={() => setSelectedReport('inventory')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReport === 'inventory'
                ? 'bg-orange-100 text-orange-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Reporte de Inventario
          </button>
        </div>

        {/* Botones de exportación */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Exportar a Excel (con totales)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => exportSalesToExcel(sales)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Ventas</span>
            </button>
            <button
              onClick={() => exportCustomersToExcel(customers)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Clientes</span>
            </button>
            <button
              onClick={() => exportProductsToExcel(products)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Productos</span>
            </button>
            <button
              onClick={() => exportSuppliersToExcel(suppliers)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Proveedores</span>
            </button>
          </div>
          



          <h4 className="text-sm font-medium text-gray-700 mb-3">Reportes Especializados</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => exportDetailedSalesToExcel(sales)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Ventas Detalladas</span>
            </button>
            <button
              onClick={() => exportPurchasesToExcel(purchases)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Pedidos/Compras</span>
            </button>

          </div>

          <h4 className="text-sm font-medium text-gray-700 mb-3">Reportes Ejecutivos Completos</h4>
          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => exportComprehensiveReport(products, customers, suppliers, sales, purchases)}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel Completo (Multi-hoja)</span>
            </button>
          </div>
          
        </div>
      </div>


      {renderReport()}

    </div>
  );
}