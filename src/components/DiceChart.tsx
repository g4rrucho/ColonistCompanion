import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { TColonistCompanion } from "@/content/watcher/gameParser/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface IDiceChartProps {
  dices: TColonistCompanion["dices"];
}

const DiceChart: React.FC<IDiceChartProps> = ({ dices }) => {
  const data = {
    labels: Array.from({ length: 11 }, (_, i) => (i + 2).toString()),
    datasets: [
      {
        data: dices,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { maxTicksLimit: 5, precision: 0 },
        grid: { display: false },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return <Bar  data={data} options={options} />;
};

export default DiceChart;
