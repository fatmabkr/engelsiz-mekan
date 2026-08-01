import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Venue, Review, CommunityPost } from '../types';

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
