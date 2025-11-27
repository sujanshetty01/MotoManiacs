import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/storeService';
import { Product } from '../types';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        setLoading(true);
        try {
            const data = await getProductById(productId);
            setProduct(data);
            if (data && data.images.length > 0) {
                setSelectedImage(data.images[0]);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            // Optional: Show a toast or notification
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
                <Button onClick={() => navigate('/store')}>Back to Store</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
            <div className="container mx-auto px-6">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="mb-8"
                    onClick={() => navigate('/store')}
                >
                    ← Back to Store
                </Button>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Gallery */}
                        <div className="p-6 lg:p-12 bg-gray-100 dark:bg-gray-900/50">
                            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-white dark:bg-gray-800 shadow-sm">
                                <img 
                                    src={selectedImage || 'https://via.placeholder.com/600x600?text=No+Image'} 
                                    alt={product.title} 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            {product.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === img 
                                                    ? 'border-red-600 ring-2 ring-red-600/20' 
                                                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-6 lg:p-12 flex flex-col">
                            <div className="mb-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    {product.categories.map(cat => (
                                        <span key={cat} className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded uppercase tracking-wider">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                                
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {product.title}
                                </h1>

                                <div className="flex items-baseline gap-4 mb-6">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {product.compareAtPrice && (
                                        <span className="text-xl text-gray-500 line-through">
                                            ${product.compareAtPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                <div className="prose dark:prose-invert max-w-none mb-8 text-gray-600 dark:text-gray-300">
                                    <p>{product.description}</p>
                                </div>

                                {product.specifications && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Specifications</h3>
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                            {Object.entries(product.specifications).map(([key, value]) => (
                                                <div key={key}>
                                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{key}</dt>
                                                    <dd className="text-sm text-gray-900 dark:text-white mt-1">{value}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 w-full sm:w-auto">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-3 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                                            {quantity}
                                        </span>
                                        <button 
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <Button 
                                        onClick={handleAddToCart}
                                        className="flex-grow flex justify-center items-center gap-2 py-3"
                                        disabled={product.inventory === 0}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </Button>
                                </div>
                                {product.inventory < 10 && product.inventory > 0 && (
                                    <p className="text-red-600 text-sm mt-2 font-medium">
                                        Only {product.inventory} left in stock!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
