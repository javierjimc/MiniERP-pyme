import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- CRUD Clientes ---
app.get("/api/customers", async (req, res) => {
    const customers = await prisma.customer.findMany();
    res.json(customers);
});

app.post("/api/customers", async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {
        const newCustomer = await prisma.customer.create({
            data: { name, email, phone, address },
        });
        res.json(newCustomer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    try {
        const updatedCustomer = await prisma.customer.update({
            where: { id: Number(id) },
            data: { name, email, phone, address },
        });
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.customer.delete({ where: { id: Number(id) } });
        res.json({ message: "Cliente eliminado" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- CRUD Proveedores ---
app.get("/api/suppliers", async (req, res) => {
    const suppliers = await prisma.supplier.findMany({ include: { products: true } });
    res.json(suppliers);
});

app.post("/api/suppliers", async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {
        const newSupplier = await prisma.supplier.create({
            data: { name, email, phone, address },
        });
        res.json(newSupplier);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/api/suppliers/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    try {
        const updatedSupplier = await prisma.supplier.update({
            where: { id: Number(id) },
            data: { name, email, phone, address },
        });
        res.json(updatedSupplier);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/suppliers/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.supplier.delete({ where: { id: Number(id) } });
        res.json({ message: "Proveedor eliminado" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- CRUD Productos ---
app.get("/api/products", async (req, res) => {
    const products = await prisma.product.findMany({ include: { supplier: true } });
    res.json(products);
});

app.post("/api/products", async (req, res) => {
    const { name, price, stock, minStock, category, supplierId } = req.body;
    try {
        const newProduct = await prisma.product.create({
            data: { name, price, stock, minStock, category, supplierId },
        });
        res.json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, minStock, category, supplierId } = req.body;
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: { name, price, stock, minStock, category, supplierId },
        });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id: Number(id) } });
        res.json({ message: "Producto eliminado" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- CRUD Compras ---
app.get("/api/purchases", async (req, res) => {
    const purchases = await prisma.purchase.findMany({
        include: { product: true, customer: true },
    });
    res.json(purchases);
});

app.post("/api/purchases", async (req, res) => {
    const { productId, customerId, quantity } = req.body;
    try {
        const newPurchase = await prisma.purchase.create({
            data: { productId, customerId, quantity },
        });
        res.json(newPurchase);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/purchases/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.purchase.delete({ where: { id: Number(id) } });
        res.json({ message: "Compra eliminada" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- CRUD Ventas ---
app.get("/api/sales", async (req, res) => {
    const sales = await prisma.sale.findMany({
        include: { product: true, customer: true },
    });
    res.json(sales);
});

app.post("/api/sales", async (req, res) => {
    const { productId, customerId, quantity } = req.body;
    try {
        const newSale = await prisma.sale.create({
            data: { productId, customerId, quantity },
        });
        res.json(newSale);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/sales/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.sale.delete({ where: { id: Number(id) } });
        res.json({ message: "Venta eliminada" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 API corriendo en http://localhost:${PORT}`));