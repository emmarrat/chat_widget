import React, {useEffect, useRef, useState} from 'react';
import './ChatWidget.css';

interface Props {
  url: string;
  emptyMessages?: string;
  minHeight?: number;
  maxHeight?: number;
}

interface Message {
  role: string;
  content: string;
}

const ChatWidget: React.FC<Props> = ({
                                       url,
                                       emptyMessages,
                                       minHeight,
                                       maxHeight
                                     }) => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [widgetHeight, setWidgetHeight] = useState(minHeight ? minHeight : 150);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetMaxHeight = maxHeight ? maxHeight : 400;

  useEffect(() => {
    scrollToBottom();
    setWidgetHeight(messages.length > 0 ? widgetMaxHeight : widgetHeight);
  }, [messages, widgetMaxHeight, widgetHeight]);

  const sendMessage = async () => {
    const userMessage = {role: 'user', content: inputText};
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(
        url,
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
    } finally {
      setIsLoading(false);
    }
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
      return <h3>{emptyMessages ? emptyMessages : 'Please send a message to start the dialog...'}</h3>;
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
          <div className="circle"/>
          <div className="circle"/>
          <div className="circle"/>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="widget" style={{height: `${widgetHeight}px`}}>
      <div
        className="messages"
        ref={containerRef}
      >
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
