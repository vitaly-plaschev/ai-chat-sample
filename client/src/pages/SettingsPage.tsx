import { Form, InputNumber, Select, Button, message, Card } from 'antd';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { useEffect } from 'react';

const { Option } = Select;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateSettings.mutateAsync(values);
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Failed to update settings');
    }
  };

  return (
    <Card title="AI Assistant Settings" style={{ maxWidth: '600px' }}>
      <Form form={form} layout="vertical">
        <Form.Item 
          name="model" 
          label="AI Model"
          rules={[{ required: true, message: 'Please select a model' }]}
        >
          <Select>
            <Option value="GigaChat">GigaChat</Option>
            <Option value="GigaChat-Pro">GigaChat Pro</Option>
            <Option value="GigaChat-Plus">GigaChat Plus</Option>
          </Select>
        </Form.Item>
        <Form.Item 
          name="temperature" 
          label="Temperature"
          tooltip="Controls randomness: Lower = more deterministic, Higher = more random"
          rules={[
            { 
              type: 'number', 
              min: 0, 
              max: 2, 
              message: 'Must be between 0 and 2' 
            }
          ]}
        >
          <InputNumber step={0.1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item 
          name="maxTokens" 
          label="Max Tokens"
          tooltip="Maximum number of tokens to generate in the response"
          rules={[
            { 
              type: 'number', 
              min: 100, 
              max: 4000, 
              message: 'Must be between 100 and 4000' 
            }
          ]}
        >
          <InputNumber step={100} style={{ width: '100%' }} />
        </Form.Item>
        <Button 
          type="primary" 
          onClick={handleSave}
          loading={updateSettings.isLoading}
        >
          Save Settings
        </Button>
      </Form>
    </Card>
  );
};

export default SettingsPage;