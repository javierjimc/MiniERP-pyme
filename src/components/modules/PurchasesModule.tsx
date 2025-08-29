import React, { useState } from 'react';
import { Plus, Eye, Check, X, FileSpreadsheet, FileDown } from 'lucide-react';
import { useData } from './DataContext';
import { exportPurchasesToExcel } from '../../utils/excelExport';
import { exportPurchasesToPDF } from '../../utils/pdfExport';

export default function PurchasesModule() {
  const { suppliers, products, purchases, addPurchase, updatePurchaseStatus } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number; cost: number }[]>([]);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 0, cost: 0 }]);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setOrderItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.cost), 0);
  };

  const handleSubmitPurchase = () => {
    if (!selectedSupplier || orderItems.length === 0) return;

    const supplier = suppliers.find(s => s.id === selectedSupplier);
    if (!supplier) return;

    const purchaseItems = orderItems.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        cost: item.cost
      };
    });

    addPurchase({
      supplierId: selectedSupplier,
      supplierName: supplier.name,
      items: purchaseItems,
      total: calculateTotal(),
      status: 'pending' as const
    });

    // Reset form
    setOrderItems([]);
    setSelectedSupplier('');
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'received': return 'Recibido';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Compras</h1>
          <p className="text-gray-600 mt-2">Administra los pedidos a proveedores</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => exportPurchasesToExcel(purchases)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Exportar Excel</span>
          </button>
          <button
            onClick={() => exportPurchasesToPDF(purchases)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FileDown className="h-4 w-4" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Pedido</span>
          </button>
        </div>
      </div>

      {/* Formulario de nueva compra */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Pedido</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar proveedor</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Items del Pedido</h4>
              <button
                onClick={handleAddItem}
                className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-200 transition-colors"
              >
                Agregar Item
              </button>
            </div>
            
            {orderItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <select
                    value={item.productId}
                    onChange={(e) => handleUpdateItem(index, 'productId', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    required
                  >
                    <option value="">Producto</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Costo unitario"
                    value={item.cost}
                    onChange={(e) => handleUpdateItem(index, 'cost', parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">${(item.quantity * item.cost).toFixed(2)}</span>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {orderItems.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitPurchase}
                  disabled={!selectedSupplier || orderItems.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  Crear Pedido
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setOrderItems([]);
                    setSelectedSupplier('');
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de compras */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Pedidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {purchase.supplierName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {purchase.items.map(item => `${item.productName} (${item.quantity})`).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${purchase.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                      {getStatusText(purchase.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {purchase.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updatePurchaseStatus(purchase.id, 'received')}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                            title="Marcar como recibido"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updatePurchaseStatus(purchase.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Cancelar pedido"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
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