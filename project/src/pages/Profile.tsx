import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { googleLogout } from '@react-oauth/google';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    navigate("/");
  };

  if (!user) return <div className="flex justify-center items-center h-64 text-lg">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-primary-100 dark:border-primary-900 text-center">
      <h2 className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-300">Your Profile</h2>
      <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full mb-4 mx-auto shadow-lg border-4 border-primary-200 dark:border-primary-700" />
      <p className="mb-2 text-lg text-gray-800 dark:text-gray-200"><strong>Name:</strong> {user.name}</p>
      <p className="mb-6 text-lg text-gray-800 dark:text-gray-200"><strong>Email:</strong> {user.email}</p>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
        >
          Logout
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default Profile;
