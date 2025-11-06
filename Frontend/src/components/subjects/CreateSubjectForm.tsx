import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { CreateSubjectData, GradeLevel, CurriculumType, Weekday } from '@/types/subject';

interface CreateSubjectFormProps {
  onSubmit: (data: CreateSubjectData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CreateSubjectData>;
  isEdit?: boolean;
}

const GRADE_OPTIONS: { value: GradeLevel; label: string }[] = [
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
];

const CURRICULUM_OPTIONS: { value: CurriculumType; label: string }[] = [
  { value: 'CAPS', label: 'CAPS' },
  { value: 'IEB', label: 'IEB' },
  { value: 'CAMBRIDGE', label: 'Cambridge' },
  { value: 'IB', label: 'IB' },
  { value: 'OTHER', label: 'Other' },
];

const WEEKDAY_OPTIONS: { value: Weekday; label: string }[] = [
  { value: 'MON', label: 'Monday' },
  { value: 'TUE', label: 'Tuesday' },
  { value: 'WED', label: 'Wednesday' },
  { value: 'THU', label: 'Thursday' },
  { value: 'FRI', label: 'Friday' },
  { value: 'SAT', label: 'Saturday' },
  { value: 'SUN', label: 'Sunday' },
];

export default function CreateSubjectForm({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}: CreateSubjectFormProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<CreateSubjectData>({
    name: initialData?.name || '',
    grade_level: initialData?.grade_level || '12',
    year: initialData?.year || currentYear,
    curriculum_type: initialData?.curriculum_type || 'CAPS',
    schedule_days: initialData?.schedule_days || [],
    schedule_times: initialData?.schedule_times || '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDayToggle = (day: Weekday) => {
    setFormData((prev) => {
      const days = prev.schedule_days.includes(day)
        ? prev.schedule_days.filter((d) => d !== day)
        : [...prev.schedule_days, day];
      return { ...prev, schedule_days: days };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }

    if (formData.schedule_days.length === 0) {
      newErrors.schedule_days = 'Please select at least one day';
    }

    if (!formData.schedule_times.trim()) {
      newErrors.schedule_times = 'Schedule times are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-cms-dark">
            {isEdit ? 'Edit Subject' : 'Create New Subject'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Advanced Mathematics"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Grade Level and Curriculum Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="grade_level" className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level *
              </label>
              <select
                id="grade_level"
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary"
              >
                {GRADE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="curriculum_type" className="block text-sm font-medium text-gray-700 mb-1">
                Curriculum Type *
              </label>
              <select
                id="curriculum_type"
                name="curriculum_type"
                value={formData.curriculum_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary"
              >
                {CURRICULUM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min={currentYear - 1}
              max={currentYear + 2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary"
            />
          </div>

          {/* Schedule Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Days *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {WEEKDAY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleDayToggle(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.schedule_days.includes(option.value)
                      ? 'bg-cms-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.schedule_days && (
              <p className="mt-1 text-sm text-red-600">{errors.schedule_days}</p>
            )}
          </div>

          {/* Schedule Times */}
          <div>
            <label htmlFor="schedule_times" className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Times *
            </label>
            <input
              type="text"
              id="schedule_times"
              name="schedule_times"
              value={formData.schedule_times}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary ${
                errors.schedule_times ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 14:00-15:30"
            />
            {errors.schedule_times && (
              <p className="mt-1 text-sm text-red-600">{errors.schedule_times}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary"
              placeholder="Brief description of the subject..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-cms-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}