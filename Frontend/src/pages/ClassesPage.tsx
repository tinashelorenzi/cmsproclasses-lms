import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import SubjectCard from '@/components/subjects/SubjectCard';
import CreateSubjectForm from '@/components/subjects/CreateSubjectForm';
import { authHelpers, type User } from '@/lib/auth';
import { subjectApi } from '@/lib/subjectApi';
import type { Subject, CreateSubjectData } from '@/types/subject';

export default function ClassesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine base route based on user type
  const getBaseRoute = () => {
    if (user?.user_type === 'STUDENT') return '/student';
    if (user?.user_type === 'TUTOR') return '/tutor';
    if (user?.user_type === 'PARENT') return '/parent';
    return '/dashboard';
  };

  const baseRoute = getBaseRoute();

  useEffect(() => {
    const { user: currentUser } = authHelpers.getAuth();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadSubjects();
  }, [navigate]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectApi.getSubjects();
      setSubjects(data);
    } catch (err: any) {
      console.error('Failed to load subjects:', err);
      setError(err.response?.data?.detail || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (data: CreateSubjectData) => {
    try {
      await subjectApi.createSubject(data);
      setShowCreateForm(false);
      loadSubjects(); // Reload subjects
    } catch (err: any) {
      console.error('Failed to create subject:', err);
      alert(err.response?.data?.detail || 'Failed to create subject');
    }
  };

  const handleEnroll = async (subjectId: number) => {
    try {
      await subjectApi.enrollInSubject(subjectId);
      loadSubjects(); // Reload to update enrollment status
    } catch (err: any) {
      console.error('Failed to enroll:', err);
      alert(err.response?.data?.error || 'Failed to enroll in subject');
    }
  };

  const handleUnenroll = async (subjectId: number) => {
    if (
      !window.confirm('Are you sure you want to unenroll from this subject?')
    ) {
      return;
    }

    try {
      await subjectApi.unenrollFromSubject(subjectId);
      loadSubjects(); // Reload to update enrollment status
    } catch (err: any) {
      console.error('Failed to unenroll:', err);
      alert(err.response?.data?.error || 'Failed to unenroll from subject');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cms-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subjects...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cms-dark">My Classes</h1>
              <p className="text-sm text-gray-600 mt-1">
                {user.user_type === 'TUTOR'
                  ? 'Manage your subjects and enrolled students'
                  : 'Browse and enroll in available subjects'}
              </p>
            </div>
            {user.user_type === 'TUTOR' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cms-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Subject</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {subjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <PlusIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {user.user_type === 'TUTOR' ? 'No subjects yet' : 'No subjects available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {user.user_type === 'TUTOR'
                    ? 'Get started by creating your first subject'
                    : 'Check back later for available subjects'}
                </p>
                {user.user_type === 'TUTOR' && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-6 py-2 bg-cms-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create Your First Subject
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  userType={user.user_type}
                  onEnroll={handleEnroll}
                  onUnenroll={handleUnenroll}
                  baseRoute={baseRoute}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Subject Modal */}
      {showCreateForm && (
        <CreateSubjectForm
          onSubmit={handleCreateSubject}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </Layout>
  );
}