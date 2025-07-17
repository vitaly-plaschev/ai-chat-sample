import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout, Menu } from "antd";
import {
  MessageOutlined,
  BulbOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ChatPage from "./pages/ChatPage";
import PromptsPage from "./pages/PromptsPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

const { Content } = Layout;

const queryClient = new QueryClient();

function App() {
  const [currentPage, setCurrentPage] = useState("chat");
  
  const renderPage = () => {
    switch (currentPage) {
      case "prompts":
        return <PromptsPage />;
      case "settings":
        return <SettingsPage />;
      case "chat":
      default:
        return <ChatPage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Menu
          mode="horizontal"
          selectedKeys={[currentPage]}
          style={{ height: "100%" }}
          items={[
            {
              key: "chat",
              icon: <MessageOutlined />,
              label: "Chat",
              onClick: () => setCurrentPage("chat"),
            },
            {
              key: "prompts",
              icon: <BulbOutlined />,
              label: "Prompts",
              onClick: () => setCurrentPage("prompts"),
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
              onClick: () => setCurrentPage("settings"),
            },
          ]}
        />
        <Content style={{ padding: "24px", background: "#fff", height: "90%" }}>
          {renderPage()}
        </Content>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
