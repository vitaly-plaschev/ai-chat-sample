import { Modal, Form, InputNumber, Select, Button, message } from 'antd';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { useEffect } from 'react';

const { Option } = Select;

const SettingsModal = ({ visible, onCancel }: { visible: boolean; onCancel: () => void }) => {
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
      onCancel();
    } catch (error) {
      message.error('Failed to update settings');
    }
  };

  return (
    <Modal
      title="AI Settings"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      confirmLoading={isLoading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="model" label="AI Model">
          <Select>
            <Option value="GigaChat">GigaChat</Option>
            <Option value="GigaChat-Pro">GigaChat Pro</Option>
          </Select>
        </Form.Item>
        <Form.Item 
          name="temperature" 
          label="Temperature (0-1)"
          rules={[
            { type: 'number', min: 0, max: 1, message: 'Must be between 0 and 1' }
          ]}
        >
          <InputNumber step={0.1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item 
          name="maxTokens" 
          label="Max Tokens"
          rules={[
            { type: 'number', min: 100, max: 4000, message: 'Must be between 100 and 4000' }
          ]}
        >
          <InputNumber step={100} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingsModal;