// components/ChartComponent.js
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export default function ChartComponent({ type, data }) {
  // Basic error handling for data structure
  if (
    !data ||
    (type === "pie" && !data.labels) ||
    (type === "line" && !data.labels)
  ) {
    return (
      <div className="text-center text-gray-500">
        No data available for this chart.
      </div>
    );
  }

  // Prepare data for Chart.js
  let chartData;
  let options = {};

  if (type === "pie") {
    chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966CC",
            "#FF9F40",
            "#A1E9F5",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966CC",
            "#FF9F40",
            "#A1E9F5",
          ],
        },
      ],
    };
    options = {
      responsive: true,
      maintainAspectRatio: false, // Allow controlling size with parent div
      plugins: {
        legend: {
          position: "top",
        },
      },
    };
  } else if (type === "line") {
    chartData = {
      labels: data.labels, // e.g., dates
      datasets: [
        {
          label: "Spending",
          data: data.values, // e.g., spending amount for each date
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    options = {
      responsive: true,
      maintainAspectRatio: false, // Allow controlling size with parent div
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Spending Over Time",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Amount (₹)",
          },
        },
      },
    };
  } else {
    return (
      <div className="text-center text-red-500">Unsupported chart type.</div>
    );
  }

  return (
    <div style={{ position: "relative", height: "300px", width: "100%" }}>
      {" "}
      {/* Container for responsive charts */}
      {type === "pie" && <Pie data={chartData} options={options} />}
      {type === "line" && <Line data={chartData} options={options} />}
    </div>
  );
}
