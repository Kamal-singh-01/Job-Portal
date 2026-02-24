import { useContext } from 'react';
import { AppContext } from '../context/AppContex.jsxt';
import { useUser } from '@clerk/clerk-react';

const UserDebug = () => {
  const { userData } = useContext(AppContext);
  const { user } = useUser();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>Debug Info:</h4>
      <p><strong>Clerk User:</strong> {user ? 'Yes' : 'No'}</p>
      <p><strong>User ID:</strong> {user?.id || 'None'}</p>
      <p><strong>User Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'None'}</p>
      <p><strong>UserData State:</strong> {userData ? 'Set' : 'Not Set'}</p>
      <p><strong>UserData Name:</strong> {userData?.name || 'None'}</p>
      <p><strong>UserData Email:</strong> {userData?.email || 'None'}</p>
    </div>
  );
};

export default UserDebug;
