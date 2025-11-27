import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Product, Order } from '../types';

// Collection names
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

// ============================================
// Products
// ============================================

/**
 * Get all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const q = query(productsRef, orderBy('title', 'asc'));
        const querySnapshot = await getDocs(q);

        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() } as Product);
        });

        return products;
    } catch (error) {
        console.error('Error getting products:', error);
        throw new Error('Failed to load products');
    }
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, id);
        const docSnap = await getDoc(productRef);

        if (!docSnap.exists()) {
            return null;
        }

        return { id: docSnap.id, ...docSnap.data() } as Product;
    } catch (error) {
        console.error('Error getting product:', error);
        throw new Error('Failed to load product');
    }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const q = query(
            productsRef,
            where('categories', 'array-contains', category),
            orderBy('title', 'asc')
        );
        const querySnapshot = await getDocs(q);

        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() } as Product);
        });

        return products;
    } catch (error) {
        console.error('Error getting products by category:', error);
        throw new Error('Failed to load products');
    }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limitCount: number = 6): Promise<Product[]> => {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const q = query(
            productsRef,
            where('featured', '==', true),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);

        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() } as Product);
        });

        return products;
    } catch (error) {
        console.error('Error getting featured products:', error);
        throw new Error('Failed to load featured products');
    }
};

/**
 * Search products by title
 */
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
    try {
        // Note: For production, consider using Algolia or similar for better search
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const querySnapshot = await getDocs(productsRef);

        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
            const product = { id: doc.id, ...doc.data() } as Product;
            if (
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                products.push(product);
            }
        });

        return products;
    } catch (error) {
        console.error('Error searching products:', error);
        throw new Error('Failed to search products');
    }
};

/**
 * Create a new product (admin only)
 */
export const createProduct = async (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> => {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const docRef = await addDoc(productsRef, {
            ...product,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return {
            id: docRef.id,
            ...product,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
    }
};

/**
 * Update an existing product (admin only)
 */
export const updateProduct = async (product: Product): Promise<void> => {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, product.id);
        const { id, createdAt, ...updateData } = product;
        await updateDoc(productRef, {
            ...updateData,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product');
    }
};

/**
 * Delete a product (admin only)
 */
export const deleteProduct = async (productId: string): Promise<void> => {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        await deleteDoc(productRef);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product');
    }
};

/**
 * Update product inventory
 */
export const updateProductInventory = async (
    productId: string,
    quantityChange: number
): Promise<void> => {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            throw new Error('Product not found');
        }

        const currentInventory = productSnap.data().inventory || 0;
        const newInventory = currentInventory + quantityChange;

        if (newInventory < 0) {
            throw new Error('Insufficient inventory');
        }

        await updateDoc(productRef, {
            inventory: newInventory,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating product inventory:', error);
        throw new Error('Failed to update product inventory');
    }
};

// ============================================
// Orders
// ============================================

/**
 * Create a new order
 */
export const createOrder = async (
    order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Order> => {
    try {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const docRef = await addDoc(ordersRef, {
            ...order,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Update inventory for each item
        for (const item of order.items) {
            await updateProductInventory(item.productId, -item.quantity);
        }

        return {
            id: docRef.id,
            ...order,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
    }
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const q = query(
            ordersRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const orders: Order[] = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() } as Order);
        });

        return orders;
    } catch (error) {
        console.error('Error getting user orders:', error);
        throw new Error('Failed to load orders');
    }
};

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async (): Promise<Order[]> => {
    try {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const orders: Order[] = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() } as Order);
        });

        return orders;
    } catch (error) {
        console.error('Error getting all orders:', error);
        throw new Error('Failed to load orders');
    }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        const docSnap = await getDoc(orderRef);

        if (!docSnap.exists()) {
            return null;
        }

        return { id: docSnap.id, ...docSnap.data() } as Order;
    } catch (error) {
        console.error('Error getting order:', error);
        throw new Error('Failed to load order');
    }
};

/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (
    orderId: string,
    status: Order['status']
): Promise<void> => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        throw new Error('Failed to update order status');
    }
};
