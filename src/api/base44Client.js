import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';

// Helper: Waits for Firebase to check if you are logged in
const waitForAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const base44 = {
  auth: {
    // 1. GET CURRENT USER (From Firestore)
    me: async () => {
      const firebaseUser = await waitForAuth();
      if (!firebaseUser) throw new Error("Not logged in");

      // Fetch their profile data from the database
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // If they logged in but have no data, throw error so they go to login/onboarding
        throw new Error("Profile not found");
      }

      return userSnap.data();
    },

    // 2. UPDATE PROFILE (Saves Onboarding/Edit Profile)
    updateMe: async (updates) => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("No user");

      const userRef = doc(db, "users", firebaseUser.uid);
      
      // Save to Cloud
      await updateDoc(userRef, updates);
      
      return { ...updates }; // Return data to keep app happy
    },

    // 3. LOGOUT
    logout: async () => {
      await signOut(auth);
      localStorage.clear(); // Clear any leftover junk
    }
  },

  entities: {
    Professional: {
      // 4. GET DECKS (Download all OTHER users)
      list: async () => {
        // Get all users from the database
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        
        const currentUid = auth.currentUser?.uid;

        // Convert database result to a list
        const allUsers = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id // Ensure ID is attached
        }));

        // Filter: Don't show ME to MYSELF, and only show people who finished onboarding
        return allUsers.filter(u => 
          u.id !== currentUid && 
          u.onboarding_completed === true
        );
      }
    }
  }
};