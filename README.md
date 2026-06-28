# 💰 AI Expense Analyzer

> **An AI-powered financial assistant that transforms raw bank statement PDFs into meaningful financial insights, spending analytics, and personalized saving recommendations.**

---

## 🚀 Overview

Managing personal finances from bank statements is often tedious and time-consuming. Traditional statements contain raw transaction descriptions such as merchant names, UPI references, and bank codes, making it difficult for users to understand their spending habits.

**AI Expense Analyzer** simplifies this process by leveraging **Google Gemini AI** to extract, categorize, and analyze transactions directly from bank statement PDFs.

Users simply upload their statement, and the application automatically generates:

* 📊 Expense analytics
* 📈 Interactive charts
* 🤖 AI-powered spending insights
* 💡 Personalized saving recommendations
* 🔄 Subscription detection
* 📅 Next month's spending prediction

---

# ✨ Features

### 📄 Smart Bank Statement Parsing

* Upload bank statement PDFs
* Automatic transaction extraction
* Merchant identification
* Structured transaction generation

### 🤖 AI Categorization

* Automatically categorizes transactions into:

  * Food & Dining
  * Shopping
  * Transportation
  * Healthcare
  * Entertainment
  * Utilities
  * Travel
  * Education
  * Insurance
  * Investments
  * and more...

### 📊 Financial Dashboard

* Total Income
* Total Expenses
* Net Savings
* Highest Spending Category

### 📈 Visual Analytics

* Spending distribution (Pie Chart)
* Monthly spending trends (Bar Chart)

### 💡 AI Insights

* Personalized spending summary
* Cost-cutting suggestions
* Budget recommendations
* Spending pattern analysis

### 🔄 Subscription Detection

Automatically detects recurring subscriptions such as:

* Netflix
* Spotify
* Insurance
* Rent
* Utility Bills

### 📅 Future Spending Prediction

Predicts:

* Upcoming subscription renewals
* Estimated next month's expenses
* Monthly recurring costs

---

# 🛠 Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Recharts
* Axios

## Backend

* Node.js
* Express.js
* Multer

## AI

* Google Gemini 3.5 Flash

---

# 🏗 System Architecture

```text
                Upload PDF
                     │
                     ▼
             Express Backend
                     │
                     ▼
      Gemini PDF Parsing & Categorization
                     │
                     ▼
       Structured Transaction JSON
                     │
                     ▼
      Analytics & Subscription Engine
                     │
                     ▼
      AI Cost-Cutting Recommendations
                     │
                     ▼
          Interactive Dashboard
```

---

# 📂 Project Structure

```
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── assets/
│   └── utils/
│

backend/
│
├── controllers/
├── services/
├── routes/
├── middleware/
├── uploads/
└── utils/
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone <repository-url>

cd AI-Expense-Analyzer
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=4000
```

---

# 📷 Workflow

1. Upload Bank Statement PDF

↓

2. Gemini extracts transactions

↓

3. AI categorizes merchants

↓

4. Analytics Engine computes statistics

↓

5. Dashboard visualizes insights

↓

6. AI generates personalized financial recommendations

---

# 🎯 Future Improvements

* Multi-bank statement support
* OCR support for scanned PDFs
* Monthly financial reports
* Export insights to PDF
* Email notifications
* Investment recommendations
* Expense anomaly detection
* Goal-based budgeting

---

# 👥 Team

Developed during **Binge N Build 24-Hour Hackathon**

Team Members:

* Aditya Umak
* Savya Agarwal

---

# 🏆 Why AI?

Unlike traditional expense trackers that rely on manually categorized data, our system uses **Google Gemini AI** to understand raw bank statement transactions, identify merchants, categorize expenses, detect subscriptions, and generate personalized financial insights automatically.

This eliminates manual effort and provides users with a smarter, faster, and more intuitive way to manage their finances.

---

## 📜 License

This project was built for educational and hackathon purposes.
