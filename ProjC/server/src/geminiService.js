import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model: gemini-2.5-flash gives the best speed/cost tradeoff for document
// extraction tasks like this. Swap to gemini-2.5-pro if you need higher
// accuracy on messy/scanned statements.
const MODEL = "gemini-2.5-flash";

// Strict schema so Gemini always returns the same shape — this is what
// makes the output safe to feed straight into the frontend / a database.
const transactionSchema = {
  type: Type.OBJECT,
  properties: {
    accountHolder: { type: Type.STRING, nullable: true },
    bankName: { type: Type.STRING, nullable: true },
    statementPeriod: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        startDate: { type: Type.STRING, nullable: true },
        endDate: { type: Type.STRING, nullable: true },
      },
    },
    currency: { type: Type.STRING, nullable: true },
    summary: {
      type: Type.OBJECT,
      properties: {
        totalIncome: { type: Type.NUMBER },
        totalExpense: { type: Type.NUMBER },
        netChange: { type: Type.NUMBER },
        transactionCount: { type: Type.INTEGER },
      },
      required: ["totalIncome", "totalExpense", "netChange", "transactionCount"],
    },
    transactions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: {
            type: Type.STRING,
            description: "Transaction date in YYYY-MM-DD format",
          },
          description: {
            type: Type.STRING,
            description: "Original raw description line from the statement",
          },
          counterparty: {
            type: Type.STRING,
            description:
              "The person or company on the other side of the transaction, cleaned up from the raw description (e.g. 'Amazon', 'John Smith', 'Uber'). Use 'Unknown' if it cannot be determined.",
          },
          type: {
            type: Type.STRING,
            enum: ["income", "expense"],
            description: "income if money came in, expense if money went out",
          },
          category: {
            type: Type.STRING,
            enum: [
              "Salary",
              "Business Income",
              "Investment Income",
              "Refund",
              "Transfer In",
              "Other Income",
              "Groceries",
              "Dining & Restaurants",
              "Transportation",
              "Utilities",
              "Rent & Housing",
              "Shopping",
              "Entertainment",
              "Healthcare",
              "Insurance",
              "Subscriptions",
              "Education",
              "Travel",
              "Fees & Charges",
              "Loan & EMI",
              "Transfer Out",
              "Cash Withdrawal",
              "Other Expense",
            ],
          },
          amount: {
            type: Type.NUMBER,
            description: "Always a positive number regardless of income/expense",
          },
          balanceAfter: {
            type: Type.NUMBER,
            nullable: true,
            description: "Running account balance after this transaction, if shown",
          },
        },
        required: ["date", "description", "counterparty", "type", "category", "amount"],
      },
    },
  },
  required: ["summary", "transactions"],
};

const SYSTEM_PROMPT = `You are a financial document parser. You will be given a bank statement PDF.

Extract every single transaction line from the statement and return structured data matching the provided schema.

Rules:
- type must be "income" for money received (credits/deposits) and "expense" for money paid out (debits/withdrawals).
- amount must always be a positive number; the sign is conveyed only through "type".
- category must be the single best-fitting category from the enum list, based on the transaction description. Use "Other Income" or "Other Expense" only when nothing else fits.
- counterparty should be a cleaned, human-readable name extracted from the raw description (strip reference numbers, transaction codes, asterisks, etc). For example "AMZN MKTP IN*2K3JF93" becomes "Amazon", "SWIGGY ORDER 88291" becomes "Swiggy", "NEFT-JOHN DOE-HDFC0001" becomes "John Doe". If truly indeterminable, use "Unknown".
- date must be normalized to YYYY-MM-DD using the statement's year context.
- Do not skip, merge, or invent transactions. Every row in the statement's transaction table should map to one entry.
- Compute summary.totalIncome and summary.totalExpense as sums of the respective amounts, summary.netChange as totalIncome - totalExpense, and summary.transactionCount as the total number of transactions.
- If the account holder name, bank name, currency, or statement period are visible on the statement, include them; otherwise use null.`;

/**
 * Sends a PDF buffer to Gemini and returns the parsed, categorized
 * transaction data as a plain JS object.
 *
 * @param {Buffer} pdfBuffer
 * @returns {Promise<object>}
 */
export async function extractStatementData(pdfBuffer) {
  const base64Data = pdfBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: SYSTEM_PROMPT },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: transactionSchema,
      temperature: 0,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response for this PDF.");
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(
      `Gemini response could not be parsed as JSON: ${err.message}`
    );
  }
}
