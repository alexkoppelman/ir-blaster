import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController, TimeScale, ChartDataLabels);

const TemperatureChart = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    axios.get('https://alexkoppelman.es:1880/hftemp')
      .then(response => {
        const validData = response.data.map(entry => ({
          datetime: new Date(entry.datetime),
          temperature: !isNaN(Number(entry.Value)) ? Number(entry.Value) : null,
        })).filter(entry => entry.temperature !== null)
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime)); // Sort by datetime in ascending order
        setData(validData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(entry => entry.datetime),
        datasets: [
          {
            label: false,
            data: data.map(entry => entry.temperature),
            fill: false,
            backgroundColor: '#EAF6FF ',
            borderColor: '#54585F',
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false, // Disable legend
          },
          tooltip: {
            enabled: false, // Disable tooltips
          },
          datalabels: {
            align: 'top',
            anchor: 'end',
            backgroundColor: '#54585F',
            borderRadius: 4,
            color: '#EAF6FF',
            formatter: (value) => value.toFixed(2), // Format the label
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              tooltipFormat: 'HH:mm', // Format for tooltips
              displayFormats: {
                minute: 'HH:mm', // Format for x-axis labels
              },
            },
            title: {
              display: false,
            },
          },
          y: {
            title: {
              display: false,
            },
            min: 0,
            max: 50,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
};

export default TemperatureChart;