import * as XLSX from 'xlsx';
import { Product, Customer, Supplier, Sale, Purchase } from '../context/DataContext-Legacy.tsx';

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Datos') => {
  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new();
  
  // Crear una hoja de trabajo con los datos
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generar el archivo y descargarlo
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportProductsToExcel = (products: Product[]) => {
  const data = products.map(product => ({
    'ID': product.id,
    'Nombre': product.name,
    'Categoría': product.category,
    'Precio': product.price,
    'Stock Actual': product.stock,
    'Stock Mínimo': product.minStock,
    'Proveedor': product.supplier,
    'Estado Stock': product.stock <= product.minStock ? 'BAJO' : 'NORMAL',
    'Valor Total': product.stock * product.price
  }));
  
  // Agregar fila de totales
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  
  data.push({
    'ID': '',
    'Nombre': 'TOTALES',
    'Categoría': `${totalProducts} productos`,
    'Precio': '',
    'Stock Actual': totalUnits,
    'Stock Mínimo': '',
    'Proveedor': `${lowStockCount} con stock bajo`,
    'Estado Stock': '',
    'Valor Total': totalStockValue
  });
  
  exportToExcel(data, 'inventario_productos', 'Productos');
};

export const exportCustomersToExcel = (customers: Customer[]) => {
  const data = customers.map(customer => ({
    'ID': customer.id,
    'Nombre': customer.name,
    'Email': customer.email,
    'Teléfono': customer.phone,
    'Dirección': customer.address,
    'Total Compras': customer.totalPurchases,
    'Última Compra': customer.lastPurchase
  }));
  
  // Agregar fila de totales
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const avgPurchase = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  
  data.push({
    'ID': '',
    'Nombre': 'TOTALES',
    'Email': `${totalCustomers} clientes`,
    'Teléfono': '',
    'Dirección': `Promedio: $${avgPurchase.toFixed(2)}`,
    'Total Compras': totalRevenue,
    'Última Compra': ''
  });
  
  exportToExcel(data, 'clientes', 'Clientes');
};

export const exportSuppliersToExcel = (suppliers: Supplier[]) => {
  const data = suppliers.map(supplier => ({
    'ID': supplier.id,
    'Nombre': supplier.name,
    'Email': supplier.email,
    'Teléfono': supplier.phone,
    'Dirección': supplier.address,
    'Productos Suministrados': supplier.products.length
  }));
  
  // Agregar fila de totales
  const totalSuppliers = suppliers.length;
  const totalProductsSupplied = suppliers.reduce((sum, s) => sum + s.products.length, 0);
  
  data.push({
    'ID': '',
    'Nombre': 'TOTALES',
    'Email': `${totalSuppliers} proveedores`,
    'Teléfono': '',
    'Dirección': '',
    'Productos Suministrados': totalProductsSupplied
  });
  
  exportToExcel(data, 'proveedores', 'Proveedores');
};

export const exportSalesToExcel = (sales: Sale[]) => {
  const data = sales.map(sale => ({
    'ID Venta': sale.id,
    'Fecha': sale.date,
    'Cliente': sale.customerName,
    'ID Cliente': sale.customerId,
    'Productos': sale.items.map(item => `${item.productName} (${item.quantity})`).join('; '),
    'Total Items': sale.items.reduce((sum, item) => sum + item.quantity, 0),
    'Total Venta': sale.total
  }));
  
  // Agregar fila de totales
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalItemsSold = sales.reduce((sum, s) => sum + s.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  data.push({
    'ID Venta': '',
    'Fecha': '',
    'Cliente': 'TOTALES',
    'ID Cliente': `${totalSales} ventas`,
    'Productos': `Promedio: $${avgSale.toFixed(2)}`,
    'Total Items': totalItemsSold,
    'Total Venta': totalRevenue
  });
  
  exportToExcel(data, 'ventas', 'Ventas');
};

export const exportPurchasesToExcel = (purchases: Purchase[]) => {
  const data = purchases.map(purchase => ({
    'ID Pedido': purchase.id,
    'Fecha': purchase.date,
    'Proveedor': purchase.supplierName,
    'ID Proveedor': purchase.supplierId,
    'Productos': purchase.items.map(item => `${item.productName} (${item.quantity})`).join('; '),
    'Total Items': purchase.items.reduce((sum, item) => sum + item.quantity, 0),
    'Total Pedido': purchase.total,
    'Estado': purchase.status === 'pending' ? 'Pendiente' : 
              purchase.status === 'received' ? 'Recibido' : 'Cancelado'
  }));
  
  // Agregar fila de totales
  const totalPurchases = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + p.total, 0);
  const totalItemsPurchased = purchases.reduce((sum, p) => sum + p.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  const pendingCount = purchases.filter(p => p.status === 'pending').length;
  const receivedCount = purchases.filter(p => p.status === 'received').length;
  
  data.push({
    'ID Pedido': '',
    'Fecha': '',
    'Proveedor': 'TOTALES',
    'ID Proveedor': `${totalPurchases} pedidos`,
    'Productos': `Pendientes: ${pendingCount}, Recibidos: ${receivedCount}`,
    'Total Items': totalItemsPurchased,
    'Total Pedido': totalSpent,
    'Estado': ''
  });
  
  exportToExcel(data, 'pedidos_compras', 'Pedidos');
};

export const exportDetailedSalesToExcel = (sales: Sale[]) => {
  const data: any[] = [];
  
  sales.forEach(sale => {
    sale.items.forEach(item => {
      data.push({
        'ID Venta': sale.id,
        'Fecha': sale.date,
        'Cliente': sale.customerName,
        'Producto': item.productName,
        'Cantidad': item.quantity,
        'Precio Unitario': item.price,
        'Subtotal': item.quantity * item.price,
        'Total Venta': sale.total
      });
    });
  });
  
  // Agregar fila de totales
  const totalItems = data.length;
  const totalQuantity = data.reduce((sum, item) => sum + item.Cantidad, 0);
  const totalSubtotal = data.reduce((sum, item) => sum + item.Subtotal, 0);
  
  data.push({
    'ID Venta': '',
    'Fecha': '',
    'Cliente': 'TOTALES',
    'Producto': `${totalItems} líneas de venta`,
    'Cantidad': totalQuantity,
    'Precio Unitario': '',
    'Subtotal': totalSubtotal,
    'Total Venta': ''
  });
  
  exportToExcel(data, 'ventas_detalladas', 'Ventas Detalladas');
};

export const exportLowStockToExcel = (products: Product[]) => {
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  
  const data = lowStockProducts.map(product => ({
    'Producto': product.name,
    'Categoría': product.category,
    'Stock Actual': product.stock,
    'Stock Mínimo': product.minStock,
    'Diferencia': product.minStock - product.stock,
    'Proveedor': product.supplier,
    'Precio': product.price,
    'Valor Total Faltante': (product.minStock - product.stock) * product.price
  }));
  
  // Agregar fila de totales
  const totalLowStock = lowStockProducts.length;
  const totalMissingUnits = lowStockProducts.reduce((sum, p) => sum + (p.minStock - p.stock), 0);
  const totalMissingValue = lowStockProducts.reduce((sum, p) => sum + ((p.minStock - p.stock) * p.price), 0);
  
  data.push({
    'Producto': 'TOTALES',
    'Categoría': `${totalLowStock} productos`,
    'Stock Actual': '',
    'Stock Mínimo': '',
    'Diferencia': totalMissingUnits,
    'Proveedor': '',
    'Precio': '',
    'Valor Total Faltante': totalMissingValue
  });
  
  exportToExcel(data, 'productos_stock_bajo', 'Stock Bajo');
};

export const exportComprehensiveReport = (
  products: Product[], 
  customers: Customer[], 
  suppliers: Supplier[], 
  sales: Sale[], 
  purchases: Purchase[]
) => {
  const workbook = XLSX.utils.book_new();
  
  // Hoja de productos
  const productsData = products.map(product => ({
    'ID': product.id,
    'Nombre': product.name,
    'Categoría': product.category,
    'Precio': product.price,
    'Stock Actual': product.stock,
    'Stock Mínimo': product.minStock,
    'Proveedor': product.supplier,
    'Estado': product.stock <= product.minStock ? 'STOCK BAJO' : 'NORMAL'
  }));
  const productsSheet = XLSX.utils.json_to_sheet(productsData);
  XLSX.utils.book_append_sheet(workbook, productsSheet, 'Productos');
  
  // Hoja de clientes
  const customersData = customers.map(customer => ({
    'ID': customer.id,
    'Nombre': customer.name,
    'Email': customer.email,
    'Teléfono': customer.phone,
    'Dirección': customer.address,
    'Total Compras': customer.totalPurchases,
    'Última Compra': customer.lastPurchase
  }));
  const customersSheet = XLSX.utils.json_to_sheet(customersData);
  XLSX.utils.book_append_sheet(workbook, customersSheet, 'Clientes');
  
  // Hoja de ventas
  const salesData = sales.map(sale => ({
    'ID': sale.id,
    'Fecha': sale.date,
    'Cliente': sale.customerName,
    'Total': sale.total,
    'Productos': sale.items.map(item => `${item.productName} (${item.quantity})`).join('; ')
  }));
  const salesSheet = XLSX.utils.json_to_sheet(salesData);
  XLSX.utils.book_append_sheet(workbook, salesSheet, 'Ventas');
  
  // Hoja de compras
  const purchasesData = purchases.map(purchase => ({
    'ID': purchase.id,
    'Fecha': purchase.date,
    'Proveedor': purchase.supplierName,
    'Total': purchase.total,
    'Estado': purchase.status,
    'Productos': purchase.items.map(item => `${item.productName} (${item.quantity})`).join('; ')
  }));
  const purchasesSheet = XLSX.utils.json_to_sheet(purchasesData);
  XLSX.utils.book_append_sheet(workbook, purchasesSheet, 'Compras');
  
  // Generar archivo
  XLSX.writeFile(workbook, 'reporte_completo_minierp.xlsx');
};