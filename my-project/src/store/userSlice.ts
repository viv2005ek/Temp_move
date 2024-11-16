import { createSlice } from '@reduxjs/toolkit';

interface Product {
  name: string;
  price: number;
  isLiked: boolean;
  photoUrl: string;
  isInCart: boolean;
  description: string;
  keywords: string[];
  quantity?: number;
  category?: string;
}

interface Transaction {
  type: string;
  userAddress: string;
  timestamp: string;  
  product: string;  
  action: string;
}

interface UserProfile {
  profilePic: string;
  name: string;
  contactNo: string;
  emailAddress: string;
}

interface UserState {
  profile: UserProfile;
  transactions: Transaction[];
  likedProducts: Product[];
  cart: Product[];
  sellingProducts: Product[];
}

const initialState: UserState = {
  profile: {
    profilePic: 'https://randomuser.me/api/portraits/men/10.jpg',
    name: 'John Doe',
    contactNo: '123-456-7890',
    emailAddress: 'viv2005ek@gmail.com',
  },
  transactions: [],
  likedProducts: [
    {
      name: 'Product 1',
      price: 100,
      isLiked: true,
      photoUrl: 'https://via.placeholder.com/150',
      isInCart: false,
      description: 'This is product 1 description.',
      keywords: ['keyword1', 'keyword2'],
    },
  ],
  cart: [
    {
      name: 'Product 2',
      price: 50,
      isLiked: false,
      photoUrl: 'https://via.placeholder.com/150',
      isInCart: true,
      description: 'This is product 2 description.',
      keywords: ['keyword3', 'keyword4'],
      quantity: 1,
    },
  ],
  sellingProducts: [
    {
      name: 'Product 3',
      price: 200,
      isLiked: false,
      photoUrl: 'https://via.placeholder.com/150',
      isInCart: false,
      description: 'This is product 3 description.',
      keywords: ['keyword5', 'keyword6'],
    },
  ],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.profile = action.payload;
      state.transactions.unshift({
        type: 'Profile Updated',
        userAddress: state.profile.emailAddress,  
        timestamp: new Date().toISOString(),
        product: 'N/A', 
        action: 'Update Profile',
      });
    },
    addTransaction(state, action) {
      state.transactions.unshift(action.payload);
    },
    addLikedProduct(state, action) {
      state.likedProducts.push(action.payload);
      state.transactions.unshift({
        type: 'Added to Liked Products',
        userAddress: state.profile.emailAddress,
        timestamp: new Date().toISOString(),
        product: action.payload.name,
        action: 'Add to Liked',
      });
    },
    addProductToCart(state, action) {
      state.cart.push(action.payload);
      state.transactions.unshift({
        type: 'Added to Cart',
        userAddress: state.profile.emailAddress,
        timestamp: new Date().toISOString(),
        product: action.payload.name,
        action: 'Add to Cart',
      });
    },

    addSellingProduct(state, action) {
      state.sellingProducts.push(action.payload);
      state.transactions.unshift({
        type: 'Added to Selling Products',
        userAddress: state.profile.emailAddress,
        timestamp: new Date().toISOString(),
        product: action.payload.name,
        action: 'Add to Selling',
      });
    },
    updateQuantity(state, action) {
      const { index, quantity } = action.payload;
      const product = state.cart[index];
      if (product && quantity >= 1) {
        product.quantity = quantity;
        state.transactions.unshift({
          type: 'Updated Cart Quantity',
          userAddress: state.profile.emailAddress,
          timestamp: new Date().toISOString(),
          product: product.name,
          action: 'Update Quantity',
        });
      }
    },
    removeFromCart: (state, action) => {
      const removedProduct = state.cart[action.payload];
      state.cart = state.cart.filter((_, index) => index !== action.payload);
      state.transactions.unshift({
        type: 'Removed from Cart',
        userAddress: state.profile.emailAddress,
        timestamp: new Date().toISOString(),
        product: removedProduct.name,
        action: 'Remove from Cart',
      });
    },

    removeFromLiked: (state, action) => {
      const removedProduct = state.likedProducts[action.payload];
      state.likedProducts = state.likedProducts.filter((_, index) => index !== action.payload);
      state.transactions.unshift({
        type: 'Removed from Liked Products',
        userAddress: state.profile.emailAddress,
        timestamp: new Date().toISOString(),
        product: removedProduct.name,
        action: 'Remove from Liked',
      });
    },
    removeFromSelling: (state, action) => {
      const removedProduct = state.sellingProducts[action.payload];
      state.sellingProducts = state.sellingProducts.filter((_, index) => index !== action.payload);
      state.transactions.unshift({
        type: 'Removed from Selling Products',
        userAddress: state.profile.emailAddress,
        timestamp: new Date().toISOString(),
        product: removedProduct.name,
        action: 'Remove from Selling',
      });
    },

    clearCart(state) {
      const clearedCart = state.cart;
      state.cart = [];
      clearedCart.forEach(product => {
        state.transactions.unshift({
          type: 'Ordered Cart',
          userAddress: state.profile.emailAddress,
          timestamp: new Date().toISOString(),
          product: product.name,
          action: 'Clear Cart',
        });
      });
    },
  },

});

export const {
  setUserProfile,
  addTransaction,
  addLikedProduct,
  addProductToCart,
  addSellingProduct,
  updateQuantity,
  removeFromCart,
  removeFromLiked,
  clearCart,
  removeFromSelling
} = userSlice.actions;

export default userSlice.reducer;
