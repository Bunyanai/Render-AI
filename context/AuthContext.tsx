import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isApproved: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isApproved: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ isApproved: boolean; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const ADMIN_EMAIL = 'ibnmolok03@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, 'users', authUser.uid);
        let userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Auto-approve and create profile for now as requested
          const newProfile = {
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            role: authUser.email === ADMIN_EMAIL ? 'admin' : 'user',
            isApproved: true, // Default to true for now
            lastLogin: serverTimestamp(),
          };
          await setDoc(userDocRef, newProfile);
          setProfile({ isApproved: newProfile.isApproved, role: newProfile.role });
        } else {
          const data = userDoc.data();
          setProfile({ isApproved: data?.isApproved ?? false, role: data?.role ?? 'user' });
          
          // Update last login
          await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        }
        setUser(authUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAdmin: profile?.role === 'admin' || user?.email === ADMIN_EMAIL,
    isApproved: profile?.isApproved ?? false,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
