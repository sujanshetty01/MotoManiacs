import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getProductsByCategory } from '../services/storeService';
import { Product } from '../types';
import Button from '../components/Button';

const StorePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<string[]>(['All']);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const allProducts = await getAllProducts();
            setProducts(allProducts);
            
            // Extract unique categories
            const uniqueCategories = Array.from(new Set(allProducts.flatMap(p => p.categories)));
            setCategories(['All', ...uniqueCategories]);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.categories.includes(selectedCategory);
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Motorsports Superstore</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gear up with the best equipment for track and street.</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-col sm:flex-row gap-4">
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                selectedCategory === category 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredProducts.map(product => (
                                    <Link key={product.id} to={`/store/${product.id}`} className="group">
                                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                            <div className="relative aspect-square overflow-hidden">
                                                <img 
                                                    src={product.images[0] || 'https://via.placeholder.com/400x400?text=No+Image'} 
                                                    alt={product.title} 
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                                        SALE
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex-grow flex flex-col">
                                                <div className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wider">
                                                    {product.categories[0]}
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors">
                                                    {product.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                                                    {product.shortDescription || product.description}
                                                </p>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                        {product.compareAtPrice && (
                                                            <span className="text-sm text-gray-500 line-through">
                                                                ${product.compareAtPrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Button size="sm" variant="secondary">View</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or category filter.</p>
                                <Button 
                                    className="mt-6" 
                                    onClick={() => {
                                        setSelectedCategory('All');
                                        setSearchQuery('');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StorePage;
