import { doc, getDoc, collection, getDocs, query, where, DocumentReference } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ItemData {
  id: string;
  Category: string;
  Imgsrc: string;
  Name: string;
  Value: number;
}

/**
 * Fetches item data by item ID
 */
export async function getItemById(itemId: string): Promise<ItemData> {
  try {
    const itemDocRef = doc(db, 'Items', itemId);
    const itemDocSnapshot = await getDoc(itemDocRef);

    if (!itemDocSnapshot.exists()) {
      throw new Error('Item document not found');
    }

    return {
      id: itemDocSnapshot.id,
      ...itemDocSnapshot.data(),
    } as ItemData;
  } catch (err: any) {
    console.error('Failed to fetch item:', err);
    throw new Error(err.message || 'Failed to fetch item');
  }
}

/**
 * Fetches all items from the Items collection
 */
export async function getAllItems(): Promise<ItemData[]> {
  try {
    const itemsCollectionRef = collection(db, 'Items');
    const querySnapshot = await getDocs(itemsCollectionRef);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ItemData[];
  } catch (err: any) {
    console.error('Failed to fetch items:', err);
    throw new Error(err.message || 'Failed to fetch items');
  }
}

/**
 * Fetches items filtered by category
 */
export async function getItemsByCategory(category: string): Promise<ItemData[]> {
  try {
    const itemsCollectionRef = collection(db, 'Items');
    const q = query(itemsCollectionRef, where('Category', '==', category));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ItemData[];
  } catch (err: any) {
    console.error('Failed to fetch items by category:', err);
    throw new Error(err.message || 'Failed to fetch items by category');
  }
}
