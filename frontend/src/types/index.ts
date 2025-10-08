export interface User {
  id: number;
  email: string;
  role: "admin" | "user";
}

export interface Skill {
  id: number;
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  proficiency: number;
  icon?: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  is_featured: boolean;
  display_order: number;
  status: "completed" | "in-progress" | "planned";
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalInfo {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url?: string;
  profile_image_url?: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  errors?: { field: string; message: string }[];
}
