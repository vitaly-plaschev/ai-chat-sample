import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPrompts, createPrompt as apiCreatePrompt } from '../api';

export const usePrompts = () => {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: fetchPrompts
  });
};

export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) => 
      apiCreatePrompt(title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });
};