import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null);   // null = still checking
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          withCredentials: true,        // ← This sends the httpOnly cookie
        });

        setUser(res.data.user || res.data);   // adjust based on your backend response
        setIsAuth(true);
      } catch (err) {
        // 401 or any error = not authenticated
        setIsAuth(false);
        setUser(null);
      }
    };

    verifyAuth();
  }, []);

  if (isAuth === null) {
    return <Loading />;
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // You can also pass the user data down if needed
  return <Outlet context={{ user }} />;
};

export default ProtectedRoute;