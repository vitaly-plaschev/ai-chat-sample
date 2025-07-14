import { useQuery, useMutation } from '@tanstack/react-query';
import {Settings} from '../types';
import { fetchSettings, updateSettings as apiUpdateSettings } from '../api';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings
  });
};

export const useUpdateSettings = () => {
  return useMutation({
    mutationFn: (settings: Partial<Settings>) => apiUpdateSettings(settings)
  });
};