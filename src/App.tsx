import React from 'react';
import ChatWidget from "./components/ChatWidget/ChatWidget";

function App() {
  return (
<div className="container">
  <div>
    <ChatWidget
      url='https://cors-anywhere.herokuapp.com/https://emmarrat.app.n8n.cloud/webhook/chat-widget'
    />
  </div>
</div>
  );
}

export default App;
