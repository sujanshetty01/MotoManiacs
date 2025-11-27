import React from 'react';
import { useCart } from '../context/CartContext';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const CartDrawer: React.FC = () => {
    const { 
        cart, 
        isCartOpen, 
        toggleCart, 
        removeFromCart, 
        updateQuantity, 
        cartTotal 
    } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
                onClick={toggleCart}
            ></div>
            
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col h-full transform transition-transform duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shopping Cart</h2>
                        <button 
                            type="button" 
                            className="text-gray-400 hover:text-gray-500"
                            onClick={toggleCart}
                        >
                            <span className="sr-only">Close panel</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Your cart is empty.</p>
                                <Button 
                                    className="mt-6" 
                                    onClick={() => {
                                        toggleCart();
                                        navigate('/store');
                                    }}
                                >
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                                {cart.map((item) => (
                                    <li key={item.productId} className="py-6 flex">
                                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                                            <img
                                                src={item.product.images[0] || 'https://via.placeholder.com/150'}
                                                alt={item.product.title}
                                                className="w-full h-full object-center object-cover"
                                            />
                                        </div>

                                        <div className="ml-4 flex-1 flex flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                    <h3>
                                                        <a href={`#/store/${item.productId}`}>{item.product.title}</a>
                                                    </h3>
                                                    <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.product.brand}</p>
                                            </div>
                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                                                    <button 
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 py-1 text-gray-900 dark:text-white">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="font-medium text-red-600 hover:text-red-500"
                                                    onClick={() => removeFromCart(item.productId)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                                <p>Subtotal</p>
                                <p>${cartTotal.toFixed(2)}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <Button className="w-full flex justify-center py-3 text-lg" onClick={() => alert('Checkout flow coming soon!')}>
                                Checkout
                            </Button>
                            <div className="mt-6 flex justify-center text-sm text-center text-gray-500 dark:text-gray-400">
                                <p>
                                    or{' '}
                                    <button
                                        type="button"
                                        className="text-red-600 font-medium hover:text-red-500"
                                        onClick={toggleCart}
                                    >
                                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
