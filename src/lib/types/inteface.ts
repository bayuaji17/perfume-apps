type ConcentrationType = "edp" | "edt" | "edc";
type GenderCategory = "female" | "male" | "unisex";
type NoteRole = "top" | "middle" | "base";
type LinkType = "shopee" | "tokopedia" | "lazada" | "whatsapp" | "tiktok";
type LinkStatus = "active" | "archive";
export interface Brands {
  id: string;
  name: string;
}
export interface PerfumeImage {
  id: string;
  imageUrl: string;
  displayOrder: number;
  perfumeId: string;
}

export interface PerfumeNote {
  id: string;
  perfumeId: string;
  role: NoteRole;
  description: string;
}

export interface Perfumes {
  id: string;
  name: string;
  description: string;
  concentration: ConcentrationType;
  sizeML: number;
  price: string;
  brandId: string;
  gender: GenderCategory;
  createdAt: string;
  updatedAt: string;
  brand: Brands;
  images: PerfumeImage[];
  notes: PerfumeNote[];
  checkoutLinks: CheckoutLink[];
}

export interface CheckoutLink {
  id: string;
  perfumeId: string;
  platform: LinkType;
  link: string;
  status: LinkStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Params {
  page?: number;
  currentPage: number;
  pageSize: number;
  search?: string;
}

export interface ErrorResponse {
  error: string;
  success: boolean;
}
