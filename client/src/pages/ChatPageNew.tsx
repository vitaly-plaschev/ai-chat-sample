import { useState, useEffect, useRef } from "react";
import {
  List,
  Typography,
  Card,
  Space,
  Spin,
  Input,
  Dropdown,
  Button,
  Popconfirm,
  type InputRef,
} from "antd";
import {
  SendOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useChat,
  useSendMessage,
  useChats,
  useCreateChat,
  useUpdateChatTitle,
  useDeleteChat,
} from "../hooks/useChats";
import { usePrompts } from "../hooks/usePrompts";
import { useQueryClient } from "@tanstack/react-query";
import MarkdownRenderer from "../components/MarkdownRenderer";

const { Text } = Typography;

const ChatPage = () => {
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newChatTitle, setNewChatTitle] = useState("");
  const inputRef = useRef<InputRef>(null);
  const { data: chats, isLoading: isChatsLoading } = useChats();
  const { data: chat, isLoading: isChatLoading } = useChat(
    selectedChatId || ""
  );
  const sendMessage = useSendMessage(selectedChatId || "");
  const createChat = useCreateChat();
  const updateTitle = useUpdateChatTitle();
  const deleteChat = useDeleteChat();
  const [message, setMessage] = useState("");
  const { data: prompts } = usePrompts();

  // Set first chat as selected when chats load
  useEffect(() => {
    if (chats && chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  // Focus input when editing
  useEffect(() => {
    if (editingChatId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingChatId]);

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
      console.error("Failed to send message : ", error);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const newChat = await createChat.mutateAsync(
        `New Chat ${new Date().toLocaleTimeString()}`
      );
      setSelectedChatId(newChat.id);
    } catch (error) {
      console.error("Failed to create new chat : ", error);
    }
  };

  const startEditing = (chatId: string, title: string) => {
    setEditingChatId(chatId);
    setNewChatTitle(title);
  };

  const cancelEditing = () => {
    setEditingChatId(null);
    setNewChatTitle("");
  };

  const saveTitle = async (chatId: string) => {
    if (!newChatTitle.trim()) {
      return;
    }

    try {
      await updateTitle.mutateAsync({ chatId, title: newChatTitle });
      setEditingChatId(null);
      setNewChatTitle("");
    } catch (error) {
      console.error("Failed to update chat title : ", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat.mutateAsync(chatId);

      // Select a new chat if the current one was deleted
      if (selectedChatId === chatId) {
        const remainingChats = chats?.filter((c) => c.id !== chatId) || [];
        setSelectedChatId(
          remainingChats.length > 0 ? remainingChats[0].id : null
        );
      }
    } catch (error) {
      console.error("Failed to delete chat : ", error);
    }
  };

  // Add real-time updates effect
  useEffect(() => {
    const handleFocus = () => {
      if (selectedChatId) {
        queryClient.invalidateQueries({ queryKey: ["chat", selectedChatId] });
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [selectedChatId, queryClient]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: "350px", marginRight: "24px" }}>
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
              style={{
                cursor: "pointer",
                background:
                  selectedChatId === chat.id ? "#e6f7ff" : "transparent",
                padding: "8px",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {editingChatId === chat.id ? (
                <div style={{ display: "flex", width: "100%" }}>
                  <Input
                    ref={inputRef}
                    value={newChatTitle}
                    onChange={(e) => setNewChatTitle(e.target.value)}
                    onPressEnter={() => saveTitle(chat.id)}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    onClick={() => saveTitle(chat.id)}
                  />
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={cancelEditing}
                  />
                </div>
              ) : (
                <div
                  style={{ flex: 1 }}
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  <Text
                    ellipsis
                    style={{
                      fontWeight:
                        selectedChatId === chat.id ? "bold" : "normal",
                      color: selectedChatId === chat.id ? "#1890ff" : "inherit",
                    }}
                  >
                    {chat.title}
                  </Text>
                </div>
              )}

              {editingChatId !== chat.id && (
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(chat.id, chat.title);
                    }}
                  />
                  <Popconfirm
                    title="Are you sure you want to delete this chat?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                </Space>
              )}
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
              {chat.messages?.map((msg) => (
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
                    // alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    // marginLeft: msg.role === "assistant" ? 0 : "auto",
                    // marginRight: msg.role === "user" ? 0 : "auto",
                  }}
                >
                  {/* <Text>{msg.content}</Text> */}
                  <MarkdownRenderer content={msg.content} />
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
                disabled={!selectedChatId}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={sendMessage.isLoading}
                disabled={!selectedChatId}
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

export default ChatPage;
