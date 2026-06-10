// messageBus.ts
type Message = {
  id: number;
  sender: string;
  recipient: string;
  recipientRole: string;
  message: string;
  files: { name: string; size: number; type: string }[];
  timestamp: string;
  status: string;
};

class MessageBus {
  private static instance: MessageBus;
  private listeners: Map<string, (message: Message) => void> = new Map();

  private constructor() {}

  static getInstance(): MessageBus {
    if (!MessageBus.instance) {
      MessageBus.instance = new MessageBus();
    }
    return MessageBus.instance;
  }

  subscribe(role: string, callback: (message: Message) => void): void {
    this.listeners.set(role, callback);
  }

  unsubscribe(role: string): void {
    this.listeners.delete(role);
  }

  send(message: Message): void {
    const recipientCallback = this.listeners.get(message.recipientRole);
    if (recipientCallback) {
      recipientCallback(message);
    }
    // Also dispatch as event for components that prefer event listeners
    window.dispatchEvent(new CustomEvent('newMessage', { detail: message }));
  }
}

export default MessageBus.getInstance();