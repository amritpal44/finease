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
  // Accepts data as array of {label, value} objects (from dashboard analysis)
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No data available for this chart.
      </div>
    );
  }

  // Convert to Chart.js format
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);

  let chartData;
  let options = {};

  if (type === "pie") {
    chartData = {
      labels,
      datasets: [
        {
          data: values,
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
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#1e2a47",
            font: { family: "inherit", size: 14 },
          },
        },
        tooltip: {
          bodyColor: "#fff", // Tooltip text color
          titleColor: "#fff", // Tooltip title color (dark blue)
          backgroundColor: "#1e2a47", // Tooltip background for contrast
          borderColor: "#36A2EB",
          borderWidth: 1,
          displayColors: false,
        },
      },
    };
  } else if (type === "line") {
    chartData = {
      labels, // e.g., dates
      datasets: [
        {
          label: "Spending",
          data: values, // e.g., spending amount for each date
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#1e2a47",
            font: { family: "inherit", size: 14 },
          },
        },
        title: {
          display: true,
          text: "Spending Over Time",
          color: "#1e2a47",
          font: { family: "inherit", size: 16, weight: "bold" },
        },
        tooltip: {
          bodyColor: "#fff", // Tooltip text color
          titleColor: "#fff", // Tooltip title color (dark blue)
          backgroundColor: "#1e2a47", // Tooltip background for contrast
          borderColor: "#36A2EB",
          borderWidth: 1,
          displayColors: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
            color: "#1e2a47",
            font: { family: "inherit", size: 13 },
          },
          ticks: {
            color: "#1e2a47",
            font: { family: "inherit", size: 12 },
          },
        },
        y: {
          title: {
            display: true,
            text: "Amount (₹)",
            color: "#1e2a47",
            font: { family: "inherit", size: 13 },
          },
          ticks: {
            color: "#1e2a47",
            font: { family: "inherit", size: 12 },
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
    <div className="w-full h-[300px] flex items-center justify-center bg-white rounded-lg shadow-sm p-2 md:p-4">
      <div className="w-full h-full">
        {type === "pie" && <Pie data={chartData} options={options} />}
        {type === "line" && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
}
