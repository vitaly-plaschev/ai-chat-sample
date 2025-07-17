import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from 'antd';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

const { Content, Sider } = Layout;

const queryClient = new QueryClient();

function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);  

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Sider width={350} style={{ background: '#fff' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>            
            <ChatList onSelectChat={setSelectedChatId} />
          </div>
        </Sider>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <ChatWindow chatId={selectedChatId || ''} />
        </Content>
      </Layout>      
    </QueryClientProvider>
  );
}

export default ChatPage;