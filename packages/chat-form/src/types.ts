import type { ReactNode } from 'react';

export interface ChatContext {
  getFromName: (name: string) => string[] | undefined;
  getFirstFromName: (name: string) => string | undefined;
  getLastFromName: (name: string) => string | undefined;
}

export type IText =
  | ReactNode
  | ((context: ChatContext) => ReactNode | Promise<ReactNode>);

export interface ChatFormParams {
  template: ChatStep[];
  complete?: (context: ChatContext) => void | Promise<void>;
}

export interface IMessage {
  text: ReactNode;
  sender: 'bot' | 'user';
}

export interface ChatStep {
  if?: {
    condition: (context: ChatContext) => boolean | Promise<boolean>;
    children: ChatFormParams['template'];
    complete?: (context: ChatContext) => void | Promise<void>;
  };
  while?: {
    condition: (context: ChatContext) => boolean | Promise<boolean>;
    children: ChatFormParams['template'];
    complete?: (context: ChatContext) => void | Promise<void>;
  };
  output?: {
    text?: IText;
    wait?: number;
    complete?: (context: ChatContext) => void | Promise<void>;
  };
  input?: {
    type: 'text';
    name: string;
    validation?: {
      fn?: (value: string, context: ChatContext) => boolean | Promise<boolean>;
      errorText: IText;
    }[];
    complete?: (context: ChatContext) => void | Promise<void>;
  };
}
