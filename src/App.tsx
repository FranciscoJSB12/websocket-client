import { useEffect, useState } from 'react';
import {
  ManageConnection,
  SocketIoConnection,
  MessageReceivedListener,
} from './socket-client';

function App() {
  const [state, setState] = useState('Diconnected');
  const [clients, setClients] = useState<string[]>([]);
  const [formValue, setFormValue] = useState('');
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<SocketIoConnection | null>(null);

  const onMessageReceived: MessageReceivedListener = payload => {
    setMessages(prevMessage => [
      ...prevMessage,
      `${payload.fullName}: ${payload.message}`,
    ]);
  };

  useEffect(() => {
    if (socket) {
      socket.addListeners(
        () => setState('Connected'),
        () => setState('Diconnected'),
        () => setClients([...clients]),
        onMessageReceived
      );
    }
  }, [socket]);

  const submitTokenHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (token === '') return;

    const newConnection = new ManageConnection(token, '/').connectToServer();

    const newSocket = new SocketIoConnection(newConnection);

    setSocket(newSocket);

    setToken('');
  };

  const submitMessageHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formValue === '') return;

    socket && socket.emitMessage(formValue);

    setFormValue('');
  };

  return (
    <main>
      <h1>Websocket</h1>
      <h2>Status: {state}</h2>
      <hr />
      <h2>Insert token:</h2>
      <form onSubmit={submitTokenHandler}>
        <input
          type='text'
          onChange={e => setToken(e.currentTarget.value)}
          value={token}
        />
        <button type='submit'>Send</button>
      </form>
      <ul>
        {clients.map((client, index) => (
          <li key={index}>{client}</li>
        ))}
      </ul>
      <hr />
      <h2>Type your message</h2>
      <form onSubmit={submitMessageHandler}>
        <input
          type='text'
          onChange={e => setFormValue(e.currentTarget.value)}
          value={formValue}
        />
        <button type='submit'>Send</button>
      </form>
      <hr />
      <h2>Messages:</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
