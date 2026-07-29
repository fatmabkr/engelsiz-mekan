import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, Info, Check, CheckCheck } from 'lucide-react';
import { ChatConversation, ChatMessage } from '../types';
import { MOCK_CHATS, MOCK_MESSAGES } from '../data/mockData';

interface ChatViewProps {
  onBack: () => void;
  initialChatId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ onBack, initialChatId }) => {
  const [chats] = useState<ChatConversation[]>(MOCK_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChatId || null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  const activeChat = chats.find((c) => c.id === selectedChatId);
  const activeMessages = selectedChatId ? messages[selectedChatId] || [] : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: selectedChatId,
      senderId: 'me',
      text: inputText,
      timestamp: 'Şimdi',
      isMe: true,
    };

    setMessages({
      ...messages,
      [selectedChatId]: [...activeMessages, newMsg],
    });

    setInputText('');

    // Simulate response
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        chatId: selectedChatId,
        senderId: 'partner',
        text: 'Mesajınızı aldım, mekanla ilgili bilgi edinip hemen dönüş yapacağım!',
        timestamp: 'Şimdi',
        isMe: false,
      };
      setMessages((prev) => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), replyMsg],
      }));
    }, 1200);
  };

  // If viewing a single chat thread
  if (selectedChatId && activeChat) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen pb-20 max-w-md mx-auto flex flex-col h-screen">
        {/* Chat Header */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedChatId(null)}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-700 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={activeChat.partnerAvatar}
                alt={activeChat.partnerName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {activeChat.onlineStatus && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 line-clamp-1">{activeChat.partnerName}</h3>
              <p className="text-[10px] font-bold text-[#009688]">
                {activeChat.venueTopic ? `Konu: ${activeChat.venueTopic}` : activeChat.partnerRole}
              </p>
            </div>
          </div>

          <button
            onClick={() => alert(`${activeChat.partnerName} ile doğrudan sesli iletişim başlatılıyor...`)}
            className="p-2 rounded-xl bg-teal-50 text-[#009688] hover:bg-teal-100 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>

        {/* Message Bubble Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-center my-2">
            <span className="px-3 py-1 bg-gray-200/70 text-gray-600 text-[10px] font-bold rounded-full">
              Engelsiz Mekân Güvenli Sohbet
            </span>
          </div>

          {activeMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  msg.isMe
                    ? 'bg-[#009688] text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Mesajınızı yazınız..."
            className="flex-1 p-3 text-xs bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#009688]"
          />
          <button
            type="submit"
            className="p-3 bg-[#009688] text-white rounded-2xl hover:bg-[#00796B] transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Chat Conversation List
  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-700 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-base text-gray-900">Mesajlar</h1>
            <p className="text-[11px] text-gray-500">Mekân soru & cevap sohbetleri</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChatId(chat.id)}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-[#009688] transition-all cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={chat.partnerAvatar}
                  alt={chat.partnerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.onlineStatus && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-gray-900 truncate">{chat.partnerName}</h4>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[10px] text-gray-400 font-medium">{chat.lastMessageTime}</span>
              {chat.unreadCount > 0 && (
                <span className="mt-1 block ml-auto w-5 h-5 bg-[#FF9800] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
