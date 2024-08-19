// definitions.ts

// Enum for Role
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    DELIVERY = 'DELIVERY',
}

export interface User {
    id: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthDate: string;
    role: Role;
    cart: Cart[];
    customerOrders: Order[];
    agentOrders: Order[];
    address: Address[];
    branches: Branch[];
    createdAt: Date;
    updatedAt: Date;
}

// Interface for Branch
export interface Branch {
    id: number;
    ownerFullName: string;
    ownerNatCode: string;
    ownerPhone: string;
    ownerState: string;
    ownerCity: string;
    ownerRegion: string;
    ownerAddress: string;
    ownerType: string;
    placeArea: string;
    placeAge: number;
    verification: boolean;
    kitchen: boolean;
    parking: boolean;
    store: boolean;
    image: string;
    worktime: string;
    tel: string[];
    food: Food[];
}

// Interface for Food
export interface Food {
    id: number;
    name: string;
    description: string;
    rateStar: number;
    mainPrice: string;
    discountPrice: string;
    discountPercent: string;
    favorite: boolean;
    score: number;
    branchId: number;
    cartId: number;
}

// Interface for Cart
export interface Cart {
    id: number;
    userId: number;
    foods: Food[];
    status: boolean;
    orders: Order[];
}

// Interface for Order
export interface Order {
    id: number;
    addressId: number;
    customerId: number;
    agentId: number;
    cartId: number;
}

// Interface for Address
export interface Address {
    id: number;
    order: Order[];
    type: string;
    phone: string;
    fullAddress: string;
    ownerId: number;
}
