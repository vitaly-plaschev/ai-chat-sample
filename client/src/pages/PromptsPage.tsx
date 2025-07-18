import { useState } from 'react';
import { 
  List, 
  Button, 
  Form, 
  Input, 
  Typography, 
  Space, 
  message,
  Modal,
  Select,
  Spin,
  Card
} from 'antd';
import { PlusOutlined, SendOutlined } from '@ant-design/icons';
import { usePrompts, useCreatePrompt } from '../hooks/usePrompts';
import { useChats } from '../hooks/useChats';
import { useSendPromptToChat } from '../hooks/useChats';

const { Text, Title } = Typography;
const { Option } = Select;

const PromptsPage = () => {
  const [form] = Form.useForm();
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<{ id: string; content: string } | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { data: prompts, isLoading } = usePrompts();
  const { data: chats, isLoading: isChatsLoading } = useChats();
  const createPrompt = useCreatePrompt();
  const sendPrompt = useSendPromptToChat();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createPrompt.mutateAsync(values);
      form.resetFields();
      message.success('Prompt created');
    } catch (error) {
      message.error('Failed to create prompt');
    }
  };

  const openSendModal = (promptId: string, content: string) => {
    setSelectedPrompt({ id: promptId, content });
    setSendModalVisible(true);
  };

  const handleSendPrompt = async () => {
    if (!selectedPrompt || !selectedChatId) return;
    
    try {
      await sendPrompt.mutateAsync({ 
        chatId: selectedChatId, 
        content: selectedPrompt.content 
      });
      message.success('Prompt sent to chat');
      setSendModalVisible(false);
    } catch (error) {
      message.error('Failed to send prompt');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
      <div style={{ width: '350px' }}>
        <Card title="Create New Prompt" style={{ marginBottom: '24px' }}>
          <Form form={form} layout="vertical">
            <Form.Item 
              name="title" 
              label="Title" 
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter prompt title" />
            </Form.Item>
            <Form.Item 
              name="content" 
              label="Content" 
              rules={[{ required: true, message: 'Please enter content' }]}
            >
              <Input.TextArea 
                rows={6} 
                placeholder="Enter prompt content" 
                style={{ resize: 'none' }}
              />
            </Form.Item>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreate}
              block
            >
              Add Prompt
            </Button>
          </Form>
        </Card>
      </div>
      
      <div style={{ flex: 1 }}>
        <Card title="Saved Prompts">
          <List
            loading={isLoading}
            dataSource={prompts}
            renderItem={prompt => (
              <List.Item
                actions={[
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    onClick={() => openSendModal(prompt.id, prompt.content)}
                  >
                    Send to Chat
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{prompt.title}</Text>}
                  description={<Text>{prompt.content}</Text>}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
      
      {/* Send Prompt Modal */}
      <Modal
        title="Send Prompt to Chat"
        open={sendModalVisible}
        onCancel={() => setSendModalVisible(false)}
        onOk={handleSendPrompt}
        confirmLoading={sendPrompt.isLoading}
      >
        {selectedPrompt && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={5} style={{ marginBottom: '8px' }}>Prompt:</Title>
            <Text>{selectedPrompt.content}</Text>
          </div>
        )}
        
        <Form layout="vertical">
          <Form.Item label="Select Chat" required>
            <Select
              placeholder="Choose a chat to send to"
              value={selectedChatId}
              onChange={setSelectedChatId}
              loading={isChatsLoading}
            >
              {chats?.map(chat => (
                <Option key={chat.id} value={chat.id}>
                  {chat.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromptsPage;