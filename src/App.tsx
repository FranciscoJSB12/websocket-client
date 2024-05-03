import { useEffect, useState } from 'react';
import { connectToServer } from './socket-client';

const socket = connectToServer();

function App() {
  const [state, setState] = useState('Diconnected');
  const [clients, setClients] = useState<string[]>([]);
  const [formValue, setFormValue] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      setState('Connected');
    });

    socket.on('disconnect', () => {
      setState('Diconnected');
    });

    socket.on('clients-updated', (clients: string[]) => {
      setClients([...clients]);
    });

    socket.on(
      'message-from-server',
      (payload: { fullName: string; message: string }) => {
        setMessages(prevMessage => [
          ...prevMessage,
          `${payload.fullName}: ${payload.message}`,
        ]);
      }
    );
  }, []);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formValue === '') return;

    socket.emit('message-from-client', {
      id: 'YO',
      message: formValue,
    });

    setFormValue('');
  };

  return (
    <main>
      <h1>Websocket</h1>
      <h2>Status: {state}</h2>
      <ul>
        {clients.map((client, index) => (
          <li key={index}>{client}</li>
        ))}
      </ul>
      <hr />
      <form onSubmit={submitHandler}>
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
