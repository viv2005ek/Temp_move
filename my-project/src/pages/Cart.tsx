/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateQuantity, removeFromCart, clearCart } from '../store/userSlice';

const CartPage = () => {
  const cart = useSelector((state: RootState) => state.user.cart);
  const userEmail = useSelector((state: RootState) => state.user.profile.emailAddress);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const baseUrl = 'http://localhost:8000';

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);
  };

  const calculateGST = (amount: number) => {
    return (amount * 3) / 100; // 3% GST
  };

  const total = calculateTotal();
  const gst = calculateGST(total);
  const grandTotal = total + gst;

  const sendEmail = async () => {
    const billDetails = cart.map(
      (product) =>
        `Product: ${product.name}, Quantity: ${product.quantity}, Price: $${(product.price * (product.quantity || 1)).toFixed(2)}`
    );

    const dataToSend = {
      email: userEmail,
      subject: 'Your Order Bill',
      message: `Thank you for your purchase!\n\nHere are the details of your order:\n\n${billDetails.join(
        '\n'
      )}\n\nTotal: $${total.toFixed(2)}\nGST (3%): $${gst.toFixed(2)}\nGrand Total: $${grandTotal.toFixed(2)}`,
    };

    try {
      await fetch(`${baseUrl}/email/sendEmail`, {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      alert('Failed to send email. Please try again.');
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    dispatch(clearCart());  
    sendEmail();
  };

  const updateProductQuantity = (index: number, change: number) => {
    const product = cart[index];
    const newQuantity = (product.quantity || 1) + change;

    if (newQuantity > 1) {
      dispatch(updateQuantity({ index, quantity: newQuantity }));
    } else if (newQuantity === 1) {
      dispatch(updateQuantity({ index, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(index));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>

      <div className="space-y-6">
        {cart.length > 0 ? (
          cart.map((product, index) => (
            <div key={index} className="flex items-center border-b pb-4">
              <img
                src={product.photoUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{product.name}</h3>
                {product.category && (
      <p className="product-category">
        <strong>Category:</strong> {product.category}
      </p>
    )}
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-gray-900 font-semibold">
                  ${product.price} × {product.quantity || 1} = $$
                  {(product.price * (product.quantity || 1)).toFixed(2)}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => updateProductQuantity(index, -1)}
                    disabled={product.quantity === 1}
                  >
                    -
                  </button>
                  <span className="text-lg">{product.quantity || 1}</span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => updateProductQuantity(index, 1)}
                  >
                    +
                  </button>
                  {product.quantity === 1 && (
                    <button
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => dispatch(removeFromCart(index))}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {cart.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total Amount:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>GST (3%):</span>
            <span>${gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Grand Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <button
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-md font-semibold"
            onClick={() => setShowModal(true)}
          >
            Buy Now
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Your Bill</h2>
            <ul className="mb-6 space-y-4">
              {cart.map((product, index) => (
                <li key={index} className="flex justify-between">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-gray-500 text-sm">Quantity: {product.quantity}</p>
                  </div>
                  <p>${(product.price * (product.quantity || 1)).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>GST (3%):</span>
                <span>${gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Grand Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleConfirm}
              >
                Send Bill & Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
