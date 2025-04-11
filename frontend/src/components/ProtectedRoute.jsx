// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth();

//   console.log("In ProtectedRoute. User is:", user);

//   if (!user) {
//     console.warn("Not authenticated. Redirecting to /");
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  console.log("In ProtectedRoute. User is:", user);

  if (loading) return null; // or a loading spinner

  if (!user) {
    console.warn("Not authenticated. Redirecting to /");
    return <Navigate to="/" replace />;
  }

  return children;
}
