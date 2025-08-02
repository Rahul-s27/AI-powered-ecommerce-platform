import { GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

interface GoogleLoginBtnProps {
  onLogin: (user: any) => void;
}

export default function GoogleLoginBtn({ onLogin }: GoogleLoginBtnProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          setLoading(true);
          setError(null);
          try {
            const token = credentialResponse.credential;
            const res = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/auth/google`,
              { token }
            );
            onLogin(res.data);
          } catch (err: any) {
            setError('Login failed. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
        onError={() => setError('Login Failed')}
        useOneTap
      />
      {loading && <div>Logging in...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
