import React from 'react';
import ChatWidget from "./components/ChatWidget/ChatWidget";

function App() {
  return (
<div className="container">
    <ChatWidget
      url='https://cors-anywhere.herokuapp.com/https://emmarrat.app.n8n.cloud/webhook/chat-widget'
      // Забыл рассказать на видео в loom что использовал cors-anywhere чтобы обойти cors ошибки,
      // так как не смог подружить n8n с localhost:3000, много читал, везде говорилось, что это можно настроить легко когда n8n запущен на своем сервере
      // Чтобы протеститровать нужно будет зайти на ссылку https://cors-anywhere.herokuapp.com
      // и получить доступ к cors, после чего запросы на апи будут проходить без проблем
      emptyMessages="Send me message to start"
      minHeight={100}
      maxHeight={550}
    />
</div>
  );
}

export default App;
