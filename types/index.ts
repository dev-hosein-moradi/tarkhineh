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
  id: string
  name: string
  compounds: string
  type: string
  tag: string
  rate: number
  percentOfDiscount: number
  discountPrice: string
  mainPrice: string
  isFavorite: Boolean
  numOfScore: number
  image: string,
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
  title: String,
  tel: String,
  content: String,
  userId: String,
  isRevciver: Boolean
}