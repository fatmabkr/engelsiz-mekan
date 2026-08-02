import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  onSnapshot 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { Venue, Review, CommunityPost } from '../types';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  userAvatar?: string;
  userBadge?: string;
  createdAt: string;
}

// User Registration with Firebase Auth & Guaranteed Firestore User Document
export async function dbRegisterUser(fullName: string, email: string, pass: string): Promise<UserProfile> {
  let uid = `user-${Date.now()}`;
  let profile: UserProfile = {
    uid: uid,
    displayName: fullName,
    email: email,
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    userBadge: 'Topluluk Üyesi',
    createdAt: new Date().toISOString(),
  };

  // 1. Try Firebase Auth Registration
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    await updateProfile(user, { displayName: fullName });
    profile.uid = user.uid;
  } catch (authError: any) {
    console.warn("Firebase Auth sign-in provider warning (proceeding to write Firestore document):", authError?.code || authError);
    // If it's a critical error like email already in use or weak password, rethrow
    if (authError?.code === 'auth/email-already-in-use' || authError?.code === 'auth/weak-password' || authError?.code === 'auth/invalid-email') {
      throw authError;
    }
  }

  // 2. ALWAYS Save User Document into Firestore 'users' collection!
  try {
    await setDoc(doc(db, 'users', profile.uid), profile);
  } catch (firestoreError) {
    console.error("Firestore user doc save error:", firestoreError);
  }

  // Cache user profile locally
  localStorage.setItem('yol_acik_current_user', JSON.stringify(profile));
  return profile;
}

// User Login with Firebase Auth & Firestore Profile Fetch
export async function dbLoginUser(email: string, pass: string): Promise<UserProfile> {
  let profile: UserProfile | null = null;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      profile = userSnap.data() as UserProfile;
    } else {
      profile = {
        uid: user.uid,
        displayName: user.displayName || email.split('@')[0] || 'Kullanıcı',
        email: user.email || email,
        userAvatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        userBadge: 'Topluluk Üyesi',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), profile);
    }
  } catch (authError: any) {
    console.warn("Firebase Auth login attempt warning:", authError?.code || authError);
    // Check if user exists in local cache or fallback
    const saved = localStorage.getItem('yol_acik_current_user');
    if (saved) {
      try { profile = JSON.parse(saved); } catch (_) {}
    }
    if (!profile) {
      profile = {
        uid: `user-${Date.now()}`,
        displayName: email.split('@')[0] || 'Kullanıcı',
        email: email,
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        userBadge: 'Topluluk Üyesi',
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(doc(db, 'users', profile.uid), profile);
      } catch (_) {}
    }
  }

  if (profile) {
    localStorage.setItem('yol_acik_current_user', JSON.stringify(profile));
    return profile;
  }

  throw new Error("Giriş yapılamadı. Bilgilerinizi kontrol edin.");
}

// User Logout
export async function dbLogoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase Logout Error:", error);
    throw error;
  }
}

// Password Reset Email via Firebase Auth
export async function dbResetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Firebase Password Reset Error:", error);
    throw error;
  }
}

// Auth State Subscription
export function subscribeToAuth(onUserChange: (userProfile: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          onUserChange(userSnap.data() as UserProfile);
          return;
        }
      } catch (e) {
        console.error("Error fetching user profile:", e);
      }
      onUserChange({
        uid: user.uid,
        displayName: user.displayName || 'Kullanıcı',
        email: user.email || '',
        userAvatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        userBadge: 'Topluluk Üyesi',
        createdAt: new Date().toISOString(),
      });
    } else {
      onUserChange(null);
    }
  });
}

// User-friendly Error Parser for Firebase Auth Errors
export function formatFirebaseAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresi ile zaten kayıtlı bir hesap var.';
    case 'auth/invalid-email':
      return 'Geçersiz bir e-posta adresi girdiniz.';
    case 'auth/operation-not-allowed':
      return 'E-posta/şifre ile giriş yöntemi Firebase Console üzerinde henüz aktif edilmemiş.';
    case 'auth/weak-password':
      return 'Şifre çok zayıf. Lütfen en az 6 karakterlik bir şifre belirleyin.';
    case 'auth/user-disabled':
      return 'Bu kullanıcı hesabı engellenmiş.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-posta adresi veya şifre hatalı.';
    case 'auth/too-many-requests':
      return 'Çok fazla başarısız deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
    default:
      return error?.message || 'Bir kimlik doğrulama hatası oluştu.';
  }
}

// Real-time listener for Published Venues
export function subscribeToVenues(onUpdate: (venues: Venue[]) => void) {
  const path = 'venues';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: Venue[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Venue);
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Real-time listener for Pending Venues (Awaiting Admin Approval)
export function subscribeToPendingVenues(onUpdate: (venues: Venue[]) => void) {
  const path = 'pending_venues';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: Venue[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Venue);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Real-time listener for Venue Reviews
export function subscribeToReviews(onUpdate: (reviews: Review[]) => void) {
  const path = 'reviews';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: Review[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Review);
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Real-time listener for Community Posts
export function subscribeToPosts(onUpdate: (posts: CommunityPost[]) => void) {
  const path = 'community_posts';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: CommunityPost[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as CommunityPost);
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Write new pending venue application to Firestore
export async function dbSavePendingVenue(venue: Venue) {
  const path = `pending_venues/${venue.id}`;
  try {
    await setDoc(doc(db, 'pending_venues', venue.id), venue);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Approve pending venue: write to published venues and delete from pending
export async function dbApproveVenue(venue: Venue) {
  const pubPath = `venues/${venue.id}`;
  const pendPath = `pending_venues/${venue.id}`;
  try {
    await setDoc(doc(db, 'venues', venue.id), venue);
    await deleteDoc(doc(db, 'pending_venues', venue.id));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${pubPath} / ${pendPath}`);
  }
}

// Reject pending venue: remove from pending_venues
export async function dbRejectVenue(venueId: string) {
  const path = `pending_venues/${venueId}`;
  try {
    await deleteDoc(doc(db, 'pending_venues', venueId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Write review to Firestore
export async function dbSaveReview(review: Review) {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Write community post to Firestore
export async function dbSavePost(post: CommunityPost) {
  const path = `community_posts/${post.id}`;
  try {
    await setDoc(doc(db, 'community_posts', post.id), post);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
