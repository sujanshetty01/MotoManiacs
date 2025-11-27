import React, { useState, useEffect } from 'react';
import { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../services/storeService';
import { Product } from '../types';
import Button from './Button';
import InputField from './InputField';
import TextAreaField from './TextAreaField';

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        title: '',
        price: 0,
        compareAtPrice: 0,
        inventory: 0,
        description: '',
        categories: [],
        images: [],
        sku: '',
        brand: '',
        featured: false
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ 
                ...product,
                images: product.images || [],
                categories: product.categories || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                title: '',
                price: 0,
                compareAtPrice: 0,
                inventory: 0,
                description: '',
                categories: [],
                images: [],
                sku: '',
                brand: '',
                featured: false
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleArrayInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'categories' | 'images') => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
            } else {
                // Ensure required fields are present
                if (!formData.title || !formData.price || !formData.sku) {
                    alert('Please fill in all required fields');
                    return;
                }
                await createProduct(formData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h2>
                <Button onClick={() => handleOpenModal()}>Add New Product</Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {products.map((product) => (
                            <li key={product.id}>
                                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                                            <img 
                                                className="h-16 w-16 object-cover" 
                                                src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                                                alt={product.title} 
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-lg font-medium text-red-600 truncate">{product.title}</div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="mr-4">SKU: {product.sku}</span>
                                                <span className="mr-4">Price: ${product.price}</span>
                                                <span className={`${product.inventory < 10 ? 'text-red-500 font-bold' : ''}`}>
                                                    Stock: {product.inventory}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleOpenModal(product)}>Edit</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {products.length === 0 && (
                            <li className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                No products found. Add one to get started.
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseModal}></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <InputField
                                                label="Product Title"
                                                name="title"
                                                value={formData.title as string}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <InputField
                                            label="SKU"
                                            name="sku"
                                            value={formData.sku as string}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <InputField
                                            label="Brand"
                                            name="brand"
                                            value={formData.brand as string}
                                            onChange={handleInputChange}
                                        />

                                        <InputField
                                            label="Price ($)"
                                            name="price"
                                            type="number"
                                            value={formData.price as number}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <InputField
                                            label="Compare at Price ($)"
                                            name="compareAtPrice"
                                            type="number"
                                            value={formData.compareAtPrice as number}
                                            onChange={handleInputChange}
                                        />

                                        <InputField
                                            label="Inventory"
                                            name="inventory"
                                            type="number"
                                            value={formData.inventory as number}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <TextAreaField
                                                label="Description"
                                                name="description"
                                                value={formData.description as string}
                                                onChange={handleInputChange}
                                                required
                                                rows={4}
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputField
                                                label="Categories (comma separated)"
                                                name="categories"
                                                value={(formData.categories as string[])?.join(', ') || ''}
                                                onChange={(e) => handleArrayInput(e, 'categories')}
                                                placeholder="Helmets, Gloves, Safety"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputField
                                                label="Image URLs (comma separated)"
                                                name="images"
                                                value={(formData.images as string[])?.join(', ') || ''}
                                                onChange={(e) => handleArrayInput(e, 'images')}
                                                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                            />
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <input
                                                id="featured"
                                                name="featured"
                                                type="checkbox"
                                                checked={formData.featured}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                                Featured Product
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <Button type="submit" className="w-full sm:w-auto sm:ml-3">
                                        Save
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="secondary" 
                                        className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
