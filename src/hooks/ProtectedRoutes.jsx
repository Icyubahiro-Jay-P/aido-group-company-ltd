import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../api/userServices';
import Loading from '../components/Loading';
import { BranchProvider } from '../context/BranchProvider';

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null);   // null = still checking
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // getUserProfile() already returns response.data, so it is the user
        // object directly. Handle wrapped shapes defensively too.
        const profile = await getUserProfile();
        setUser(profile?.user || profile?.data || profile);
        setIsAuth(true);
      } catch {
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
  return (
    <BranchProvider user={user}>
      <Outlet context={{ user }} />
    </BranchProvider>
  );
};

export default ProtectedRoute;