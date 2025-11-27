import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { User } from '../types';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Firestore collection name for user roles
const USERS_COLLECTION = 'users';

/**
 * Get user role from Firestore
 */
export const getUserRole = async (uid: string): Promise<'user' | 'admin'> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role || 'user'; // Default to 'user' if role is not set
    } else {
      // If user document doesn't exist, create one with default 'user' role
      await setDoc(userDocRef, {
        role: 'user',
        createdAt: serverTimestamp(),
      });
      return 'user';
    }
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user'; // Default to 'user' on error
  }
};

/**
 * Set user role in Firestore (admin only operation)
 */
export const setUserRole = async (uid: string, role: 'user' | 'admin'): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userDocRef, {
      role,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error setting user role:', error);
    throw new Error('Failed to set user role');
  }
};

/**
 * Convert Firebase User to app User type
 */
export const firebaseUserToAppUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const role = await getUserRole(firebaseUser.uid);
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    role,
  };
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return await firebaseUserToAppUser(userCredential.user);
  } catch (error: any) {
    console.error('Sign in error:', error);
    let errorMessage = 'Failed to sign in. Please try again.';

    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.';
    }

    throw new Error(errorMessage);
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create user document in Firestore with default 'user' role
    const userDocRef = doc(db, USERS_COLLECTION, userCredential.user.uid);
    await setDoc(userDocRef, {
      email: userCredential.user.email,
      role: 'user',
      createdAt: serverTimestamp(),
    });

    return await firebaseUserToAppUser(userCredential.user);
  } catch (error: any) {
    console.error('Sign up error:', error);
    let errorMessage = 'Failed to create account. Please try again.';

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    }

    throw new Error(errorMessage);
  }
};


/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    // Check if user exists in Firestore, if not create it
    const userDocRef = doc(db, USERS_COLLECTION, userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: userCredential.user.email,
        role: 'user',
        createdAt: serverTimestamp(),
      });
    }

    return await firebaseUserToAppUser(userCredential.user);
  } catch (error: any) {
    console.error('Google sign in error:', error);
    let errorMessage = 'Failed to sign in with Google. Please try again.';

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked. Please allow popups and try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled. Please try again.';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email. Please sign in with your email and password.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for OAuth operations. Please add it to the Firebase Console.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Google Sign-In is not enabled. Please enable it in the Firebase Console.';
    }

    throw new Error(errorMessage);
  }
};

/**
 * Sign out
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const appUser = await firebaseUserToAppUser(firebaseUser);
        callback(appUser);
      } catch (error) {
        console.error('Error converting Firebase user:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

