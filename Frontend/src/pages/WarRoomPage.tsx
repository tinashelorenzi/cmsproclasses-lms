import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { authHelpers, type User } from '@/lib/auth';

export default function WarRoomPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user: currentUser } = authHelpers.getAuth();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cms-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-cms-dark">War Room</h1>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">War Room feature coming soon!</p>
              <p className="text-sm text-gray-500">You'll be able to join and manage virtual meetings here.</p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

