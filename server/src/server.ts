import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  initializeDB,
  createNewChat,
  addMessageToChat,
  getChats,
  getChatById,
  getPrompts,
  getSettings,
  createPrompt,
  updateSettings,
} from "./db/database";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
initializeDB();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const axiosInstance = axios.create({
  httpsAgent,
});

function generateUuid() {
  return crypto.randomUUID();
}

let accessToken = "";
let tokenExpiration = 0;

// Get access token
async function getAccessToken() {
  if (Date.now() < tokenExpiration) return accessToken;

  try {
    const response = await axiosInstance.post(
      `${process.env.GIGACHAT_AUTH_URL}`,
      new URLSearchParams({ scope: "GIGACHAT_API_PERS" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          RqUID: generateUuid(),
          Authorization: `Basic ${process.env.GIGACHAT_AUTH_KEY}`,
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error: any) {
    console.error("Token error:", error.response.data);
    throw new Error("Authentication failed");
  }
}

// Chat routes
app.get("/api/chats", async (req, res) => {
  try {
    const chats = await getChats();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

app.get("/api/chats/:id", async (req, res) => {
  try {
    const chat = await getChatById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

app.post("/api/chats", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newChat = await createNewChat(title);
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
});

app.post("/api/chats/:id/messages", async (req, res) => {
  try {
    const { role, content } = req.body;
    if (!role || !content)
      return res.status(400).json({ error: "Role and content are required" });

    const token = await getAccessToken();
    const response = await axiosInstance.post(
      process.env.GIGACHAT_API_URL!,
      {
        model: "GigaChat",
        messages: [{ role, content }],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    // Save user message
    await addMessageToChat(req.params.id, {
      role: "user",
      content,
      timestamp: new Date(),
    });

    // Save AI response
    const savedMessage = await addMessageToChat(req.params.id, {
      role: "assistant",
      content: aiMessage,
      timestamp: new Date(),
    });

    res.json(savedMessage);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

app.get("/api/prompts", async (req, res) => {
  try {
    const prompts = await getPrompts();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
});

app.post("/api/prompts", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ error: "Title and content are required" });

    const newPrompt = await createPrompt(title, content);
    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ error: "Failed to create prompt" });
  }
});

// Settings routes
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    const updatedSettings = await updateSettings(req.body);
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

app.post('/api/chats/:id/prompt', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });
    
    // Save user message
    await addMessageToChat(req.params.id, {
      role: 'user',
      content,
      timestamp: new Date()
    });
    
    // Get access token
    const token = await getAccessToken();
    
    // Get chat history for context
    const chat = await getChatById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    
    // Prepare messages for GigaChat (entire conversation history)
    const messages = chat.messages.map(m => ({
      role: m.role,
      content: m.content
    }));
    
    // Add the new prompt
    messages.push({
      role: 'user',
      content
    });
    
    // Call GigaChat API
    const response = await axiosInstance.post(
      process.env.GIGACHAT_API_URL!,
      {
        model: 'GigaChat',
        messages,
        temperature: chat.settings.temperature || 0.7,
        max_tokens: chat.settings.maxTokens || 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    
    // Save AI response
    const savedMessage = await addMessageToChat(req.params.id, {
      role: 'assistant',
      content: aiMessage,
      timestamp: new Date()
    });
    
    res.json({
      userMessage: content,
      aiMessage: savedMessage
    });
  } catch (error) {
    console.error('Prompt sending error:', error);
    res.status(500).json({ error: 'Failed to process prompt' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
