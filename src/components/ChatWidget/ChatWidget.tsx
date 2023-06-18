import React, { useEffect, useRef, useState } from 'react';
import './ChatWidget.css';

interface Message {
  role: string;
  content: string;
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const userMessage = { role: 'user', content: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://emmarrat.app.n8n.cloud/webhook/chat-widget',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: inputText,
          }),
        }
      );

      const data = await response.json();

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].message &&
        data[0].message.content
      ) {
        const responseMessage = data[0].message;
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setIsLoading(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputText(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendMessage();
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return <h3>Please send a message to start the dialog...</h3>;
    }

    return messages.map((message, index) => (
      <div
        key={index}
        className={`message message-${message.role}`}
      >
        {message.content}
      </div>
    ));
  };

  const renderLoadingAnimation = () => {
    if (isLoading) {
      return (
        <div className="loading-animation">
          <div className="circle" />
          <div className="circle" />
          <div className="circle" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="widget">
      <div className="messages" ref={containerRef}>
        {renderMessages()}
        {renderLoadingAnimation()}
      </div>

      <div className="input-wrapper">
        <form onSubmit={onSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
            />
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
