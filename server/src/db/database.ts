import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface Settings {
  temperature: number;
  maxTokens: number;
  model: string;
}

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  settings: Settings;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DatabaseSchema {
  chats: Chat[];
  prompts: Prompt[];
  settings: Settings;
}

const adapter = new JSONFile<DatabaseSchema>("db.json");
const db = new Low<DatabaseSchema>(adapter, {
  chats: [],
  prompts: [],
  settings: { temperature: 0.7, maxTokens: 1000, model: "GigaChat" },
});

async function initializeDB() {
  await db.read();
  db.data ||= {
    chats: [],
    prompts: [
      {
        id: uuidv4(),
        title: "Code Review",
        content: "Please review this code and suggest improvements:",
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Content Summary",
        content: "Summarize the following content in bullet points:",
        createdAt: new Date(),
      },
    ],
    settings: {
      temperature: 0.7,
      maxTokens: 1000,
      model: "GigaChat",
    },
  };
  await db.write();
}

async function createNewChat(title: string): Promise<Chat> {
  const newChat: Chat = {
    id: uuidv4(),
    title,
    createdAt: new Date(),
    messages: [],
    settings: { temperature: 0.7, maxTokens: 1000, model: "Giga" },
  };

  db.data?.chats.push(newChat);
  await db.write();
  return newChat;
}

async function addMessageToChat(
  chatId: string,
  message: Omit<Message, "id">
): Promise<Message> {
  const chat = db.data?.chats.find((c) => c.id === chatId);
  if (!chat) throw new Error("Chat not found");

  const newMessage: Message = {
    id: uuidv4(),
    ...message,
  };

  chat.messages.push(newMessage);

  if (chat.messages.length === 1 && message.role === "user") {
    //  chat.title = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
    chat.title =
      message.content.substring(0, 30) +
      (message.content.length > 30 ? "..." : "");
    
    await db.write();
  }

  await db.write();
  return newMessage;
}

async function getChats(): Promise<Chat[]> {
  return db.data?.chats || [];
}

async function getChatById(chatId: string): Promise<Chat | undefined> {
  return db.data?.chats.find((c) => c.id === chatId);
}
async function getPrompts(): Promise<Prompt[]> {
  return db.data?.prompts || [];
}

async function createPrompt(title: string, content: string): Promise<Prompt> {
  const newPrompt: Prompt = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date(),
  };

  db.data?.prompts.push(newPrompt);
  await db.write();
  return newPrompt;
}

async function getSettings(): Promise<Settings> {
  return (
    db.data?.settings || {
      temperature: 0.7,
      maxTokens: 1000,
      model: "GigaChat",
    }
  );
}

async function updateSettings(
  newSettings: Partial<Settings>
): Promise<Settings> {
  if (!db.data) throw new Error("Database not initialized");

  db.data.settings = {
    ...db.data.settings,
    ...newSettings,
  };

  await db.write();
  return db.data.settings;
}

async function updateChatTitle(chatId: string, title: string): Promise<Chat> {
  if (!db.data) throw new Error("Database not initialized");
  
  const chatIndex = db.data.chats.findIndex(c => c.id === chatId);
  if (chatIndex === -1) throw new Error('Chat not found');
  
  db.data.chats[chatIndex].title = title;
  await db.write();
  return db.data.chats[chatIndex];
}

async function deleteChat(chatId: string): Promise<void> {
  if (!db.data) throw new Error("Database not initialized");
  
  const initialLength = db.data.chats.length;
  db.data.chats = db.data.chats.filter(chat => chat.id !== chatId);
  
  if (db.data.chats.length === initialLength) {
    throw new Error('Chat not found');
  }
  
  await db.write();
}

export {
  initializeDB,
  createNewChat,
  addMessageToChat,
  getChats,
  getChatById,
  getPrompts,
  createPrompt,
  getSettings,
  updateSettings,
  updateChatTitle,
  deleteChat
};

export type { Chat, Message };
