const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ----------------------
// Normalize merchant names
// ----------------------
function normalizeMerchant(name) {
  return name
    .toLowerCase()
    .replace("india", "")
    .replace("pvt", "")
    .replace("private", "")
    .replace(/[^a-z]/g, "")
    .trim();
}

function getFrequency(transactions) {

    if (transactions.length < 2)
        return "Unknown";

    const dates = transactions
        .map(t => new Date(t.Date))
        .sort((a,b)=>a-b);

    let total = 0;

    for(let i=1;i<dates.length;i++){

        total += (dates[i]-dates[i-1])/(1000*60*60*24);

    }

    const avg = total/(dates.length-1);

    if(avg>=25 && avg<=35)
        return "Monthly";

    if(avg>=6 && avg<=8)
        return "Weekly";

    if(avg>=360 && avg<=370)
        return "Yearly";

    return "Unknown";

}

function predictNextCharge(transactions){

    const dates = transactions
        .map(t=>new Date(t.Date))
        .sort((a,b)=>a-b);

    const last = dates[dates.length-1];

    const next = new Date(last);

    next.setMonth(next.getMonth()+1);

    return next.toDateString();

}

function detectPriceIncrease(transactions){

    const amounts = transactions.map(
        t=>Math.abs(Number(t.Amount))
    );

    const first = amounts[0];

    const last = amounts[amounts.length-1];

    if(last>first){

        return {
            increased:true,
            old:first,
            current:last
        };

    }

    return {
        increased:false
    };

}

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.post("/upload", upload.single("file"), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {

      // Delete uploaded CSV
      fs.unlinkSync(req.file.path);

      // Group transactions
      const grouped = {};

      results.forEach((transaction) => {

        const merchant = normalizeMerchant(transaction.Merchant);

        if (!grouped[merchant]) {
          grouped[merchant] = [];
        }

        grouped[merchant].push(transaction);

      });

      // Detect subscriptions
      const subscriptions = [];

      for (const merchant in grouped) {

  if (grouped[merchant].length >= 2) {

    subscriptions.push({
      name: merchant,
      amount: grouped[merchant][0].Amount,
      frequency: getFrequency(grouped[merchant]),
      nextCharge: predictNextCharge(grouped[merchant]),
      priceInfo: detectPriceIncrease(grouped[merchant]),
      transactions: grouped[merchant]
    });

  }

}

      res.json(subscriptions);

    });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});