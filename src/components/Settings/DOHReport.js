import { useState, useEffect } from 'react';
import { useSubmitAnnualReportMutation } from '@/service/dohService';
import Accordion from '../Accordion';
import Button from '../Button';
import Table from '../Table';

const accordionItem = [
  // { id:1, slug: 'dohAuthenticationTest', title: "Authentication"},
  { id: 2, slug: 'dohInfoClassification', title: 'Info Classification' },
  { id: 3, slug: 'dohInfoQualityMgmt', title: 'Info Quality Management' },
  { id: 4, slug: 'dohInfoBedCapacity', title: 'Bed Capacity' },
  {
    id: 5,
    slug: 'dohHospOptSummaryPatient',
    title: 'Hospital Operations Summary of Patients'
  },
  {
    id: 6,
    slug: 'dohHospOptDishargesSpecialty',
    title: 'Hospital Operations Discharges Specialty'
  },
  {
    id: 7,
    slug: 'dohHospOptDishargesMorbidity',
    title: 'Hospital Operations Discharges Morbidity'
  },
  {
    id: 8,
    slug: 'dohHospOptDishargesNumberDeliveries',
    title: 'Hospital Operations Discharges Number Deliveries'
  },
  {
    id: 9,
    slug: 'dohHospOptDishargesOpv',
    title: 'Hospital Operations Discharges OPV'
  },
  {
    id: 10,
    slug: 'dohHospOptDishargesOpd',
    title: 'Hospital Operations Discharges OPD'
  },
  {
    id: 11,
    slug: 'dohHospOptDishargesEr',
    title: 'Hospital Operations Discharges ER'
  },
  {
    id: 12,
    slug: 'dohHospOptDishargesEv',
    title: 'Hospital Operations Discharges Testing'
  },
  {
    id: 13,
    slug: 'dohHospOptDishargesTesting',
    title: 'Hospital Operations Discharges EV'
  },
  {
    id: 14,
    slug: 'dohHospOperationDeath',
    title: 'Hospital Operations Deaths'
  },
  {
    id: 15,
    slug: 'dohHospOperationMortalityDeath',
    title: 'Hospital Operations Mortality Deaths'
  },
  { id: 16, slug: 'dohHospOperationHai', title: 'Hospital Operations HAI ' },
  {
    id: 17,
    slug: 'dohHospOperationMajorOpt',
    title: 'Hospital Operations Major'
  },
  {
    id: 18,
    slug: 'dohHospOperationMinorOpt',
    title: 'Hospital Operations Major'
  },
  { id: 19, slug: 'dohStaffingPatern', title: 'Staffing Patern' },
  { id: 20, slug: 'dohExpenses', title: 'Expenses' },
  { id: 21, slug: 'dohRevenues', title: 'Revenues' },
  { id: 22, slug: 'dohSubmittedReport', title: 'Submitted Reports' }
];

function DOHReport({ onAccordionClicked, dohData, header }) {
  const [isOpen, setIsOpen] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [accordionLoading, setAccordionLoading] = useState({});
  const initialOpenIds = accordionItem.map((item) => item.id);
  const [accordionIdOpen, setAccordionIdOpen] = useState(initialOpenIds);
  const [reportingYear, setReportingYear] = useState(0);
  const [apiStatus, setApiStatus] = useState({
    // dohAuthenticationTestStatus: 'pending',
    dohInfoClassificationStatus: 'pending',
    dohInfoQualityMgmtStatus: 'pending',
    dohInfoBedCapacityStatus: 'pending',
    dohHospOptSummaryPatientStatus: 'pending',
    dohHospOptDishargesSpecialtyStatus: 'pending',
    dohHospOptDishargesMorbidityStatus: 'pending',
    dohHospOptDishargesNumberDeliveriesStatus: 'pending',
    dohHospOptDishargesOpvStatus: 'pending',
    dohHospOptDishargesOpdStatus: 'pending',
    dohHospOptDishargesErStatus: 'pending',
    dohHospOptDishargesEvStatus: 'pending',
    dohHospOptDishargesTestingStatus: 'pending',
    dohHospOperationDeathStatus: 'pending',
    dohHospOperationMortalityDeathStatus: 'pending',
    dohHospOperationHaiStatus: 'pending',
    dohHospOperationMajorOptStatus: 'pending',
    dohHospOperationMinorOptStatus: 'pending',
    dohStaffingPaternStatus: 'pending',
    dohExpensesStatus: 'pending',
    dohRevenuesStatus: 'pending',
    dohSubmittedReportStatus: 'pending'
    // ... other methods
  });

  const [submitAnnualReport] = useSubmitAnnualReportMutation();

  const checkAndStopSpinner = () => {
    const anyPending = Object.values(apiStatus).some(
      (status) => status !== 'done'
    );
    setBtnSpinner(anyPending);
    // const allDone = Object.values(apiStatus).every(status => status === 'done')
    // if(allDone) {
    //     setBtnSpinner(false)
    // } else {
    //     accordionItem.forEach(item => {
    //         if (apiStatus[item.slug + 'Status'] === 'done') {
    //             setBtnSpinner(false)
    //         }
    //     })
    // }
  };

  useEffect(() => {
    if (!btnSpinner) return;

    checkAndStopSpinner();
    // const apiStatusSubscription = apiStatus?.subscribe(() => checkAndStopSpinner())
    // return () => apiStatusSubscription.unsubscribe()

    // let spinnerTimer
    // const statusWithLongestTime = Math.max(
    //     ...Object.values(apiStatus).map(status => status === 'pending' ? apiStatus[status] : 0)
    // )
    // spinnerTimer = setTimeout(checkAndStopSpinner, statusWithLongestTime)
    // return () => {
    //     if(spinnerTimer) {
    //         clearTimeout(spinnerTimer)
    //     }
    // }
  }, [btnSpinner, apiStatus, accordionItem]);

  const toggleAccordion = (id, slug) => {
    if (slug === 'info_classification') {
      onAccordionClicked(slug);
    } else if (slug === 'quality_mgmt') {
      onAccordionClicked(slug);
    }
    setAccordionIdOpen((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((accordionId) => accordionId !== id);
      }
      return [...prevState, id];
    });
  };

  const toggleButton = () => {};

  // console.log(btnSpinner)

  const apiDohEndpoints = [
    // { name: 'dohAuthenticationTest', endpoint: '/doh-auth' },
    { name: 'dohInfoClassification', endpoint: '/submit-ic' },
    { name: 'dohInfoQualityMgmt', endpoint: '/submit-iqm' },
    { name: 'dohInfoBedCapacity', endpoint: '/submit-ibc' },
    { name: 'dohHospOptSummaryPatient', endpoint: '/submit-hosp' },
    { name: 'dohHospOptDishargesSpecialty', endpoint: '/submit-hods' },
    { name: 'dohHospOptDishargesMorbidity', endpoint: '/submit-hodm' },
    { name: 'dohHospOptDishargesNumberDeliveries', endpoint: '/submit-hodnd' },
    { name: 'dohHospOptDishargesOpv', endpoint: '/submit-hodopv' },
    { name: 'dohHospOptDishargesOpd', endpoint: '/submit-hodopd' },
    { name: 'dohHospOptDishargesEr', endpoint: '/submit-hosder' },
    { name: 'dohHospOptDishargesEv', endpoint: '/submit-hosdev' },
    { name: 'dohHospOptDishargesTesting', endpoint: '/submit-hosdt' },
    { name: 'dohHospOperationDeath', endpoint: '/submit-hood' },
    { name: 'dohHospOperationMortalityDeath', endpoint: '/submit-homd' },
    { name: 'dohHospOperationHai', endpoint: '/submit-hohai' },
    { name: 'dohHospOperationMajorOpt', endpoint: '/submit-homajopt' },
    { name: 'dohHospOperationMinorOpt', endpoint: '/submit-hominopt' },
    { name: 'dohStaffingPatern', endpoint: '/submit-stafptern' },
    { name: 'dohExpenses', endpoint: '/submit-dohexpen' },
    { name: 'dohRevenues', endpoint: '/submit-dohrev' },
    { name: 'dohSubmittedReport', endpoint: '/submit-sreport' }
  ];

  const startAccordionLoading = (id) => {
    setAccordionLoading((prevLoading) => ({
      ...prevLoading,
      [id]: true
    }));
  };

  const stopAccordionLoading = (id) => {
    setAccordionLoading((prevLoading) => ({
      ...prevLoading,
      [id]: false
    }));
  };

  const handleButtonSubmit = async () => {
    setBtnSpinner(true);
    await handleApiRequestInSequence();
    setBtnSpinner(false);
  };

  const handleApiRequestInSequence = async () => {
    for (const { name, endpoint } of apiDohEndpoints) {
      await handleApiRequest(name, endpoint);
    }
  };

  const handleApiRequest = async (apiName, apiEndpoint) => {
    const data = await handleSubmit(apiName, apiEndpoint);
    const res = data?.data.map((el) => el.original);
    // console.log(res)
    if (res[0]?.data.response_code == 104) {
      setApiStatus((prev) => ({ ...prev, [`${apiName}Status`]: 'done' }));
    }
  };

  const handleSubmit = async (slug, url) => {
    const data = await submitAnnualReport({ slug, url, reportingYear });
    return data;
  };

  // const handleAccordion = (data) => {
  //     if(data === "info_classification") {
  //         onAccordionClicked(data)
  //         setIsOpen(!isOpen)
  //     } else if(data === "quality_mgmt") {
  //         onAccordionClicked(data)
  //         setIsOpen(!isOpen)
  //     }
  // }

  // console.log(header)

  const renderTableContent = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {header
            ?.filter((tblHeader) => tblHeader !== 'id')
            .map((tblHeader, tblHeaderIndex) => (
              <th
                key={tblHeaderIndex}
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {tblHeader}
              </th>
            ))}

          {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                    </th> */}
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {dohData?.length === 0 ? (
          <tr>
            <td colSpan={header?.length + 1} className="px-6 py-2 text-center">
              No records found.
            </td>
          </tr>
        ) : (
          dohData?.map((tblBody, tblBodyIndex) => (
            // <tr key={tblBodyIndex} className={`${highlightedRows.has(tblBodyIndex)} ? 'bg-green-200' : ''`}>
            <tr key={tblBodyIndex} className="hover:bg-gray-100">
              {header
                ?.filter((tblHeader) => tblHeader !== 'id')
                .map((tblHeader) => (
                  <td
                    key={tblHeader}
                    className="px-6 py-2 whitespace-nowrap text-sm "
                  >
                    {tblBody[tblHeader]}
                  </td>
                ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  const renderContent = () => (
    <div className="p-10 pt-[5rem]">
      <div className="space-y-2">
        <div className="font-bold text-xl mb-2 uppercase text-gray-600">
          DOH Annual Health Facility Statistical Report
        </div>
        <div className="flex space-x-2">
          <Button
            btnIcon="add"
            bgColor="disable"
            btnLoading
            onClick={() => toggleButton('green')}
          >
            Generate
          </Button>

          <select
            className="border border-gray-300 rounded px-4 py-1 mr-4 focus:outline-none text-sm"
            onChange={(e) => setReportingYear(e.target.value)}
          >
            <option>Select year</option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>

          <Button
            bgColor={btnSpinner ? 'disable' : 'blue'}
            btnIcon={btnSpinner ? 'disable' : 'submit'}
            // btnLoading={btnSpinner}
            onClick={() => handleButtonSubmit()}
          >
            Submit
          </Button>
        </div>

        {accordionItem.map((item) => (
          <div className="border rounded-md overflow-hidden">
            <button
              className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
              onClick={() => toggleAccordion(item.id, item.slug)}
            >
              <div className="flex justify-between">
                {item.title}
                {btnSpinner ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 animate-spin text-gray-700"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="32"
                      stroke-width="8"
                      stroke="currentColor"
                      stroke-dasharray="50.26548245743669 50.26548245743669"
                      fill="none"
                      stroke-linecap="round"
                    />
                  </svg>
                ) : (
                  apiStatus[`${item.slug}Status`] === 'done' && (
                    <svg
                      fill="currentColor"
                      className="w-7 h-7 text-green-500"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      />
                    </svg>
                  )
                )}
              </div>
            </button>
          </div>
        ))}

        <div className="space-y-4">
          <div />
        </div>
      </div>
    </div>
  );

  return <div>{renderContent()}</div>;
}

export default DOHReport;
