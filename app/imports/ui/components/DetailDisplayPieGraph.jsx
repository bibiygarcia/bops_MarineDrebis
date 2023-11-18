import React, { useEffect, useState } from 'react';
import { ArcElement, CategoryScale, Chart, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const DetailDisplayPieGraph = ({ event }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  Chart.register(ArcElement, CategoryScale, Legend);

  const distributionTypes = {
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };

  useEffect(() => {
    const distributionCounts = {};

    event.parts?.forEach((part) => {
      distributionCounts[part.distribution] = distributionCounts[part.distribution]
        ? distributionCounts[part.distribution] + part.weight
        : part.weight;
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
          position: 'bottom',
          labels: {
            padding: 20,
          },
        },
      },
    });

  }, [event]);

  const largeScreen = window.innerWidth >= 1200;

  const largeScreenStyles = largeScreen
    ? { marginTop: '300px', marginLeft: '75px' }
    : { marginTop: '0px', marginLeft: '0px' };

  const styles = {
    ...largeScreenStyles,
    width: '100%',
    height: '500px',
    marginBottom: '100px',
    textAlign: 'center',
  };

  return (
    <div style={styles}>
      {chartData && chartOptions
        ? (
          <div>
            <h3 style={{ color: 'dimgrey' }}>Debris Distribution</h3>
            <div style={{ height: '500px', position: 'relative' }}>
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
        )
        : <p>This event does not have any parts yet.</p>}
    </div>
  );
};

DetailDisplayPieGraph.propTypes = {
  event: PropTypes.shape({
    parts: PropTypes.arrayOf(PropTypes.shape({
      distribution: PropTypes.number,
      weight: PropTypes.number,
    })),
  }),
};
DetailDisplayPieGraph.defaultProps = {
  event: {
    parts: [],
  },
};

export default DetailDisplayPieGraph;
