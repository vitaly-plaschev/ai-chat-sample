import { useEffect, useRef, useState } from 'react';
import { 
  Input, 
  Button, 
  List, 
  Typography, 
  Card, 
  Space, 
  Spin,
  message as antdMessage
} from 'antd';
import { Bubble } from "@ant-design/x";
import { SendOutlined } from '@ant-design/icons';
import { useChat, useSendMessage } from '../hooks/useChats';
import MarkdownRenderer from './MarkdownRenderer';

const { Text } = Typography;

const ChatWindow = ({ chatId }: { chatId: string }) => {
  const { data: chat, isLoading } = useChat(chatId);
  const sendMessage = useSendMessage(chatId);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage.mutateAsync(message);
      setMessage('');
    } catch (error) {
      antdMessage.error('Failed to send message');
    }
  };

  if (isLoading && !chat) {
    return <Spin size="large" style={{ margin: 'auto', display: 'block' }} />;
  }

  if (!chat) {
    return <Text type="secondary">Select a chat or create a new one</Text>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* <Bubble.List items={chat.messages} /> */}
        <List
          dataSource={chat.messages}
          renderItem={(msg: any) => (
            <List.Item style={{ padding: '8px 0' }}>
              <Card
                size="small"
                style={{ 
                  width: 'fit-content',
                  maxWidth: '80%',
                  backgroundColor: msg.role === 'user' ? '#f0f9ff' : '#f6f6f6',
                  border: 'none'
                }}
                bodyStyle={{ padding: '8px 12px' }}
              >
                {/* <Text>{msg.content}</Text> */}
                <MarkdownRenderer content={msg.content} />
                <div style={{ textAlign: 'right' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>
      
      <Space.Compact style={{ width: '100%', padding: '16px' }}>
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={handleSend}
          disabled={sendMessage.isPending}
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          onClick={handleSend}
          loading={sendMessage.isPending}
        >
          Send
        </Button>
      </Space.Compact>
    </div>
  );
};

export default ChatWindow;