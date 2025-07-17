import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/a11y-light.css";
import "highlight.js/styles/github-dark.css";
import { Alert, Button } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const extractTextFromChildren = (children) => {
    let text = "";
    React.Children.forEach(children, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        text += child;
      } else if (React.isValidElement(child) && child.props.children) {
        text += extractTextFromChildren(child.props.children);
      }
    });
    return text;
  };

  const handleCopy = (text: string, id: string, children: any) => {
    navigator.clipboard
      .writeText(extractTextFromChildren(children))
      .then(() => {
        setCopiedStates((prev) => {
          return { ...prev, [id]: true };
        });

        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [id]: false }));
        }, 2000);
      })
      .catch(() => {
        console.error("Failed to copy code");
      });
  };

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeText = String(children).replace(/\n$/, "");
          const uniqueId = `code-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          return !inline && match ? (
            <div className="code-block-container">
              <div className="code-block-header">
                <span>{match[1]}</span>
                <Button
                  type="text"
                  size="small"
                  className="copy-button"
                  icon={
                    copiedStates[uniqueId] ? (
                      <CheckOutlined />
                    ) : (
                      <CopyOutlined />
                    )
                  }
                  onClick={() => handleCopy(codeText, uniqueId, children)}
                >
                  {copiedStates[uniqueId] ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className={className}>
                <code {...props}>{children}</code>
              </pre>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <div className="ant-code-block">{children}</div>;
        },
        table({ children }) {
          return (
            <div className="ant-table-container">
              <table className="ant-table">{children}</table>
            </div>
          );
        },
        blockquote({ children }) {
          return <Alert message={children} type="info" showIcon />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
