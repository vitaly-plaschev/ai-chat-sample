import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchChats, 
  fetchChatById, 
  createNewChat as apiCreateNewChat,
  sendMessage as apiSendMessage
} from '../api';

export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats
  });
};

export const useChat = (id: string) => {
  return useQuery({
    queryKey: ['chat', id],
    queryFn: () => fetchChatById(id)
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (title: string) => apiCreateNewChat(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });
};

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (content: string) => apiSendMessage(chatId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    }
  });
};