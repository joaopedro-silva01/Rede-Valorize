import { GoogleGenAI } from "@google/genai";
import { Partner, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePartnerStrategy = async (partner: Partner): Promise<AnalysisResult> => {
  // Use 'gemini-3-flash-preview' for basic text tasks as per guidelines
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Você é um consultor estratégico sênior da "Rede Valorize + Saúde".
    Analise o seguinte parceiro que está performando abaixo do esperado (parte dos 80% menos rentáveis) de acordo com o princípio de Pareto.
    
    Dados do Parceiro:
    - Nome: ${partner.name}
    - Segmento: ${partner.segment}
    - Localização: ${partner.location} (Uberlândia/MG)
    - Pontuação de Uso (0-100): ${partner.usageScore}
    - Receita Mensal Gerada: R$ ${partner.monthlyRevenue}
    - Benefícios Oferecidos: ${partner.benefits.join(', ')}
    
    A rede oferece benefícios como Seguro de Acidentes, Sorteios, Descontos em Clínicas e Exames.
    
    Forneça uma análise curta e direta em formato JSON com dois campos:
    1. "recommendation": Uma ação curta (ex: "Renegociar Descontos", "Campanha de Marketing", "Descontinuar").
    2. "strategy": Uma explicação de 2 frases sobre como melhorar a performance ou por que cancelar, focado em aumentar o valor para o usuário final.
    
    Responda APENAS o JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    // Access .text property directly as per guidelines
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    
    return {
      partnerId: partner.id,
      recommendation: result.recommendation || "Análise Manual Necessária",
      strategy: result.strategy || "Consultar equipe comercial."
    };

  } catch (error) {
    console.error("Error analyzing partner:", error);
    return {
      partnerId: partner.id,
      recommendation: "Erro na Análise",
      strategy: "Não foi possível gerar insights automáticos no momento. Verifique a chave de API."
    };
  }
};