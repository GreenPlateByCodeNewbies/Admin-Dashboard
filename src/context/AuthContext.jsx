import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../app/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to verify if the email belongs to the required educational domain
  const isValidEduDomain = (email) => {
    return email?.toLowerCase().endsWith('.edu.in');
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log('🔵 Login attempt for:', email);

      // Step 1: Sign in with Firebase
      // If the user is in your Firebase Auth DB, this succeeds.
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Firebase auth successful');

      // Step 2: Suffix Verification 
      // Mandatory check to ensure the logged-in user has a .edu.in address
      if (!isValidEduDomain(user.email)) {
        console.log('❌ Access denied: Non-.edu.in domain');
        await signOut(auth);
        throw new Error('Access denied: Only .edu.in email addresses are authorized');
      }

      // Step 3: Admin Verification
      const token = await user.getIdToken();
      
      // 🔧 MOCK MODE 
      const MOCK_MODE = true; 
      
      if (MOCK_MODE) {
        console.log('✅ User verified via Firebase DB and Domain suffix');
        
        setIsAdmin(true);
        setCurrentUser(user);
        localStorage.setItem('adminToken', token);
        
        return { success: true };
      }
      
      // Real backend verification (use when FastAPI is ready)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Not authorized as admin');
      const data = await response.json();
      
      if (!data.is_admin) {
        await signOut(auth);
        throw new Error('Access denied: Admin privileges required');
      }

      setIsAdmin(true);
      setCurrentUser(user);
      localStorage.setItem('adminToken', token);
      return { success: true };

    } catch (err) {
      console.error('❌ Login error:', err);
      setIsAdmin(false);
      setCurrentUser(null);
      localStorage.removeItem('adminToken');
      
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
      localStorage.removeItem('adminToken');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verify domain suffix on refresh to maintain security
          if (isValidEduDomain(user.email)) {
            const token = await user.getIdToken();
            console.log('✅ Auth refresh: User verified');
            setIsAdmin(true);
            setCurrentUser(user);
            localStorage.setItem('adminToken', token);
          } else {
            console.log('❌ Auth refresh: Invalid domain, signing out');
            await signOut(auth);
          }
        } catch (err) {
          console.error('❌ Verification error on refresh:', err);
          setIsAdmin(false);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        localStorage.removeItem('adminToken');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, isAdmin, loading, error, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};