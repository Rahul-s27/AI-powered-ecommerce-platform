import GoogleLoginBtn from '../components/GoogleLoginBtn';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/'); // redirect if already logged in
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 via-white to-primary-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 border border-primary-200 dark:border-primary-800 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-300">Sign in to RetailVerse</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300">Access your personalized shopping experience.</p>
        <GoogleLoginBtn onLogin={setUser} />
      </div>
    </div>
  );
};

export default Login;
