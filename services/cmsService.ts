import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
    CMSPage,
    EcosystemSegment,
    VisionMission,
    InstitutionCard,
} from '../types';

// Collection names
const PAGES_COLLECTION = 'pages';
const ECOSYSTEM_SEGMENTS_COLLECTION = 'ecosystemSegments';
const VISION_MISSION_COLLECTION = 'visionMission';
const INSTITUTION_CARDS_COLLECTION = 'institutionCards';

// ============================================
// CMS Pages
// ============================================

/**
 * Get all CMS pages
 */
export const getAllPages = async (): Promise<CMSPage[]> => {
    try {
        const pagesRef = collection(db, PAGES_COLLECTION);
        const q = query(pagesRef, orderBy('title', 'asc'));
        const querySnapshot = await getDocs(q);

        const pages: CMSPage[] = [];
        querySnapshot.forEach((doc) => {
            pages.push({ id: doc.id, ...doc.data() } as CMSPage);
        });

        return pages;
    } catch (error) {
        console.error('Error getting CMS pages:', error);
        throw new Error('Failed to load CMS pages');
    }
};

/**
 * Get a single CMS page by slug
 */
export const getPageBySlug = async (slug: string): Promise<CMSPage | null> => {
    try {
        const pagesRef = collection(db, PAGES_COLLECTION);
        const q = query(pagesRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as CMSPage;
    } catch (error) {
        console.error('Error getting CMS page:', error);
        throw new Error('Failed to load CMS page');
    }
};

/**
 * Create a new CMS page
 */
export const createPage = async (page: Omit<CMSPage, 'id'>): Promise<CMSPage> => {
    try {
        const pagesRef = collection(db, PAGES_COLLECTION);
        const docRef = await addDoc(pagesRef, {
            ...page,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return {
            id: docRef.id,
            ...page,
        };
    } catch (error) {
        console.error('Error creating CMS page:', error);
        throw new Error('Failed to create CMS page');
    }
};

/**
 * Update an existing CMS page
 */
export const updatePage = async (page: CMSPage): Promise<void> => {
    try {
        const pageRef = doc(db, PAGES_COLLECTION, page.id);
        const { id, createdAt, ...updateData } = page;
        await updateDoc(pageRef, {
            ...updateData,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating CMS page:', error);
        throw new Error('Failed to update CMS page');
    }
};

/**
 * Delete a CMS page
 */
export const deletePage = async (pageId: string): Promise<void> => {
    try {
        const pageRef = doc(db, PAGES_COLLECTION, pageId);
        await deleteDoc(pageRef);
    } catch (error) {
        console.error('Error deleting CMS page:', error);
        throw new Error('Failed to delete CMS page');
    }
};

// ============================================
// Ecosystem Segments
// ============================================

/**
 * Get all ecosystem segments (ordered)
 */
export const getEcosystemSegments = async (): Promise<EcosystemSegment[]> => {
    try {
        const segmentsRef = collection(db, ECOSYSTEM_SEGMENTS_COLLECTION);
        const q = query(segmentsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);

        const segments: EcosystemSegment[] = [];
        querySnapshot.forEach((doc) => {
            segments.push({ id: doc.id, ...doc.data() } as EcosystemSegment);
        });

        return segments;
    } catch (error) {
        console.error('Error getting ecosystem segments:', error);
        throw new Error('Failed to load ecosystem segments');
    }
};

/**
 * Create a new ecosystem segment
 */
export const createEcosystemSegment = async (
    segment: Omit<EcosystemSegment, 'id'>
): Promise<EcosystemSegment> => {
    try {
        const segmentsRef = collection(db, ECOSYSTEM_SEGMENTS_COLLECTION);
        const docRef = await addDoc(segmentsRef, segment);

        return {
            id: docRef.id,
            ...segment,
        };
    } catch (error) {
        console.error('Error creating ecosystem segment:', error);
        throw new Error('Failed to create ecosystem segment');
    }
};

/**
 * Update an ecosystem segment
 */
export const updateEcosystemSegment = async (segment: EcosystemSegment): Promise<void> => {
    try {
        const segmentRef = doc(db, ECOSYSTEM_SEGMENTS_COLLECTION, segment.id);
        const { id, ...updateData } = segment;
        await updateDoc(segmentRef, updateData);
    } catch (error) {
        console.error('Error updating ecosystem segment:', error);
        throw new Error('Failed to update ecosystem segment');
    }
};

/**
 * Delete an ecosystem segment
 */
export const deleteEcosystemSegment = async (segmentId: string): Promise<void> => {
    try {
        const segmentRef = doc(db, ECOSYSTEM_SEGMENTS_COLLECTION, segmentId);
        await deleteDoc(segmentRef);
    } catch (error) {
        console.error('Error deleting ecosystem segment:', error);
        throw new Error('Failed to delete ecosystem segment');
    }
};

// ============================================
// Vision & Mission
// ============================================

/**
 * Get vision & mission content
 */
export const getVisionMission = async (): Promise<VisionMission | null> => {
    try {
        const visionMissionRef = collection(db, VISION_MISSION_COLLECTION);
        const querySnapshot = await getDocs(visionMissionRef);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as VisionMission;
    } catch (error) {
        console.error('Error getting vision/mission:', error);
        throw new Error('Failed to load vision/mission');
    }
};

/**
 * Update vision & mission content
 */
export const updateVisionMission = async (
    visionMission: Omit<VisionMission, 'id' | 'updatedAt'>
): Promise<void> => {
    try {
        // Get the first document or create one
        const visionMissionRef = collection(db, VISION_MISSION_COLLECTION);
        const querySnapshot = await getDocs(visionMissionRef);

        const updateData = {
            ...visionMission,
            updatedAt: new Date().toISOString(),
        };

        if (querySnapshot.empty) {
            // Create new document
            await addDoc(visionMissionRef, updateData);
        } else {
            // Update existing document
            const docRef = doc(db, VISION_MISSION_COLLECTION, querySnapshot.docs[0].id);
            await updateDoc(docRef, updateData);
        }
    } catch (error) {
        console.error('Error updating vision/mission:', error);
        throw new Error('Failed to update vision/mission');
    }
};

// ============================================
// Institution Cards
// ============================================

/**
 * Get all institution cards (ordered)
 */
export const getInstitutionCards = async (): Promise<InstitutionCard[]> => {
    try {
        const cardsRef = collection(db, INSTITUTION_CARDS_COLLECTION);
        const q = query(cardsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);

        const cards: InstitutionCard[] = [];
        querySnapshot.forEach((doc) => {
            cards.push({ id: doc.id, ...doc.data() } as InstitutionCard);
        });

        return cards;
    } catch (error) {
        console.error('Error getting institution cards:', error);
        throw new Error('Failed to load institution cards');
    }
};

/**
 * Create a new institution card
 */
export const createInstitutionCard = async (
    card: Omit<InstitutionCard, 'id'>
): Promise<InstitutionCard> => {
    try {
        const cardsRef = collection(db, INSTITUTION_CARDS_COLLECTION);
        const docRef = await addDoc(cardsRef, card);

        return {
            id: docRef.id,
            ...card,
        };
    } catch (error) {
        console.error('Error creating institution card:', error);
        throw new Error('Failed to create institution card');
    }
};

/**
 * Update an institution card
 */
export const updateInstitutionCard = async (card: InstitutionCard): Promise<void> => {
    try {
        const cardRef = doc(db, INSTITUTION_CARDS_COLLECTION, card.id);
        const { id, ...updateData } = card;
        await updateDoc(cardRef, updateData);
    } catch (error) {
        console.error('Error updating institution card:', error);
        throw new Error('Failed to update institution card');
    }
};

/**
 * Delete an institution card
 */
export const deleteInstitutionCard = async (cardId: string): Promise<void> => {
    try {
        const cardRef = doc(db, INSTITUTION_CARDS_COLLECTION, cardId);
        await deleteDoc(cardRef);
    } catch (error) {
        console.error('Error deleting institution card:', error);
        throw new Error('Failed to delete institution card');
    }
};
