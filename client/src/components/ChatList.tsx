import { List, Button, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useChats, useCreateChat } from '../hooks/useChats';

const { Title } = Typography;

const ChatList = ({ onSelectChat }: { onSelectChat: (id: string) => void }) => {
  const { data: chats, isLoading } = useChats();
  const createChat = useCreateChat();

  const handleNewChat = async () => {
    const newChat = await createChat.mutateAsync(`New Chat ${new Date().toLocaleTimeString()}`);
    onSelectChat(newChat.id);
  };

  return (
    <div style={{ padding: '16px', width: '250px', borderRight: '1px solid #f0f0f0' }}>
      <Space style={{ marginBottom: '16px', width: '100%' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleNewChat}
          block
        >
          New Chat
        </Button>
      </Space>
      
      <Title level={4} style={{ marginTop: '0' }}>Chat History</Title>
      
      <List
        loading={isLoading}
        dataSource={chats || []}
        renderItem={(chat: any) => (
          <List.Item 
            onClick={() => onSelectChat(chat.id)}
            style={{ cursor: 'pointer', padding: '8px 0' }}
          >
            <List.Item.Meta
              title={chat.title}
              description={new Date(chat.createdAt).toLocaleString()}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ChatList;