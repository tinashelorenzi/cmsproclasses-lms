import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/ui/button';
import { authHelpers, type User } from '@/lib/auth';
import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CalendarIcon } from '@heroicons/react/24/solid';

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

  // Sample course data - replace with actual API data
  const courses = [
    {
      id: 1,
      name: 'Mathematics 101',
      code: 'MATH-101',
      term: '2025 Fall',
      color: 'bg-cms-primary', // French Blue
      tutor: 'Mr. Johnson',
    },
    {
      id: 2,
      name: 'Advanced Calculus',
      code: 'CALC-201',
      term: '2025 Fall',
      color: 'bg-cms-secondary', // Jonquil Yellow
      tutor: 'Ms. Smith',
    },
    {
      id: 3,
      name: 'Statistics',
      code: 'STAT-101',
      term: '2025 Fall',
      color: 'bg-cms-dark', // Black/Dark
      tutor: 'Dr. Williams',
    },
  ];

  // Sample todo items - replace with actual API data
  const todoItems = [
    {
      id: 1,
      title: 'Complete Chapter 5 Assignment',
      dueDate: 'Nov 5 at 11:59pm',
    },
    {
      id: 2,
      title: 'Submit Practice Problems',
      dueDate: 'Nov 8 at 11:59pm',
    },
  ];

  // Sample upcoming items - replace with actual API data
  const upcomingItems = [
    {
      id: 1,
      title: 'Mathematics 101 - Lesson',
      day: 'Monday',
      time: '3:00 PM',
    },
    {
      id: 2,
      title: 'Calculus Quiz',
      day: 'Tuesday',
      time: '4:00 PM',
    },
    {
      id: 3,
      title: 'Statistics Assignment Due',
      day: 'Thursday',
      time: '11:59 PM',
    },
    {
      id: 4,
      title: 'War Room Meeting',
      day: 'Friday',
      time: '5:00 PM',
    },
  ];

  // Sample feedback items - replace with actual API data
  const feedbackItems = [
    {
      id: 1,
      title: 'Chapter 4 Assignment',
      score: '95/100',
      feedback: 'Excellent work!',
    },
    {
      id: 2,
      title: 'Practice Problems Set 3',
      score: '88/100',
      feedback: 'Good progress',
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Main Content Area */}
        <div className="flex-1 bg-gray-100">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Welcome back, {user.first_name || user.username}!</p>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                {/* View Toggle Buttons */}
                <button className="p-2 text-cms-primary hover:bg-gray-100 rounded">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-2 h-2 bg-current"></div>
                    <div className="w-2 h-2 bg-current"></div>
                    <div className="w-2 h-2 bg-current"></div>
                    <div className="w-2 h-2 bg-current"></div>
                  </div>
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                  <div className="space-y-1">
                    <div className="w-4 h-0.5 bg-current"></div>
                    <div className="w-4 h-0.5 bg-current"></div>
                    <div className="w-4 h-0.5 bg-current"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="px-4 md:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                >
                  {/* Colored Header */}
                  <div className={`${course.color} px-4 py-6 relative`}>
                    <h3 className={`${course.color === 'bg-cms-secondary' ? 'text-cms-dark' : 'text-white'} text-lg md:text-xl font-semibold`}>{course.name}</h3>
                    <p className={`${course.color === 'bg-cms-secondary' ? 'text-cms-dark/90' : 'text-white/90'} text-sm mt-1`}>{course.code}</p>
                    <p className={`${course.color === 'bg-cms-secondary' ? 'text-cms-dark/80' : 'text-white/80'} text-xs mt-1`}>{course.term}</p>
                    <p className={`${course.color === 'bg-cms-secondary' ? 'text-cms-dark/80' : 'text-white/80'} text-xs mt-2`}>Tutor: {course.tutor}</p>
                    {/* Settings Icon */}
                    <button className={`absolute top-3 right-3 p-1 ${course.color === 'bg-cms-secondary' ? 'text-cms-dark/80 hover:text-cms-dark hover:bg-cms-dark/10' : 'text-white/80 hover:text-white hover:bg-white/20'} rounded`}>
                      <Cog6ToothIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Course Actions */}
                  <div className="flex items-center justify-around py-4 border-t border-gray-200">
                    <button className="flex flex-col items-center text-gray-600 hover:text-cms-primary transition-colors">
                      <BellIcon className="h-5 md:h-6 w-5 md:w-6" />
                      <span className="text-xs mt-1">Alerts</span>
                    </button>
                    <button className="flex flex-col items-center text-gray-600 hover:text-cms-primary transition-colors">
                      <ClipboardDocumentListIcon className="h-5 md:h-6 w-5 md:w-6" />
                      <span className="text-xs mt-1">Work</span>
                    </button>
                    <button className="flex flex-col items-center text-gray-600 hover:text-cms-primary transition-colors">
                      <BookOpenIcon className="h-5 md:h-6 w-5 md:w-6" />
                      <span className="text-xs mt-1">Materials</span>
                    </button>
                    <button className="flex flex-col items-center text-gray-600 hover:text-cms-primary transition-colors">
                      <ChatBubbleLeftRightIcon className="h-5 md:h-6 w-5 md:w-6" />
                      <span className="text-xs mt-1">Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-y-auto">
          {/* To Do Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">To Do</h2>
            {todoItems.length > 0 ? (
              <div className="space-y-3">
                {todoItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-cms-primary border-gray-300 rounded focus:ring-cms-primary"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">due: {item.dueDate}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nothing for now</p>
            )}
          </div>

          {/* Coming Up Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Coming Up</h2>
              <button className="text-sm text-cms-primary hover:underline flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                View Calendar
              </button>
            </div>
            {upcomingItems.length > 0 ? (
              <div className="space-y-3">
                {upcomingItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 italic">
                        {item.day} • {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nothing upcoming</p>
            )}
          </div>

          {/* Recent Feedback Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Feedback</h2>
            {feedbackItems.length > 0 ? (
              <div className="space-y-3">
                {feedbackItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.score}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent feedback</p>
            )}
          </div>

          {/* View Progress Button */}
          <div className="px-6 pb-6">
            <Button variant="outline" className="w-full">
              View All Progress
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}