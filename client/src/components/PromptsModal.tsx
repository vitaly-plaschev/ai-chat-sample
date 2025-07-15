import { Modal, List, Button, Form, Input, Typography, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { usePrompts, useCreatePrompt } from '../hooks/usePrompts';
import { type Prompt } from '../types';

const { Text } = Typography;

const PromptsModal = ({ visible, onCancel }: { visible: boolean; onCancel: () => void }) => {
  const [form] = Form.useForm();
  const { data: prompts, isLoading } = usePrompts();
  const createPrompt = useCreatePrompt();

  const handleCreatePrompt = async () => {
    try {
      const values = await form.validateFields();
      await createPrompt.mutateAsync(values);
      form.resetFields();
      message.success('Prompt created successfully');
    } catch (error) {
      message.error('Failed to create prompt');
    }
  };

  return (
    <Modal
      title="Manage Prompts"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div style={{ display: 'flex', height: '500px' }}>
        <div style={{ width: '50%', padding: '16px', borderRight: '1px solid #f0f0f0' }}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Prompt Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Enter prompt title" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Prompt Content"
              rules={[{ required: true, message: 'Please enter content' }]}
            >
              <Input.TextArea rows={6} placeholder="Enter prompt content" />
            </Form.Item>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreatePrompt}
            >
              Add Prompt
            </Button>
          </Form>
        </div>
        <div style={{ width: '50%', padding: '16px', overflow: 'auto' }}>
          <List
            loading={isLoading}
            dataSource={prompts || []}
            renderItem={(prompt: Prompt) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text strong>{prompt.title}</Text>}
                  description={<Text>{prompt.content}</Text>}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PromptsModal;