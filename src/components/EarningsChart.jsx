import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const EarningsChart = ({ chartData }) => {
  const data = {
    labels: chartData.map(entry => new Date(entry.date).toLocaleString('default', { month: 'short', year: 'numeric' })),
    datasets: [
      {
        label: 'Monthly Earnings (₹)',
        data: chartData.map(entry => entry.amount),
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Earnings Trend' },
    },
  };
  return <Line options={options} data={data} />;
};
export default EarningsChart;