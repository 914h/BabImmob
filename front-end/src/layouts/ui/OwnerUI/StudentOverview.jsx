"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const propertyTypes = [
  { label: "Apartments", count: 8, color: "#2563eb" },
  { label: "Villas", count: 3, color: "#22c55e" },
  { label: "Houses", count: 5, color: "#f59e42" },
  { label: "Studios", count: 2, color: "#a21caf" },
  { label: "Commercial", count: 1, color: "#f43f5e" },
];

const data = {
  labels: propertyTypes.map((t) => t.label),
  datasets: [
    {
      label: "# of Properties",
      data: propertyTypes.map((t) => t.count),
      backgroundColor: propertyTypes.map((t) => t.color),
      borderColor: [
        "#1e40af",
        "#15803d",
        "#ea580c",
        "#701a75",
        "#be123c"
      ],
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // We'll use a custom legend
    tooltip: {
      callbacks: {
        label: (context) => {
          const idx = context.dataIndex;
          const t = propertyTypes[idx];
          return `${t.label}: ${t.count} properties`;
        },
      },
    },
  },
};

export default function StudentOverview() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[380px] h-[280px] mx-auto">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4 w-full max-w-md text-center text-sm text-muted-foreground">
        <span className="font-semibold text-primary-modern">Portfolio Breakdown:</span> See the distribution of your property types.<br />
        <div className="mt-4 flex flex-wrap justify-center gap-3 w-full">
          {propertyTypes.map((t, idx) => (
            <div key={t.label} className="flex items-center gap-2 px-3 py-1 rounded bg-muted/50">
              <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: t.color }}></span>
              <span className="font-medium">{t.label}</span>
              <span className="ml-1 text-xs text-muted-foreground">({t.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
