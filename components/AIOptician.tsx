
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Instagram, Check, MessageCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { ChatMessage, Persona } from '../types';
import { SALES_EXPERT_PERSONA } from '../data';
import { sendMessageToGemini, resetChat } from '../services/geminiService';

interface AIOpticianProps {
    initialMessage?: string;
}

const AIOptician: React.FC<AIOpticianProps> = ({ initialMessage }) => {
  // Use the fixed Sales Expert Persona
  const [currentPersona, setCurrentPersona] = useState<Persona>(SALES_EXPERT_PERSONA);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedStore, setCopiedStore] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    resetChat(); // Reset gemini session
    setMessages([{
        id: 'welcome',
        role: 'model',
        text: `Olá! Sou a ${currentPersona.name}, sua Consultora Especialista da Ótica CDO. Estou aqui para garantir que você faça a melhor escolha para sua visão e estilo. Como posso ajudar com seu orçamento hoje?`
    }]);
  }, [currentPersona]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
      if (initialMessage) {
          setInput(initialMessage);
      }
  }, [initialMessage]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    if (!textOverride) setInput('');
    setIsLoading(true);

    // Add user message only if it's a new input (not a retry)
    if (!textOverride) {
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: textToSend
        };
        setMessages(prev => [...prev, userMessage]);
    }

    // Get AI response passing the current persona
    try {
      const responseText = await sendMessageToGemini(textToSend, currentPersona);
      
      // Check if the response contains an error marker string from our service
      const isErrorResponse = responseText.includes('⚠️') || responseText.includes('Erro') || responseText.includes('Desculpe, tive um pequeno problema');
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        isError: isErrorResponse
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro fatal na interface:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Erro crítico de comunicação. Por favor, recarregue a página.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
      // Find the last user message to resend
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
          // Remove the last error message if present
          setMessages(prev => {
             const newHistory = [...prev];
             if (newHistory.length > 0 && newHistory[newHistory.length - 1].isError) {
                 newHistory.pop();
             }
             return newHistory;
          });
          handleSend(lastUserMessage.text);
      }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    resetChat();
    // Re-trigger welcome message
    setMessages([{
        id: Date.now().toString(),
        role: 'model',
        text: `Olá novamente! Sou a ${currentPersona.name}. Vamos começar um novo orçamento do zero? Me diga o que você precisa.`
    }]);
  };

  const generateHistoryText = () => {
    return messages
      .filter(m => !m.isError && m.id !== 'welcome')
      .map(m => `${m.role === 'user' ? '👤 Cliente' : `👓 ${currentPersona.name}`}: ${m.text}`)
      .join('\n\n');
  };

  const handleInstagramContact = (handle: string) => {
    const history = generateHistoryText();
    const clipboardText = `Olá! Fui atendido pela Consultora Especialista ${currentPersona.name} e gostaria de finalizar este orçamento:\n\n${history}`;

    navigator.clipboard.writeText(clipboardText).then(() => {
      setCopiedStore(handle);
      setTimeout(() => setCopiedStore(null), 3000);
      window.open(`https://instagram.com/${handle}`, '_blank');
    }).catch(err => {
      console.error('Falha ao copiar:', err);
      window.open(`https://instagram.com/${handle}`, '_blank');
    });
  };

  const handleWhatsAppContact = () => {
    const history = generateHistoryText();
    const clipboardText = `Olá! Fui atendido pela Consultora Especialista ${currentPersona.name} e gostaria de falar com um humano sobre este orçamento:\n\n${history}`;
    
    navigator.clipboard.writeText(clipboardText).then(() => {
        setCopiedStore('whatsapp');
        setTimeout(() => setCopiedStore(null), 3000);
        window.open('https://wa.me/5585999999999', '_blank');
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[700px]">
        
        {/* Header - Intelligent Consultant */}
        <div className="bg-slate-900 p-6 flex items-center justify-between border-b-4 border-orange-500">
          
          <div className="flex items-center text-white">
            <div className={`p-3 rounded-full mr-4 shadow-lg border-2 border-white ${currentPersona.color} transition-colors duration-500`}>
               <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                  <h2 className="font-bold text-2xl tracking-wide">{currentPersona.name}</h2>
                  <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm">
                      Especialista
                  </span>
              </div>
              <p className="text-sm text-blue-200 uppercase tracking-wider font-semibold opacity-90 mt-1">
                  Inteligência Artificial de Vendas
              </p>
            </div>
          </div>

          <button 
              onClick={handleReset}
              className="text-white/80 hover:text-white hover:bg-white/10 p-3 rounded-full transition group"
              title="Reiniciar Atendimento"
          >
              <RefreshCw className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 relative">
          
          {/* Expertise Banner */}
          <div className="flex justify-center mb-6">
             <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-orange-400" />
                <span className="italic font-medium">Especialista em Visagismo, Lentes e Orçamentos</span>
             </div>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mx-2 shadow-sm transition-colors duration-500 ${
                  msg.role === 'user' 
                    ? 'bg-orange-100' 
                    : msg.isError ? 'bg-red-100' : currentPersona.color
                }`}>
                  {msg.role === 'user' ? <User className="h-6 w-6 text-orange-600" /> : 
                   msg.isError ? <AlertCircle className="h-6 w-6 text-red-600" /> : <Bot className="h-6 w-6 text-white" />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                  msg.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-tr-none' 
                    : msg.isError 
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                  
                  {/* Retry Button for Error Messages */}
                  {msg.isError && (
                    <div className="mt-3 pt-3 border-t border-red-100">
                        <button 
                            onClick={handleRetry}
                            className="flex items-center text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                            <RotateCcw className="h-3 w-3 mr-2" />
                            Tentar Novamente
                        </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mx-2 ${currentPersona.color}`}>
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua dúvida ou o que procura..."
              className="flex-1 p-4 border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-orange-600 text-white p-4 rounded-xl hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          
          {/* Social Links / Send to Store */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-3 font-bold text-center sm:text-left uppercase tracking-wider">
              Fechar pedido com a Vendedora {currentPersona.name}?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start flex-wrap">
              <button 
                onClick={() => handleInstagramContact('oticacdo_fortaleza')}
                className={`flex items-center justify-center text-xs font-bold px-4 py-3 rounded-lg transition border uppercase tracking-wide ${
                   copiedStore === 'oticacdo_fortaleza' 
                   ? 'bg-green-100 text-green-700 border-green-300' 
                   : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:border-orange-400'
                }`}
              >
                {copiedStore === 'oticacdo_fortaleza' ? <Check className="h-4 w-4 mr-2" /> : <Instagram className="h-4 w-4 mr-2 text-pink-600" />}
                Loja Fortaleza
              </button>

              <button 
                onClick={() => handleInstagramContact('oticacdo_caucaia')}
                className={`flex items-center justify-center text-xs font-bold px-4 py-3 rounded-lg transition border uppercase tracking-wide ${
                   copiedStore === 'oticacdo_caucaia' 
                   ? 'bg-green-100 text-green-700 border-green-300' 
                   : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:border-orange-400'
                }`}
              >
                {copiedStore === 'oticacdo_caucaia' ? <Check className="h-4 w-4 mr-2" /> : <Instagram className="h-4 w-4 mr-2 text-pink-600" />}
                Loja Caucaia
              </button>

              <button 
                onClick={handleWhatsAppContact}
                className={`flex items-center justify-center text-xs font-bold px-4 py-3 rounded-lg transition border text-white uppercase tracking-wide shadow-md ${
                   copiedStore === 'whatsapp' 
                   ? 'bg-green-700 border-green-800' 
                   : 'bg-green-600 hover:bg-green-700 border-green-600'
                }`}
              >
                {copiedStore === 'whatsapp' ? <Check className="h-4 w-4 mr-2" /> : <MessageCircle className="h-4 w-4 mr-2" />}
                Enviar p/ WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOptician;
