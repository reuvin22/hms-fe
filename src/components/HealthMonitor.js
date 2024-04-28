// import { Chart } from 'react-chartjs-2'
import Chart from 'chart.js/auto';
// import Chart from 'chart.js'
import 'moment';
import 'chartjs-adapter-moment';
import { useRef, useEffect, useState } from 'react';
import { useCreateBulkMutation } from '@/service/settingService';
import { useDeleteDataMutation, useCreateDataMutation } from '@/service/patientService';
const generateBlankData = () => {
  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  );
  return hoursArray;
};

const fillData = (baseData, inputData) => {
  const filledData = baseData.map((hour) => {
    const index = inputData.labels.findIndex((label) => label === hour);
    return index !== -1 ? inputData.data[index] : null;
  });
  return filledData;
};

function HealthMonitor({
  data,
  onSetHour,
  onInputtedRR,
  onInputtedPR,
  onInputtedTemp,
  onAddData,
  onClearData,
  profileData
}) {
  const chartRef = useRef(null);
  const currentDate = new Date();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const formattedCurrentDate = `${currentDate.getDate().toString().padStart(2, '0')} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  const [displayedDateTime, setDisplayedDateTime] =
    useState(formattedCurrentDate);
  const [displayedHour, setDisplayedHour] = useState('');
  const [addedSets, setAddedSets] = useState([]);
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [pulseRate, setPulseRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [hasAddedDay, setHasAddedDay] = useState(false);
  const [hour, setHour] = useState('');
  const [formData, setFormData] = useState({
    health_monitor_id: profileData.id,
    patient_id: profileData.patient_id,
    date: displayedDateTime,
    hour: '',
    respiratory_rate: '',
    pulse_rate: '',
    temperature: ''
  });
  const [createBulk] = useCreateBulkMutation();
  const [createData] = useCreateDataMutation();
  const [deleteData] = useDeleteDataMutation();
  const handleDateTimeChange = (e) => {
    setDisplayedDateTime(e.target.value);

    if (e.target.value !== formattedCurrentDate) {
      handleAddDay();
    }
  };

  const baseLabels = generateBlankData();
  const fillDataWithBaseLabels = (labelName) =>
    fillData(baseLabels, {
      labels: data.labels,
      data: data.datasets.find((dataset) => dataset.label === labelName).data
    });

  const handleHourChange = (e) => {
    const time = e.target.value.slice(0, 2); // This will give something like "16:00"
    setDisplayedHour(time);

    // const militaryTime = time.replace(':', ''); // Convert it to "1600"
    setHour(time);
    onSetHour(time);
    setFormData((prev) => ({
      ...prev,
      hour: time
    }));
  };

  const handleRespiratoryRateChange = (e) => {
    setRespiratoryRate(e.target.value);
    onInputtedRR(e.target.value);
    setFormData((prev) => ({
      ...prev,
      respiratory_rate: e.target.value
    }));
  };

  const handlePulseRateChange = (e) => {
    setPulseRate(e.target.value);
    onInputtedPR(e.target.value);
    setFormData((prev) => ({
      ...prev,
      pulse_rate: e.target.value
    }));
  };

  const handleTemperatureChange = (e) => {
    setTemperature(e.target.value);
    onInputtedTemp(e.target.value);
    setFormData((prev) => ({
      ...prev,
      temperature: e.target.value
    }));
  };

  // const respiratoryRateData = fillDataWithBaseLabels('Respiratory Rate');
  // const pulseRateData = fillDataWithBaseLabels('Pulse Rate');
  // const temperatureData = fillDataWithBaseLabels('Temperature');
  // console.log(respiratoryRateData)

  const respiratoryRateData = [];
  const pulseRateData = [];
  const temperatureData = [];

  profileData.health_monitors?.map((item) => {
    respiratoryRateData.push(item.respiratory_rate);
    pulseRateData.push(item.pulse_rate);
    temperatureData.push(item.temperature);
    return item;
  });

  // console.log(h);
  const [labels, setLabels] = useState([...baseLabels]); // Start with Day 1 labels

  const handleAddDay = () => {
    // const newLabels = baseLabels.map(label => `${label}`)
    // setLabels(prevLabels => [...prevLabels, ...newLabels])
    if (hasAddedDay) return;

    const newLabels = baseLabels.map((label) => `${label}`);
    setLabels((prevLabels) => [...prevLabels, ...newLabels]);
    setAddedSets((prevSets) => [...prevSets, newLabels]); // Remember this new set
    setHasAddedDay(true);
  };

  const handleRemoveDay = () => {
    if (addedSets.length > 0) {
      const lastAdded = addedSets[addedSets.length - 1];
      const lastAddedCount = lastAdded.length;
      setLabels((prevLabels) => prevLabels.slice(0, -lastAddedCount)); // Remove the last added set
      setAddedSets((prevSets) => prevSets.slice(0, -1)); // Forget the last added set
    }
    // if (labels.length > 24) {
    //     setLabels(prevLabels => prevLabels.slice(0, -24))
    // }
  };
  const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
  const minTime =
    displayedDateTime === formattedCurrentDate ? currentTime : '00';

  useEffect(() => {
    if (displayedDateTime !== formattedCurrentDate && !hasAddedDay) {
      handleAddDay();
    }

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Respiratory Rate',
            // data: respiratoryRateData,
            data: respiratoryRateData,
            yAxisID: 'rr',
            borderColor: '#0000FF',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            fill: false,
            borderWidth: 2,
            spanGaps: true,
            pointRadius: 3
          },
          {
            label: 'Pulse Rate',
            data: pulseRateData,
            yAxisID: 'pr',
            borderColor: '#FF0000',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            fill: false,
            borderWidth: 2,
            spanGaps: true,
            pointRadius: 3
          },
          {
            label: 'Temperature',
            yAxisID: 'temperature',
            data: temperatureData,
            borderColor: '#FFFF00',
            backgroundColor: 'rgba(255, 255, 0, 0.2)',
            fill: false,
            borderWidth: 2,
            spanGaps: true,
            pointRadius: 3
          }
        ]
      },
      options: {
        // responsive: true,
        // maintainAspectRatio: false,
        scales: {
          x: {
            // type: 'time',
            // time: {
            //     unit: 'year',
            //     stepSize: 100,
            //     // displayFormats: {
            //     //     hour: 'HH:mm'
            //     // }
            // },
            ticks: {
              font: {
                size: 12 // change the value as needed
              }
            }
          },
          temperature: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 44,
            ticks: {
              stepSize: 4,
              callback(value) {
                if (value >= 20 && value <= 50) {
                  return value;
                }
                return null;
              }
            },
            grid: {
              drawBorder: true,
              drawOnChartArea: false,
              borderColor: '#000', // border color
              borderWidth: 1 // border width
            }
          },

          pr: {
            type: 'linear',
            position: 'left', // All left, they'll overlap visually
            min: 30,
            max: 180,
            ticks: {
              stepSize: 10,
              callback(value) {
                if (value >= 50 && value <= 180) {
                  return value;
                }
                return null;
              },
              afterBuildTicks(scale) {
                const temperatureScale = scale.chart.scales.temperature;

                console.log(scale);
                // Check if 180 exists in the PR ticks
                if (scale.ticks.includes(180)) {
                  temperatureScale.ticks = [null, null, 40, 39, 38, 37, 36, 35];
                }
                // Further adjustments can be added based on your requirements.
              }
            },
            grid: {
              drawBorder: true,
              drawOnChartArea: false,
              borderColor: '#000', // border color
              borderWidth: 1 // border width
            }
          },
          rr: {
            type: 'linear',
            position: 'left',
            min: -5,
            max: 190,
            ticks: {
              stepSize: 10,
              callback(value) {
                if (value >= 10 && value <= 60) {
                  return value;
                }
                return null;
              }
            },
            grid: {
              drawBorder: true,
              drawOnChartArea: false,
              borderColor: '#000', // border color
              borderWidth: 1 // border width
            }
          }
        },
        plugins: {
          title: {
            display: true,
            font: {
              size: 24 // change the value as needed
            }
          }
        }
      }
      // Add other configuration options if needed
    });

    chartRef.current = newChartInstance;

    return () => {
      // Cleanup: destroy chart instance before unmounting component
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, labels, respiratoryRateData, pulseRateData, temperatureData]);

  const handleAddData = () => {
    onAddData();
    createData({ url: 'create-health-monitor', actionType: 'createHealthMonitor', data: formData });
    setRespiratoryRate(''), setPulseRate(''), setTemperature('');
    setHour('');
  };

  const handleClearData = () => {
    onClearData();
    deleteData({
      url: 'delete-health-monitor',
      id: profileData.id,
      actionType: 'deleteHealthMonitorById'
    });
  };

  return (
    <div>
      <div className="flex items-center pb-10 px-10">
        <div className="flex flex-col">
          <label className="text-gray-500 font-bold uppercase text-xs">
            Date
          </label>
          <input
            type="text"
            value={displayedDateTime}
            onChange={handleDateTimeChange}
            readOnly
            className="border text-xs border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />

          <label className="text-gray-500 font-bold uppercase text-xs">
            Hour
          </label>
          <input
            type="number"
            placeholder="Enter hour"
            value={displayedHour}
            min="0"
            max="23"
            onChange={handleHourChange}
            className="border text-xs border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />

          <label className="text-gray-500 font-bold uppercase text-xs">
            Respiratory Rate
          </label>
          <input
            type="number"
            placeholder="Enter RR"
            value={respiratoryRate}
            onChange={handleRespiratoryRateChange}
            className="border text-xs border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />

          <label className="text-gray-500 font-bold uppercase text-xs">
            Pulse Rate
          </label>
          <input
            type="number"
            placeholder="Enter PR"
            value={pulseRate}
            onChange={handlePulseRateChange}
            className="border text-xs border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />

          <label className="text-gray-500 font-bold uppercase text-xs">
            Temperature
          </label>
          <input
            type="number"
            placeholder="Enter T"
            value={temperature}
            onChange={handleTemperatureChange}
            className="border text-xs border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={() => handleAddData()}
              title="Add Day"
              className="flex justify-center items-center bg-green-600 hover:bg-green-700 text-white text-xs p-1 rounded w-full"
            >
              <svg
                dataSlot="icon"
                fill="none"
                className="w-5 h-5 mr-1"
                strokeWidth={1.5}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add
            </button>
            <button
              onClick={() => handleClearData()}
              title="Remove Day"
              className="flex justify-center items-center bg-red-500 hover:bg-red-600 text-white text-xs p-1 rounded w-full"
            >
              <svg
                dataSlot="icon"
                fill="none"
                className="w-5 h-5 mr-1"
                strokeWidth={1.5}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              Clear
            </button>
          </div>
        </div>

        <div className="w-full px-8" style={{ position: 'relative', top: 0 }}>
          <div
            style={{
              position: 'absolute',
              top: '3rem',
              left: '25px',
              fontSize: '10px',
              color: 'rgb(107 114 128)',
              width: '5px',
              lineHeight: '.5rem',
              fontWeight: 700
            }}
          >
            RR cpm
          </div>
          <div
            style={{
              position: 'absolute',
              top: '3rem',
              left: 'calc(4% + 12px)',
              fontSize: '10px',
              color: 'rgb(107 114 128)',
              width: '5px',
              lineHeight: '.5rem',
              fontWeight: 700
            }}
          >
            PR cpm
          </div>
          <div
            style={{
              position: 'absolute',
              top: '3rem',
              left: 'calc(7% + 10px)',
              fontSize: '10px',
              color: 'rgb(107 114 128)',
              width: '5px',
              lineHeight: '.5rem',
              fontWeight: 700
            }}
          >
            Temp
          </div>

          <canvas id="myChart" style={{ height: '200px' }} />
        </div>
      </div>
    </div>
  );
}

export default HealthMonitor;
