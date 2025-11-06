import { Link } from 'react-router-dom';
import { BookOpenIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import type { Subject } from '@/types/subject';

interface SubjectCardProps {
  subject: Subject;
  userType: 'TUTOR' | 'STUDENT' | 'PARENT';
  onEnroll?: (subjectId: number) => void;
  onUnenroll?: (subjectId: number) => void;
  baseRoute: string;
}

// Map weekday codes to full names
const WEEKDAY_NAMES: Record<string, string> = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};

// Map curriculum types to display names
const CURRICULUM_NAMES: Record<string, string> = {
  CAPS: 'CAPS',
  IEB: 'IEB',
  CAMBRIDGE: 'Cambridge',
  IB: 'IB',
  OTHER: 'Other',
};

export default function SubjectCard({
  subject,
  userType,
  onEnroll,
  onUnenroll,
  baseRoute,
}: SubjectCardProps) {
  const handleEnrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (subject.is_enrolled && onUnenroll) {
      onUnenroll(subject.id);
    } else if (!subject.is_enrolled && onEnroll) {
      onEnroll(subject.id);
    }
  };

  return (
    <Link
      to={`${baseRoute}/classes/${subject.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      {/* Card Header with gradient */}
      <div className="bg-gradient-to-r from-cms-primary to-blue-600 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{subject.name}</h3>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <span>Grade {subject.grade_level}</span>
              <span>•</span>
              <span>{CURRICULUM_NAMES[subject.curriculum_type]}</span>
              <span>•</span>
              <span>{subject.year}</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
            <BookOpenIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Tutor Info */}
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Tutor:</span> {subject.tutor.full_name}
          </p>
        </div>

        {/* Schedule */}
        {subject.schedule_days && subject.schedule_days.length > 0 && (
          <div className="mb-3 flex items-start gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-gray-700 font-medium">
                {subject.schedule_days.map((day) => WEEKDAY_NAMES[day]).join(', ')}
              </p>
              {subject.schedule_times && (
                <p className="text-gray-600">{subject.schedule_times}</p>
              )}
            </div>
          </div>
        )}

        {/* Enrolled Students Count (for tutors) */}
        {userType === 'TUTOR' && (
          <div className="mb-3 flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-gray-400" />
            <p className="text-sm text-gray-600">
              {subject.enrolled_students_count}{' '}
              {subject.enrolled_students_count === 1 ? 'student' : 'students'} enrolled
            </p>
          </div>
        )}

        {/* Description Preview */}
        {subject.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{subject.description}</p>
        )}

        {/* Action Button for Students */}
        {userType === 'STUDENT' && (
          <button
            onClick={handleEnrollClick}
            className={cn(
              'w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors',
              subject.is_enrolled
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-cms-primary text-white hover:bg-blue-600'
            )}
          >
            {subject.is_enrolled ? 'Enrolled' : 'Enroll Now'}
          </button>
        )}

        {/* Status Badge for Tutors */}
        {userType === 'TUTOR' && (
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                subject.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              )}
            >
              {subject.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className="text-xs text-gray-500">Click to manage</span>
          </div>
        )}
      </div>
    </Link>
  );
}