import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  List, 
  Button, 
  Form, 
  Input, 
  Typography, 
  Space, 
  message,
  Modal,
  Popconfirm,
  Card
} from 'antd';
import { PlusOutlined, SendOutlined } from '@ant-design/icons';
import { usePrompts, useCreatePrompt } from '../hooks/usePrompts';
import { useChats } from '../hooks/useChats';

const { Text } = Typography;

const PromptsPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: prompts, isLoading } = usePrompts();
  const createPrompt = useCreatePrompt();
  const { data: chats } = useChats();

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

  const handleSendPrompt = (content: string) => {
    if (!chats || chats.length === 0) {
      message.warning('Please create a chat first');
      return;
    }

    Modal.confirm({
      title: 'Send this prompt to chat?',
      content: content,
      okText: 'Send',
      onOk: () => {
        navigate('/chat');
        // In a real app, you'd pass the prompt content to the chat page via state
        message.info('Navigate to chat and paste the prompt manually');
      }
    });
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
                    onClick={() => handleSendPrompt(prompt.content)}
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
    </div>
  );
};

export default PromptsPage;