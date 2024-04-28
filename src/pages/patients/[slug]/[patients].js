import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layouts/AppLayout';
import NavTab from '@/components/NavTab';
import CustomCKEditor from '@/components/CustomCKEditor';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import SearchItemPage from '@/components/SearchItemPage';
import HealthMonitor from '@/components/HealthMonitor';
import ReactImageZoom from 'react-image-zoom';
import ImagingResult from '@/components/ImagingResult';
import { useGetICDDataQuery } from '@/service/icdService';
import Soap from '@/components/Patient/OPD/Soap';
import ProfileInformation from '@/components/ProfileInformation';
import DoctorOrder from '@/components/Patient/IPD/DoctorOrder';
import LabResult from '@/components/Patient/OPD/LabResult';

const doctor_request_categories = [
  { id: 1, name: 'hematology' },
  { id: 2, name: 'urine_stool_studies' },
  { id: 3, name: 'cardiac_studies' }
];

// const doctor_requests = [
//     {}
// ]

const soapData = [
  {
    hematology: [
      {
        id: 1,
        type: 'hematology',
        name: 'Complete Blood Count with platelet count(CBC with platelet)'
      },
      { id: 2, type: 'hematology', name: 'Peripheral Blood Smear' },
      { id: 3, type: 'hematology', name: 'Clotting Time(CT)' },
      { id: 4, type: 'hematology', name: 'Bleeding Time(BT)' },
      { id: 5, type: 'hematology', name: 'Prothrombin Time(PT)' },
      { id: 6, type: 'hematology', name: 'Partial Thromboplastin Time(PTT)' },
      { id: 7, type: 'hematology', name: 'Dengue NS1' },
      { id: 8, type: 'hematology', name: 'Crossmatching' },
      { id: 9, type: 'hematology', name: 'Blood Typing' },
      { id: 10, type: 'hematology', name: 'Others' }
    ],
    urine_stool_studies: [
      { id: 11, type: 'stool', name: 'Urinalysis(midstream, clean catch)' },
      { id: 12, type: 'stool', name: 'Pregnancy Test' },
      { id: 13, type: 'stool', name: 'Fecalysis' },
      { id: 14, type: 'stool', name: 'Others' }
    ],
    cardiac_studies: [
      { id: 15, type: 'cardiac', name: 'Electrocardiogram(ECG)' },
      { id: 16, type: 'cardiac', name: 'Others' }
    ],
    chemistry: [
      { id: 17, type: 'chemistry', name: 'Lipid Profile' },
      { id: 18, type: 'chemistry', name: 'Serum Sodium(Na)' },
      { id: 19, type: 'chemistry', name: 'Serum Potassium(K)' },
      { id: 20, type: 'chemistry', name: 'Blood Urea Nitrogen(BUN)' },
      { id: 21, type: 'chemistry', name: 'Ionized Calcium(iCa)' },
      { id: 22, type: 'chemistry', name: 'Uric Acid' },
      { id: 23, type: 'chemistry', name: 'ALT/SGPT' },
      { id: 24, type: 'chemistry', name: 'AST/SGOT' },
      { id: 25, type: 'chemistry', name: 'Hepatitis Test' },
      { id: 26, type: 'chemistry', name: 'Syphilis' },
      { id: 27, type: 'chemistry', name: 'TSH' },
      { id: 28, type: 'chemistry', name: 'Ft4' },
      { id: 29, type: 'chemistry', name: 'Ft3' },
      { id: 30, type: 'chemistry', name: 'TT4' },
      { id: 31, type: 'chemistry', name: 'TT3' },
      { id: 32, type: 'chemistry', name: 'PSA' },
      { id: 33, type: 'chemistry', name: 'Rapid Antigen Test(COVID-19)' },
      { id: 45, type: 'chemistry', name: 'Others' }
    ],
    glucose: [
      { id: 46, type: 'glucose', name: 'Fasting Blood Sugar(FBS)' },
      { id: 47, type: 'glucose', name: 'Hba1c' },
      { id: 48, type: 'glucose', name: 'Random Blood Sugar' },
      {
        id: 49,
        type: 'glucose',
        name: '75g Oral Glucose Tolerance Test(OGTT)'
      },
      { id: 50, type: 'glucose', name: 'Others' }
    ]
  }
];

const soapHeaders = [
  'hematology',
  'urine_stool_studies',
  'cardiac_studies',
  'chemistry',
  'glucose'
];

const dummyData = [
  { id: 1, name: 'Paracetamol' },
  { id: 2, name: 'Other Medicine' },
  { id: 3, name: 'Test Medicine2' },
  { id: 4, name: 'Test Medicine5' },
  { id: 5, name: 'Test Medicine6' },
  { id: 6, name: 'Test Medicine7' },
  { id: 7, name: 'Test Medicine7' },
  { id: 8, name: 'Test Medicine7' },
  { id: 9, name: 'Test Medicine7' },
  { id: 10, name: 'Test Medicine7' },
  { id: 11, name: 'Test Medicine7' },
  { id: 12, name: 'Test Medicine7' },
  { id: 13, name: 'Test Medicine7' },
  { id: 14, name: 'Test Medicine7' },
  { id: 15, name: 'Test Medicine7' },
  { id: 16, name: 'Test Medicine7' }
];

const labResults = [
  {
    user_id: '',
    test_name: 'Hemoglobin',
    result: 12,
    normal_range: '11.0 - 16.0',
    unit: 'g/dL',
    date_examination: '06 Aug 2023 09:00AM'
  },

  {
    user_id: '',
    test_name: 'RBC',
    result: '3.3',
    normal_range: '3.5-5.50',
    unit: '10^6/uL',
    date_examination: '06 Aug 2023 09:00AM'
  }
];

const imagingResults = [
  {
    imaging_type: 'XRAY',
    imaging_src: 'soap',
    date_examination: '06 Aug 2023 09:00AM'
  }
];

const prescriptionData = [
  {
    headerText: 'Clinic Name',
    footerText: 'Clinic Adrress Location'
  }
];

const icdDataHeaders = ['icd_codes', 'name'];

// const medicalHistory = [
//     {
//         nurser_incharge: "Jane Smith",
//         phyisician: "Snoop Dog",
//         gender: "Male",
//         phone: "123456789",
//         last_visit: "23 Aug 2023",
//     }
// ]

const userInfo = [
  {
    user_id: 'PAT-230818XYA2',
    email: 'john@gmail.com',
    identity: {
      first_name: 'John'
    }
  }
];

function SubModule() {
  const router = useRouter();
  const { slug, patients } = router.query;
  const menuGroup = 'patients';
  const [activeTab, setActiveTab] = useState('tab1');
  const [tableHeader, setTableHeader] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [hourToDay, setHourToDay] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    '/path/to/default-photo.png'
  );

  // monitoring sheets
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [pulseRate, setPulseRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [hour, setHour] = useState('');
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
  const [lastAddedDate, setLastAddedDate] = useState('05 Oct 2023');

  const [checkedItem, setCheckedItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // icd codes
  const {
    data: icdResultData,
    isLoading,
    isError,
    error,
    isSuccess
  } = useGetICDDataQuery(
    {
      keywords: searchQuery
    },
    {
      enabled: !!searchQuery
    }
  );

  const icdData = icdResultData && icdResultData[3] ? icdResultData[3] : [];

  const mappedIcdData = icdData.map((entry) =>
    icdDataHeaders.reduce((obj, header, index) => {
      obj[header] = entry[index];
      return obj;
    }, {})
  );

  const handleICDSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // console.log(soapData)
  const patientData = [
    {
      patient_name: 'John Doe',
      patient_id: 'PAT-230818XY2A',
      gender: 'Male',
      phone: '092222222222',
      physician: 'Dr Smith'
    }
  ];

  const handleCheckbox = (moduleId) => {
    if (checkedItem.includes(moduleId)) {
      setCheckedItem(checkedItem.filter((checked) => checked !== moduleId));
      // onCheckedData([...checkedItem])
    } else {
      setCheckedItem([...checkedItem, moduleId]);

      // onCheckedData([...checkedItem])
    }
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Respiratory Rate',
        data: [],
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)'
      },
      {
        label: 'Pulse Rate',
        data: [],
        borderColor: '#33FF57',
        backgroundColor: 'rgba(51, 255, 87, 0.2)'
      },
      {
        label: 'Temperature',
        data: [],
        borderColor: '#3357FF',
        backgroundColor: 'rgba(51, 87, 255, 0.2)'
      }
    ]
  });

  const handleClearData = () => {
    setChartData({
      labels: [],
      datasets: [
        {
          label: 'Respiratory Rate',
          data: [],
          borderColor: '#FF5733',
          backgroundColor: 'rgba(255, 87, 51, 0.2)'
        },
        {
          label: 'Pulse Rate',
          data: [],
          borderColor: '#33FF57',
          backgroundColor: 'rgba(51, 255, 87, 0.2)'
        },
        {
          label: 'Temperature',
          data: [],
          borderColor: '#3357FF',
          backgroundColor: 'rgba(51, 87, 255, 0.2)'
        }
      ]
    });
  };

  const handleAddData = () => {
    const newLabels = [...chartData.labels];
    const newDataset0Data = [...chartData.datasets[0].data];
    const newDataset1Data = [...chartData.datasets[1].data];
    const newDataset2Data = [...chartData.datasets[2].data];

    // If date has changed and hasn't been filled in with new 24-hour set, do so.
    if (displayedDateTime !== lastAddedDate && newLabels.length === 0) {
      for (let i = 0; i < 24; i++) {
        newLabels.push(`${i.toString().padStart(2, '0')}:00`);
        newDataset0Data.push(null);
        newDataset1Data.push(null);
        newDataset2Data.push(null);
      }
      setLastAddedDate(displayedDateTime); // Update the last added date.
    }

    // Find the position based on the hour to add the new data.
    const currentHourIndex = parseInt(hour.split(':')[0]);
    newDataset0Data[currentHourIndex] = respiratoryRate;
    newDataset1Data[currentHourIndex] = pulseRate;
    newDataset2Data[currentHourIndex] = temperature;

    setChartData({
      ...chartData,
      labels: newLabels,
      datasets: [
        { ...chartData.datasets[0], data: newDataset0Data },
        { ...chartData.datasets[1], data: newDataset1Data },
        { ...chartData.datasets[2], data: newDataset2Data }
      ]
    });
    // setChartData(prevData => ({
    //     ...prevData,
    //     labels: [...prevData.labels, hour],
    //     datasets: [
    //         { ...prevData.datasets[0], data: [...prevData.datasets[0].data, respiratoryRate] },
    //         { ...prevData.datasets[1], data: [...prevData.datasets[1].data, pulseRate] },
    //         { ...prevData.datasets[2], data: [...prevData.datasets[2].data, temperature] }
    //     ]
    // }))

    // const lastHour = labels[labels.length - 1]

    // if (lastHour && lastHour !== "23:00") {
    //     let currentHourIndex = parseInt(lastHour.split(":")[0])

    //     // Fill in the remaining hours for the previous day
    //     while (currentHourIndex < 23) {
    //         currentHourIndex++;
    //         labels.push(`${currentHourIndex.toString().padStart(2, '0')}:00`)
    //         // Add null (or interpolated) data for each dataset
    //         respiratoryRate.push(null)
    //         pulseRate.push(null)
    //         temperature.push(null)
    //     }
    // }
  };

  console.log(chartData)

  const handleOnInputtedHour = (h) => {
    setHour(h);
  };

  const handleOnInputtedRR = (rr) => {
    setRespiratoryRate(rr);
  };

  const handleOnInputtedPR = (pr) => {
    setPulseRate(pr);
  };

  const handleOnInputtedTemp = (temp) => {
    setTemperature(temp);
  };

  const handleExportToPDF = () => {};
  const handleItemsPerPageChange = (item) => {
    setItemsPerPage(item);
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleImageChange = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
      // Handle autosave here.
      // If you're using something like Axios, it could be axios.post('/path/to/upload', file);
      // If you're using Next.js's API routes, it could be a fetch to your API route.
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout
      moduleId={slug}
      menuGroup={menuGroup}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {slug}
        </h2>
      }
    >
      <Head>
        <title>Laravel - {slug}</title>
      </Head>

      <div className="max-w-full sm:rounded-lg mx-8">
        <div className="flex items-center py-5 space-x-5">
          <button
            onClick={() => router.back()}
            className="text-sm uppercase shadow-md bg-white text-gray-500 hover:text-gray-700 py-4 px-8 rounded-full font-medium transition duration-300"
          >
            Back
          </button>

          <div className="flex items-center">
            <div className="relative rounded-full border overflow-hidden w-32 h-32">
              <img
                src={imagePreviewUrl}
                alt="img"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0020.07 7H21a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="-space-y-5">
              <div className="items-center">
                <div className="font-bold text-xl mb-2 uppercase text-gray-600">
                  {slug}
                </div>
              </div>
              <div className="items-center">
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                  {' '}
                  {/* <-- Placeholder icon for birthday */}
                </svg>
                <span className="text-gray-600">ID:</span>
                <span>PAT-230818XYA2</span> {/* Replace with dynamic data */}
              </div>
              <div className="items-center">
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                  {' '}
                  {/* <-- Placeholder icon for birthday */}
                </svg>
                <span className="text-gray-600">Birthday:</span>
                <span>July 15, 1995</span> {/* Replace with dynamic data */}
              </div>
              <div className="items-center">
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                  {' '}
                  {/* <-- Placeholder icon for location */}
                </svg>
                <span className="text-gray-600">Location:</span>
                <span>New York, USA</span> {/* Replace with dynamic data */}
              </div>
              {/* Add more profile details here */}
            </div>
          </div>
        </div>

        {slug === 'out-patient' && (
          <>
            <div className="bg-white overflow-hidden mx-auto sm:w-full">
              <div className="border border-gray-300 rounded">
                <div className="flex justify-items-center">
                  <div className="rounded-tl-lg py-3 ml-3">
                    <button
                      onClick={() => setActiveTab('tab1')}
                      className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                    >
                      Patient Information and consent
                    </button>
                    <button
                      onClick={() => setActiveTab('tab2')}
                      className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                    >
                      S.O.A.P
                    </button>
                    <button
                      onClick={() => setActiveTab('tab3')}
                      className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                    >
                      Laboratory Results
                    </button>
                    <button
                      onClick={() => setActiveTab('tab4')}
                      className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                    >
                      Imaging Results
                    </button>
                    <button
                      onClick={() => setActiveTab('tab5')}
                      className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab5' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                    >
                      Prescription
                    </button>
                  </div>
                </div>

                <div className="tab-content px-3 max-h-[65vh] overflow-y-auto scroll-custom">
                  {activeTab === 'tab1' && <PatientInformation opdForms />}
                  {activeTab === 'tab2' && (
                    <Soap
                      soapData={soapData}
                      soapHeaders={soapHeaders}
                      dummyData={dummyData}
                    />
                  )}
                  {activeTab === 'tab3' && <LabResult slug={slug} />}
                  {activeTab === 'tab4' && (
                    <ImagingResult
                      slug={slug}
                      imageType="XRAY"
                      data={imagingResults}
                    />
                  )}
                  {activeTab === 'tab5' && <div />}
                </div>
              </div>
            </div>

            <div>
              <div className="mt-5 font-bold text-xl uppercase text-gray-600">
                Medical History
              </div>
              <SearchItemPage
                onExportToPDF={handleExportToPDF}
                onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                onCurrentPage={(page) => handleCurrentPage(page)}
                // onSearchResults={(results) => handleSearchResults(results)}
                action={false}
                onSelectedRecords={(e) => handleSelectedRecordChange(e)}
                onSearch={(q) => handleSearch(q)}
              />

              {/* <Table 
                                    title="Patient List" 
                                    action={false}
                                    slug={slug}
                                    tableHeader={Object.keys(medicalHistory[0])}
                                    tableData={medicalHistory} 
                                /> */}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                // onPageChange={newPage => setCurrentPage(newPage)}
                onPageChange={(newPage) => handleNewPage(newPage)}
              />
            </div>
          </>
        )}

        {slug === 'in-patient' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-auto sm:w-full">
            <div className="border rounded-lg ">
              <div className="flex justify-items-center">
                <div className="rounded-tl-lg py-3 ml-3">
                  <button
                    onClick={() => setActiveTab('tab1')}
                    className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                  >
                    Patient Information & Consent
                  </button>
                  <button
                    onClick={() => setActiveTab('tab2')}
                    className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                  >
                    Medical History
                  </button>
                  <button
                    onClick={() => setActiveTab('tab3')}
                    className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                  >
                    Laboratory Results
                  </button>
                  <button
                    onClick={() => setActiveTab('tab4')}
                    className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                  >
                    Imaging Results
                  </button>
                  <button
                    onClick={() => setActiveTab('tab5')}
                    className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab5' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                  >
                    Doctor's Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('tab6')}
                    className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab6' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                  >
                    Monitoring Sheets
                  </button>
                  <button
                    onClick={() => setActiveTab('tab7')}
                    className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab7' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                  >
                    Nurse's Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('tab8')}
                    className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab8' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                  >
                    Medication Sheet
                  </button>
                </div>
              </div>

              <div className="tab-content px-3 max-h-[70vh] overflow-y-auto scroll-custom">
                {activeTab === 'tab1' && (
                  <div>
                    <PatientInformation ipdForms />
                  </div>
                )}
                {activeTab === 'tab2' && <div>{/* <MedicalHistory /> */}</div>}
                {activeTab === 'tab3' && (
                  <>
                    {/* <div className="text-medium font-semibold text-center tracking-wide text-white uppercase border-b bg-green-500 px-4 py-4">
                                            <span>Date of Examination</span>
                                        </div> */}

                    <Table
                      title="Patient List"
                      action={false}
                      slug={slug}
                      tableHeader={Object.keys(labResults[0])}
                      tableData={labResults}
                    />
                  </>
                )}
                {activeTab === 'tab4' && (
                  <ImagingResult imageType="XRAY" data={imagingResults} />
                )}
                {activeTab === 'tab5' && <DoctorOrder />}
                {activeTab === 'tab6' && (
                  <>
                    <div className="flex flex-col gap-4 mb-2 sm:flex-row">
                      <div className="flex flex-col w-[10rem]">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded mr-2"
                          onClick={handleAddData}
                        >
                          Add Data
                        </button>
                      </div>

                      <div className="flex flex-col w-[10rem]">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded mr-2"
                          onClick={handleClearData}
                        >
                          Clear Data
                        </button>
                      </div>
                    </div>

                    <HealthMonitor
                      onInputtedTemp={(data) => handleOnInputtedTemp(data)}
                      onInputtedRR={(data) => handleOnInputtedRR(data)}
                      onInputtedPR={(data) => handleOnInputtedPR(data)}
                      onSetHour={(data) => handleOnInputtedHour(data)}
                      data={chartData}
                    />
                  </>
                )}

                {activeTab === 'tab7' && <div />}

                {activeTab === 'tab8' && <div />}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default SubModule;
