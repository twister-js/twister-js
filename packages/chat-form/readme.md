# @twister-js/chat-form

A flexible and customizable React chat form component with TypeScript support. Create interactive chat-based forms with validation, conditional logic, and dynamic content.

[![npm version](https://badge.fury.io/js/@twister-js%2Fchat-form.svg)](https://badge.fury.io/js/@twister-js%2Fchat-form)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔄 **Interactive Chat Flow**: Create conversational forms that feel natural
- 📝 **Input Validation**: Built-in validation with custom error messages
- 🔀 **Conditional Logic**: Use `if` and `while` statements for dynamic flows
- ⏱️ **Timing Control**: Add delays between messages for realistic chat experience
- 🎯 **TypeScript Support**: Fully typed for better development experience
- 🎨 **Flexible Styling**: Bring your own UI components and styling
- 📦 **Lightweight**: Minimal dependencies, only requires React

## Installation

```bash
npm install @twister-js/chat-form
```

```bash
yarn add @twister-js/chat-form
```

```bash
pnpm add @twister-js/chat-form
```

## Quick Start

```typescript
import { useChatForm } from '@twister-js/chat-form';

function App() {
  const chat = useChatForm({
    template: [
      {
        output: {
          text: 'Hello! What\'s your name?',
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
          text: ctx => `Nice to meet you, ${ctx.getFirstFromName('name')}!`,
        },
      },
    ],
  });

  return (
    <div>
      <div>
        {chat.messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        disabled={chat.inputDisabled}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;
            chat.send(target.value);
            target.value = '';
          }
        }}
        placeholder="Type your message..."
      />
    </div>
  );
}
```

## API Reference

### useChatForm Hook

The main hook that provides chat form functionality.

```typescript
const chat = useChatForm({ template, complete? });
```

#### Parameters

- `template: ChatStep[]` - Array of chat steps defining the conversation flow
- `complete?: (context: ChatContext) => void | Promise<void>` - Optional callback when chat completes

#### Returns

```typescript
{
  send: (text: string) => void;
  messages: IMessage[];
  inputDisabled: boolean;
  values: { [key: string]: string[] };
  status: 'completed' | 'waiting' | 'active';
}
```

### Chat Steps

#### Output Step

Display a message from the bot.

```typescript
{
  output: {
    text: string | ReactNode | ((context: ChatContext) => ReactNode | Promise<ReactNode>);
    wait?: number; // Delay in milliseconds
    complete?: (context: ChatContext) => void | Promise<void>;
  }
}
```

#### Input Step

Collect user input with optional validation.

```typescript
{
  input: {
    type: 'text';
    name: string;
    validation?: {
      fn?: (value: string, context: ChatContext) => boolean | Promise<boolean>;
      errorText: string | ReactNode | ((context: ChatContext) => ReactNode | Promise<ReactNode>);
    }[];
    complete?: (context: ChatContext) => void | Promise<void>;
  }
}
```

#### Conditional Step (if)

Execute steps based on a condition.

```typescript
{
  if: {
    condition: (context: ChatContext) => boolean | Promise<boolean>;
    children: ChatStep[];
    complete?: (context: ChatContext) => void | Promise<void>;
  }
}
```

#### Loop Step (while)

Repeat steps while a condition is true.

```typescript
{
  while: {
    condition: (context: ChatContext) => boolean | Promise<boolean>;
    children: ChatStep[];
    complete?: (context: ChatContext) => void | Promise<void>;
  }
}
```

### Chat Context

The context object provides access to collected values:

```typescript
interface ChatContext {
  getFromName: (name: string) => string[] | undefined;
  getFirstFromName: (name: string) => string | undefined;
  getLastFromName: (name: string) => string | undefined;
}
```

## Examples

### Basic Form with Validation

```typescript
import { useChatForm } from '@twister-js/chat-form';

function AgeValidationExample() {
  const chat = useChatForm({
    template: [
      {
        output: {
          text: 'How old are you?',
        },
      },
      {
        input: {
          type: 'text',
          name: 'age',
          validation: [
            {
              fn: value => {
                const age = parseInt(value);
                return !isNaN(age) && age >= 0 && age <= 130;
              },
              errorText: 'Please enter a valid age between 0 and 130.',
            },
          ],
        },
      },
      {
        if: {
          condition: context => parseInt(context.getFirstFromName('age')!) < 18,
          children: [
            {
              output: {
                text: 'You are a minor.',
              },
            },
          ],
        },
      },
      {
        if: {
          condition: context => parseInt(context.getFirstFromName('age')!) >= 18,
          children: [
            {
              output: {
                text: 'You are an adult.',
              },
            },
          ],
        },
      },
    ],
  });

  return (
    <div>
      <div className="chat-messages">
        {chat.messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        disabled={chat.inputDisabled}
        onKeyUp={(e) => {
          const target = e.target as HTMLInputElement;
          if (e.key === 'Enter') {
            chat.send(target.value);
            target.value = '';
          }
        }}
        placeholder="Type your response..."
      />
    </div>
  );
}
```

### Dynamic Loop Example

```typescript
import { useChatForm } from '@twister-js/chat-form';
import { useRef } from 'react';

function TeamMembersExample() {
  const currentTeamSize = useRef(0);

  const chat = useChatForm({
    template: [
      {
        output: {
          text: 'How many members are in your team?',
        },
      },
      {
        input: {
          type: 'text',
          name: 'teamSize',
        },
      },
      {
        while: {
          condition: context => {
            const size = parseInt(context.getFirstFromName('teamSize')!);
            currentTeamSize.current++;
            return currentTeamSize.current <= size;
          },
          children: [
            {
              output: {
                text: _ => `What is the name of member ${currentTeamSize.current}?`,
              },
            },
            {
              input: {
                type: 'text',
                name: 'memberName',
              },
            },
            {
              output: {
                text: context => `How old is ${context.getLastFromName('memberName')}?`,
              },
            },
            {
              input: {
                type: 'text',
                name: 'memberAge',
              },
            },
          ],
        },
      },
      {
        output: {
          text: 'Thank you for providing your team information!',
        },
      },
    ],
  });

  return (
    <div>
      <div className="chat-messages">
        {chat.messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        disabled={chat.inputDisabled}
        onKeyUp={(e) => {
          const target = e.target as HTMLInputElement;
          if (e.key === 'Enter') {
            chat.send(target.value);
            target.value = '';
          }
        }}
        placeholder="Type your response..."
      />
      {chat.status === 'completed' && (
        <div className="completion-message">
          Chat completed! Collected values: {JSON.stringify(chat.values, null, 2)}
        </div>
      )}
    </div>
  );
}
```

### Delayed Messages

```typescript
const chat = useChatForm({
  template: [
    {
      output: {
        text: 'Enter your name:',
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
        text: 'Processing...',
        wait: 2000, // Wait 2 seconds
      },
    },
    {
      output: {
        text: ctx => `Welcome to our platform, ${ctx.getFirstFromName('name')}!`,
      },
    },
  ],
});
```

## TypeScript Support

The package includes full TypeScript definitions. All interfaces are exported for use in your applications:

```typescript
import type {
  ChatContext,
  ChatFormParams,
  ChatStep,
  IMessage,
  IText,
} from '@twister-js/chat-form';
```

## Styling

The component is unstyled by default, giving you complete control over the appearance. Here's a basic CSS example:

```css
.chat-messages {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.message {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.message.bot {
  background-color: #f0f0f0;
  text-align: left;
}

.message.user {
  background-color: #007bff;
  color: white;
  text-align: right;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
```

## Requirements

- React 16.8.0 or higher
- TypeScript 4.0 or higher (optional, but recommended)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT © [TwistByte](https://github.com/twister-js)

## Support

If you find this package useful, please consider giving it a ⭐ on [GitHub](https://github.com/twister-js/twister-js)!

For issues and feature requests, please use the [GitHub Issues](https://github.com/twister-js/twister-js/issues) page.