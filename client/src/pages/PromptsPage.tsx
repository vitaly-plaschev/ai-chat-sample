import { useState } from 'react';
import { 
  List, 
  Button, 
  Form, 
  Input, 
  Typography, 
  Space, 
  message,
  Modal
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { usePrompts, useCreatePrompt } from '../hooks/usePrompts';
import { useSendMessage } from '../hooks/useChats';

const { Text } = Typography;

const PromptsPage = () => {
  const [form] = Form.useForm();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const { data: prompts, isLoading } = usePrompts();
  const createPrompt = useCreatePrompt();
  const sendMessage = useSendMessage(selectedPrompt || '');

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

  const handleSendPrompt = async (content: string) => {
    Modal.confirm({
      title: 'Send this prompt to chat?',
      content: content,
      onOk: async () => {
        await sendMessage.mutateAsync(content);
        message.success('Prompt sent to chat');
      }
    });
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '300px', marginRight: '16px' }}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Prompt title" />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="Prompt content" />
          </Form.Item>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
          >
            Add Prompt
          </Button>
        </Form>
      </div>
      
      <div style={{ flex: 1, overflow: 'auto' }}>
        <List
          loading={isLoading}
          dataSource={prompts}
          renderItem={(prompt: any) => (
            <List.Item
              actions={[
                <Button onClick={() => handleSendPrompt(prompt.content)}>
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
      </div>
    </div>
  );
};

export default PromptsPage;