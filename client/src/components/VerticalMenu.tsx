import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout, Menu } from 'antd';
import { 
  MessageOutlined, 
  BulbOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import ChatPage from '../pages/ChatPage';
import PromptsPage from '../pages/PromptsPage';
import SettingsPage from '../pages/SettingsPage';

const { Content, Sider } = Layout;

const queryClient = new QueryClient();

function VerticalMenu() {
  const [currentPage, setCurrentPage] = useState('chat');  

  const renderPage = () => {
    switch (currentPage) {
      case 'prompts':
        return <PromptsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'chat':
      default:
        return <ChatPage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={250} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[currentPage]}
            style={{ height: '100%' }}
            items={[
              {
                key: 'chat',
                icon: <MessageOutlined />,
                label: 'Chat',
                onClick: () => setCurrentPage('chat')
              },
              {
                key: 'prompts',
                icon: <BulbOutlined />,
                label: 'Prompts',
                onClick: () => setCurrentPage('prompts')
              },
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: 'Settings',
                onClick: () => setCurrentPage('settings')
              }
            ]}
          />
        </Sider>
        <Content style={{ padding: '24px', background: '#fff' }}>
          {renderPage()}
        </Content>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default VerticalMenu;