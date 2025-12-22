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

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Step 1: Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Get Firebase ID token
      const token = await user.getIdToken();

      // Step 3: Verify admin role with backend
      // 🔧 MOCK MODE - Remove this when backend is ready
      const MOCK_MODE = true; // Set to false when FastAPI is ready
      
      if (MOCK_MODE) {
        // Mock admin verification (for testing only)
        // Only allow emails ending with @tint.edu.in
        const allowedDomain = '@tint.edu.in';
        if (!email.endsWith(allowedDomain)) {
          await signOut(auth);
          throw new Error(`Access denied: Only ${allowedDomain} emails are allowed`);
        }
        
        // Mock: Assume user is admin if domain matches
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, verify admin status
        try {
          const token = await user.getIdToken();
          
          // 🔧 MOCK MODE - Remove this when backend is ready
          const MOCK_MODE = true; // Set to false when FastAPI is ready
          
          if (MOCK_MODE) {
            // Mock: Check if email domain is allowed
            const allowedDomain = '@tint.edu.in';
            if (user.email && user.email.endsWith(allowedDomain)) {
              setIsAdmin(true);
              setCurrentUser(user);
              localStorage.setItem('adminToken', token);
            } else {
              setIsAdmin(false);
              setCurrentUser(null);
              localStorage.removeItem('adminToken');
              await signOut(auth);
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
          console.error('Admin verification error:', err);
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