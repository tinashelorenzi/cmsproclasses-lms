import { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, FilmIcon } from '@heroicons/react/24/outline';
import type { CreateMaterialData, MaterialType, VideoPlatform } from '@/types/subject';

interface CreateMaterialFormProps {
  onSubmit: (data: CreateMaterialData) => Promise<void>;
  onCancel: () => void;
  subjectId: number;
  initialData?: Partial<CreateMaterialData>;
  isEdit?: boolean;
}

const VIDEO_PLATFORMS: { value: VideoPlatform; label: string }[] = [
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'VIMEO', label: 'Vimeo' },
  { value: 'DAILYMOTION', label: 'Dailymotion' },
];

export default function CreateMaterialForm({
  onSubmit,
  onCancel,
  subjectId,
  initialData,
  isEdit = false,
}: CreateMaterialFormProps) {
  const [materialType, setMaterialType] = useState<MaterialType>(
    initialData?.material_type || 'VIDEO'
  );

  const [formData, setFormData] = useState({
    subject: initialData?.subject || subjectId,
    title: initialData?.title || '',
    description: initialData?.description || '',
    video_url: initialData?.video_url || '',
    video_platform: initialData?.video_platform || 'YOUTUBE' as VideoPlatform,
    order: initialData?.order || 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Clear file error
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: '' }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (materialType === 'VIDEO') {
      if (!formData.video_url.trim()) {
        newErrors.video_url = 'Video URL is required';
      } else {
        // Basic URL validation
        try {
          new URL(formData.video_url);
        } catch {
          newErrors.video_url = 'Please enter a valid URL';
        }
      }

      if (!formData.video_platform) {
        newErrors.video_platform = 'Please select a platform';
      }
    }

    if (materialType === 'FILE') {
      if (!file && !isEdit) {
        newErrors.file = 'Please select a file to upload';
      }
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
      const submitData: CreateMaterialData = {
        subject: formData.subject,
        title: formData.title,
        description: formData.description,
        material_type: materialType,
        order: formData.order,
      };

      if (materialType === 'VIDEO') {
        submitData.video_url = formData.video_url;
        submitData.video_platform = formData.video_platform;
      } else {
        submitData.file = file || undefined;
      }

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
            {isEdit ? 'Edit Material' : 'Add New Material'}
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
          {/* Material Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMaterialType('VIDEO')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                  materialType === 'VIDEO'
                    ? 'border-cms-primary bg-cms-primary text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <FilmIcon className="h-5 w-5" />
                <span>Video</span>
              </button>
              <button
                type="button"
                onClick={() => setMaterialType('FILE')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                  materialType === 'FILE'
                    ? 'border-cms-primary bg-cms-primary text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                <span>File/Document</span>
              </button>
            </div>
          </div>

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
              placeholder={
                materialType === 'VIDEO'
                  ? 'e.g., Introduction to Calculus'
                  : 'e.g., Study Notes - Chapter 1'
              }
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary"
              placeholder="Brief description of this material..."
            />
          </div>

          {/* Video Fields */}
          {materialType === 'VIDEO' && (
            <>
              <div>
                <label htmlFor="video_platform" className="block text-sm font-medium text-gray-700 mb-1">
                  Video Platform *
                </label>
                <select
                  id="video_platform"
                  name="video_platform"
                  value={formData.video_platform}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary ${
                    errors.video_platform ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {VIDEO_PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                {errors.video_platform && (
                  <p className="mt-1 text-sm text-red-600">{errors.video_platform}</p>
                )}
              </div>

              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL *
                </label>
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cms-primary ${
                    errors.video_url ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {errors.video_url && (
                  <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Paste the full URL of the video
                </p>
              </div>
            </>
          )}

          {/* File Upload */}
          {materialType === 'FILE' && (
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Upload File *
              </label>
              <div className="mt-1">
                <label
                  htmlFor="file"
                  className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    errors.file
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-cms-primary hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      {file ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-cms-primary">Click to upload</span>
                            {' or drag and drop'}
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 50MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileChange}
                    className="sr-only"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                  />
                </label>
              </div>
              {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
            </div>
          )}

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
              {isSubmitting
                ? materialType === 'FILE'
                  ? 'Uploading...'
                  : 'Adding...'
                : isEdit
                ? 'Update Material'
                : 'Add Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}