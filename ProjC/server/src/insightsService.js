import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

const suggestionsSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Short, specific action (e.g. 'Cancel unused Hulu subscription')",
          },
          detail: {
            type: Type.STRING,
            description: "1-2 sentence explanation grounded in the actual numbers provided",
          },
          estimatedMonthlySavings: {
            type: Type.NUMBER,
            description: "Rough estimated monthly savings if this suggestion is followed, 0 if not quantifiable",
          },
          category: {
            type: Type.STRING,
            description: "The spending category this relates to",
          },
        },
        required: ["title", "detail", "estimatedMonthlySavings", "category"],
      },
    },
  },
  required: ["suggestions"],
};

const SYSTEM_PROMPT = `You are a personal finance assistant. You will be given a JSON summary of someone's spending: their category totals, detected subscriptions, and monthly income/expense figures.

Generate 4-7 specific, actionable cost-cutting suggestions based ONLY on the data provided. Rules:
- Be specific: name the actual category, subscription, or pattern from the data, not generic advice like "cook at home more."
- Only flag subscriptions or categories that are actually unusually high relative to the rest of their spending, or that look duplicated/overlapping (e.g. two streaming services).
- estimatedMonthlySavings should be a realistic number derived from the actual amounts given, not invented. Use 0 if you can't reasonably estimate it.
- Do not suggest cutting essential categories (Rent & Housing, Healthcare, Insurance, Loan & EMI) unless the data shows something clearly anomalous.
- Keep each suggestion concise — one specific action and why, not a paragraph.
- If the data genuinely shows healthy, lean spending with nothing notable to cut, return fewer suggestions rather than inventing filler ones.`;

/**
 * Sends a compact spending summary (not the raw PDF) to Gemini and gets
 * back structured cost-cutting suggestions.
 *
 * @param {object} spendingContext - category totals, subscriptions, monthly figures
 * @returns {Promise<Array>}
 */
export async function getCostCuttingSuggestions(spendingContext) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: SYSTEM_PROMPT },
          { text: `Spending data:\n${JSON.stringify(spendingContext, null, 2)}` },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: suggestionsSchema,
      temperature: 0.3,
    },
  });

  const text = response.text;
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    return parsed.suggestions || [];
  } catch {
    return [];
  }
}
