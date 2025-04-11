// import { createContext, useContext, useState, useEffect } from 'react';

// // Create Context
// const AuthContext = createContext();

// // Custom Hook
// export const useAuth = () => useContext(AuthContext);

// // Provider
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { name, email, token }
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('job-user');
//     console.log("Raw user from localStorage:", storedUser);

//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         if (parsed && parsed.token) {
//           setUser(parsed);
//           console.log("Parsed and set user:", parsed);
//         }
//       } catch (error) {
//         console.error('Invalid user in localStorage');
//       }
//     }
//   }, []);

//   const login = (userData) => {
//     console.log("Logging in with:", userData);
//     setUser(userData);
//     localStorage.setItem('job-user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     console.log("Logging out");
//     setUser(null);
//     localStorage.removeItem('job-user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useContext, useState, useEffect } from 'react';

// Create Context
const AuthContext = createContext();

// Custom Hook
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email, token }
  const [loading, setLoading] = useState(true); // true initially during check

  useEffect(() => {
    const storedUser = localStorage.getItem('job-user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.token) {
          setUser(parsed);
        }
      } catch (error) {
        console.error('Invalid user in localStorage');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('job-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('job-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
