import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MoodChart = ({ data }) => {
    const { theme } = useTheme();
    const chartData = useMemo(() => {
        const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
        return {
            labels: sortedData.map(d => new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })),
            datasets: [{ label: 'Mood Score', data: sortedData.map(d => d.score), borderColor: 'rgb(99, 102, 241)', backgroundColor: 'rgba(99, 102, 241, 0.2)', tension: 0.4, fill: true }],
        };
    }, [data]);

    const options = {
        responsive: true,
        scales: {
            y: {
                min: 0, max: 6,
                ticks: { stepSize: 1, callback: function (value) { const labels = ['', 'Sad', 'Bad', 'Okay', 'Good', 'Great']; return labels[value] || ''; }, color: theme === 'dark' ? '#94a3b8' : '#64748b' },
                grid: { color: theme === 'dark' ? '#1e293b' : '#e2e8f0' }
            },
            x: { ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' }, grid: { display: false } }
        },
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: function (context) { const labels = ['', 'Very Sad', 'Bad', 'Okay', 'Good', 'Amazing']; return `Mood: ${labels[context.raw]}`; } } }
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weekly Mood Trend</h3>
            <div className="h-64 w-full">{data.length > 0 ? <Line options={options} data={chartData} /> : <div className="h-full flex items-center justify-center text-gray-400">No mood data yet</div>}</div>
        </Card>
    );
};
export default MoodChart;
