import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { ArcElement, CategoryScale, Chart, Legend } from 'chart.js';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from './LoadingSpinner';

// TODO: check if this works correctly. It does show the pie chart, but it doesn't seem to be displaying the correct data
const AnalysisPieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  Chart.register(ArcElement, CategoryScale, Legend);

  const distributionTypes = {
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };

  const { stuffs, ready } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.analysis);
    return {
      ready: subscription.ready(),
      stuffs: Stuffs.collection.find().fetch(),
    };
  }, []);

  useEffect(() => {
    const distributionCounts = {};

    stuffs.forEach((stuff) => {
      stuff.parts?.forEach((part) => {
        distributionCounts[part.distribution] = distributionCounts[part.distribution]
          ? distributionCounts[part.distribution] + part.weight
          : part.weight;
      });
    });

    setChartData({
      labels: Object.keys(distributionCounts).map(key => distributionTypes[Number(key)]),
      datasets: [{
        data: Object.values(distributionCounts),
        backgroundColor: [
          'rgba(28, 128, 172, 0.6)', // Deep Sea Blue
          // 'rgba(201, 235, 227, 0.6)', // Mint Cream
          // 'rgba(211, 245, 242, 0.6)', // Light Cyan
          'rgba(3, 37, 65, 0.6)', // Dark Navy
          // 'rgba(72, 194, 227, 0.6)', // Aquamarine
          'rgba(167, 219, 216, 0.6)', // Turquoise
          'rgba(226, 106, 106, 0.6)', // Salmon contrast color
        ],
      }],
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
      },
    });

  }, [stuffs]);

  return (ready ? (
    <div>
      {chartData && chartOptions
        ? (
          <div style={{ width: '100%', height: '500px', marginBottom: '100px' }}>
            <h3>Debris Distribution</h3>
            <Pie data={chartData} options={chartOptions} />
          </div>
        )
        : <p>No events have any parts yet.</p>}
    </div>
  ) : <LoadingSpinner />);
};

export default AnalysisPieChart;
