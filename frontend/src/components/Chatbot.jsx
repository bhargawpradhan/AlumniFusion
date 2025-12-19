// import { useState, useRef, useEffect } from 'react';
// import { Send, Bot, X, User, MessageCircle } from 'lucide-react';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: 'Hello! I\'m your Alumni Assistant. How can I help you today?',
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef(null);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // Add user message
//     const userMessage = { role: 'user', content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');

//     try {
//       // Simulate AI response (in a real app, you would call your backend API here)
//       setTimeout(() => {
//         const responses = {
//           'hi': 'Hello! How can I assist you with Alumni Fusion today?',
//           'events': 'You can find upcoming alumni events in the Events section. Would you like me to take you there?',
//           'contact': 'You can contact our support team at support@alumnifusion.com',
//           'donate': 'Thank you for considering a donation! You can make a donation through the Donate section.',
//           'jobs': 'Check out the Jobs section for the latest career opportunities shared by our alumni network.'
//         };

//         const response = responses[input.toLowerCase()] || 
//           "I'm sorry, I'm still learning. Could you rephrase your question or try asking about events, jobs, donations, or contact information?";

//         setMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content: response },
//         ]);
//       }, 1000);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setMessages((prev) => [
//         ...prev,
//         { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' },
//       ]);
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   if (!isOpen) {
//     return (
//       <button
//         onClick={toggleChat}
//         className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 flex items-center justify-center"
//       >
//         <MessageCircle className="w-8 h-8" />
//       </button>
//     );
//   }

//   return (
//     <div className="fixed bottom-8 right-8 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 border border-gray-200 dark:border-gray-700">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <Bot className="w-6 h-6" />
//           <h3 className="font-semibold">Alumni Assistant</h3>
//         </div>
//         <button
//           onClick={toggleChat}
//           className="text-white hover:text-gray-200 focus:outline-none"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-4 overflow-y-auto max-h-96">
//         <div className="space-y-4">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div
//                 className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
//                   message.role === 'user'
//                     ? 'bg-blue-500 text-white rounded-br-none'
//                     : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
//                 }`}
//               >
//                 <div className="flex items-start space-x-2">
//                   {message.role === 'assistant' && (
//                     <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-blue-500" />
//                   )}
//                   <p className="text-sm">{message.content}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input */}
//       <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Chatbot;
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageCircle, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Alumni Assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input || input.trim() === '') return;

    const userText = input.trim();
    const newUserMessage = { role: 'user', content: userText };
    
    // Add user message immediately
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Clear input
    setInput('');
    
    // Show typing indicator
    setIsTyping(true);

    try {
      // Call Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are an AI assistant for AlumniFusion, an alumni networking platform for Government Engineering College. 

The platform offers:
- Alumni Directory: Search and connect with alumni by batch, branch, or location
- Networking Hub: Build professional relationships with fellow alumni
- Job Portal: Find job opportunities posted by alumni and companies
- Donation Portal: Support the alma mater through various donation categories
- Events & Reunions: Stay updated with upcoming alumni events
- Success Stories: Read inspiring stories from accomplished alumni

Answer the following question in a friendly, helpful manner. Keep responses concise (2-3 sentences).

User question: ${userText}`
            }
          ],
        }),
      });

      const data = await response.json();
      
      let botResponse = '';
      if (data.content && data.content.length > 0) {
        botResponse = data.content.map(item => item.text || '').join('');
      }
      
      if (!botResponse) {
        botResponse = "I'm here to help! I can answer questions about our alumni directory, networking, jobs, donations, events, and success stories. What would you like to know?";
      }

      const newBotMessage = { role: 'assistant', content: botResponse };
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: "I can help you with information about AlumniFusion! Ask me about our alumni directory, networking opportunities, job postings, donation options, upcoming events, or success stories from our community." 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={toggleChat}
          className="relative bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group overflow-hidden"
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-400 opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-300" />
          
          <div 
            className="absolute inset-0 rounded-full border-4 border-white/30"
            style={{
              animation: 'spin 3s linear infinite',
            }}
          />
          
          <MessageCircle className="w-8 h-8 relative z-10" />
          
          <Sparkles className="w-4 h-4 absolute top-1 right-1 text-yellow-300 animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-8 w-[420px] h-[calc(100vh-2rem)] max-h-[1200px] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 backdrop-blur-sm border border-white/10"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientMove 8s ease infinite',
        }}
      />

      {/* Animated floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* AI Robot Background - Clearly Visible and Animated */}
      <div 
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{
          animation: 'robotFloat 4s ease-in-out infinite',
        }}
      >
        <svg 
          viewBox="0 0 200 200" 
          className="w-64 h-64 opacity-60"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))',
          }}
        >
          {/* Robot Head */}
          <circle cx="100" cy="80" r="40" fill="url(#gradient1)" className="animate-pulse" />
          
          {/* Antenna */}
          <line x1="100" y1="40" x2="100" y2="50" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="35" r="5" fill="#ec4899" className="animate-ping" style={{animationDuration: '2s'}} />
          
          {/* Eyes with animation */}
          <circle cx="85" cy="70" r="8" fill="#93c5fd">
            <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="70" r="8" fill="#93c5fd">
            <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
          </circle>
          
          {/* Pupils */}
          <circle cx="85" cy="70" r="3" fill="#1e40af">
            <animate attributeName="cx" values="85;87;85" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="70" r="3" fill="#1e40af">
            <animate attributeName="cx" values="115;117;115" dur="4s" repeatCount="indefinite" />
          </circle>
          
          {/* Smile */}
          <path d="M85 90 Q100 98 115 90" stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" />
          
          {/* Body */}
          <rect x="70" y="100" width="60" height="70" rx="10" fill="url(#gradient2)" />
          
          {/* Chest display */}
          <rect x="85" y="115" width="30" height="20" rx="3" fill="#1e293b" opacity="0.5" />
          <line x1="90" y1="120" x2="105" y2="120" stroke="#22d3ee" strokeWidth="2" opacity="0.8">
            <animate attributeName="x2" values="105;110;105" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="90" y1="125" x2="108" y2="125" stroke="#a78bfa" strokeWidth="2" opacity="0.8">
            <animate attributeName="x2" values="108;112;108" dur="2.5s" repeatCount="indefinite" />
          </line>
          <line x1="90" y1="130" x2="102" y2="130" stroke="#f472b6" strokeWidth="2" opacity="0.8">
            <animate attributeName="x2" values="102;107;102" dur="3s" repeatCount="indefinite" />
          </line>
          
          {/* Arms */}
          <rect x="50" y="110" width="15" height="40" rx="7" fill="url(#gradient3)">
            <animateTransform attributeName="transform" type="rotate" values="0 57 130; -10 57 130; 0 57 130" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="135" y="110" width="15" height="40" rx="7" fill="url(#gradient3)">
            <animateTransform attributeName="transform" type="rotate" values="0 143 130; 10 143 130; 0 143 130" dur="3s" repeatCount="indefinite" />
          </rect>
          
          {/* Hands */}
          <circle cx="57" cy="160" r="6" fill="#6366f1" />
          <circle cx="143" cy="160" r="6" fill="#6366f1" />
          
          {/* Legs */}
          <rect x="75" y="175" width="20" height="15" rx="5" fill="url(#gradient3)" />
          <rect x="105" y="175" width="20" height="15" rx="5" fill="url(#gradient3)" />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 0.9}} />
              <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0.9}} />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 0.8}} />
              <stop offset="100%" style={{stopColor: '#ec4899', stopOpacity: 0.8}} />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#8b5cf6', stopOpacity: 0.8}} />
              <stop offset="100%" style={{stopColor: '#6366f1', stopOpacity: 0.8}} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative bg-gradient-to-r from-blue-600/70 via-sky-600/80 backdrop-blur-sm text-white p-5 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-7 h-7 animate-bounce" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Alumni Assistant</h3>
            <p className="text-xs text-white/80">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={toggleChat}
          className="text-white hover:text-gray-200 focus:outline-none transition-transform hover:rotate-90 duration-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 p-5 overflow-y-auto relative">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{
                animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-lg transform transition-all hover:scale-105 relative z-10 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500/70 to-blue-600/70 backdrop-blur-sm text-white rounded-br-none'
                    : 'bg-white/5 backdrop-blur-md text-gray-900 dark:text-white rounded-bl-none border border-white/20'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-5 h-5 mt-1 flex-shrink-0 text-blue-500 animate-pulse" />
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start relative z-10">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl rounded-bl-none px-5 py-3 border border-white/20">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="relative p-5 border-t border-white/10 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-5 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110 shadow-lg"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gradientMove {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        @keyframes robotFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;