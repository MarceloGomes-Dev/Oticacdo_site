import { GoogleGenerativeAI } from "@google/generative-ai";
import { FRAMES, LENSES } from "../data";
import { Persona } from "../types";

/**
 * ⚠️ ATENÇÃO
 * Uso direto no frontend expõe a chave.
 * Funciona para testes. Em produção, use backend.
 */

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("⚠️ VITE_GOOGLE_API_KEY não definida no .env");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Estado simples para simular reset de conversa
let lastPersonaId: string | null = null;

const generateSystemInstruction = (persona: Persona) => `
=== CONFIGURAÇÃO DO AGENTE DE VENDAS ===
NOME: ${persona.name}
CARGO: ${persona.role} (Ótica CDO)
PERSONALIDADE: ${persona.systemPrompt}

=== CATÁLOGO DE ARMAÇÕES ===
${JSON.stringify(
  FRAMES.map(f => ({
    nome: f.name,
    preco: f.price,
    formato: f.shape,
    rosto_ideal: f.faceShape,
    material: f.material,
    descricao: f.description
  })),
  null,
  2
)}

=== CATÁLOGO DE LENTES ===
${JSON.stringify(
  LENSES.map(l => ({
    nome: l.type + " " + l.material,
    preco: l.price,
    beneficios: l.features.join(", ")
  })),
  null,
  2
)}

REGRAS:
- Seja persuasivo
- Use técnicas de venda
- Sempre chame para o WhatsApp
`;

export async function sendMessageToGemini(
  message: string,
  persona: Persona
): Promise<string> {
  if (!apiKey) {
    return "⚠️ Chave da IA não configurada.";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        lastPersonaId === persona.id
          ? undefined
          : generateSystemInstruction(persona),
    });

    lastPersonaId = persona.id;

    const result = await model.generateContent(message);
    return result.response.text();
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "Desculpe, estou com instabilidade no momento.";
  }
}

/**
 * Permite que componentes (ex: AIOptician)
 * reiniciem o estado da conversa
 */
export function resetChat() {
  lastPersonaId = null;
}
