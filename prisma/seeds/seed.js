// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed de datos...");

    // ---- Clientes ----
    await prisma.customer.createMany({
        data: [
            { name: "Juan Pérez", email: "juan@example.com", phone: "987654321", address: "Av. Siempre Viva 123" },
            { name: "María López", email: "maria@example.com", phone: "912345678", address: "Calle Falsa 456" },
            { name: "Carlos Díaz", email: "carlos@example.com", phone: "998877665", address: "Pasaje Central 789" },
        ],
    });

    // ---- Proveedores ----
    const supplier1 = await prisma.supplier.create({
        data: {
            name: "Distribuidora Norte",
            email: "proveedor1@example.com",
            phone: "900111222",
            address: "Av. Industrial 45",
        },
    });

    const supplier2 = await prisma.supplier.create({
        data: {
            name: "Mayorista Sur",
            email: "proveedor2@example.com",
            phone: "900333444",
            address: "Camino Rural 77",
        },
    });

    // ---- Productos ----
    await prisma.product.createMany({
        data: [
            { name: "Laptop", category: "Electrónica", price: 800.0, stock: 20, minStock: 5, supplierId: supplier1.id },
            { name: "Teclado", category: "Accesorios", price: 25.0, stock: 50, minStock: 10, supplierId: supplier1.id },
            { name: "Silla Oficina", category: "Muebles", price: 120.0, stock: 15, minStock: 3, supplierId: supplier2.id },
            { name: "Monitor 24\"", category: "Electrónica", price: 200.0, stock: 30, minStock: 5, supplierId: supplier2.id },
        ],
    });

    // Obtenemos productos y clientes para relaciones
    const allProducts = await prisma.product.findMany();
    const allCustomers = await prisma.customer.findMany();

    // ---- Compras ----
    await prisma.purchase.createMany({
        data: [
            { productId: allProducts[0].id, customerId: allCustomers[0].id, quantity: 2 },
            { productId: allProducts[1].id, customerId: allCustomers[1].id, quantity: 5 },
            { productId: allProducts[2].id, customerId: allCustomers[2].id, quantity: 1 },
        ],
    });

    // ---- Ventas ----
    await prisma.sale.createMany({
        data: [
            { productId: allProducts[0].id, customerId: allCustomers[1].id, quantity: 1 },
            { productId: allProducts[1].id, customerId: allCustomers[2].id, quantity: 3 },
            { productId: allProducts[3].id, customerId: allCustomers[0].id, quantity: 2 },
        ],
    });

    console.log("✅ Seed completado con éxito!");
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
