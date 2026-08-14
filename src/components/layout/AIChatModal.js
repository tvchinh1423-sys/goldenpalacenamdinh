"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const SUGGESTED_QUESTIONS = [
  "💡 Giá 1 mâm cỗ cưới khoảng bao nhiêu?",
  "🏛️ Sảnh tiệc chứa được tối đa bao nhiêu khách?",
  "🎁 Golden Palace có ưu đãi gì mới không?",
  "📝 Hướng dẫn cách lập dự toán chi phí tiệc.",
  "📍 Địa chỉ và hotline liên hệ nhà hàng?"
];

export default function AIChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Em là **Trợ lý AI Golden Palace**. Em có thể giúp Quý khách tư vấn về sảnh tiệc, giá mâm cỗ, thực đơn và lập dự toán chi phí tiệc cưới / sự kiện. Quý khách cần hỗ trợ thông tin gì ạ?',
      suggestions: SUGGESTED_QUESTIONS
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (questionText) => {
    const query = questionText || input.trim();
    if (!query || loading) return;

    const userMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/guest/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            suggestions: data.suggestions || []
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Dạ, hiện tại hệ thống đang bận một chút. Quý khách có thể liên hệ trực tiếp Hotline **0228 659 5959** hoặc trải nghiệm công cụ **[Dự toán chi phí](/du-toan-chi-phi)** ạ!',
            suggestions: ["📞 Gọi Hotline 0228 659 5959", "📝 Tính dự toán ngay"]
          }
        ]);
      }
    } catch (err) {
      console.error('AI Chat Error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Dạ, em chưa nhận được phản hồi. Quý khách có thể gọi trực tiếp Hotline **0228 659 5959** để được tư vấn nhanh nhất ạ!',
          suggestions: ["📞 Gọi Hotline 0228 659 5959"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 w-[92vw] sm:w-[420px] max-h-[80vh] h-[580px] bg-white rounded-2xl shadow-2xl border border-[#e3a638]/30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 font-montserrat">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 text-white flex items-center justify-between border-b border-[#e3a638]/40">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#e3a638] to-[#a66a3a] p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              <img src="/logo-icon.png" alt="AI Avatar" className="w-7 h-7 object-contain" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
          </div>
          <div>
            <h3 className="font-playfair text-base font-semibold text-[#e3a638] flex items-center gap-1.5">
              Trợ lý AI Golden Palace
            </h3>
            <p className="text-[11px] text-gray-300 font-light">Tư vấn tiệc cưới & sự kiện 24/7</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          title="Đóng cửa sổ chat"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#fcf9f2] space-y-4 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white rounded-br-none'
                  : 'bg-white border border-[#e3a638]/20 text-gray-800 rounded-bl-none'
              }`}
            >
              {/* Simple Markdown Formatting Render */}
              <div 
                className="prose prose-sm max-w-none text-sm font-light space-y-2"
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#a66a3a] underline font-medium hover:text-[#e3a638]">$1</a>')
                    .replace(/\n/g, '<br/>')
                }}
              />
            </div>

            {/* Suggestions Chips below AI answer */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                {msg.suggestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSend(sug.replace(/^[💡🏛️🎁📝📍📞]\s*/, ''))}
                    className="text-[11px] bg-white border border-[#e3a638]/40 hover:bg-[#e3a638]/10 text-[#a66a3a] px-3 py-1.5 rounded-full transition-all duration-200 shadow-2xs font-medium text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 bg-white border border-[#e3a638]/20 px-4 py-3 rounded-2xl rounded-bl-none w-fit shadow-xs">
            <span className="w-2 h-2 bg-[#e3a638] rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-[#a66a3a] rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-[#e3a638] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-xs text-gray-500 font-light ml-1">AI đang suy nghĩ...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#e3a638]/20 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi cho Trợ lý AI..."
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-xs sm:text-sm focus:outline-none focus:border-[#e3a638] focus:bg-white text-gray-900 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#e3a638] to-[#a66a3a] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md flex-shrink-0"
          title="Gửi câu hỏi"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </form>
    </div>
  );
}
