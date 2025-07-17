import { Form, InputNumber, Select, Button, message } from 'antd';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { useEffect } from 'react';

const { Option } = Select;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const { data: settings } = useSettings();
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
      message.success('Settings updated');
    } catch (error) {
      message.error('Failed to update settings');
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <Form form={form} layout="vertical">
        <Form.Item name="model" label="AI Model">
          <Select>
            <Option value="GigaChat">GigaChat</Option>
            <Option value="GigaChat-Pro">GigaChat Pro</Option>
          </Select>
        </Form.Item>
        <Form.Item name="temperature" label="Temperature (0-1)">
          <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="maxTokens" label="Max Tokens">
          <InputNumber min={100} max={4000} step={100} style={{ width: '100%' }} />
        </Form.Item>
        <Button type="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Form>
    </div>
  );
};

export default SettingsPage;