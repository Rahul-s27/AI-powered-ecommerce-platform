import { googleLogout } from '@react-oauth/google';

interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const handleLogout = () => {
    googleLogout();
    onLogout();
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center' }}>
      <img src={user.picture} alt="profile" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      <span style={{ marginLeft: 10 }}>{user.name}</span>
      <button onClick={handleLogout} style={{ marginLeft: 15 }}>Logout</button>
    </div>
  );
}
