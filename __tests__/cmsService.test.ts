import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllPages, createPage } from '../services/cmsService';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    where: vi.fn(),
    serverTimestamp: vi.fn(),
    getFirestore: vi.fn(),
}));

vi.mock('../firebaseConfig', () => ({
    db: {},
}));

describe('cmsService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllPages', () => {
        it('should return all pages', async () => {
            const mockPages = [
                { id: '1', title: 'Page 1', slug: 'page-1' },
                { id: '2', title: 'Page 2', slug: 'page-2' },
            ];

            (getDocs as any).mockResolvedValue({
                forEach: (callback: any) => {
                    mockPages.forEach(page => callback({ id: page.id, data: () => page }));
                }
            });

            const pages = await getAllPages();
            expect(pages).toHaveLength(2);
            expect(pages[0].title).toBe('Page 1');
        });
    });

    describe('createPage', () => {
        it('should create a page', async () => {
            const newPage = {
                title: 'New Page',
                slug: 'new-page',
                sections: [],
                published: true,
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01'
            };

            (addDoc as any).mockResolvedValue({ id: 'new-id' });

            const result = await createPage(newPage);
            expect(result.id).toBe('new-id');
            expect(result.title).toBe('New Page');
        });
    });
});
