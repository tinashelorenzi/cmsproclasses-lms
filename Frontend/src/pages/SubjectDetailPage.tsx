import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BellIcon,
  BookOpenIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import CreateAnnouncementForm from '@/components/subjects/CreateAnnouncementForm';
import CreateMaterialForm from '@/components/subjects/CreateMaterialForm';
import StudentSubjectView from '@/components/subjects/StudentSubjectView';
import { authHelpers, type User } from '@/lib/auth';
import { subjectApi, announcementApi, materialApi } from '@/lib/subjectApi';
import type { Subject, CreateAnnouncementData, CreateMaterialData } from '@/types/subject';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'announcements' | 'materials' | 'students';
type ViewMode = 'student' | 'manage';

const WEEKDAY_NAMES: Record<string, string> = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};

const CURRICULUM_NAMES: Record<string, string> = {
  CAPS: 'CAPS',
  IEB: 'IEB',
  CAMBRIDGE: 'Cambridge',
  IB: 'IB',
  OTHER: 'Other',
};

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('manage');

  // Form visibility state
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);

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
    // Students always see student view
    if (currentUser.user_type === 'STUDENT') {
      setViewMode('student');
    }
    loadSubject();
  }, [navigate, id]);

  const loadSubject = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await subjectApi.getSubject(parseInt(id));
      setSubject(data);
    } catch (err: any) {
      console.error('Failed to load subject:', err);
      setError(err.response?.data?.detail || 'Failed to load subject');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`${baseRoute}/classes`);
  };

  const handleCreateAnnouncement = async (data: CreateAnnouncementData) => {
    try {
      await announcementApi.createAnnouncement(data);
      setShowAnnouncementForm(false);
      loadSubject();
    } catch (err: any) {
      console.error('Failed to create announcement:', err);
      alert(err.response?.data?.detail || 'Failed to create announcement');
      throw err;
    }
  };

  const handleCreateMaterial = async (data: CreateMaterialData) => {
    try {
      await materialApi.createMaterial(data);
      setShowMaterialForm(false);
      loadSubject();
    } catch (err: any) {
      console.error('Failed to create material:', err);
      alert(err.response?.data?.detail || 'Failed to create material');
      throw err;
    }
  };

  const handleDeleteAnnouncement = async (announcementId: number) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await announcementApi.deleteAnnouncement(announcementId);
      loadSubject();
    } catch (err: any) {
      console.error('Failed to delete announcement:', err);
      alert(err.response?.data?.detail || 'Failed to delete announcement');
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      await materialApi.deleteMaterial(materialId);
      loadSubject();
    } catch (err: any) {
      console.error('Failed to delete material:', err);
      alert(err.response?.data?.detail || 'Failed to delete material');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cms-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subject...</p>
        </div>
      </div>
    );
  }

  if (error || !subject || !user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Subject not found'}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-cms-primary text-white rounded-lg hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const isTutor = user.user_type === 'TUTOR';
  const isStudent = user.user_type === 'STUDENT';

  // If student or tutor viewing as student, show student view
  if (isStudent || (isTutor && viewMode === 'student')) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-cms-primary to-blue-600 text-white">
            <div className="px-6 py-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Classes</span>
              </button>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <span>Grade {subject.grade_level}</span>
                    <span>•</span>
                    <span>{CURRICULUM_NAMES[subject.curriculum_type]}</span>
                    <span>•</span>
                    <span>{subject.year}</span>
                  </div>
                  <p className="mt-2 text-white/80">Tutor: {subject.tutor.full_name}</p>
                </div>

                {/* View Toggle for Tutors */}
                {isTutor && (
                  <button
                    onClick={() => setViewMode('manage')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    <span>Manage Content</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Student View Content */}
          <main className="px-6 py-8">
            <StudentSubjectView subject={subject} />
          </main>
        </div>
      </Layout>
    );
  }

  // Tutor management view
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpenIcon },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: BellIcon,
      count: subject.announcements?.length,
    },
    {
      id: 'materials',
      label: 'Materials',
      icon: BookOpenIcon,
      count: subject.materials?.length,
    },
    {
      id: 'students',
      label: 'Students',
      icon: UserGroupIcon,
      count: subject.enrolled_students_count,
    },
  ] as const;

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-cms-primary to-blue-600 text-white">
          <div className="px-6 py-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Classes</span>
            </button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <span>Grade {subject.grade_level}</span>
                  <span>•</span>
                  <span>{CURRICULUM_NAMES[subject.curriculum_type]}</span>
                  <span>•</span>
                  <span>{subject.year}</span>
                </div>
                <p className="mt-2 text-white/80">Tutor: {subject.tutor.full_name}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('student')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <EyeIcon className="h-5 w-5" />
                  <span>View as Student</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <PencilIcon className="h-5 w-5" />
                  <span>Edit Subject</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-white/20">
            <div className="px-6 flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative',
                      isActive ? 'text-white' : 'text-white/70 hover:text-white/90'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content - Management View */}
        <main className="px-6 py-8">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-cms-dark mb-4">Subject Information</h2>

              <div className="space-y-4">
                {/* Schedule */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Schedule</h3>
                  <p className="text-gray-700">
                    {subject.schedule_days.map((day) => WEEKDAY_NAMES[day]).join(', ')}
                  </p>
                  {subject.schedule_times && (
                    <p className="text-gray-600 text-sm">{subject.schedule_times}</p>
                  )}
                </div>

                {/* Description */}
                {subject.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{subject.description}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Announcements</p>
                    <p className="text-2xl font-bold text-cms-dark">
                      {subject.announcements?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Materials</p>
                    <p className="text-2xl font-bold text-cms-dark">
                      {subject.materials?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-cms-dark">
                      {subject.enrolled_students_count}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-cms-dark">Announcements</h2>
                <button
                  onClick={() => setShowAnnouncementForm(true)}
                  className="px-4 py-2 bg-cms-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Announcement
                </button>
              </div>

              {subject.announcements && subject.announcements.length > 0 ? (
                <div className="space-y-4">
                  {subject.announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-cms-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">
                            {announcement.content}
                          </p>
                          <p className="text-xs text-gray-500">
                            Posted on{' '}
                            {new Date(announcement.published_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-600">No announcements yet</p>
                  <button
                    onClick={() => setShowAnnouncementForm(true)}
                    className="mt-4 px-4 py-2 bg-cms-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    Create First Announcement
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-cms-dark">Materials</h2>
                <button
                  onClick={() => setShowMaterialForm(true)}
                  className="px-4 py-2 bg-cms-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Material
                </button>
              </div>

              {subject.materials && subject.materials.length > 0 ? (
                <div className="space-y-4">
                  {subject.materials.map((material) => (
                    <div
                      key={material.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-cms-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{material.title}</h3>
                            <span
                              className={cn(
                                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                material.material_type === 'VIDEO'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              )}
                            >
                              {material.material_type}
                            </span>
                          </div>
                          {material.description && (
                            <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                          )}
                          {material.material_type === 'VIDEO' && material.video_platform && (
                            <p className="text-xs text-gray-500 mb-2">
                              Platform: {material.video_platform}
                            </p>
                          )}
                          <div className="flex items-center gap-3">
                            {material.material_type === 'VIDEO' && material.video_url && (
                              <a
                                href={material.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm px-3 py-1.5 bg-cms-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Watch Video
                              </a>
                            )}
                            {material.material_type === 'FILE' && material.file_url && (
                              <a
                                href={material.file_url}
                                download
                                className="text-sm px-3 py-1.5 bg-cms-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Download File
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-600">No materials yet</p>
                  <button
                    onClick={() => setShowMaterialForm(true)}
                    className="mt-4 px-4 py-2 bg-cms-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    Add First Material
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-cms-dark mb-6">Enrolled Students</h2>

              {subject.enrollments && subject.enrollments.length > 0 ? (
                <div className="space-y-3">
                  {subject.enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:border-cms-primary transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {enrollment.student.full_name}
                        </p>
                        <p className="text-sm text-gray-600">{enrollment.student.email}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Enrolled{' '}
                        {new Date(enrollment.enrolled_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-600">No enrolled students yet</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Forms */}
      {showAnnouncementForm && (
        <CreateAnnouncementForm
          onSubmit={handleCreateAnnouncement}
          onCancel={() => setShowAnnouncementForm(false)}
          subjectId={subject.id}
        />
      )}

      {showMaterialForm && (
        <CreateMaterialForm
          onSubmit={handleCreateMaterial}
          onCancel={() => setShowMaterialForm(false)}
          subjectId={subject.id}
        />
      )}
    </Layout>
  );
}