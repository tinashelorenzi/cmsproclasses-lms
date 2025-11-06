import { BellIcon, BookOpenIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import VideoPlayer from './VideoPlayer';
import type { Subject } from '@/types/subject';

interface StudentSubjectViewProps {
  subject: Subject;
}

export default function StudentSubjectView({ subject }: StudentSubjectViewProps) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Announcements Section */}
      {subject.announcements && subject.announcements.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BellIcon className="h-6 w-6 text-cms-primary" />
            <h2 className="text-2xl font-bold text-cms-dark">Announcements</h2>
          </div>

          <div className="space-y-4">
            {subject.announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white border-l-4 border-cms-primary rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {announcement.title}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {new Date(announcement.published_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials Section */}
      {subject.materials && subject.materials.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpenIcon className="h-6 w-6 text-cms-primary" />
            <h2 className="text-2xl font-bold text-cms-dark">Course Materials</h2>
          </div>

          <div className="space-y-6">
            {subject.materials.map((material, index) => (
              <div
                key={material.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Material Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cms-primary text-white text-sm font-bold">
                          {index + 1}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {material.title}
                        </h3>
                      </div>
                      {material.description && (
                        <p className="text-gray-600 text-sm ml-11">
                          {material.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        material.material_type === 'VIDEO'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {material.material_type === 'VIDEO' ? '🎥 Video' : '📄 Document'}
                    </span>
                  </div>
                </div>

                {/* Material Content */}
                <div className="p-6">
                  {material.material_type === 'VIDEO' && material.video_url && material.video_platform ? (
                    <VideoPlayer
                      url={material.video_url}
                      platform={material.video_platform}
                      title={material.title}
                    />
                  ) : material.material_type === 'FILE' && material.file_url ? (
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-cms-primary text-white">
                          <ArrowDownTrayIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {material.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Click to download this file
                          </p>
                        </div>
                      </div>
                      <a
                        href={material.file_url}
                        download
                        className="px-6 py-3 bg-cms-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm hover:shadow-md"
                      >
                        Download
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!subject.announcements || subject.announcements.length === 0) &&
        (!subject.materials || subject.materials.length === 0) && (
          <div className="text-center py-16">
            <BookOpenIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No content yet</h3>
            <p className="mt-2 text-gray-600">
              Your tutor hasn't added any materials or announcements yet.
              Check back soon!
            </p>
          </div>
        )}
    </div>
  );
}