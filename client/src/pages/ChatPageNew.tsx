import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  Typography,
  Card,
  Space,
  Spin,
  Input,
  Dropdown,
  Button,
  message,
} from "antd";
import { SendOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useChat,
  useSendMessage,
  useChats,
  useCreateChat,
} from "../hooks/useChats";
import { usePrompts } from "../hooks/usePrompts";

const { Text } = Typography;

const ChatPageNew = () => {
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { data: chats, isLoading: isChatsLoading } = useChats();
  const { data: chat, isLoading: isChatLoading } = useChat(
    selectedChatId || ""
  );
  const sendMessage = useSendMessage(selectedChatId || "");
  const createChat = useCreateChat();
  const [message, setMessage] = useState("");
  const { data: prompts } = usePrompts();

  // Set first chat as selected when chats load
  useEffect(() => {
    if (chats && chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  const promptItems = prompts?.map((prompt) => ({
    key: prompt.id,
    label: prompt.title,
    onClick: () => setMessage(prompt.content),
  }));

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage.mutateAsync(message);
      setMessage("");
    } catch (error) {
      message.error("Failed to send message");
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const newChat = await createChat.mutateAsync(
        `New Chat ${new Date().toLocaleTimeString()}`
      );
      setSelectedChatId(newChat.id);
      message.success("New chat created");
    } catch (error) {
      message.error("Failed to create new chat");
    }
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: "250px", marginRight: "24px" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateNewChat}
          style={{ marginBottom: "16px", width: "100%" }}
        >
          New Chat
        </Button>

        <List
          loading={isChatsLoading}
          size="small"
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item
              onClick={() => setSelectedChatId(chat.id)}
              style={{
                cursor: "pointer",
                background:
                  selectedChatId === chat.id ? "#e6f7ff" : "transparent",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <Text
                ellipsis
                style={{
                  fontWeight: selectedChatId === chat.id ? "bold" : "normal",
                  color: selectedChatId === chat.id ? "#1890ff" : "inherit",
                }}
              >
                {chat.title}
              </Text>
            </List.Item>
          )}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {isChatLoading && selectedChatId ? (
          <Spin size="large" style={{ margin: "auto" }} />
        ) : chat ? (
          <>
            <div
              style={{
                flex: 1,
                overflow: "auto",
                marginBottom: "16px",
                padding: "16px",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }}
            >
              {chat.messages?.map((msg: any) => (
                <Card
                  key={msg.id}
                  size="small"
                  style={{
                    marginBottom: "12px",
                    width: "fit-content",
                    maxWidth: "80%",
                    backgroundColor:
                      msg.role === "user" ? "#f0f9ff" : "#f6f6f6",
                    border: "none",
                  }}
                >
                  <Text>{msg.content}</Text>
                  <div style={{ textAlign: "right" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Text>
                  </div>
                </Card>
              ))}
            </div>

            <Space.Compact style={{ width: "100%" }}>
              <Dropdown menu={{ items: promptItems }} placement="topLeft">
                <Button>Prompts</Button>
              </Dropdown>
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={handleSend}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={sendMessage.isLoading}
              />
            </Space.Compact>
          </>
        ) : (
          <div style={{ textAlign: "center", margin: "auto" }}>
            <Text type="secondary">
              No chats available. Create a new chat to start.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPageNew;
