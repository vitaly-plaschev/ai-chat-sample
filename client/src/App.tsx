import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout, Menu, Button } from 'antd';
import { 
  MessageOutlined, 
  BulbOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import PromptsModal from './components/PromptsModal';
import SettingsModal from './components/SettingsModal';
import './App.css';

const { Content, Sider } = Layout;

const queryClient = new QueryClient();

function App() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [promptsVisible, setPromptsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={350} style={{ background: '#fff' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Menu
              mode="horizontal"
              items={[
                {
                  key: '1',
                  icon: <BulbOutlined />,
                  label: 'Prompts',
                  onClick: () => setPromptsVisible(true)
                },
                {
                  key: '2',
                  icon: <SettingOutlined />,
                  label: 'Settings',
                  onClick: () => setSettingsVisible(true)
                }
              ]}
            />
            <ChatList onSelectChat={setSelectedChatId} />
          </div>
        </Sider>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <ChatWindow chatId={selectedChatId || ''} />
        </Content>
      </Layout>

      <PromptsModal 
        visible={promptsVisible} 
        onCancel={() => setPromptsVisible(false)} 
      />
      <SettingsModal 
        visible={settingsVisible} 
        onCancel={() => setSettingsVisible(false)} 
      />
      
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;