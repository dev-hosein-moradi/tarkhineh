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