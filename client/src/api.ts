import axios from 'axios';
import { type Settings } from './types';


const API_URL = 'http://localhost:5000/api';

export const fetchChats = async () => {
  const response = await axios.get(`${API_URL}/chats`);
  return response.data;
};

export const fetchChatById = async (id: string) => {
  const response = await axios.get(`${API_URL}/chats/${id}`);
  return response.data;
};

export const createNewChat = async (title: string) => {
  const response = await axios.post(`${API_URL}/chats`, { title });
  return response.data;
};

export const sendMessage = async (chatId: string, content: string) => {
  const response = await axios.post(`${API_URL}/chats/${chatId}/messages`, {
    role: 'user',
    content
  });
  return response.data;
};

export const fetchPrompts = async () => {
  const response = await axios.get(`${API_URL}/prompts`);
  return response.data;
};

export const createPrompt = async (title: string, content: string) => {
  const response = await axios.post(`${API_URL}/prompts`, { title, content });
  return response.data;
};

export const fetchSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`);
  return response.data;
};

export const updateSettings = async (settings: Partial<Settings>) => {
  const response = await axios.put(`${API_URL}/settings`, settings);
  return response.data;
};

export const sendPromptToChat = async (chatId: string, content: string) => {
  const response = await axios.post(`${API_URL}/chats/${chatId}/prompt`, { content });
  return response.data;
};