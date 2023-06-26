import React, {useEffect, useRef, useState} from 'react';
import './ChatWidget.css';

interface Props {
  url: string;
  emptyMessages?: string;
  minHeight?: number;
  maxHeight?: number;
  userColor?: string,
  botColor?: string,
  btnText?: string;
  bgColor?: string;
}

interface Message {
  role: string;
  content: string;
}


const ChatWidget: React.FC<Props> = ({
                                       url,
                                       emptyMessages,
                                       minHeight = 120,
                                       maxHeight = 400,
                                       userColor = '#5e3391',
                                       botColor = '#9170b7',
                                       btnText = 'Send',
                                       bgColor = '#ffff',
                                     }) => {

  const [messages, setMessages] = useState<Message[]>([{role: 'assistant', content: 'test'}]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [widgetHeight, setWidgetHeight] = useState(minHeight);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    setWidgetHeight(messages.length > 0 ? maxHeight : widgetHeight);
  }, [messages, maxHeight, widgetHeight]);

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

    return messages.map((message, index) => {
      const messageClassName = `message message-${message.role}`;
      const beforeClassName = message.role === 'user' ? 'message-user-before' : 'message-assistant-before';
      const beforeStyle = message.role === 'user' ? { borderTopColor: userColor } : { borderTopColor: botColor };

      return (
        <div key={index} className={messageClassName} style={{ background: message.role === 'user' ? userColor : botColor }}>
          {message.content}
          {message.role === 'user' && <div className={beforeClassName} style={beforeStyle} />}
          {message.role === 'assistant' && <div className={beforeClassName} style={beforeStyle} />}
        </div>
      );
    });
  };

  const renderLoadingAnimation = () => {
    if (isLoading) {
      return (
        <div className="loading-animation">
          <div className="circle" style={{background: botColor}}/>
          <div className="circle" style={{background: botColor}}/>
          <div className="circle" style={{background: botColor}}/>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="widget" style={{height: `${widgetHeight}px`, background: bgColor}}>
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
            <button type="submit" disabled={inputText.length === 0}>{btnText}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default ChatWidget;

