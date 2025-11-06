// Types for Subjects/Courses functionality

export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    first_name: string;
    last_name: string;
  }
  
  export type GradeLevel = '8' | '9' | '10' | '11' | '12';
  
  export type CurriculumType = 'CAPS' | 'IEB' | 'CAMBRIDGE' | 'IB' | 'OTHER';
  
  export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  
  export type MaterialType = 'VIDEO' | 'FILE';
  
  export type VideoPlatform = 'YOUTUBE' | 'VIMEO' | 'DAILYMOTION';
  
  export interface Subject {
    id: number;
    name: string;
    grade_level: GradeLevel;
    year: number;
    curriculum_type: CurriculumType;
    tutor: User;
    schedule_days: Weekday[];
    schedule_times: string;
    description: string;
    is_active: boolean;
    enrolled_students_count: number;
    is_enrolled: boolean;
    created_at: string;
    updated_at: string;
    announcements?: Announcement[];
    materials?: Material[];
    enrollments?: SubjectEnrollment[];
  }
  
  export interface SubjectEnrollment {
    id: number;
    student: User;
    subject: number;
    subject_name: string;
    enrolled_date: string;
    is_active: boolean;
  }
  
  export interface Announcement {
    id: number;
    subject: number;
    subject_name: string;
    title: string;
    content: string;
    created_by: User;
    published_date: string;
    order: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Material {
    id: number;
    subject: number;
    subject_name: string;
    title: string;
    description: string;
    material_type: MaterialType;
    video_url: string | null;
    video_platform: VideoPlatform | null;
    file: string | null;
    file_url: string | null;
    created_by: User;
    order: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateSubjectData {
    name: string;
    grade_level: GradeLevel;
    year: number;
    curriculum_type: CurriculumType;
    schedule_days: Weekday[];
    schedule_times: string;
    description?: string;
  }
  
  export interface UpdateSubjectData extends Partial<CreateSubjectData> {
    is_active?: boolean;
  }
  
  export interface CreateAnnouncementData {
    subject: number;
    title: string;
    content: string;
    published_date: string;
    order?: number;
  }
  
  export interface CreateMaterialData {
    subject: number;
    title: string;
    description?: string;
    material_type: MaterialType;
    video_url?: string;
    video_platform?: VideoPlatform;
    file?: File;
    order?: number;
  }
  
  export interface ReorderItem {
    item_id: number;
    new_order: number;
  }