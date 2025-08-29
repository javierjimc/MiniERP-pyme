import React, { useState } from 'react';
import {  Plus, Eye, FileSpreadsheet, FileDown } from 'lucide-react';
import { useData } from './DataContext';
import { exportSalesToExcel, exportDetailedSalesToExcel } from '../../utils/excelExport';
import { exportSalesToPDF } from '../../utils/pdfExport';

export default function SalesModule() {
  const { products, customers, sales, addSale } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  console.log(sales)
    console.log(customers)

  const handleAddToCart = (productId: string) => {
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmitSale = () => {
    if (!selectedCustomer || cart.length === 0) return;

    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;

    const saleItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price
      };
    });

    addSale({
      customerId: selectedCustomer,
      customerName: customer.name,
      items: saleItems,
      total: calculateTotal()
    });

    // Reset form
    setCart([]);
    setSelectedCustomer('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Ventas</h1>
          <p className="text-gray-600 mt-2">Registra nuevas ventas y consulta el historial</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => exportSalesToExcel(sales)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Exportar Excel</span>
          </button>
          <button
            onClick={() => exportSalesToPDF(sales)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FileDown className="h-4 w-4" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nueva Venta</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Nueva Venta</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Productos Disponibles</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {products.filter(p => p.stock > 0).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">${product.price} - Stock: {product.stock}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs hover:bg-purple-200 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carrito */}
          {cart.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Carrito de Compras</h4>
              <div className="space-y-2 mb-4">
                {cart.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">${product.price} c/u</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                        <span className="ml-4 font-medium">${(product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmitSale}
                    disabled={!selectedCustomer || cart.length === 0}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Completar Venta
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setCart([]);
                      setSelectedCustomer('');
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Historial de ventas */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Historial de Ventas</h3>
            <button
              onClick={() => exportDetailedSalesToExcel(sales)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Detallado</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.customerId}
                  </td>
                  {/*<td className="px-6 py-4 text-sm text-gray-500">*/}
                  {/*  {sale..map(item => `${item.productName} (${item.quantity})`).join(', ')}*/}
                  {/*</td>*/}
                  {/*<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">*/}
                  {/*  ${sale.total.toFixed(2)}*/}
                  {/*</td>*/}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}