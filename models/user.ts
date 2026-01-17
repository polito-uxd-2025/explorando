import { ref, get } from 'firebase/database';
import { doc, getDoc, DocumentReference, collection, query, where, getDocs, addDoc, updateDoc, arrayUnion, runTransaction } from 'firebase/firestore';
import { rtdb, db } from '@/lib/firebase';

export interface UserData {
  id: string;
  Avatar: string[];
  Badges: DocumentReference[];
  DisplayName: string;
  Friends: DocumentReference[];
  Items: DocumentReference[];
  Username: string;
  XP: number;
  Points: number;
}

/**
 * Fetches the current user's ID from rtdb and returns their Firestore document
 * @returns Promise resolving to the user document data and ID
 * @throws Error if user ID cannot be retrieved or user document not found
 */
export async function getCurrentUser(): Promise<UserData> {
  let userId: string;

  // Get user ID from rtdb
  try {
    const currentIdRef = ref(rtdb, 'userid');
    const snapshot = await get(currentIdRef);

    if (!snapshot.exists()) {
      throw new Error('No user ID found in database');
    }

    userId = snapshot.val();
  } catch (err: any) {
    console.error('Failed to fetch user ID:', err);
    throw new Error(err.message || 'Failed to fetch user ID');
  }

  // Get user document from Firestore
  try {
    const userDocRef = doc(db, 'User', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      throw new Error('User document not found');
    }

    return {
      id: userDocSnapshot.id,
      ...userDocSnapshot.data(),
    } as UserData;
  } catch (err: any) {
    console.error('Failed to fetch user document:', err);
    throw new Error(err.message || 'Failed to fetch user document');
  }
}

/**
 * Fetches user data by ID, username, or document reference
 */
export async function getUserData(userId: string): Promise<UserData>;
export async function getUserData(username: string, byUsername: true): Promise<UserData>;
export async function getUserData(ref: DocumentReference): Promise<UserData>;
export async function getUserData(
  input: string | DocumentReference,
  byUsername?: boolean
): Promise<UserData> {
  try {
    let userDocSnapshot;

    if (input instanceof DocumentReference) {
      // By document reference
      userDocSnapshot = await getDoc(input);
    } else if (byUsername) {
      // By username
      const q = query(collection(db, 'User'), where('Username', '==', input));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error(`User with username "${input}" not found`);
      }

      userDocSnapshot = snapshot.docs[0];
    } else {
      // By user ID
      const userDocRef = doc(db, 'User', input);
      userDocSnapshot = await getDoc(userDocRef);
    }

    if (!userDocSnapshot.exists()) {
      throw new Error('User document not found');
    }

    return {
      id: userDocSnapshot.id,
      ...userDocSnapshot.data(),
    } as UserData;
  } catch (err: any) {
    console.error('Failed to fetch user data:', err);
    throw new Error(err.message || 'Failed to fetch user data');
  }
}

/**
 * Creates and pushes a new user to the database
 */
export async function createUser(
  data: Omit<UserData, 'id'>
): Promise<UserData> {
  try {
    const docRef = await addDoc(collection(db, 'User'), data);
    return {
      id: docRef.id,
      ...data,
    } as UserData;
  } catch (err: any) {
    console.error('Failed to create user:', err);
    throw new Error(err.message || 'Failed to create user');
  }
}

/**
 * Adds an item reference to the current user's Items array
 */
export async function addItemToUser(itemId: string): Promise<void> {
  try {
    const currentUser = await getCurrentUser();
    const userRef = doc(db, 'User', currentUser.id);
    const itemRef = doc(db, 'Items', itemId);
    await updateDoc(userRef, {
      Items: arrayUnion(itemRef),
    });
  } catch (err: any) {
    console.error('Failed to add item to user:', err);
    throw new Error(err.message || 'Failed to add item to user');
  }
}

/**
 * Purchases an item: ensures sufficient Points, deducts cost, and adds the item reference.
 */
export async function purchaseItem(itemId: string, cost: number): Promise<void> {
  const currentUser = await getCurrentUser();
  const userRef = doc(db, 'User', currentUser.id);
  const itemRef = doc(db, 'Items', itemId);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) {
      throw new Error('User document not found');
    }

    const data = userSnap.data() as Partial<UserData>;
    const currentPoints = Number(data.Points ?? 0);
    if (currentPoints < cost) {
      throw new Error('Fondi insufficienti');
    }

    transaction.update(userRef, {
      Points: currentPoints - cost,
      Items: arrayUnion(itemRef),
    });
  });
}
