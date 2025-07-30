export interface IBranch {
  id: string;
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
  name: string;
  title: string;
  address: string;
  workTime: string;
  tel: [string];
}

export interface ICategory {
  id: string;
  name: string;
  title: string;
  image: string
}

export interface IFood {
  id?: string;
  name: string;
  compounds: string;
  type: string;
  tag: string;
  rate: number;
  percentOfDiscount: number;
  discountPrice: string;
  mainPrice: string;
  isFavorite: boolean;
  numOfScore: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICart {
  id: String,
  foodId: String,
  customerId: String,
  deliverId: String,
  branchId: String,
  price: String,
  payment: Boolean,
  status: String,
}

export interface CartFood extends IFood {
  quantity: number
}

export interface IAddress {
  id: string,
  title: string,
  tel: string,
  content: string,
  userId: string,
  isReciver: Boolean
}

export interface IOrder {
  id: string;
  userId: string;
  foods: { id: string; quantity: number }[];
  status: string;
  userAddress: string;
  price: string;
  discount: string;
  time: string;
  deliverType: string;
  paymentType: string;
  branchId: string;
}

export interface IAccompanimentCategory {
  id?: string;
  name: string;
  title: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAccompaniment {
  id?: string;
  name: string;
  categoryId: string;
  category?: IAccompanimentCategory;
  price: string;
  image?: string;
  description?: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber: string;
  type: UserType;
  role: UserRole;
  branchId?: string;
  branch?: IBranch;
  permissions: IUserPermission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserPermission {
  id: string;
  userId: string;
  permission: PermissionType;
  branchId?: string;
  branch?: IBranch;
  createdAt: string;
  updatedAt: string;
}

export enum UserType {
  user = "user",
  admin = "admin",
  manager = "manager",
  staff = "staff",
}

export enum UserRole {
  customer = "customer",
  staff = "staff",
  branchManager = "branchManager",
  admin = "admin",
  superAdmin = "superAdmin",
}

export enum PermissionType {
  // Food Management
  MANAGE_FOODS = "MANAGE_FOODS",
  VIEW_FOODS = "VIEW_FOODS",

  // Branch Management
  MANAGE_BRANCHES = "MANAGE_BRANCHES",
  VIEW_BRANCHES = "VIEW_BRANCHES",
  MANAGE_OWN_BRANCH = "MANAGE_OWN_BRANCH",

  // Order Management
  MANAGE_ORDERS = "MANAGE_ORDERS",
  VIEW_ORDERS = "VIEW_ORDERS",
  MANAGE_BRANCH_ORDERS = "MANAGE_BRANCH_ORDERS",

  // User Management
  MANAGE_USERS = "MANAGE_USERS",
  VIEW_USERS = "VIEW_USERS",
  MANAGE_BRANCH_STAFF = "MANAGE_BRANCH_STAFF",

  // Accompaniment Management
  MANAGE_ACCOMPANIMENTS = "MANAGE_ACCOMPANIMENTS",
  VIEW_ACCOMPANIMENTS = "VIEW_ACCOMPANIMENTS",

  // Category Management
  MANAGE_CATEGORIES = "MANAGE_CATEGORIES",
  VIEW_CATEGORIES = "VIEW_CATEGORIES",

  // Reports and Analytics
  VIEW_REPORTS = "VIEW_REPORTS",
  VIEW_BRANCH_REPORTS = "VIEW_BRANCH_REPORTS",

  // System Settings
  MANAGE_SYSTEM_SETTINGS = "MANAGE_SYSTEM_SETTINGS",

  // Cart Management
  MANAGE_CARTS = "MANAGE_CARTS",
  VIEW_CARTS = "VIEW_CARTS",
}