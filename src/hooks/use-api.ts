import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/integrations/api/client';
import { toast } from 'sonner';

// Health Check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
    retry: 3,
    retryDelay: 1000,
  });
};

// Users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: any) => apiClient.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: any }) =>
      apiClient.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
};

// Courses
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => apiClient.getCourses(),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => apiClient.getCourse(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseData: any) => apiClient.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create course: ${error.message}`);
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, courseData }: { id: string; courseData: any }) =>
      apiClient.updateCourse(id, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update course: ${error.message}`);
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete course: ${error.message}`);
    },
  });
};

// Progress - User-specific
export const useProgress = () => {
  return useQuery({
    queryKey: ['progress'],
    queryFn: () => apiClient.getProgress(),
  });
};

export const useCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: ['progress', courseId],
    queryFn: () => apiClient.getCourseProgress(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (progressData: any) => apiClient.updateProgress(progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      toast.success('Progress updated!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update progress: ${error.message}`);
    },
  });
};

