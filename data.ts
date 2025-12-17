
import { Frame, LensOption, Persona } from './types';

export const FRAMES: Frame[] = [
  {
    id: '1',
    name: 'Classic Aviator Gold',
    price: 350.00,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    description: 'Estilo aviador clássico em metal dourado.',
    gender: 'Unissex',
    usage: 'Receituário',
    shape: 'Aviador',
    faceShape: 'Oval',
    material: 'Metal',
    frameColor: 'Dourado',
    lensWidth: 58,
    bridgeSize: 14,
    templeLength: 140,
    highPrescriptionCompatible: false,
    weight: '22g'
  },
  {
    id: '2',
    name: 'Modern Square Black',
    price: 290.00,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
    description: 'Armação quadrada em acetato preto fosco.',
    gender: 'Masculino',
    usage: 'Receituário',
    shape: 'Quadrado',
    faceShape: 'Redondo',
    material: 'Acetato',
    frameColor: 'Preto',
    lensWidth: 54,
    bridgeSize: 18,
    templeLength: 145,
    highPrescriptionCompatible: true,
    weight: '28g'
  },
  {
    id: '3',
    name: 'Cat Eye Rose',
    price: 420.00,
    imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&q=80',
    description: 'Elegante formato gatinho em tom rosé.',
    gender: 'Feminino',
    usage: 'Receituário',
    shape: 'Gatinho',
    faceShape: 'Coração',
    material: 'Metal',
    frameColor: 'Rose',
    lensWidth: 52,
    bridgeSize: 16,
    templeLength: 140,
    highPrescriptionCompatible: true,
    weight: '18g'
  },
  {
    id: '4',
    name: 'Round Tortoise',
    price: 380.00,
    imageUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&q=80',
    description: 'Redondo clássico com estampa tartaruga.',
    gender: 'Unissex',
    usage: 'Receituário',
    shape: 'Redondo',
    faceShape: 'Quadrado',
    material: 'Acetato',
    frameColor: 'Tartaruga',
    lensWidth: 50,
    bridgeSize: 20,
    templeLength: 145,
    highPrescriptionCompatible: true,
    weight: '24g'
  },
  {
    id: '5',
    name: 'Kids Flex Blue',
    price: 250.00,
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f9a87595ca05?w=500&q=80',
    description: 'Material flexível e resistente para crianças.',
    gender: 'Infantil',
    usage: 'Receituário',
    shape: 'Retangular',
    faceShape: 'Redondo',
    material: 'Injetado',
    frameColor: 'Azul',
    lensWidth: 46,
    bridgeSize: 15,
    templeLength: 130,
    highPrescriptionCompatible: true,
    weight: '12g'
  },
  {
    id: '6',
    name: 'Summer Sun Black',
    price: 450.00,
    imageUrl: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500&q=80',
    description: 'Óculos de sol com proteção UV400.',
    gender: 'Unissex',
    usage: 'Solar',
    shape: 'Retangular',
    faceShape: 'Oval',
    material: 'Injetado',
    frameColor: 'Preto',
    lensWidth: 55,
    bridgeSize: 18,
    templeLength: 145,
    highPrescriptionCompatible: false,
    weight: '30g'
  },
  {
    id: '7',
    name: 'Titanium Light',
    price: 550.00,
    imageUrl: 'https://images.unsplash.com/photo-1560000085-f1262d083b38?w=500&q=80',
    description: 'Leveza absoluta em titânio.',
    gender: 'Masculino',
    usage: 'Receituário',
    shape: 'Retangular',
    faceShape: 'Redondo',
    material: 'Titanio',
    frameColor: 'Prata',
    lensWidth: 53,
    bridgeSize: 17,
    templeLength: 140,
    highPrescriptionCompatible: true,
    weight: '10g'
  },
  {
    id: '8',
    name: 'Fashion Demi',
    price: 320.00,
    imageUrl: 'https://images.unsplash.com/photo-1510943544766-38d591b72a9e?w=500&q=80',
    description: 'Estilo ousado demi marrom.',
    gender: 'Feminino',
    usage: 'Receituário',
    shape: 'Gatinho',
    faceShape: 'Quadrado',
    material: 'Acetato e metal',
    frameColor: 'Demi marrom',
    lensWidth: 54,
    bridgeSize: 16,
    templeLength: 142,
    highPrescriptionCompatible: false,
    weight: '26g'
  }
];

export const LENSES: LensOption[] = [
  {
    id: 'l1',
    type: 'Visão Simples',
    material: 'Resina Standard',
    price: 150.00,
    features: ['Antirreflexo Básico']
  },
  {
    id: 'l2',
    type: 'Visão Simples',
    material: 'Policarbonato (Mais fino)',
    price: 280.00,
    features: ['Antirreflexo Premium', 'Resistente a impactos']
  },
  {
    id: 'l3',
    type: 'Visão Simples',
    material: 'Alto Índice 1.67',
    price: 450.00,
    features: ['Super Fino', 'Antirreflexo Premium', 'Filtro Azul']
  },
  {
    id: 'l4',
    type: 'Multifocal',
    material: 'Digital Standard',
    price: 500.00,
    features: ['Campo de visão amplo', 'Antirreflexo']
  },
  {
    id: 'l5',
    type: 'Multifocal',
    material: 'Premium HDR',
    price: 950.00,
    features: ['Campo de visão total', 'Filtro Azul', 'Transições suaves']
  }
];

// PERSONA ÚNICA E ESPECIALIZADA EM VENDAS
export const SALES_EXPERT_PERSONA: Persona = {
    id: 'vitoria_sales',
    name: 'Vitória',
    role: 'Especialista em Vendas',
    description: 'Especialista em óculos, visagismo e saúde visual.',
    systemPrompt: `
      IDENTIDADE:
      Você é Vitória, a principal estrategista de vendas da Ótica CDO. 
      Você não é apenas uma atendente, você é uma CONSULTORA DE ALTA PERFORMANCE.
      
      SUA METODOLOGIA DE VENDAS (S.P.I.N. Selling Adaptado):
      1. SITUAÇÃO: Entenda o contexto do cliente (trabalha no pc? dirige à noite? grau alto?).
      2. PROBLEMA: Identifique dores (óculos pesados, dores de cabeça, lentes grossas).
      3. IMPLICAÇÃO: Mostre o custo de não resolver (piora da visão, desconforto diário).
      4. NECESSIDADE: Apresente a solução (produto) como um investimento, não um custo.

      SEUS SUPER-PODERES:
      - Visagismo: Você sabe exatamente qual óculos combina com cada rosto.
      - Gatilhos Mentais: Você usa Escassez ("Temos poucas unidades desse modelo"), Autoridade ("Como especialista, recomendo...") e Prova Social ("Este é o favorito dos nossos clientes").
      - Argumentação Técnica: Você transforma "Acetato" em "Material nobre, antialérgico e durável". Você transforma "Filtro Azul" em "Proteção essencial para seu sono e descanso visual".
      
      TONALIDADE:
      Confiante, profissional, persuasiva, mas extremamente empática. Você conduz a venda, não espera o cliente decidir sozinho.
    `,
    color: 'bg-gradient-to-r from-orange-500 to-red-600'
};

export const PERSONAS: Persona[] = [ SALES_EXPERT_PERSONA ];
