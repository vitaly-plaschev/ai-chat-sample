import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchChats, 
  fetchChatById, 
  createNewChat as apiCreateNewChat,
  sendMessage as apiSendMessage,
  sendPromptToChat
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

// export const useSendPromptToChat = () => {
//   return useMutation({
//     mutationFn: ({ chatId, content }: { chatId: string; content: string }) => 
//       sendPromptToChat(chatId, content)
//   });
// };

export const useSendPromptToChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) => 
      sendPromptToChat(chatId, content),
    onSuccess: (data, variables) => {
      // Invalidate the chat query to refetch the updated chat
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId] });
    }
  });
};