import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  name: string;
  price: number;
  photoUrl: string;
  description: string;
  category: string;
  keywords: string[];
}

interface MarketState {
  products: Product[];
}

const initialState: MarketState = {
  products: [
    {
      name: 'Product 1',
      price: 100,
      photoUrl: 'https://via.placeholder.com/150',
      description: 'Description of Product 1',
      category: 'Electronics',
      keywords: ['gadget', 'technology'],
    },
    {
      name: 'Product 2',
      price: 50,
      photoUrl: 'https://via.placeholder.com/150',
      description: 'Description of Product 2',
      category: 'Clothing',
      keywords: ['fashion', 'style'],
    },
    {
      name: 'Product 3',
      price: 200,
      photoUrl: 'https://via.placeholder.com/150',
      description: 'Description of Product 3',
      category: 'Furniture',
      keywords: ['home', 'furniture'],
    },
  ],
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((product) => product.name !== action.payload);
    },
  },
});

export const { addProduct, removeProduct } = marketSlice.actions;
export default marketSlice.reducer;
