# Ledger — Bank Statement PDF → Insights

Upload a bank statement PDF and get back a full financial picture: every
transaction categorized (income vs. expense, category, amount, counterparty,
date), plus subscription detection, a next-month spending estimate, spending
charts, and AI-generated cost-cutting suggestions — powered by the Gemini API.

```
bank-statement-parser/
├── client/   React + Vite frontend (Ledger view + Insights dashboard)
└── server/   Express backend: PDF extraction + local analysis + Gemini insights
```

## How it works

1. The React app lets you drag-and-drop or select a PDF bank statement.
2. The file is sent to the Express server (`POST /api/parse-statement`).
3. The server base64-encodes the PDF and sends it inline to Gemini
   (`gemini-2.5-flash`) along with a strict JSON schema and a prompt
   describing the extraction/categorization rules. This returns every
   transaction with its date, counterparty, type, category, and amount.
4. The server then runs **deterministic, local analysis** on those
   transactions — no extra AI call needed:
   - **Subscription detection**: groups expenses by counterparty, flags
     ones with a regular cadence (weekly/monthly/quarterly/yearly) and
     near-identical amounts, restricted to categories where that pattern
     actually means "subscription" rather than e.g. a recurring grocery run.
   - **Next-month prediction**: projects known subscriptions forward to
     their next due date, and estimates typical non-subscription spend
     from the average of past months in the statement.
   - **Spending breakdowns**: totals by category and by month, for charts.
5. The category totals + detected subscriptions (a small, compact summary —
   not the raw PDF) are sent to Gemini once more for **cost-cutting
   suggestions** — the one place an LLM's judgment genuinely helps, since
   it can reason about which categories look unusually high or redundant.
6. Everything comes back in a single response. Nothing is written to disk.

## Setup

### 1. Get a Gemini API key

Create a key at [Google AI Studio](https://aistudio.google.com/apikey).

### 2. Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env and paste your key into GEMINI_API_KEY
npm run dev
```

The server starts on `http://localhost:4000` (configurable via `PORT` in `.env`).

### 3. Client

In a separate terminal:

```bash
cd client
npm install
cp .env.example .env   # only needed if your server isn't on localhost:4000
npm run dev
```

The client starts on `http://localhost:5173`. Open it, upload a statement
PDF, and click "Parse statement." You'll land on the **Insights** tab by
default, with a **Ledger** tab for the raw transaction table.

## JSON output shape

```jsonc
{
  "accountHolder": "Jane Doe",
  "bankName": "Example Bank",
  "statementPeriod": { "startDate": "2026-01-01", "endDate": "2026-03-31" },
  "currency": "USD",
  "summary": {
    "totalIncome": 12000,
    "totalExpense": 8500.45,
    "netChange": 3499.55,
    "transactionCount": 24
  },
  "transactions": [
    {
      "date": "2026-01-05",
      "description": "AMZN MKTP US*2K3JF93",
      "counterparty": "Amazon",
      "type": "expense",
      "category": "Shopping",
      "amount": 42.99,
      "balanceAfter": 1820.11
    }
    // ...
  ],
  "insights": {
    "subscriptions": [
      {
        "counterparty": "Netflix",
        "category": "Subscriptions",
        "cadence": "monthly",
        "averageAmount": 15.99,
        "occurrences": 3,
        "lastChargeDate": "2026-03-05",
        "nextExpectedDate": "2026-04-04",
        "annualCost": 191.88
      }
    ],
    "nextMonth": {
      "estimatedSubscriptionCharges": 15.99,
      "estimatedOtherSpend": 312.40,
      "estimatedTotal": 328.39,
      "upcomingSubscriptionCharges": [ /* same shape as subscriptions */ ]
    },
    "categoryBreakdown": [
      { "category": "Groceries", "total": 412.10 }
      // one entry per category, sorted descending
    ],
    "monthlyBreakdown": [
      { "month": "2026-01", "income": 4000, "expense": 1200.30 }
      // one entry per calendar month present in the statement
    ],
    "suggestions": [
      {
        "title": "Cancel unused Hulu subscription",
        "detail": "You're paying for both Netflix and Hulu — consolidating to one saves money if you're not using both.",
        "estimatedMonthlySavings": 12.99,
        "category": "Subscriptions"
      }
    ]
  }
}
```

`category` is constrained to a fixed enum (see `server/src/geminiService.js`)
covering common income and expense buckets — edit that list and the prompt
together if you want to add or rename categories.

## Why subscription detection and prediction aren't AI calls

Recurring-charge detection and next-month projection are pattern-matching
and arithmetic, not generation — handing them to an LLM would be slower,
costlier, and less consistent than just computing them (see
`server/src/analysis.js`). The categorization step still needs Gemini
because reading a messy PDF and inferring "this is dining, that's a
transfer" genuinely benefits from a model. Cost-cutting suggestions also go
through Gemini (`server/src/insightsService.js`), but only on the *already
computed* summary — a few hundred bytes of JSON, not the original PDF — so
that call stays fast and cheap.

## Notes & limits

- Inline PDF uploads are capped at **20MB** (Gemini's inline-data limit and
  also enforced by Multer on the server). For larger statements, you'd swap
  the inline `base64` approach in `geminiService.js` for Gemini's Files API.
- Scanned/image-only PDFs work too — Gemini reads PDFs with native vision,
  not just a text layer — but quality depends on scan clarity.
- Subscription detection needs **at least 2 occurrences** of a counterparty
  to flag a pattern, and next-month estimates get more accurate with more
  months of statement data. A single month's statement will still work, but
  predictions are necessarily rougher.
- If the Gemini call for cost-cutting suggestions fails for any reason, the
  rest of the response (transactions, subscriptions, charts) still comes
  through — `suggestions` just comes back as an empty array.
- This is a starting point, not a production hardened service: there's no
  auth, rate limiting, or persistence layer. Add those before deploying
  anywhere a stranger can hit your Gemini quota.

