import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Product, Customer, Supplier, Sale, Purchase } from '../context/DataContext-Legacy.tsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const addHeader = (doc: jsPDF, title: string) => {
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175); // Blue color
  doc.text('MiniERP PyME', 20, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(title, 20, 30);
  
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 40);
  
  // Add line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 45, 190, 45);
};

export const exportProductsToPDF = (products: Product[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte de Inventario');

  const tableData = products.map(product => [
    product.name,
    product.category,
    `$${product.price.toFixed(2)}`,
    product.stock.toString(),
    product.minStock.toString(),
    product.stock <= product.minStock ? 'BAJO' : 'NORMAL',
    product.supplier
  ]);

  // Calculate totals
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  doc.autoTable({
    head: [['Producto', 'Categoría', 'Precio', 'Stock', 'Mín', 'Estado', 'Proveedor']],
    body: tableData,
    startY: 55,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 64, 175] }
  });

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de Productos: ${totalProducts}`, 20, finalY);
  doc.text(`Valor Total del Stock: $${totalStockValue.toFixed(2)}`, 20, finalY + 8);
  doc.text(`Productos con Stock Bajo: ${lowStockCount}`, 20, finalY + 16);

  doc.save('inventario_productos.pdf');
};

export const exportCustomersToPDF = (customers: Customer[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte de Clientes (CRM)');

  const tableData = customers.map(customer => [
    customer.name,
    customer.email,
    customer.phone,
    customer.address,
    `$${customer.totalPurchases.toFixed(2)}`,
    customer.lastPurchase
  ]);

  // Calculate totals
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const avgPurchase = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  doc.autoTable({
    head: [['Cliente', 'Email', 'Teléfono', 'Dirección', 'Total Compras', 'Última Compra']],
    body: tableData,
    startY: 55,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [5, 150, 105] }
  });

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de Clientes: ${totalCustomers}`, 20, finalY);
  doc.text(`Facturación Total: $${totalRevenue.toFixed(2)}`, 20, finalY + 8);
  doc.text(`Compra Promedio por Cliente: $${avgPurchase.toFixed(2)}`, 20, finalY + 16);

  doc.save('clientes_crm.pdf');
};

export const exportSuppliersToPDF = (suppliers: Supplier[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte de Proveedores (SCM)');

  const tableData = suppliers.map(supplier => [
    supplier.name,
    supplier.email,
    supplier.phone,
    supplier.address,
    supplier.products.length.toString()
  ]);

  const totalSuppliers = suppliers.length;
  const totalProductsSupplied = suppliers.reduce((sum, s) => sum + s.products.length, 0);

  doc.autoTable({
    head: [['Proveedor', 'Email', 'Teléfono', 'Dirección', 'Productos']],
    body: tableData,
    startY: 55,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [234, 88, 12] }
  });

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de Proveedores: ${totalSuppliers}`, 20, finalY);
  doc.text(`Total de Productos Suministrados: ${totalProductsSupplied}`, 20, finalY + 8);

  doc.save('proveedores_scm.pdf');
};

export const exportSalesToPDF = (sales: Sale[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte de Ventas');

  const tableData = sales.map(sale => [
    sale.id,
    sale.date,
    sale.customerName,
    sale.items.length.toString(),
    `$${sale.total.toFixed(2)}`
  ]);

  // Calculate totals
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;
  const totalItemsSold = sales.reduce((sum, s) => sum + s.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  doc.autoTable({
    head: [['ID Venta', 'Fecha', 'Cliente', 'Items', 'Total']],
    body: tableData,
    startY: 55,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [147, 51, 234] }
  });

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de Ventas: ${totalSales}`, 20, finalY);
  doc.text(`Facturación Total: $${totalRevenue.toFixed(2)}`, 20, finalY + 8);
  doc.text(`Venta Promedio: $${avgSale.toFixed(2)}`, 20, finalY + 16);
  doc.text(`Total Items Vendidos: ${totalItemsSold}`, 20, finalY + 24);

  doc.save('reporte_ventas.pdf');
};

export const exportPurchasesToPDF = (purchases: Purchase[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte de Compras/Pedidos');

  const tableData = purchases.map(purchase => [
    purchase.id,
    purchase.date,
    purchase.supplierName,
    purchase.items.length.toString(),
    `$${purchase.total.toFixed(2)}`,
    purchase.status === 'pending' ? 'Pendiente' : 
    purchase.status === 'received' ? 'Recibido' : 'Cancelado'
  ]);

  // Calculate totals
  const totalPurchases = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + p.total, 0);
  const pendingPurchases = purchases.filter(p => p.status === 'pending').length;
  const receivedPurchases = purchases.filter(p => p.status === 'received').length;

  doc.autoTable({
    head: [['ID Pedido', 'Fecha', 'Proveedor', 'Items', 'Total', 'Estado']],
    body: tableData,
    startY: 55,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [20, 184, 166] }
  });

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de Pedidos: ${totalPurchases}`, 20, finalY);
  doc.text(`Monto Total Gastado: $${totalSpent.toFixed(2)}`, 20, finalY + 8);
  doc.text(`Pedidos Pendientes: ${pendingPurchases}`, 20, finalY + 16);
  doc.text(`Pedidos Recibidos: ${receivedPurchases}`, 20, finalY + 24);

  doc.save('reporte_compras.pdf');
};

export const exportComprehensivePDF = (
  products: Product[], 
  customers: Customer[], 
  suppliers: Supplier[], 
  sales: Sale[], 
  purchases: Purchase[]
) => {
  const doc = new jsPDF();
  addHeader(doc, 'Reporte Ejecutivo Completo');

  // Resumen ejecutivo
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalCustomers = customers.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalSuppliers = suppliers.length;
  const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('RESUMEN EJECUTIVO', 20, 60);

  doc.setFontSize(10);
  const summaryData = [
    ['INVENTARIO', ''],
    ['Total de Productos', totalProducts.toString()],
    ['Valor Total del Stock', `$${totalStockValue.toFixed(2)}`],
    ['Productos con Stock Bajo', lowStockCount.toString()],
    ['', ''],
    ['CLIENTES (CRM)', ''],
    ['Total de Clientes', totalCustomers.toString()],
    ['Facturación Total', `$${totalRevenue.toFixed(2)}`],
    ['', ''],
    ['PROVEEDORES (SCM)', ''],
    ['Total de Proveedores', totalSuppliers.toString()],
    ['Gasto Total en Compras', `$${totalPurchases.toFixed(2)}`],
    ['', ''],
    ['RENTABILIDAD', ''],
    ['Margen Bruto Estimado', `$${(totalRevenue - totalPurchases).toFixed(2)}`]
  ];

  doc.autoTable({
    body: summaryData,
    startY: 70,
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 60, halign: 'right' }
    },
    theme: 'plain'
  });

  doc.save('reporte_ejecutivo_completo.pdf');
};