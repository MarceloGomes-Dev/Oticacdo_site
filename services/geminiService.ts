
import { GoogleGenAI, Chat } from "@google/genai";
import { FRAMES, LENSES } from '../data';
import { Persona } from '../types';

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const apiKey = process.env.API_KEY;

// Initialize with a fallback string to prevent immediate crash on load, 
// though actual calls will fail gracefully if key is missing.
const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });

// Function to generate specific context based on the selected Persona
const generateSystemInstruction = (persona: Persona) => {
    return `
=== CONFIGURAÇÃO DO AGENTE DE VENDAS ===
NOME: ${persona.name}
CARGO: ${persona.role} (Ótica CDO)
PERSONALIDADE/FRAMEWORK: ${persona.systemPrompt}

=== BASE DE CONHECIMENTO DE PRODUTOS ===

CATÁLOGO DE ARMAÇÕES:
${JSON.stringify(FRAMES.map(f => ({
  nome: f.name,
  preco: f.price,
  estilo: f.shape,
  rosto_ideal: f.faceShape,
  material: f.material,
  beneficio_material: f.material === 'Titanio' ? 'Ultra leve e indestrutível' : f.material === 'Acetato' ? 'Resistente e premium' : 'Leveza e flexibilidade',
  desc: f.description
})), null, 2)}

CATÁLOGO DE LENTES:
${JSON.stringify(LENSES.map(l => ({
  nome: l.type + ' ' + l.material,
  preco: l.price,
  argumento_venda: l.features.join(', ') + (l.price > 400 ? ' (Tecnologia Premium)' : ' (Custo-benefício)')
})), null, 2)}

=== REGRAS DE OURO PARA VENDAS (MANDATÓRIO) ===

1. **CRIE VALOR, NÃO APENAS INFORME O PREÇO**:
   - Nunca diga apenas "Custa R$ 300".
   - Diga: "Por apenas R$ 300, você leva uma armação em Acetato que dura anos e não descasca."

2. **CROSS-SELLING INTELIGENTE**:
   - Se o cliente escolher uma armação, IMEDIATAMENTE pergunte sobre o grau para sugerir a lente.
   - Argumento: "Uma armação linda como essa merece uma lente que valorize seus olhos. Qual seu grau aproximado?"

3. **OBJEÇÕES DE PREÇO**:
   - Se o cliente achar caro, use a técnica da divisão: "Esse valor diluído em 1 ano é menos de 1 real por dia para ter conforto visual."

4. **SOMATÓRIA EXPLÍCITA**:
   - Ao final, mostre a conta:
   "Armação: R$ X"
   "Lente Sugerida: R$ Y"
   "TOTAL DO INVESTIMENTO: R$ Z"

5. **FECHAMENTO**:
   - Sempre termine com uma chamada para ação (CTA) para o WhatsApp. "Podemos reservar esse modelo para você agora no WhatsApp?"

6. **EDUCAÇÃO**:
   - Ensine o cliente. Se ele tem rosto redondo, explique POR QUE a armação quadrada fica melhor (contraste).

Mantenha o tom profissional, persuasivo e acolhedor. Você quer vender!
`;
};

let chatSession: Chat | null = null;
let currentPersonaId: string | null = null;

export const getChatSession = (persona: Persona): Chat => {
  // Return existing session if valid
  if (chatSession && currentPersonaId === persona.id) {
    return chatSession;
  }

  // Create new session
  currentPersonaId = persona.id;
  try {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: generateSystemInstruction(persona),
          temperature: 0.5,
        },
      });
      return chatSession;
  } catch (e) {
      console.error("Falha ao criar sessão de chat:", e);
      throw e;
  }
};

export const sendMessageToGemini = async (message: string, persona: Persona): Promise<string> => {
  const currentKey = process.env.API_KEY;
  
  if (!currentKey) {
      return "⚠️ **Erro de Configuração**: A chave de API não foi detectada.\n\nPara funcionar no GitHub Pages ou Localmente, crie um arquivo `.env` com `API_KEY=sua_chave` e reinicie o projeto.";
  }

  if (currentKey.includes('YOUR_API_KEY')) {
      return "⚠️ **Erro de Configuração**: Você está usando a chave de exemplo padrão. Por favor, gere uma chave válida no Google AI Studio.";
  }

  try {
    const chat = getChatSession(persona);
    const result = await chat.sendMessage({ message });
    return result.text || "Desculpe, estou recalculando as melhores ofertas. Pode repetir?";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // CRITICAL: Reset session on error so next attempt is fresh
    resetChat();

    // Friendly error mapping
    const errorMsg = error.toString().toLowerCase();
    
    if (error.status === 400 || errorMsg.includes('400')) {
        return "Desculpe, não entendi. Poderia reformular sua frase?";
    }
    if (error.status === 401 || errorMsg.includes('401') || errorMsg.includes('unauthenticated')) {
        return "⚠️ **Erro de Acesso**: A chave de API é inválida. Verifique suas configurações de ambiente.";
    }
    if (error.status === 403 || errorMsg.includes('403')) {
        return "⚠️ **Acesso Negado**: A chave de API não tem permissão ou a cota foi excedida.";
    }
    if (error.status === 429 || errorMsg.includes('429')) {
        return "⏳ **Muitos pedidos**: Estou com muitos atendimentos agora. Aguarde um instante e tente novamente.";
    }
    if (errorMsg.includes('fetch') || errorMsg.includes('network')) {
        return "📡 **Erro de Conexão**: Verifique sua internet e tente novamente.";
    }

    return "Desculpe, tive um pequeno problema técnico. Vamos tentar de novo?";
  }
};

export const resetChat = () => {
  chatSession = null;
  currentPersonaId = null;
};
