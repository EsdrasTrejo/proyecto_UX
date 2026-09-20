import api from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const getProfile =
  async (): Promise<UserProfile> => {
    const response =
      await api.get<UserProfile>(
        '/auth/profile',
      );

    return response.data;
  };