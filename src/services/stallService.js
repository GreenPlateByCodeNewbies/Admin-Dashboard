import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  // getDoc
} from 'firebase/firestore';
import { db, auth } from '../app/firebase';

const COLLEGE_ID = 'tMEBxMvwxTkfeYU5mXDW';

const getStallsRef = () => {
  return collection(db, 'colleges', COLLEGE_ID, 'stalls');
};

export const getAllStalls = async () => {
  try {
    const stallsRef = getStallsRef();
    const q = query(stallsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const stalls = [];
    querySnapshot.forEach((doc) => {
      stalls.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      });
    });
    
    return stalls;
  } catch (error) {
    console.error('Error fetching stalls:', error);
    throw new Error('Failed to load stalls. Please try again.');
  }
};

// Add new stall
export const addStall = async (stallData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    const newStall = {
      name: stallData.name,
      email: stallData.email,
      isVerified: false,
      status: 'active', 
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: currentUser.email,
    };
    const stallsRef = getStallsRef();
    console.log('🔵 Getting stalls reference...');
    
    const docRef = await addDoc(stallsRef, newStall);
    console.log('✅ Stall added successfully! ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...newStall,
      createdAt: newStall.createdAt.toDate(),
      updatedAt: newStall.updatedAt.toDate(),
    };
  } catch (error) {
    console.error('❌ Error adding stall:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    throw new Error(`Failed to add stall: ${error.message}`);
  }
};

// Update stall
export const updateStall = async (stallId, updates) => {
  try {
    const stallRef = doc(db, 'colleges', COLLEGE_ID, 'stalls', stallId);
    
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(stallRef, updateData);
    
    return {
      id: stallId,
      ...updates,
      updatedAt: updateData.updatedAt.toDate(),
    };
  } catch (error) {
    console.error('Error updating stall:', error);
    throw new Error('Failed to update stall. Please try again.');
  }
};

// Delete stall
export const deleteStall = async (stallId) => {
  try {
    const stallRef = doc(db, 'colleges', COLLEGE_ID, 'stalls', stallId);
    await deleteDoc(stallRef);
    return true;
  } catch (error) {
    console.error('Error deleting stall:', error);
    throw new Error('Failed to delete stall. Please try again.');
  }
};

// Toggle verification status
export const toggleStallVerification = async (stallId, currentStatus) => {
  try {
    return await updateStall(stallId, {
      isVerified: !currentStatus,
    });
  } catch (error) {
    console.error('Error toggling verification:', error);
    throw new Error('Failed to update verification status. Please try again.');
  }
};  