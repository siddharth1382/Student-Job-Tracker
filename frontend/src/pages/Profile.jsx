import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">My Profile</h2>
      
      <div className="space-y-8">
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border-2 border-blue-200">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl">
          <div>
            <label className="text-gray-500 font-medium text-sm uppercase tracking-wider block mb-2">Full Name</label>
            <p className="text-gray-800 text-lg font-medium">{user.name}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl">
          <div>
            <label className="text-gray-500 font-medium text-sm uppercase tracking-wider block mb-2">Email</label>
            <p className="text-gray-800 text-lg font-medium">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;