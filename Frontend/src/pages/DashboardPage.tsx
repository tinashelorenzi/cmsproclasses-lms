import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/ui/button';
import { authHelpers, type User } from '@/lib/auth';
import { BookOpen, Users, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
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
      {/* Main Content Area */}
      <div className="min-h-screen">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-cms-dark">Dashboard</h1>
            <div className="text-sm text-gray-600">
              Welcome back, {user.first_name || user.username}!
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-cms-dark mb-2">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cms-primary/10 text-cms-primary">
                  {user.user_type_display}
                </span>
              </p>
              {user.email && <p className="text-gray-600 mt-2">{user.email}</p>}
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-cms-primary/10 p-3 rounded-lg">
                <BookOpen className="h-8 w-8 text-cms-primary" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Active Courses</p>
                <p className="text-2xl font-bold text-cms-dark">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-cms-secondary/10 p-3 rounded-lg">
                <Users className="h-8 w-8 text-cms-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Tutors</p>
                <p className="text-2xl font-bold text-cms-dark">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-cms-primary/10 p-3 rounded-lg">
                <BarChart3 className="h-8 w-8 text-cms-primary" />
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Progress</p>
                <p className="text-2xl font-bold text-cms-dark">0%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-cms-dark mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              View Courses
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Find Tutors
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              View Progress
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              Resources
            </Button>
          </div>
        </div>
        </main>
      </div>
    </Layout>
  );
}

