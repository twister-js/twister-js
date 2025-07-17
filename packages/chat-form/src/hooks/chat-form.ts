import { useEffect, useRef, useState } from 'react';
import type { ChatContext, ChatFormParams, ChatStep, IMessage } from '../types';

export function useChatForm({ template }: ChatFormParams) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [chatCompleted, setChatCompleted] = useState(false);

  const currentPosition = useRef<number[]>([]);
  const chatValues = useRef<{ [key: string]: string[] }>({});
  const context = useRef<ChatContext>({
    getFromName: name => chatValues.current[name],
    getFirstFromName: name => chatValues.current[name]?.[0],
    getLastFromName: name => chatValues.current[name]?.slice(-1)[0],
  });

  useEffect(() => {
    if (currentPosition.current.length === 0) {
      currentPosition.current = [0];
      validateTemplate();
      continueChat();
    }
  }, []);

  function validateTemplate() {
    for (const step of template) {
      const validArgs =
        (step.input ? 1 : 0) +
        (step.output ? 1 : 0) +
        (step.if ? 1 : 0) +
        (step.while ? 1 : 0);
      if (validArgs !== 1) {
        throw new Error(
          'Each step must have exactly one of input, output, if, or while defined'
        );
      }

      if (step.if || step.while) {
        if ((step.if?.children || step.while?.children || []).length === 0) {
          throw new Error('If or while step must have children defined');
        }
      }
    }
  }

  function getStepFromTemplate(
    position: number[],
    template: ChatStep[]
  ): ChatStep | undefined {
    const step = template[position[0]];

    if (step && (step.if || step.while) && position.length > 1) {
      return getStepFromTemplate(
        position.slice(1),
        step.if?.children || step.while?.children || []
      );
    }

    return step;
  }

  function nextPosition(position: number[]): number[] {
    const nextPos = [...position];
    nextPos[nextPos.length - 1] += 1;

    let step = getStepFromTemplate(nextPos, template);

    if (step) {
      return nextPos;
    }

    nextPos.pop();

    step = getStepFromTemplate(nextPos, template);

    if (step?.if) {
      return nextPosition(nextPos);
    }

    return nextPos;
  }

  async function continueChat() {
    const step = getStepFromTemplate(currentPosition.current, template);

    if (!step) {
      setChatCompleted(true);
      return;
    }

    if (step.output) {
      const text =
        typeof step.output.text === 'function'
          ? await step.output.text(context.current)
          : step.output.text;
      setMessages(prev => [...prev, { text, sender: 'bot' }]);

      const tasks = [];

      if (step.output.complete) {
        tasks.push(step.output.complete(context.current));
      }
      if (step.output.wait && step.output.wait > 0) {
        tasks.push(
          new Promise(resolve => setTimeout(resolve, step.output?.wait))
        );
      }

      await Promise.all(tasks);
      const nextPos = nextPosition(currentPosition.current);

      currentPosition.current = nextPos;
      await continueChat();
    } else if (step.input) {
      setInputDisabled(false);
    } else if (step.while) {
      const condition = await step.while.condition(context.current);

      if (condition) {
        currentPosition.current.push(0);
      } else {
        const nextPos = nextPosition(currentPosition.current);
        currentPosition.current = nextPos;
      }
      await continueChat();
    } else if (step.if) {
      const condition = await step.if.condition(context.current);

      if (condition) {
        currentPosition.current.push(0);
      } else {
        const nextPos = nextPosition(currentPosition.current);
        currentPosition.current = nextPos;
      }

      await continueChat();
    }
  }

  async function handleInput(text: string) {
    setInputDisabled(true);
    const step = getStepFromTemplate(currentPosition.current, template);
    setMessages(prevMessages => [
      ...prevMessages,
      { text: text, sender: 'user' },
    ]);

    for (const validation of step?.input?.validation ?? []) {
      if (validation.fn) {
        if (!(await validation.fn(text, context.current))) {
          const text =
            typeof validation.errorText === 'function'
              ? await validation.errorText(context.current)
              : validation.errorText;
          setMessages(prev => [...prev, { text, sender: 'bot' }]);
          await continueChat();
          return;
        }
      }
    }

    const name = step?.input?.name;

    if (name) {
      if (chatValues.current[name]) {
        chatValues.current[name].push(text);
      } else {
        chatValues.current[name] = [text];
      }
    }

    const nextPos = nextPosition(currentPosition.current);

    currentPosition.current = nextPos;
    await continueChat();
  }

  const status: 'completed' | 'waiting' | 'active' = chatCompleted
    ? 'completed'
    : inputDisabled
      ? 'waiting'
      : 'active';

  return {
    send: handleInput,
    messages,
    inputDisabled,
    values: chatValues.current,
    status,
  };
}
