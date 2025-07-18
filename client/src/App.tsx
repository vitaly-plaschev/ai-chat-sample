import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { 
  MessageOutlined, 
  BulbOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import ChatPage from './pages/ChatPage';
import ChatPageNew from './pages/ChatPageNew';
import PromptsPage from './pages/PromptsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const { Content, Sider } = Layout;

const queryClient = new QueryClient();

const menuItems = [
  {
    key: '/chat',
    icon: <MessageOutlined />,
    label: 'Chat'
  },
  {
    key: '/prompts',
    icon: <BulbOutlined />,
    label: 'Prompts'
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Settings'
  }
];

const AppLayout = () => {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const selectedKey = location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: colorBgContainer }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
          onClick={({ key }) => window.location.href = key}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/chat" element={<ChatPageNew />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;