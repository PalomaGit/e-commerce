export interface Ingredient {
  id?: number;
  name: string;
  costPrice: number;
  currentStock: number;
  unit: string;
}

export interface ProductRecipe {
  id?: number;
  ingredient: Ingredient;
  quantity: number;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  recipes?: ProductRecipe[];
  calculatedCost?: number;
  profitMargin?: number;
}
