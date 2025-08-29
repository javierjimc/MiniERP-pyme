import {Customer, Product, Purchase, Supplier} from "@prisma/client";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";

export interface Sale {
    id: number;
    productId: number;
    customerId: number;
    quantity: number;
    total: number;
    date: string;
}
export type PurchaseStatus = 'pending' | 'received' | 'cancelled';

interface DataContextType {
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
    updateCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: number) => Promise<void>;

    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getLowStockProducts: () => Product[];

    suppliers: Supplier[];
    addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
    updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;

    purchases: Purchase[];
    addPurchase: (purchase: Omit<Purchase, 'id' | 'date'>) => Promise<void>;
    updatePurchaseStatus: (id: string, status: PurchaseStatus) => Promise<void>;

    sales: Sale[];
    addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
    getTopProducts: () => Array<{ product: Product; sold: number }>;
    getTopCustomers: () => Array<{ id: number; name: string; phone?: string; totalPurchases: number }>;
    getMonthlySales: () => Array<{ month: string; sales: number }>;

    error: string | null;
}
const apiUrl = import.meta.env.VITE_API_URL;
const DataContext = createContext<DataContextType | undefined>(undefined);
export function DataProvider({ children }: { children: ReactNode }) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customersRes = await fetch(`${apiUrl}/api/customers`);
                if (!customersRes.ok) throw new Error('Error al cargar clientes');
                const customersData = await customersRes.json();
                setCustomers(customersData);
            } catch (err) {
                console.error(err);
                setError(prev => prev ? prev + ' | No se pudieron cargar los clientes' : 'No se pudieron cargar los clientes');
            }

            try {
                const productsRes = await fetch(`${apiUrl}/api/products`);
                if (!productsRes.ok) throw new Error('Error al cargar productos');
                const productsData = await productsRes.json();
                setProducts(productsData);
            } catch (err) {
                console.error(err);
                setError(prev => prev ? prev + ' | No se pudieron cargar los productos' : 'No se pudieron cargar los productos');
            }

            try {
                const suppliersRes = await fetch(`${apiUrl}/api/suppliers`);
                if (!suppliersRes.ok) throw new Error('Error al cargar proveedores');
                const suppliersData = await suppliersRes.json();
                setSuppliers(suppliersData);
            } catch (err) {
                console.error(err);
                setError(prev => prev ? prev + ' | No se pudieron cargar los proveedores' : 'No se pudieron cargar los proveedores');
            }

            try {
                const purchasesRes = await fetch(`${apiUrl}/api/purchases`);
                if (!purchasesRes.ok) throw new Error('Error al cargar compras');
                const purchasesData = await purchasesRes.json();
                setPurchases(purchasesData);
            } catch (err) {
                console.error(err);
                setError(prev => prev ? prev + ' | No se pudieron cargar las compras' : 'No se pudieron cargar las compras');
            }

            try {
                const salesRes = await fetch(`${apiUrl}/api/sales`);
                if (!salesRes.ok) throw new Error('Error al cargar ventas');
                const salesData = await salesRes.json();
                setSales(salesData);
            } catch (err) {
                console.error(err);
                setError(prev => prev ? prev + ' | No se pudieron cargar las ventas' : 'No se pudieron cargar las ventas');
            }
        };

        fetchData();
    }, [apiUrl]);


    // --- Funciones estadísticas ---
    const getTopProducts = () => {
        const productMap: { [id: number]: { product: Product; sold: number } } = {};
        sales.forEach(sale => {
            const product = products.find(p => p.id === sale.productId);
            if (product) {
                if (!productMap[product.id]) {
                    productMap[product.id] = { product, sold: 0 };
                }
                productMap[product.id].sold += sale.quantity;
            }
        });
        return Object.values(productMap)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);
    };

    const getTopCustomers = () => {
        const customerMap: { [id: number]: { id: number; name: string; phone?: string; totalPurchases: number } } = {};
        sales.forEach(sale => {
            const customer = customers.find(c => c.id === sale.customerId);
            if (customer) {
                if (!customerMap[customer.id]) {
                    customerMap[customer.id] = { id: customer.id, name: customer.name, phone: customer.phone, totalPurchases: 0 };
                }
                customerMap[customer.id].totalPurchases += sale.total;
            }
        });
        return Object.values(customerMap)
            .sort((a, b) => b.totalPurchases - a.totalPurchases)
            .slice(0, 5);
    };

    const getMonthlySales = () => {
        const months: { [key: string]: number } = {};
        sales.forEach(sale => {
            const date = new Date(sale.date);
            const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            months[month] = (months[month] || 0) + sale.total;
        });
        return Object.entries(months)
            .map(([month, sales]) => ({ month, sales }))
            .sort((a, b) => a.month.localeCompare(b.month));
    };

    const addCustomer = async (customer: Omit<Customer, 'id'>) => {
        try {
            const res = await fetch(`${apiUrl}/api/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customer),
            });
            if (!res.ok) throw new Error();
            const newCustomer: Customer = await res.json();
            setCustomers(prev => [...prev, newCustomer]);
            setError(null);
        } catch {
            setError('No se pudo crear el cliente');
        }
    };

    const updatePurchaseStatus = async (id: string, status: PurchaseStatus) => {
        try {
            const res = await fetch(`${apiUrl}/api/datasets/purchases/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error();
            const updated: Purchase = await res.json();
            setPurchases(prev => prev.map(p => (p.id === id ? updated : p)));
            setError(null);
        } catch {
            setError('No se pudo actualizar el estado de la compra');
        }
    };
// Actualizar un cliente
    const updateCustomer = async (id: number, customer: Partial<Customer>) => {
        try {
            const res = await fetch(`${apiUrl}/api/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customer),
            });
            if (!res.ok) throw new Error();
            const updatedCustomer: Customer = await res.json();
            setCustomers(prev => prev.map(c => (c.id === id ? updatedCustomer : c)));
            setError(null);
        } catch {
            setError('No se pudo actualizar el cliente');
        }
    };

// Eliminar un cliente
    const deleteCustomer = async (id: number) => {
        try {
            const res = await fetch(`${apiUrl}/api/customers/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error();
            setCustomers(prev => prev.filter(c => c.id !== id));
            setError(null);
        } catch {
            setError('No se pudo eliminar el cliente');
        }
    };

// Agregar un producto
    const addProduct = async (product: Omit<Product, 'id'>) => {
        try {
            const res = await fetch(`${apiUrl}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            if (!res.ok) throw new Error();
            const newProduct: Product = await res.json();
            setProducts(prev => [...prev, newProduct]);
            setError(null);
        } catch {
            setError('No se pudo crear el producto');
        }
    };

// Actualizar un producto
    const updateProduct = async (id: number, product: Partial<Product>) => {
        try {
            const res = await fetch(`${apiUrl}/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            if (!res.ok) throw new Error();
            const updatedProduct: Product = await res.json();
            setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
            setError(null);
        } catch {
            setError('No se pudo actualizar el producto');
        }
    };

// Eliminar un producto
    const deleteProduct = async (id: number) => {
        try {
            const res = await fetch(`${apiUrl}/api/products/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error();
            setProducts(prev => prev.filter(p => p.id !== id));
            setError(null);
        } catch {
            setError('No se pudo eliminar el producto');
        }
    };

// Obtener productos con stock bajo
    const getLowStockProducts = () => {
        return products.filter(p => p.stock <= p.minStock);
    };

// Agregar una compra
    const addPurchase = async (purchase: Omit<Purchase, 'id' | 'date'>) => {
        try {
            const res = await fetch(`${apiUrl}/api/purchases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchase),
            });
            if (!res.ok) throw new Error();
            const newPurchase: Purchase = await res.json();
            setPurchases(prev => [...prev, newPurchase]);
            setError(null);
        } catch {
            setError('No se pudo crear la compra');
        }
    };
    // Agregar un proveedor
    const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
        try {
            const res = await fetch(`${apiUrl}/api/suppliers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(supplier),
            });
            if (!res.ok) throw new Error();
            const newSupplier: Supplier = await res.json();
            setSuppliers(prev => [...prev, newSupplier]);
            setError(null);
        } catch {
            setError('No se pudo crear el proveedor');
        }
    };

// Actualizar un proveedor
    const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
        try {
            const res = await fetch(`${apiUrl}/api/suppliers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(supplier),
            });
            if (!res.ok) throw new Error();
            const updatedSupplier: Supplier = await res.json();
            setSuppliers(prev => prev.map(s => (s.id === id ? updatedSupplier : s)));
            setError(null);
        } catch {
            setError('No se pudo actualizar el proveedor');
        }
    };

// Eliminar un proveedor
    const deleteSupplier = async (id: string) => {
        try {
            const res = await fetch(`${apiUrl}/api/suppliers/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error();
            setSuppliers(prev => prev.filter(s => s.id !== id));
            setError(null);
        } catch {
            setError('No se pudo eliminar el proveedor');
        }
    };

    const addSale = async (sale: Omit<Sale, 'id'>) => {
        try {
            const res = await fetch(`${apiUrl}/api/sales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sale),
            });
            if (!res.ok) throw new Error();
            const newSale: Sale = await res.json();
            setSales(prev => [...prev, newSale]);
            setError(null);
        } catch {
            setError('No se pudo crear la venta');
        }
    };

    return (
        <DataContext.Provider value={{
            //CUSTOMERS
            customers,
            addCustomer,
            updateCustomer,
            deleteCustomer,
            //PRODUCTS
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            getLowStockProducts,
            //SUPPLIERS
            suppliers,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            //PURCHASES
            purchases,
            addPurchase,
            updatePurchaseStatus,
            //SALES
            sales,
            addSale,
            //STATS
            getTopProducts,
            getTopCustomers,
            getMonthlySales,
            error,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData debe usarse dentro de un DataProvider");
    }
    return context;
};