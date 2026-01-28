
import { GoogleGenAI, Type } from "@google/genai";
import { UserContext, Question, AIAnalysis, CompetencyDomain, QuizQuestion, Recommendation } from "../types";

export const generateCustomQuestions = async (context: UserContext): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Buatlah 5 pertanyaan asesmen studi kasus yang sangat mendalam untuk profil berikut:
               Nama: ${context.name || 'User'}
               Peran: ${context.role}
               Level: ${context.level}
               Konteks Organisasi: ${context.organization}
               
               Setiap pertanyaan harus menguji gabungan antara kompetensi teknis, soft skill, dan pemahaman organisasi.`,
    config: {
      thinkingConfig: { thinkingBudget: 16384 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING, enum: Object.values(CompetencyDomain) },
            text: { type: Type.STRING }
          },
          required: ["domain", "text"]
        }
      }
    }
  });

  try {
    const rawQuestions = JSON.parse(response.text.trim());
    return rawQuestions.map((q: any, idx: number) => ({
      id: idx + 1,
      domain: q.domain as CompetencyDomain,
      text: q.text
    }));
  } catch (e) {
    console.error("Gagal mengurai pertanyaan AI", e);
    throw new Error("Gagal membuat pertanyaan khusus.");
  }
};

export const evaluateAssessment = async (
  context: UserContext, 
  questions: Question[], 
  answers: Record<number, string>
): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const submission = questions.map(q => ({
    question: q.text,
    answer: answers[q.id]
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Evaluasi secara profesional jawaban asesmen ini.
               Profil: ${context.role} (${context.level}) di ${context.organization}.
               Jawaban: ${JSON.stringify(submission)}
               
               TUGAS ANDA:
               Buatlah laporan hasil asesmen yang mendetail dengan struktur:
               1. Tentukan Skor Total (skala 1-200) dan Status (e.g., PERLU PENGEMBANGAN, KOMPETEN, EXPERT).
               2. Buatlah 15-20 poin penilaian granular.
               3. SETIAP poin penilaian granular HARUS dipetakan ke salah satu dari 5 Domain Utama berikut sebagai 'subType': ${Object.values(CompetencyDomain).join(', ')}.
               4. Setiap poin penilaian harus memiliki:
                  - Kategori (nama spesifik kompetensi, misal: 'Manajemen Konflik' atau 'Analisis Data')
                  - subType (HARUS salah satu dari 5 domain di atas)
                  - Skor (1-10)
                  - Umpan Balik AI (analisis singkat kenapa skor tersebut diberikan)
               5. Berikan rekomendasi pengembangan yang spesifik untuk peran ${context.role}.`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallSummary: { type: Type.STRING },
          totalScore: { type: Type.NUMBER },
          status: { type: Type.STRING },
          detailedPoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                subType: { type: Type.STRING, enum: Object.values(CompetencyDomain) },
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING }
              },
              required: ["category", "subType", "score", "feedback"]
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { name: { type: Type.STRING }, url: { type: Type.STRING } }
                  }
                }
              },
              required: ["title", "description", "actionItems"]
            }
          }
        },
        required: ["overallSummary", "totalScore", "status", "detailedPoints", "recommendations"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Gagal mengurai evaluasi AI", e);
    throw new Error("Gagal mengevaluasi jawaban.");
  }
};

export const generateQuizFromRecommendations = async (recommendations: Recommendation[]): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Berdasarkan rekomendasi pengembangan karier berikut, buatlah kuis 3 pertanyaan pilihan ganda untuk mengetes pemahaman pengguna terhadap langkah-langkah pengembangan yang disarankan.
               
               Rekomendasi: ${JSON.stringify(recommendations)}
               
               Pastikan pertanyaan bersifat aplikatif dan membantu pengguna mengingat poin-poit kritis dari rekomendasi tersebut.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Gagal membuat kuis", e);
    throw new Error("Gagal membuat kuis pemahaman.");
  }
};

export const askCareerCoach = async (query: string, history: any[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [...history, { role: 'user', parts: [{ text: query }] }],
    config: {
      thinkingConfig: { thinkingBudget: 16384 },
      systemInstruction: "Anda adalah pelatih karier eksekutif. Bantu pengguna mendalami hasil asesmen mereka di CompetencyAI. Bahasa: Indonesia profesional."
    }
  });
  return response.text.trim();
};
