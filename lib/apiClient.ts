// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

interface Job {
  id: number;
  title: string;
  link?: string; // Original job posting URL
  company: string;
  location: string;
  description?: string; // Full job description
  requirements?: string; // Job requirements
  published?: string; // Published date as string
  deadline?: string; // Deadline as string
  experience?: string; // Experience level
  salaryRange?: string; // Salary range
  category?: string; // Job category
  jobType?: string; // Employment type (Full-time, Part-time, etc.)
  type: string; // Job or Internship
  createdAt: string;
  isFeatured: boolean;
  isActive: boolean;
  company_info?: {
    id: number;
    name: string;
    logo?: string;
    website?: string;
  };
}

interface Company {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  location?: string;
  jobCount?: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  isPro: boolean;
}

interface Scholarship {
  id: number;
  title: string;
  organization: string;
  location: string;
  description?: string;
  requirements?: string;
  link?: string;
  
  // Image fields
  banner_image?: string;
  logo_image?: string;
  image_alt?: string;
  
  // Scholarship-specific fields
  degree_level: string;
  field_of_study?: string;
  funding_type: string;
  funding_amount?: string;
  
  // Common fields
  deadline?: string;
  duration?: string;
  eligibility?: string;
  benefits?: string;
  
  // System fields
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  is_saved?: boolean;
}

interface Event {
  id: number;
  title: string;
  organizer: string;
  location: string;
  description?: string;
  requirements?: string;
  link?: string;
  
  // Image fields
  banner_image?: string;
  logo_image?: string;
  image_alt?: string;
  
  // Event-specific fields
  event_type: string;
  format?: string;
  duration?: string;
  
  // Opportunity fields
  benefits?: string;
  eligibility?: string;
  application_process?: string;
  
  // Dates
  start_date?: string;
  end_date?: string;
  deadline?: string;
  
  // System fields
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  is_saved?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface JobsListResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CompaniesListResponse {
  companies: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ScholarshipsListResponse {
  scholarships: Scholarship[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface EventsListResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface StatsResponse {
  overview: {
    totalJobs: number;
    activeJobs: number;
    totalCompanies: number;
    totalUsers: number;
    featuredJobs: number;
    recentJobs: number;
  };
  categories: Array<{
    name: string;
    count: number;
  }>;
  jobTypes: Array<{
    name: string;
    type: string;
    count: number;
  }>;
  locations: Array<{
    name: string;
    count: number;
  }>;
  topCompanies: Array<{
    id: number;
    name: string;
    logo?: string;
    jobCount: number;
  }>;
  trends: Array<{
    date: string;
    count: number;
  }>;
  userStats?: {
    savedJobs: number;
    isAdmin: boolean;
  };
}

interface DashboardStatsResponse {
  overview: {
    jobs: {
      total: number;
      active: number;
      inactive: number;
      featured: number;
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    companies: {
      total: number;
    };
    users: {
      total: number;
      admins: number;
      regular: number;
    };
  };
  recentActivity: {
    jobs: Job[];
    users: User[];
  };
}

// New API client to replace the Encore.dev client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000') {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    this.token = localStorage.getItem('jobflow_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jobflow_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('jobflow_token');
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure endpoint starts with /api/ and doesn't duplicate it
    const apiEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
    const url = `${this.baseURL}${apiEndpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Route ${apiEndpoint} not found`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Jobs API
  jobs = {
    list: async (params: any = {}): Promise<JobsListResponse> => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key].toString());
        }
      });
      
      const queryString = searchParams.toString();
      return this.request<JobsListResponse>(`/jobs${queryString ? `?${queryString}` : ''}`);
    },

    get: async (params: { id: number }): Promise<Job> => {
      return this.request<Job>(`/jobs/${params.id}`);
    },

    create: async (data: any): Promise<Job> => {
      return this.request<Job>('/jobs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    bulkCreate: async (data: { jobs: any[] }): Promise<{ jobs: Job[] }> => {
      return this.request<{ jobs: Job[] }>('/jobs/bulk', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: number, data: any): Promise<Job> => {
      return this.request<Job>(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
      return this.request<{ success: boolean }>(`/jobs/${id}`, {
        method: 'DELETE',
      });
    },

    stats: async (): Promise<StatsResponse> => {
      return this.request<StatsResponse>('/stats');
    },
  };

  // Companies API
  companies = {
    list: async (params: any = {}) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key].toString());
        }
      });
      
      const queryString = searchParams.toString();
      return this.request(`/companies${queryString ? `?${queryString}` : ''}`);
    },

    get: async (params: { id: number }) => {
      return this.request(`/companies/${params.id}`);
    },

    getTopCompanies: async (params: { limit?: number } = {}) => {
      const searchParams = new URLSearchParams();
      if (params.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      
      const queryString = searchParams.toString();
      return this.request(`/companies/top/featured${queryString ? `?${queryString}` : ''}`);
    },
  };

  // Auth API
  auth = {
    login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      // Store token in localStorage
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    },

    register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      // Store token in localStorage
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    },

    me: async (): Promise<User> => {
      return this.request<User>('/auth/me');
    },

    logout: async (): Promise<void> => {
      await this.request<void>('/auth/logout', {
        method: 'POST',
      });
      this.clearToken();
    },
  };

  // Saved Jobs API
  savedJobs = {
    list: async (params: { userId: number }) => {
      return this.request(`/saved-jobs/${params.userId}`);
    },

    save: async (data: { jobId: number; userId: number }) => {
      return this.request('/saved-jobs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    unsave: async (data: { jobId: number; userId: number }) => {
      return this.request('/saved-jobs', {
        method: 'DELETE',
        body: JSON.stringify(data),
      });
    },

    remove: async (jobId: number) => {
      return this.request(`/saved-jobs/${jobId}`, {
        method: 'DELETE',
      });
    },

    check: async (params: { jobId: number }) => {
      return this.request(`/saved-jobs/check/${params.jobId}`);
    },
  };

  // Users API
  users = {
    getProfile: async () => {
      return this.request('/users/profile');
    },

    updateProfile: async (data: any) => {
      return this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    list: async (params: any = {}) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key].toString());
        }
      });
      
      const queryString = searchParams.toString();
      return this.request(`/users${queryString ? `?${queryString}` : ''}`);
    },

    get: async (params: { id: number }) => {
      return this.request(`/users/${params.id}`);
    },
  };

  // Scholarships API
  scholarships = {
    list: async (params: any = {}): Promise<ScholarshipsListResponse> => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key].toString());
        }
      });
      
      const queryString = searchParams.toString();
      return this.request<ScholarshipsListResponse>(`/scholarships${queryString ? `?${queryString}` : ''}`);
    },

    get: async (params: { id: number }): Promise<Scholarship> => {
      return this.request<Scholarship>(`/scholarships/${params.id}`);
    },

    create: async (data: any): Promise<Scholarship> => {
      return this.request<Scholarship>('/scholarships', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    bulkCreate: async (data: { scholarships: any[] }): Promise<{ scholarships: Scholarship[] }> => {
      return this.request<{ scholarships: Scholarship[] }>('/scholarships/bulk', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: number, data: any): Promise<Scholarship> => {
      return this.request<Scholarship>(`/scholarships/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
      return this.request<{ success: boolean }>(`/scholarships/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // Events API
  events = {
    list: async (params: any = {}): Promise<EventsListResponse> => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key].toString());
        }
      });
      
      const queryString = searchParams.toString();
      return this.request<EventsListResponse>(`/events${queryString ? `?${queryString}` : ''}`);
    },

    get: async (params: { id: number }): Promise<Event> => {
      return this.request<Event>(`/events/${params.id}`);
    },

    create: async (data: any): Promise<Event> => {
      return this.request<Event>('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    bulkCreate: async (data: { events: any[] }): Promise<{ events: Event[] }> => {
      return this.request<{ events: Event[] }>('/events/bulk', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: number, data: any): Promise<Event> => {
      return this.request<Event>(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
      return this.request<{ success: boolean }>(`/events/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // Saved Scholarships API
  savedScholarships = {
    list: async (params: { userId: number }) => {
      return this.request(`/saved-scholarships/${params.userId}`);
    },

    save: async (params: { scholarshipId: number; userId: number }) => {
      return this.request('/saved-scholarships', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    unsave: async (params: { scholarshipId: number; userId: number }) => {
      return this.request('/saved-scholarships', {
        method: 'DELETE',
        body: JSON.stringify(params),
      });
    },

    check: async (params: { scholarshipId: number }) => {
      return this.request(`/saved-scholarships/check/${params.scholarshipId}`);
    },
  };

  // Saved Events API
  savedEvents = {
    list: async (params: { userId: number }) => {
      return this.request(`/saved-events/${params.userId}`);
    },

    save: async (params: { eventId: number; userId: number }) => {
      return this.request('/saved-events', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    unsave: async (params: { eventId: number; userId: number }) => {
      return this.request('/saved-events', {
        method: 'DELETE',
        body: JSON.stringify(params),
      });
    },

    check: async (params: { eventId: number }) => {
      return this.request(`/saved-events/check/${params.eventId}`);
    },
  };

  // Stats API
  stats = {
    get: async (): Promise<StatsResponse> => {
      return this.request<StatsResponse>('/stats');
    },

    getDashboard: async (): Promise<DashboardStatsResponse> => {
      return this.request<DashboardStatsResponse>('/stats/dashboard');
    },
  };
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;

// Export types for use in components
export type {
  Job,
  Company,
  User,
  Scholarship,
  Event,
  AuthResponse,
  JobsListResponse,
  CompaniesListResponse,
  ScholarshipsListResponse,
  EventsListResponse,
  StatsResponse,
  DashboardStatsResponse,
  ApiResponse
};
