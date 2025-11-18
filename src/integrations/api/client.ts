// API Client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

// Auth Token Management
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Include credentials for CORS
        mode: 'cors', // Explicitly set CORS mode
      });

      // Check if response is ok before parsing
      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(`JSON Parse Error (${endpoint}):`, text);
        throw new Error(`Invalid JSON response from server. Response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        const error = new Error(data.message || data.error || data.details || 'Request failed') as any;
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error);
      // If it's a network error, provide a more helpful message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the server is running.');
      }
      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Users
  async getUsers(): Promise<ApiResponse> {
    return this.request('/users');
  }

  async getUser(id: string): Promise<ApiResponse> {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: any): Promise<ApiResponse> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Courses
  async getCourses(params?: { category?: string; level?: string }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.level) queryParams.append('level', params.level);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/courses${query}`);
  }

  async getCourse(id: string): Promise<ApiResponse> {
    return this.request(`/courses/${id}`);
  }

  async getCourseBySubjectAndLevel(subject: string, level: string): Promise<ApiResponse> {
    return this.request(`/subjects/courses/${subject}/${level}`);
  }

  async enrollInCourse(subject: string, level: string): Promise<ApiResponse> {
    return this.request(`/subjects/enroll/${subject}/${level}`, {
      method: 'POST',
    });
  }

  async createCourse(courseData: any): Promise<ApiResponse> {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: string, courseData: any): Promise<ApiResponse> {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id: string): Promise<ApiResponse> {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Weekly Content
  async getWeeklyContent(courseId: string, level: string): Promise<ApiResponse> {
    return this.request(`/weekly/${courseId}/${level}/weeks`);
  }

  async getWeekContent(courseId: string, level: string, weekNumber: number): Promise<ApiResponse> {
    return this.request(`/weekly/${courseId}/${level}/week/${weekNumber}`);
  }

  async completeAssignment(courseId: string, level: string, weekNumber: number, assignmentIndex: number): Promise<ApiResponse> {
    return this.request(`/weekly/${courseId}/${level}/week/${weekNumber}/complete-assignment`, {
      method: 'POST',
      body: JSON.stringify({ assignmentIndex }),
    });
  }

  async completeQuiz(courseId: string, level: string, weekNumber: number, quizIndex: number, answers: any[], score: number): Promise<ApiResponse> {
    return this.request(`/weekly/${courseId}/${level}/week/${weekNumber}/complete-quiz`, {
      method: 'POST',
      body: JSON.stringify({ quizIndex, answers, score }),
    });
  }

  async getWeeklyProgress(courseId: string, level: string): Promise<ApiResponse> {
    return this.request(`/weekly/progress/${courseId}/${level}`);
  }

  // Progress
  async getProgress(): Promise<ApiResponse> {
    return this.request('/progress');
  }

  async getCourseProgress(courseId: string): Promise<ApiResponse> {
    return this.request(`/progress/${courseId}`);
  }

  async updateProgress(progressData: any): Promise<ApiResponse> {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async completeLesson(courseId: string, lessonId: string, quizPassed?: boolean): Promise<ApiResponse> {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify({
        courseId,
        lessonId,
        completed: true,
        quizPassed: quizPassed || false,
      }),
    });
  }

  // Lesson Content Generation
  async generateLessonSummary(lessonId: string): Promise<ApiResponse> {
    return this.request(`/lessons/${lessonId}/generate-summary`, {
      method: 'POST',
    });
  }

  async regenerateLessonContent(lessonId: string, prompt?: string): Promise<ApiResponse> {
    return this.request(`/lessons/${lessonId}/regenerate-content`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  // Alphabets
  async getAlphabetData(language: string): Promise<ApiResponse> {
    return this.request(`/alphabets/${language}`);
  }

  async getAllAlphabets(): Promise<ApiResponse> {
    return this.request('/alphabets');
  }

  // Greetings
  async getGreetingsData(language: string): Promise<ApiResponse> {
    return this.request(`/greetings/${language}`);
  }

  async getAllGreetings(): Promise<ApiResponse> {
    return this.request('/greetings');
  }

  // Assignments
  async getAssignmentForLesson(lessonId: string): Promise<ApiResponse> {
    return this.request(`/assignments/lesson/${lessonId}`);
  }

  async submitAssignment(assignmentId: string, answers: any[], timeSpent: number): Promise<ApiResponse> {
    return this.request(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent }),
    });
  }

  async getAssignmentSubmission(assignmentId: string): Promise<ApiResponse> {
    return this.request(`/assignments/${assignmentId}/submission`);
  }

  async generateAssignments(): Promise<ApiResponse> {
    return this.request('/assignments/generate', {
      method: 'POST',
    });
  }

  // Auth (if needed)
  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request('/auth/me');
  }

  async updateProfile(data: { name?: string; avatar?: string }): Promise<ApiResponse> {
    return this.request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Achievements
  async getAchievements(): Promise<ApiResponse> {
    return this.request('/achievements');
  }

  async getUserAchievements(): Promise<ApiResponse> {
    return this.request('/achievements/user');
  }

  async unlockAchievement(achievementId: string): Promise<ApiResponse> {
    return this.request('/achievements/unlock', {
      method: 'POST',
      body: JSON.stringify({ achievementId }),
    });
  }

  async getLeaderboard(): Promise<ApiResponse> {
    return this.request('/achievements/leaderboard');
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse> {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string): Promise<ApiResponse> {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead(): Promise<ApiResponse> {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Subscriptions
  async getSubscriptionPlans(): Promise<ApiResponse> {
    return this.request('/subscriptions/plans');
  }

  async getCurrentSubscription(): Promise<ApiResponse> {
    return this.request('/subscriptions/current');
  }

  async upgradeSubscription(plan: string, paymentMethod?: string): Promise<ApiResponse> {
    return this.request('/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan, paymentMethod }),
    });
  }

  async cancelSubscription(): Promise<ApiResponse> {
    return this.request('/subscriptions/cancel', {
      method: 'POST',
    });
  }

  // Projects
  async getProjects(): Promise<ApiResponse> {
    return this.request('/projects');
  }

  async getProject(id: string): Promise<ApiResponse> {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData: any): Promise<ApiResponse> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: any): Promise<ApiResponse> {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async submitProject(id: string): Promise<ApiResponse> {
    return this.request(`/projects/${id}/submit`, {
      method: 'POST',
    });
  }

  async deleteProject(id: string): Promise<ApiResponse> {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getShowcaseProjects(): Promise<ApiResponse> {
    return this.request('/projects/showcase/all');
  }

  // Messages
  async getMessages(roomId: string, limit?: number): Promise<ApiResponse> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/messages/${roomId}${query}`);
  }

  async sendMessage(messageData: any): Promise<ApiResponse> {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async deleteMessage(id: string): Promise<ApiResponse> {
    return this.request(`/messages/${id}`, {
      method: 'DELETE',
    });
  }

  // Translator
  async searchTranslator(word: string, language: string): Promise<ApiResponse> {
    return this.request(`/dictionary/search?word=${encodeURIComponent(word)}&language=${encodeURIComponent(language)}`);
  }
  
  // Legacy method name for backward compatibility
  async searchDictionary(word: string, language: string): Promise<ApiResponse> {
    return this.searchTranslator(word, language);
  }

  async getDictionaryWords(language: string, page?: number, limit?: number): Promise<ApiResponse> {
    const params = new URLSearchParams({ language });
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return this.request(`/dictionary/words?${params.toString()}`);
  }

  async createDictionaryEntry(entryData: any): Promise<ApiResponse> {
    return this.request('/dictionary', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async updateDictionaryEntry(id: string, entryData: any): Promise<ApiResponse> {
    return this.request(`/dictionary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  }

  async deleteDictionaryEntry(id: string): Promise<ApiResponse> {
    return this.request(`/dictionary/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;

