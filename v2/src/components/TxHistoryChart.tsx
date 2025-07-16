import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import LoadingSpinner from './common/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Block {
  index: number;
  timestamp: string;
  txCount: number;
}

interface TxHistoryChartProps {
  blocks: Block[];
  loading: boolean;
}

const processData = (blocks: Block[]) => {
  if (!blocks || blocks.length === 0) return { labels: [], data: [] };

  const sortedBlocks = [...blocks]
    .map((b) => ({ timestamp: b.timestamp, txCount: b.txCount, index: b.index }))
    .reverse();

  if (sortedBlocks.length > 0) {
    const startIndex = sortedBlocks[0].index - (sortedBlocks[0].index % 10);
    const filteredBlocks = sortedBlocks.filter((b) => b.index >= startIndex);

    const chunkedBlocks = [];
    for (let i = 0; i < filteredBlocks.length; i += 10) {
      chunkedBlocks.push(filteredBlocks.slice(i, i + 10));
    }

    const labels = chunkedBlocks.map((chunk) => {
      const first = chunk[0];
      const last = chunk[chunk.length - 1];
      return `${first.index}~${last.index}`;
    });

    const data = chunkedBlocks.map((chunk) => {
      const avgTx = chunk.reduce((sum, block) => sum + block.txCount, 0) / chunk.length;
      return avgTx;
    });

    return { labels, data };
  }

  return { labels: [], data: [] };
};

export default function TxHistoryChart({ blocks, loading }: TxHistoryChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const { labels, data } = processData(blocks);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: '#f6a14c',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        radius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: false,
        title: { display: false },
      },
      y: { display: true },
    },
  };

  if (loading) {
    return (
      <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
        <LoadingSpinner size="sm" color="gray" />
      </div>
    );
  }

  return (
    <div className="h-32">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
