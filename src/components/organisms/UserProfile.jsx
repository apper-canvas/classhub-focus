import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';

const UserProfile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  if (!isAuthenticated) {
    return <div>Loading user information...</div>;
  }
  
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-white font-medium">
            {user?.firstName?.[0] || user?.name?.[0] || 'U'}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {user?.firstName || user?.name || 'User'}
          </h3>
          <p className="text-sm text-gray-500">
            {user?.emailAddress || user?.email || 'user@example.com'}
          </p>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
};

export default UserProfile;