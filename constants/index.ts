// placeholder-data.ts

import { Role, Branch, Food, Cart, Order, Address, User } from '@/app/lib/definitions';

// Placeholder data for Role enum
const roles: Role[] = [Role.USER, Role.ADMIN, Role.DELIVERY];

const users: User[] = [
    {
        id: 1,
        email: 'john.doe@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        phone: '+1234567890',
        birthDate: '1990-01-01',
        role: Role.USER,
        cart: [], // You can add logic to populate carts, orders, etc.
        customerOrders: [],
        agentOrders: [],
        address: [],
        branches: [], // Assuming you connect branches later
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Placeholder data for Branches
const branches: Branch[] = [
    {
        id: 1,
        ownerFullName: 'John Doe',
        ownerNatCode: '1234567890',
        ownerPhone: '+1234567890',
        ownerState: 'California',
        ownerCity: 'Los Angeles',
        ownerRegion: 'Downtown',
        ownerAddress: '123 Main St',
        ownerType: 'Restaurant',
        placeArea: '200 sq ft',
        placeAge: 5,
        verification: true,
        kitchen: true,
        parking: true,
        store: true,
        image: 'branch1.jpg',
        worktime: '8:00 AM - 10:00 PM',
        tel: ['+1234567890'],
        food: [],
    },
    // Add more branches as needed
];

// Placeholder data for Foods
const foods: Food[] = [
    {
        id: 1,
        name: 'Pizza',
        description: 'Delicious pizza with various toppings',
        rateStar: 4.5,
        mainPrice: '$10.99',
        discountPrice: '$8.99',
        discountPercent: '20%',
        favorite: true,
        score: 100,
        branchId: 1,
        cartId: 1,
    },
    // Add more foods as needed
];

// Placeholder data for Carts
const carts: Cart[] = [
    {
        id: 1,
        userId: 1,
        foods: [],
        status: true,
        orders: [],
    },
    // Add more carts as needed
];

// Placeholder data for Orders
const orders: Order[] = [
    {
        id: 1,
        addressId: 1,
        customerId: 1,
        agentId: 2,
        cartId: 1,
    },
    // Add more orders as needed
];

// Placeholder data for Addresses
const addresses: Address[] = [
    {
        id: 1,
        order: [],
        type: 'Home',
        phone: '+1234567890',
        fullAddress: '456 Elm St, Los Angeles, CA',
        ownerId: 1,
    },
    // Add more addresses as needed
];

export { roles, branches, foods, carts, orders, addresses, users };
