// seed.ts

import { PrismaClient } from '@prisma/client';
import { User, Role, Branch, Food, Cart, Order, Address } from '@/app/lib/definitions';
import { users, roles, branches, foods, carts, orders, addresses } from '@/constants/index';

const prisma = new PrismaClient();
async function seedUsers() {
    try {
        await Promise.all(
            users.map(async (userData) => {
                const { id, email, password, firstname, lastname, phone, birthDate, role, cart, customerOrders, agentOrders, address, branches, createdAt, updatedAt } = userData;

                await prisma.user.create({
                    data: {
                        id,
                        email,
                        password,
                        firstname,
                        lastname,
                        phone,
                        birthDate,
                        role: role as Role,
                        cart: {
                            create: cart,
                        },
                        customerOrders: {
                            create: customerOrders.map(order => ({
                                ...order,
                                agent: {
                                    connect: { id: order.agentId }
                                },
                                cart: {
                                    connect: { id: order.cartId }
                                },
                                address: {
                                    connect: { id: order.addressId }
                                }
                            })),
                        },
                        agentOrders: {
                            create: agentOrders.map(order => ({
                                ...order,
                                customer: {
                                    connect: { id: order.customerId }
                                },
                                cart: {
                                    connect: { id: order.cartId }
                                },
                                address: {
                                    connect: { id: order.addressId }
                                }
                            })),
                        },
                        address: {
                            connect: address.map(addr => ({ id: addr.id })),
                        },
                        branches: {
                            connect: branches.map(branch => ({ id: branch.id })),
                        },
                        createdAt,
                        updatedAt,
                    },
                });
            })
        );

        console.log('Users seeded successfully.');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
}


async function seedCarts() {
    try {
        await Promise.all(
            carts.map(async (cart: Cart) => {
                await prisma.cart.create({
                    data: {
                        ...cart,
                        user: {
                            connect: { id: cart.userId }
                        },
                        foods: {
                            create: cart.foods.map((food: Food) => ({
                                ...food,
                                branch: {
                                    connect: { id: food.branchId }
                                }
                            }))
                        },
                        orders: {
                            connect: cart.orders.map((order: Order) => ({ id: order.id }))
                        }
                    },
                });
            })
        );

        console.log('Carts seeded successfully.');
    } catch (error) {
        console.error('Error seeding carts:', error);
    }
}
