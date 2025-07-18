import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchChats, 
  fetchChatById, 
  createNewChat as apiCreateNewChat,
  sendMessage as apiSendMessage,
  sendPromptToChat,
  updateChatTitle,
  deleteChat
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

export const useUpdateChatTitle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, title }: { chatId: string; title: string }) => 
      updateChatTitle(chatId, title),
    onSuccess: (data, variables) => {
      // Update the specific chat in the chats list
      queryClient.setQueryData<Chat[]>(['chats'], (oldChats = []) => 
        oldChats.map(chat => 
          chat.id === variables.chatId ? { ...chat, title: variables.title } : chat
        )
      );
      
      // Invalidate the specific chat query
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId] });
    }
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),
    onSuccess: (_, chatId) => {
      // Remove the chat from the chats list
      queryClient.setQueryData<Chat[]>(['chats'], (oldChats = []) => 
        oldChats.filter(chat => chat.id !== chatId)
      );
      
      // Invalidate the specific chat query
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    }
  });
};