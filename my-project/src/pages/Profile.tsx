/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom'; 
import { removeFromLiked,addProductToCart, removeFromCart, addSellingProduct, removeFromSelling} from '../store/userSlice';
import { addProduct } from '../store/marketSlice';

import { useDispatch } from 'react-redux'; 


const ProfilePage = () => {
  const userInfo = useSelector((state: RootState) => state.user);
  const [isTransactionsOpen, setTransactionsOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSellingOpen, setSellingOpen] = useState(false);
  const [isLikedOpen, setLikedOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const handleAddToCart = (product: object, index: number) => {
    const productCopy = { ...product }; 
    dispatch(addProductToCart(productCopy));
    dispatch(removeFromLiked(index)); 
  };

  const handleRemoveFromCart = (index: number) => {
    dispatch(removeFromCart(index)); 
  };

  const handleRemoveFromLiked = (index: number) => {
    dispatch(removeFromLiked(index)); 
  };
  const handleRemoveFromSelling = (index: number) => {
    dispatch(removeFromSelling(index)); 
  };

  const handleAddSellingProduct = (product:any) => {
    const productCopy = { ...product }; 
    dispatch(addSellingProduct(productCopy)); 
    dispatch(addProduct(product));
  };

  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    if (section === 'transactions') {
      setTransactionsOpen(!isTransactionsOpen);
    } else if (section === 'cart') {
      setCartOpen(!isCartOpen);
    } else if (section === 'selling') {
      setSellingOpen(!isSellingOpen);
    } else if (section === 'liked') {
      setLikedOpen(!isLikedOpen);
    }
  };

  const goToCart = () => {
    navigate('/cart'); 
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center mb-8">
        <img
          src={userInfo.profile.profilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-indigo-500 mr-6"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{userInfo.profile.name}</h1>
          <p className="text-gray-600">Email: {userInfo.profile.emailAddress}</p>
          <p className="text-gray-600">Contact No: {userInfo.profile.contactNo}</p>
        </div>
      </div>

<div className="bg-white p-6 rounded-lg shadow-lg mb-6">
  <button
    onClick={() => toggleSection('transactions')}
    className="w-full text-left text-2xl font-semibold text-indigo-600 py-3 border-b border-gray-200 hover:bg-gray-50 focus:outline-none"
  >
    Transaction History
  </button>
  {isTransactionsOpen && (
    <ul className="mt-4 list-disc pl-5">
      {userInfo.transactions.map((transaction, index) => (
        <li key={index} className="text-gray-700 mb-4">
          <div className="font-semibold">{transaction.type}</div>
          <div className="text-sm text-gray-500">
            <strong>User Address:</strong> {transaction.userAddress}
          </div>
          <div className="text-sm text-gray-500">
            <strong>Action:</strong> {transaction.action}
          </div>
          <div className="text-sm text-gray-500">
            <strong>Product:</strong> {transaction.product || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            <strong>Timestamp:</strong> {new Date(transaction.timestamp).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <button
          onClick={() => toggleSection('liked')}
          className="w-full text-left text-2xl font-semibold text-indigo-600 py-3 border-b border-gray-200 hover:bg-gray-50 focus:outline-none"
        >
          Liked Products
        </button>
        {isLikedOpen && (
          <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {userInfo.likedProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.photoUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3> 
                {product.category && (
      <p className="product-category">
        <strong>Category:</strong> {product.category}
      </p>
    )}
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-900 font-bold">${product.price}</p>
               
    
                <button
                  onClick={() => handleAddToCart(product, index)} 
                  className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 focus:outline-none"
                >
                  Add to Cart
                </button>
    
                <button
                  onClick={() => handleRemoveFromLiked(index)} 
                  className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
  )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <button
          onClick={() => toggleSection('cart')}
          className="w-full text-left text-2xl font-semibold text-indigo-600 py-3 border-b border-gray-200 hover:bg-gray-50 focus:outline-none"
        >
          Your Cart
        </button>
        {isCartOpen && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {userInfo.cart.map((product, index) => (
  <div
    key={index}
    className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
  >
    <img
      src={product.photoUrl}
      alt={product.name}
      className="w-full h-48 object-cover rounded-lg mb-4"
    />
    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3> 
       {product.category && (
      <p className="product-category">
        <strong>Category:</strong> {product.category}
      </p>
    )}
    <p className="text-gray-600">{product.description}</p>
    <p className="text-gray-900 font-bold">${product.price}</p>


    <button
      onClick={() => handleRemoveFromCart(index)} 
      className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 focus:outline-none"
    >
      Remove
    </button>
  </div>
))}

            </div>
            <button
              onClick={goToCart} 
              className="mt-6 w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Go to Cart
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <button
          onClick={() => toggleSection('selling')}
          className="w-full text-left text-2xl font-semibold text-indigo-600 py-3 border-b border-gray-200 hover:bg-gray-50 focus:outline-none"
        >
          Selling Products
        </button>
        {isSellingOpen && (
          <div>
            

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {userInfo.sellingProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                  {product.category && (
      <p className="product-category">
        <strong>Category:</strong> {product.category}
      </p>
    )}
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-gray-900 font-bold">${product.price}</p>
                  
                  <button
                  onClick={() => handleRemoveFromSelling(index)} 
                  className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 focus:outline-none"
                >
                  Remove Sell
                </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(true)} 
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none mb-6"
            >
              Add Product
            </button>
          </div>
        )}
      </div>

{isModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement; 

          const newProduct = {
            name: form.name.value, 
            price: parseFloat(form.price.value),
            photoUrl: form.photoUrl.value,
            description: form.description.value,
            keywords: form.keywords.value.split(','),
            category: form.category.value, 
          };

          handleAddSellingProduct(newProduct);
          setModalOpen(false);
        }}
      >

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Product Name</label>
          <input
            type="text"
            name="name"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Price</label>
          <input
            type="number"
            name="price"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Photo URL</label>
          <input
            type="text"
            name="photoUrl"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <textarea
            name="description"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Keywords</label>
          <input
            type="text"
            name="keywords"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter keywords separated by commas"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Category</label>
          <select
            name="category"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Furniture">Furniture</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  </div>
)}

  </div>
)}


  
export default ProfilePage;
