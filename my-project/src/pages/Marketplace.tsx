import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store'; 
import { addProductToCart, addLikedProduct } from '../store/userSlice'; 
import { Product } from '../store/marketSlice';

const MarketPlace = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.market.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]); 

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = category ? product.category === category : true;
    const matchesPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  const handleAddToCart = (product: Product) => {
    dispatch(addProductToCart(product)); 
  };

  // Handle adding product to liked list
  const handleAddToLiked = (product: Product) => {
    dispatch(addLikedProduct(product)); 
  };

  return (
    <div className="marketplace">
      {/* Filter Options */}
      <div className="filters mb-6">
        <input
          type="text"
          placeholder="Search by name or keywords"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar p-2 border border-gray-300 rounded-md"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-dropdown p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
        </select>
        <div className="price-range mt-4">
          <label>Price Range</label>
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="price-input p-2 border border-gray-300 rounded-md"
          />
          <span>to</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="price-input p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="product-list grid grid-cols-3 gap-6">
        {filteredProducts.map((product: Product) => (
          <div key={product.name} className="product-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img src={product.photoUrl} alt={product.name} className="product-image w-full h-48 object-cover rounded-md" />
            <div className="product-info mt-4">
              <h3 className="product-name text-lg font-semibold">{product.name}</h3>
              <p className="product-description text-gray-600">{product.description}</p>
              <p className="product-price text-xl font-bold">${product.price}</p>
              <p className="product-category text-sm text-gray-500">Category: {product.category}</p> {/* Display category */}
            </div>
            <div className="product-actions mt-4 flex justify-between">
              <button
                onClick={() => handleAddToCart(product)}
                className="add-to-cart bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleAddToLiked(product)}
                className="add-to-liked bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Add to Liked
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPlace;
