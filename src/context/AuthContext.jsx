import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../app/firebase';
import { getCollegeDomains } from '../services/domainService';

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

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log('🔵 Login attempt for:', email);

      // Step 1: Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Firebase auth successful');

      // Step 2: Get Firebase ID token
      const token = await user.getIdToken();

      // Step 3: Verify admin role with backend
      // 🔧 MOCK MODE - Remove this when backend is ready
      const MOCK_MODE = true; // Set to false when FastAPI is ready
      
      if (MOCK_MODE) {
        console.log('🔵 Mock mode: Checking domain...');
        
        // Mock admin verification - check domain from Firestore
        try {
          const { domains } = await getCollegeDomains();
          const emailDomain = email.split('@')[1]?.toLowerCase();
          const isAllowed = domains.some(d => d.toLowerCase() === emailDomain);
          
          console.log('🔍 Email domain:', emailDomain);
          console.log('🔍 Allowed domains:', domains);
          console.log('🔍 Is allowed?', isAllowed);
          
          if (!isAllowed) {
            await signOut(auth);
            throw new Error('Access denied: Your email domain is not authorized');
          }
          
          console.log('✅ Domain check passed');
          
          // Mock: Assume user is admin if domain matches
          setIsAdmin(true);
          setCurrentUser(user);
          localStorage.setItem('adminToken', token);
          
          return { success: true };
        } catch (domainError) {
          console.error('❌ Domain check failed:', domainError);
          await signOut(auth);
          throw domainError;
        }
      }
      
      // Real backend verification (use when FastAPI is ready)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Not authorized as admin');
      }

      const data = await response.json();
      
      if (!data.is_admin) {
        // If not admin, sign them out immediately
        await signOut(auth);
        throw new Error('Access denied: Admin privileges required');
      }

      setIsAdmin(true);
      setCurrentUser(user);
      
      // Store token for API calls
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

  // Logout function
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
    console.log('🔵 Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔵 Auth state changed. User:', user?.email || 'None');
      
      if (user) {
        // User is signed in, verify admin status
        try {
          const token = await user.getIdToken();
          
          // 🔧 MOCK MODE - Remove this when backend is ready
          const MOCK_MODE = true; // Set to false when FastAPI is ready
          
          if (MOCK_MODE) {
            console.log('🔵 Mock mode: Verifying on refresh...');
            
            // Mock: Check if email domain is allowed
            try {
              const { domains } = await getCollegeDomains();
              const emailDomain = user.email.split('@')[1]?.toLowerCase();
              const isAllowed = domains.some(d => d.toLowerCase() === emailDomain);
              
              console.log('🔍 Refresh check - Email domain:', emailDomain);
              console.log('🔍 Refresh check - Allowed domains:', domains);
              console.log('🔍 Refresh check - Is allowed?', isAllowed);
              
              if (isAllowed) {
                console.log('✅ Domain valid - setting as admin');
                setIsAdmin(true);
                setCurrentUser(user);
                localStorage.setItem('adminToken', token);
              } else {
                console.log('❌ Domain invalid - signing out');
                setIsAdmin(false);
                setCurrentUser(null);
                localStorage.removeItem('adminToken');
                await signOut(auth);
              }
            } catch (domainError) {
              console.error('❌ Domain check error on refresh:', domainError);
              setIsAdmin(false);
              setCurrentUser(null);
              localStorage.removeItem('adminToken');
            }
          } else {
            // Real backend verification (use when FastAPI is ready)
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/verify`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              setIsAdmin(data.is_admin);
              setCurrentUser(user);
              localStorage.setItem('adminToken', token);
            } else {
              setIsAdmin(false);
              setCurrentUser(null);
              localStorage.removeItem('adminToken');
            }
          }
        } catch (err) {
          console.error('❌ Admin verification error:', err);
          setIsAdmin(false);
          setCurrentUser(null);
        }
      } else {
        console.log('🔵 No user signed in');
        setCurrentUser(null);
        setIsAdmin(false);
        localStorage.removeItem('adminToken');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};