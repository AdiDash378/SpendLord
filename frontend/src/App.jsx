import { useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {

  const [subscriptions, setSubscriptions] = useState([]);

  const uploadFile = async (e) => {

    const formData = new FormData();

    formData.append("file", e.target.files[0]);

    const res = await axios.post(
      "http://localhost:5000/upload",
      formData
    );

    setSubscriptions(res.data);

  };

  const totalSubscriptions = subscriptions.length;

  const totalMonthlyCost = subscriptions.reduce(
    (sum, sub) => sum + Math.abs(Number(sub.amount)),
    0
  );

  const highestSubscription =
    subscriptions.length > 0
      ? subscriptions.reduce((a, b) =>
          Math.abs(Number(a.amount)) > Math.abs(Number(b.amount)) ? a : b
        )
      : null;

const pieData = {
  labels: subscriptions.map((sub) => sub.name),

  datasets: [
    {
      label: "Monthly Cost",
      data: subscriptions.map((sub) =>
        Math.abs(Number(sub.amount))
      ),

      backgroundColor: [
        "#36A2EB", // Blue
        "#FF6384", // Pink
        "#FFCE56", // Yellow
        "#4BC0C0", // Teal
        "#9966FF", // Purple
        "#FF9F40", // Orange
      ],

      borderColor: "#ffffff",
      borderWidth: 2,
    },
  ],
};

const pieOptions = {
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

  return (
    <div style={{ padding: "30px" }}>

      <h1>SubSlash</h1>

      <div
    style={{
      display: "flex",
      gap: "20px",
      marginBottom: "30px",
      marginTop: "20px",
    }}
  >

    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
        width: "200px",
      }}
    >
      <h3>Active Subscriptions</h3>
      <h2>{totalSubscriptions}</h2>
    </div>

    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
        width: "200px",
      }}
    >
      <h3>Monthly Cost</h3>
      <h2>₹{totalMonthlyCost}</h2>
    </div>

    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
        width: "200px",
      }}
    >
      <h3>Highest Subscription</h3>
      <h2>{highestSubscription?.name}</h2>
    </div>

  </div>

      <div
        style={{
          width: "400px",
          marginTop: "30px",
        }}
      >
        <Pie data={pieData} options={pieOptions} />
      </div>
      <input
        type="file"
        accept=".csv"
        onChange={uploadFile}
      />

      <hr />

      {subscriptions.map((sub, index) => (

        <div
          key={index}
          style={{
            border: "1px solid gray",
            marginBottom: "20px",
            padding: "10px"
          }}
        >

          <h2>{sub.name}</h2>

          <p>Next Charge: {sub.nextCharge}</p>

          <p>Amount: ₹{sub.amount}</p>

          <p>{sub.frequency}</p>

          {sub.priceInfo.increased && (
          <p style={{ color: "red" }}>
            ⚠️ Price increased from ₹{sub.priceInfo.old} to ₹{sub.priceInfo.current}
          </p>
        )}

          {sub.transactions.map((t, i) => (

            <div key={i}>

              {t.Date} | ₹{t.Amount}

            </div>

          ))}

        </div>

      ))}

    </div>
  );

}

export default App;