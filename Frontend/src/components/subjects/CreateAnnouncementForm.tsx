import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { CreateAnnouncementData } from '@/types/subject';

interface CreateAnnouncementFormProps {
  onSubmit: (data: CreateAnnouncementData) => Promise<void>;
  onCancel: () => void;
  subjectId: number;
  initialData?: Partial<CreateAnnouncementData>;
  isEdit?: boolean;
}

export default function CreateAnnouncementForm({
  onSubmit,
  onCancel,
  subjectId,
  initialData,
  isEdit = false,
}: CreateAnnouncementFormProps) {
  const [formData, setFormData] = useState<CreateAnnouncementData>({
    subject: initialData?.subject || subjectId,
    title: initialData?.title || '',
    content: initialData?.content || '',
    published_date: initialData?.published_date || new Date().toISOString().slice(0, 16),
    order: initialData?.order || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.published_date) {
      newErrors.published_date = 'Published date is required';
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
      // Convert local datetime to ISO format
      const submitData = {
        ...formData,
        published_date: new Date(formData.published_date).toISOString(),
      };
      await onSubmit(submitData);
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
            {isEdit ? 'Edit Announcement' : 'Create New Announcement'}
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
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Important Test on Friday"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write your announcement here..."
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {formData.content.length} characters
            </p>
          </div>

          {/* Published Date */}
          <div>
            <label htmlFor="published_date" className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date & Time *
            </label>
            <input
              type="datetime-local"
              id="published_date"
              name="published_date"
              value={formData.published_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary ${
                errors.published_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.published_date && (
              <p className="mt-1 text-sm text-red-600">{errors.published_date}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              When this announcement will be visible to students
            </p>
          </div>

          {/* Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first (0 = top)
            </p>
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
              {isSubmitting ? 'Publishing...' : isEdit ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}