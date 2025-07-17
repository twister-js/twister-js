import { useChatForm } from '@twister-js/chat-form';
import { useState } from 'react';

function App() {
  const [inputValue, setInputValue] = useState('');

  const chat = useChatForm({
    template: [
      {
        output: {
          text: 'Enter your name: ',
        },
      },
      {
        input: {
          type: 'text',
          name: 'name',
        },
      },
      {
        output: {
          text: 'Thinking...',
          wait: 2000,
        },
      },
      {
        output: {
          text: ctx => `Hello, ${ctx.getFirstFromName('name')}!`,
        },
      },
    ],
  });

  const handleSend = () => {
    if (inputValue.trim()) {
      chat.send(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid #e1e5e9',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
          }}
        >
          Chat Form
        </h1>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
        }}
      >
        {chat.messages.map((message, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor:
                message.sender === 'user' ? '#3b82f6' : '#f1f3f4',
              border:
                message.sender === 'user'
                  ? '1px solid #3b82f6'
                  : '1px solid #e1e5e9',
              color: message.sender === 'user' ? 'white' : 'inherit',
              maxWidth: 'fit-content',
              marginLeft: message.sender === 'user' ? 'auto' : '0',
              marginRight: message.sender === 'user' ? '0' : 'auto',
            }}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* Input Container */}
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid #e1e5e9',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end',
          }}
        >
          <input
            type='text'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder='Type your message...'
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = '#3b82f6')}
            onBlur={e => (e.target.style.borderColor = '#d1d5db')}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: inputValue.trim() ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
              fontWeight: '500',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
