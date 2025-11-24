import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Copy, Check, Trash2, Search, Bell, Settings } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { StorageManager } from '../utils/localStorage';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  messages: Message[];
}

export const MessagesPage: React.FC = () => {
  const storage = StorageManager.getInstance();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const telegramUrl = 'https://t.me/loveinthecity';
  const whatsappUrl = 'https://wa.me/1234567890';

  // Initialize conversations from storage
  useEffect(() => {
    const loadConversations = () => {
      const savedConversations = storage.get<Conversation[]>('conversations');
      if (savedConversations && savedConversations.length > 0) {
        setConversations(savedConversations);
        setSelectedConversation(savedConversations[0]);
      } else {
        // Create default conversations
        const defaultConversations: Conversation[] = MOCK_USERS.filter(u => u.id !== 'support')
          .slice(0, 5)
          .map((user, index) => ({
            id: `conv_${user.id}`,
            userId: user.id,
            userName: user.name,
            userImage: user.images[0],
            lastMessage: 'Hi! How are you?',
            lastMessageTime: Date.now() - (index * 60000),
            unreadCount: index % 2 === 0 ? index : 0,
            messages: [
              {
                id: 'msg_1',
                conversationId: `conv_${user.id}`,
                senderId: user.id,
                text: 'Hi! How are you?',
                timestamp: Date.now() - 300000,
                read: true
              },
              {
                id: 'msg_2',
                conversationId: `conv_${user.id}`,
                senderId: 'me',
                text: 'I\'m doing great! How about you?',
                timestamp: Date.now() - 240000,
                read: true
              },
              {
                id: 'msg_3',
                conversationId: `conv_${user.id}`,
                senderId: user.id,
                text: 'Great! Would you like to meet up?',
                timestamp: Date.now() - 60000,
                read: false
              }
            ]
          }));
        storage.set('conversations', defaultConversations);
        setConversations(defaultConversations);
        setSelectedConversation(defaultConversations[0]);
      }
    };

    loadConversations();
  }, [storage]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'me',
      text: messageInput,
      timestamp: Date.now(),
      read: true
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          lastMessageTime: Date.now()
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    storage.set('conversations', updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessage: messageInput,
      lastMessageTime: Date.now()
    });
    setMessageInput('');
  };

  const handleDeleteConversation = (conversationId: string) => {
    const filtered = conversations.filter(c => c.id !== conversationId);
    setConversations(filtered);
    storage.set('conversations', filtered);
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(filtered[0] || null);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyContactInfo = () => {
    if (!selectedConversation) return;
    const info = `Contact: ${selectedConversation.userName}\nStarted chatting to connect!`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-full bg-gray-50 flex flex-col pb-20 font-sans text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle size={24} className="text-primary" />
            <div>
              <h1 className="text-xl font-bold">Messages</h1>
              {totalUnread > 0 && (
                <p className="text-xs text-red-500">
                  {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Bell size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-gray-200 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                  selectedConversation?.id === conv.id
                    ? 'bg-primary/5 border-l-4 border-primary'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={conv.userImage}
                    alt={conv.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm truncate">{conv.userName}</h3>
                      <span className="text-xs text-gray-400">
                        {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <div className="inline-block bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-2">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 hidden md:flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConversation.userImage}
                  alt={selectedConversation.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-bold text-sm">{selectedConversation.userName}</h2>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyContactInfo}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  title="Copy contact info"
                >
                  {copied ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <Copy size={20} className="text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteConversation(selectedConversation.id)}
                  className="p-2 hover:bg-red-50 rounded-full transition"
                  title="Delete conversation"
                >
                  <Trash2 size={20} className="text-gray-600 hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {selectedConversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.senderId === 'me'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase">Quick Links</p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition text-center font-medium"
                >
                  💬 Telegram Support
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition text-center font-medium"
                >
                  📱 WhatsApp Help
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center text-center">
            <div>
              <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
