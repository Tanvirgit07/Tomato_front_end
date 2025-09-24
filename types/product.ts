export interface Category {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  publicId: string;
  category: Category;
  subCategory: SubCategory;
  status: string,
  // reviews: any[];
  // comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse {
  success: boolean;
  count: number;
  data: Product[];
}
