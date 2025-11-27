import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { db } from '../firebaseConfig';
import { getStorage } from 'firebase/storage';
import {
    CampusRegistration,
    TalentSubmission,
    ReviewTask,
    SubmissionStatus,
} from '../types';

// Initialize Firebase Storage
const storage = getStorage();

// Collection names
const CAMPUS_REGISTRATIONS_COLLECTION = 'campusRegistrations';
const TALENT_SUBMISSIONS_COLLECTION = 'talentSubmissions';
const REVIEW_TASKS_COLLECTION = 'reviewTasks';

// ============================================
// Campus Registrations
// ============================================

/**
 * Create a new campus registration
 */
export const createCampusRegistration = async (
    registration: Omit<CampusRegistration, 'id' | 'submittedAt' | 'status'>
): Promise<CampusRegistration> => {
    try {
        const registrationsRef = collection(db, CAMPUS_REGISTRATIONS_COLLECTION);
        const docRef = await addDoc(registrationsRef, {
            ...registration,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        });

        return {
            id: docRef.id,
            ...registration,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error creating campus registration:', error);
        throw new Error('Failed to submit campus registration');
    }
};

/**
 * Get all campus registrations (admin only)
 */
export const getAllCampusRegistrations = async (): Promise<CampusRegistration[]> => {
    try {
        const registrationsRef = collection(db, CAMPUS_REGISTRATIONS_COLLECTION);
        const q = query(registrationsRef, orderBy('submittedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const registrations: CampusRegistration[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            registrations.push({
                id: doc.id,
                ...data,
            } as CampusRegistration);
        });

        return registrations;
    } catch (error) {
        console.error('Error getting campus registrations:', error);
        throw new Error('Failed to load campus registrations');
    }
};

/**
 * Get campus registration by ID
 */
export const getCampusRegistrationById = async (
    id: string
): Promise<CampusRegistration | null> => {
    try {
        const registrationRef = doc(db, CAMPUS_REGISTRATIONS_COLLECTION, id);
        const docSnap = await getDoc(registrationRef);

        if (!docSnap.exists()) {
            return null;
        }

        return { id: docSnap.id, ...docSnap.data() } as CampusRegistration;
    } catch (error) {
        console.error('Error getting campus registration:', error);
        throw new Error('Failed to load campus registration');
    }
};

/**
 * Update campus registration status
 */
export const updateCampusRegistrationStatus = async (
    id: string,
    status: SubmissionStatus,
    adminNotes?: string,
    reviewedBy?: string
): Promise<void> => {
    try {
        const registrationRef = doc(db, CAMPUS_REGISTRATIONS_COLLECTION, id);
        await updateDoc(registrationRef, {
            status,
            adminNotes: adminNotes || '',
            reviewedBy: reviewedBy || '',
            reviewedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating campus registration status:', error);
        throw new Error('Failed to update campus registration status');
    }
};

// ============================================
// Talent Submissions
// ============================================

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
    file: File,
    path: string
): Promise<string> => {
    try {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
    }
};

/**
 * Create a new talent submission
 */
export const createTalentSubmission = async (
    submission: Omit<TalentSubmission, 'id' | 'submittedAt' | 'status'>,
    resumeFile: File,
    videoFile?: File
): Promise<TalentSubmission> => {
    try {
        // Upload resume
        const resumePath = `talent-submissions/${Date.now()}_${resumeFile.name}`;
        const resumeUrl = await uploadFile(resumeFile, resumePath);

        // Upload video if provided
        let videoUrl: string | undefined;
        if (videoFile) {
            const videoPath = `talent-submissions/${Date.now()}_${videoFile.name}`;
            videoUrl = await uploadFile(videoFile, videoPath);
        }

        // Create submission document
        const submissionsRef = collection(db, TALENT_SUBMISSIONS_COLLECTION);
        const docRef = await addDoc(submissionsRef, {
            ...submission,
            resumeUrl,
            demoVideoUrl: videoUrl || submission.demoVideoUrl || '',
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        });

        return {
            id: docRef.id,
            ...submission,
            resumeUrl,
            demoVideoUrl: videoUrl || submission.demoVideoUrl,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error creating talent submission:', error);
        throw new Error('Failed to submit talent application');
    }
};

/**
 * Get all talent submissions (admin only)
 */
export const getAllTalentSubmissions = async (): Promise<TalentSubmission[]> => {
    try {
        const submissionsRef = collection(db, TALENT_SUBMISSIONS_COLLECTION);
        const q = query(submissionsRef, orderBy('submittedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const submissions: TalentSubmission[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            submissions.push({
                id: doc.id,
                ...data,
            } as TalentSubmission);
        });

        return submissions;
    } catch (error) {
        console.error('Error getting talent submissions:', error);
        throw new Error('Failed to load talent submissions');
    }
};

/**
 * Get talent submission by ID
 */
export const getTalentSubmissionById = async (
    id: string
): Promise<TalentSubmission | null> => {
    try {
        const submissionRef = doc(db, TALENT_SUBMISSIONS_COLLECTION, id);
        const docSnap = await getDoc(submissionRef);

        if (!docSnap.exists()) {
            return null;
        }

        return { id: docSnap.id, ...docSnap.data() } as TalentSubmission;
    } catch (error) {
        console.error('Error getting talent submission:', error);
        throw new Error('Failed to load talent submission');
    }
};

/**
 * Update talent submission status
 */
export const updateTalentSubmissionStatus = async (
    id: string,
    status: SubmissionStatus,
    adminNotes?: string,
    reviewedBy?: string
): Promise<void> => {
    try {
        const submissionRef = doc(db, TALENT_SUBMISSIONS_COLLECTION, id);
        await updateDoc(submissionRef, {
            status,
            adminNotes: adminNotes || '',
            reviewedBy: reviewedBy || '',
            reviewedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating talent submission status:', error);
        throw new Error('Failed to update talent submission status');
    }
};

// ============================================
// Review Tasks
// ============================================

/**
 * Create a review task
 */
export const createReviewTask = async (
    task: Omit<ReviewTask, 'id' | 'createdAt' | 'status'>
): Promise<ReviewTask> => {
    try {
        const tasksRef = collection(db, REVIEW_TASKS_COLLECTION);
        const docRef = await addDoc(tasksRef, {
            ...task,
            status: 'Open',
            createdAt: new Date().toISOString(),
        });

        return {
            id: docRef.id,
            ...task,
            status: 'Open',
            createdAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error creating review task:', error);
        throw new Error('Failed to create review task');
    }
};

/**
 * Get all review tasks
 */
export const getAllReviewTasks = async (): Promise<ReviewTask[]> => {
    try {
        const tasksRef = collection(db, REVIEW_TASKS_COLLECTION);
        const q = query(tasksRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const tasks: ReviewTask[] = [];
        querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() } as ReviewTask);
        });

        return tasks;
    } catch (error) {
        console.error('Error getting review tasks:', error);
        throw new Error('Failed to load review tasks');
    }
};

/**
 * Update review task status
 */
export const updateReviewTaskStatus = async (
    id: string,
    status: 'Open' | 'InProgress' | 'Completed',
    notes?: string
): Promise<void> => {
    try {
        const taskRef = doc(db, REVIEW_TASKS_COLLECTION, id);
        const updateData: any = {
            status,
            notes: notes || '',
        };

        if (status === 'Completed') {
            updateData.completedAt = new Date().toISOString();
        }

        await updateDoc(taskRef, updateData);
    } catch (error) {
        console.error('Error updating review task status:', error);
        throw new Error('Failed to update review task status');
    }
};
