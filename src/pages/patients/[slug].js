import Head from 'next/head';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  createContext
} from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layouts/AppLayout';
import NavTab from '@/components/NavTab';
import Form from '@/components/Form';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import Modal from '@/components/Modal';
import SearchExport from '@/components/SearchExport';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import ItemPerPage from '@/components/ItemPerPage';
import { AppLayoutContext } from '@/components/Layouts/AppLayout';
import { PDFDocument, StandardFonts, fontkit } from 'pdf-lib';
import { DropdownExport, DropdownRowMenu } from '@/components/DropdownLink';
import {
  useGetDetailByIdQuery,
  useGetPatientListQuery,
  useGetPhysicianListQuery,
  useGetRadiologyListQuery,
  useGetRadiologyCategoryListQuery,
  useGetPathologyListQuery,
  useGetPathologyCategoryListQuery,
  useGetMedicineListQuery,
  useGetIcd10ListQuery,
  useGetActiveBedListQuery,
  useGetMedicationListQuery,
  useGetImgResultListQuery,
  useGetLabResultListQuery,
  useGetNurseNoteListQuery,
  useAutoSaveDataMutation,
  useGetDoctorOrderListQuery,
  useCreateDataMutation,
  useDeleteDataMutation,
  useFetchDataQuery,
  useGetSymptomListQuery,
  useGetAllSymptomsQuery
} from '@/service/patientService';
import {
  useGetModuleListQuery,
  useCreateBulkMutation,
  useUpdateBulkMutation,
  useGetAboutUsQuery
} from '@/service/settingService';
import {
  useGetCityDataQuery,
  useGetProvinceDataQuery,
  useGetMunicipalityDataQuery,
  useGetBarangayDataQuery
} from '@/service/psgcService';

import {
  useGetUserDetailsQuery,
  useGetUserByIdQuery
} from '@/service/authService';

import { useGeneratePdfQuery } from '@/service/pdfService';

import Tabs from '@/components/Tabs';
import Alert from '@/components/Alert';
import Soap from '@/components/Patient/OPD/Soap';
import LabResult from '@/components/Patient/OPD/LabResult';
import ImagingResult from '@/components/Patient/OPD/ImagingResult';
import PatientInformation from '@/components/Patient/PatientInformation';
import Prescription from '@/components/Patient/OPD/Prescription';
// import Prescription from '@/components/Prescription'
import ProfileInformation from '@/components/ProfileInformation';
import Profile from '@/components/Profile';
import { generateOpdForms, generateIpdForms } from '@/utils/forms';
import SkeletonScreen from '@/components/SkeletonScreen';
import {
  ComponentContext,
  FormContext,
  ModalContext,
  PdfContext,
  TableContext,
  useComponentContext
} from '@/utils/context';
import DoctorRequest from '@/components/Patient/OPD/DoctorRequest';
import PdfGenerator from '@/components/PdfGenerator';
import DoctorOrder from '@/components/Patient/IPD/DoctorOrder';
import NurseNote from '@/components/Patient/IPD/NurseNote';
import HealthMonitor from '@/components/HealthMonitor';
import MedicationSheet from '@/components/Patient/IPD/MedicationSheet';
import AutoSaveSpinner from '@/components/AutoSaveSpinner';
import ClinicalRecord from '@/components/Patient/IPD/ClinicalRecord';

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

const frequencyOptions = [
  'once a day',
  'twice a day',
  'every other day',
  'every 12 hours'
];

const formMedication = [
  'tablets',
  'capsules',
  'spansules',
  'liquid',
  'softgels'
];

const SubModule = () => {
  const appLayoutContext = useContext(AppLayoutContext);
  const componentContext = useComponentContext();
  const formRef = useRef(null);
  const tblRef = useRef(null);
  const router = useRouter();
  const { slug } = router.query;
  const menuGroup = 'patients';
  const [activeTab, setActiveTab] = useState('tab1');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContent, setActiveContent] = useState('yellow');
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [contentType, setContentType] = useState('');
  const [selectedInformation, setSelectedInformation] = useState({});
  const [searchMedicine, setSearchMedicine] = useState('');
  const [refetchRTK, setRefetchRTK] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedPrint, setSelectedPrint] = useState('');

  const [checkIds, setCheckIds] = useState(0);
  const [isOptionDisabled, setIsOptionDisabled] = useState(true);
  const [isOptionEditDisabled, setIsOptionEditDisabled] = useState(true);
  const [fab, setFab] = useState(false);
  const [isDrDrawerOpen, setIsDrDrawerOpen] = useState(false);
  const [testsData, setTestsData] = useState({});
  const [drRequestForms, setDrRequestForms] = useState([]);
  const [autoSaveLoader, setAutoSaveLoader] = useState(false);

  // medications
  const [isShowMedForm, setIsShowMedForm] = useState(false);
  const [addedMedicine, setAddedMedicine] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalType, setModalType] = useState('');
  const [searchMedicationList, setSearchMedicationList] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [contentHeight, setContentHeight] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opdForms, setOpdForms] = useState([]);
  const [ipdForms, setIpdForms] = useState([]);

  const [activeSlug, setActiveSlug] = useState(null);

  const [provinceCode, setProvinceCode] = useState(null);
  const [municipalCode, setMunicipalCode] = useState(null);
  const [clickedValue, setClickedValue] = useState(null);
  const [apiLink, setApiLink] = useState(null);
  const [pdfLink, setPdfLink] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pdfFont, setPdfFont] = useState(null);

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
  const [lastAddedDate, setLastAddedDate] = useState(formattedCurrentDate);
  const [hour, setHour] = useState('');
  const [pulseRate, setPulseRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
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
    let newLabels = [...chartData.labels];
    let newDataset0Data = [...chartData.datasets[0].data];
    let newDataset1Data = [...chartData.datasets[1].data];
    let newDataset2Data = [...chartData.datasets[2].data];

    // If date has changed and hasn't been filled in with new 24-hour set, do so.
    if (/*displayedDateTime !== lastAddedDate &&*/ newLabels.length === 0) {
      for (let i = 0; i < 24; i++) {
        newLabels.push(i.toString().padStart(2, '0'));
        newDataset0Data.push(null);
        newDataset1Data.push(null);
        newDataset2Data.push(null);
      }
      setLastAddedDate(displayedDateTime); // Update the last added date.
    }
    // const currentHourIndex = parseInt(hour.split(":")[0])
    const currentHourIndex = parseInt(hour.slice(0, 2));
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

    refetchUserDetailById();
    // setChartData(prevData => ({
    //     ...prevData,
    //     labels: [...prevData.labels, hour],
    //     datasets: [
    //         { ...prevData.datasets[0], data: [...prevData.datasets[0].data, respiratoryRate] },
    //         { ...prevData.datasets[1], data: [...prevData.datasets[1].data, pulseRate] },
    //         { ...prevData.datasets[2], data: [...prevData.datasets[2].data, temperature] }
    //     ]
    // }))
  };

  const [autoSaveData] = useAutoSaveDataMutation();
  // const { data: masterData, refetch: refetchMasterData } = useFetchDataQuery({ //don't delete for future used! })
  const { data: symtomsList, refetch: refetchSymptomsList } =
    useGetAllSymptomsQuery();
  const { data: doctorOrderList, refetch: refetchDoctorOrderList } =
    useGetDoctorOrderListQuery();
  const { data: userDetails, refetch: refetchUserDetails } =
    useGetUserDetailsQuery();
  const { data: userDetailById, refetch: refetchUserDetailById } =
    useGetDetailByIdQuery(
      {
        user_id: profileData?.patient_id
      },
      {
        enabled: !!profileData?.patient_id
      }
    );

  const { data: provinceData } = useGetProvinceDataQuery();
  const { data: cityData, refetch: refetchCityData } = useGetCityDataQuery(
    {
      provinceCode: provinceCode || profileData?.user_data_info?.province
    },
    {
      enabled: !!provinceCode || !!profileData?.user_data_info?.province
    }
  );
  const { data: municipalityData, refetch: refetchMunicipalData } =
    useGetMunicipalityDataQuery(
      {
        provinceCode: provinceCode || profileData?.user_data_info?.province
      },
      {
        enabled: !!provinceCode || !!profileData?.user_data_info?.province
      }
    );
  const { data: barangayData, refetch: refetchBarangayData } =
    useGetBarangayDataQuery(
      {
        municipalCode:
          municipalCode || profileData?.user_data_info?.municipality,
        apiLink: apiLink
      },
      {
        enabled: !!municipalCode || !!profileData?.user_data_info?.municipality
      }
    );

  const { data: medicineList, refetch: medicineRefetch } =
    useGetMedicineListQuery(
      {
        keywords: searchMedicine
      },
      {
        enabled: !!searchMedicine
      }
    );

  const { isLoading: moduleListLoading } = useGetModuleListQuery();

  const {
    data: patientList,
    isLoading: patientListLoading,
    refetch: refetchPatientData,
    isError: userErr,
    isSuccess: patientSuccess
  } = useGetPatientListQuery(
    {
      slug: slug,
      items: itemsPerPage,
      page: currentPage,
      keywords: searchQuery,
      patientType: 'ipd'
    },
    {
      enabled: !!searchQuery && !!itemsPerPage
    }
  );
  console.log(patientList);
  const { data: nurseNoteList } = useGetNurseNoteListQuery({
    patient_id: profileData?.patient_id
  });

  const [
    createBulk,
    { isLoading: createBulkLoading, isSuccess: createUserSuccess }
  ] = useCreateBulkMutation();

  const [createData] = useCreateDataMutation();
  const [deleteData] = useDeleteDataMutation();

  const [updateBulk, { isLoading: updateBulkLoading }] =
    useUpdateBulkMutation();

  const { data: activeBedList } = useGetActiveBedListQuery();
  const { data: physicianList } = useGetPhysicianListQuery();

  const { data: icd10List } = useGetIcd10ListQuery(undefined, {
    skip: !refetchRTK
  });

  const { data: medicationList, refetch: medicationRefetch } =
    useGetMedicationListQuery(
      {
        keywords: searchMedicine,
        patient_id: profileData?.patient_id
      },
      {
        enabled: !!searchMedicine
      }
    );

  const { data: imgResultList } = useGetImgResultListQuery({
    slug: 'imaging',
    patient_id: profileData?.patient_id
  });

  const { data: labResultList, refetch: labResultRefetch } =
    useGetLabResultListQuery({
      slug: 'laboratory',
      patient_id: profileData?.patient_id
    });

  const { data: pathologyList } = useGetPathologyListQuery();
  const { data: pathologyCategoryList } = useGetPathologyCategoryListQuery();
  const { data: radiologyList } = useGetRadiologyListQuery();

  const { patientData, pagination, header } = useMemo(() => {
    const data = patientList?.data ?? [];
    const paginationInfo = patientList?.pagination ?? [];
    const headers = patientList?.columns ?? [];

    return {
      patientData: data,
      pagination: paginationInfo,
      header: headers
    };
  }, [patientList]);

  const handleOnEdit = (data) => {
    setCheckIds(data);
  };

  const handleOnChecked = (data) => {
    setIsOptionEditDisabled(data.length > 1);
    setIsOptionDisabled(data.length === 0);
  };
  const formatTitlePages = (str) => {
    return str
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  useEffect(() => {
    if (activeTab) {
      refetchPatientData();
    }

    if (pathologyCategoryList && pathologyList) {
      const pathologyData = pathologyCategoryList?.reduce((acc, category) => {
        acc[category.category_name] = pathologyList?.filter(
          (test) => test.patho_category_id === category.id
        );
        return acc;
      }, {});

      setTestsData(pathologyData);
    }

    if (physicianList && activeBedList) {
      const ipd = generateIpdForms(physicianList, activeBedList);
      setIpdForms(ipd);
    }

    let spinnerTimer;
    if (btnSpinner) {
      spinnerTimer = setTimeout(() => {
        setBtnSpinner(false);
      }, 500);
    }

    let autoSaveSpinner;
    if (autoSaveLoader) {
      autoSaveSpinner = setTimeout(() => {
        setAutoSaveLoader(false);
      }, 1500);
    }

    if (slug) {
      setPageTitle(formatTitlePages(slug));
    }

    let timerAlertMessage;
    if (alertMessage) {
      timerAlertMessage = setTimeout(() => {
        setAlertMessage('');
      }, 3000);
    }

    const calculateHeight = () => {
      const windowHeight = window.innerHeight;
      setContentHeight(windowHeight);
    };
    calculateHeight();

    // Recalculate height on window resize
    window.addEventListener('resize', calculateHeight);
    return () => {
      if (spinnerTimer) {
        clearTimeout(spinnerTimer);
      }
      if (timerAlertMessage) {
        clearTimeout(timerAlertMessage);
      }
      if (autoSaveSpinner) {
        clearTimeout(autoSaveSpinner);
      }
      window.removeEventListener('resize', calculateHeight);
    };
  }, [
    pathologyCategoryList,
    pathologyList,
    btnSpinner,
    physicianList,
    autoSaveLoader,
    clickedValue,
    activeTab
  ]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
  };

  const handleOnChange = (data) => {
    switch (data.type) {
      case 'province':
        setProvinceCode(data.value);
        break;

      case 'city_of':
        setApiLink(data.category);
        setMunicipalCode(data.value);
        break;

      case 'municipality':
        setApiLink(data.category);
        setMunicipalCode(data.value);
        break;

      case 'newPage':
        setCurrentPage(data.value);
        break;

      case 'searchMedQuery':
        setSearchMedicine(data.value);
        break;

      case 'temp':
        setTemperature(data.value);
        break;

      case 'pr':
        setPulseRate(data.value);
        break;

      case 'rr':
        setRespiratoryRate(data.value);
        break;

      case 'hour':
        setHour(data.value);

      default:
        break;
    }
  };

  const handleSelectMedicine = (data) => {
    setSelectedMedicine(data);
    setIsShowMedForm(true);
  };

  const handleOnClose = (data) => {
    if (data.type === 'backToList') {
      setAddedMedicine([]);
      setSelectedMedicine(null);
      setIsShowMedForm(false);
      setAlertMessage('');
    } else if (data.type === 'closeMenu') {
      setIsDrDrawerOpen(false);
    } else if (data.type === 'closeIpd') {
      setItemsPerPage((prev) => prev + 1);
      setActiveContent('yellow');
      setProfileData([]);
    } else if (data.type === 'isGreen') {
      setActiveContent('yellow');
      setProfileData({});
    }
    // else if(data.slug !== slug){

    // }
  };

  const handleCheckPatient = (data) => {
    if (data.checked) {
      setProfileData(data.data);
    } else {
      setProfileData([]);
    }
  };

  const handleOnClick = (data) => {
    switch (data.type) {
      case 'printPrescription':
        formRef.current.handleGeneratePDF('print-prescription');
        break;

      case 'addRowBtn':
        formRef.current.handleAddRow();
        break;

      case 'addUserBtn':
        formRef.current.handleSubmit('createUser');
        break;

      case 'closeDrawer':
        setActiveContent('yellow');
        setProfileData({});
        break;

      case 'editUserBtn':
        // setProfileData(data)
        setActiveContent('green');
        setContentType('editUser');
        break;

      case 'clickedRow':
        setProfileData(data.value);
        setActiveContent('green');
        setContentType('tableRow');
        break;

      case 'clickedTabs':
        refetchPatientData();
        break;

      default:
        break;
    }
  };

  const handleRemoveData = (data) => {
    if (data.slug === 'remove-row-doctor-order') {
      deleteData({
        id: data.id,
        url: 'doctor-orders',
        actionType: 'deleteDoctorOrderById'
      });
      refetchUserDetailById();
    } else if (data.slug === 'remove-row-medication') {
      deleteData({
        id: data.id,
        url: 'delete-patient-medication',
        actionType: 'deletePatientMedicationById'
      });
      medicationRefetch();
      medicineRefetch();
    }
  };

  const handleSubmitButton = (data) => {
    if (data.slug === 'out-patient') {
      formRef.current.handleSubmit('createOutPatient');
    } else if (data.slug === 'in-patient') {
      formRef.current.handleSubmit('createInPatient');
    } else if (data.slug === 'add-row-doctor-order') {
      createData({
        data: {
          patientId: profileData?.patient_id,
          nurseId: profileData?.admitting_clerk,
          physicianId: profileData?.physician_data_info?.personal_id
        },
        url: 'create-doctor-order-row',
        actionType: 'createDoctorOrderNewRow'
      });
    } else if (data.slug === 'doctor-request') {
      createBulk({ actionType: 'createDoctorRequest', data: drRequestForms })
        .unwrap()
        .then((response) => {
          if (response.status === 'success') {
            setBtnSpinner(true);
            labResultRefetch();
          }
        })
        .catch((error) => {
          if (error.status === 500) {
            setAlertType('error');
            setAlertMessage('Unsuccessful');
            setAlertOpen(true);
          }
        });
    } else if (data.link === 'add-medicine') {
      if (
        data.qty > selectedMedicine?.medicine?.quantity ||
        slug.qty > selectedMedicine?.quantity
      ) {
        setAlertMessage(
          `Please refer to available stock (${selectedMedicine?.medicine?.quantity || selectedMedicine?.quantity})`
        );
      } else {
        if (data.medication !== null) {
          const data = selectedMedicine;
          const patientId = profileData?.patient_id;
          const physicianId = profileData?.admitting_physician;
          createBulk({
            data: { data, patientId, physicianId },
            actionType: 'createPrescription'
          })
            .unwrap()
            .then((response) => {
              if (response.status === 'success') {
                medicationRefetch();
                medicineRefetch();
              }
            })
            .catch((error) => {
              console.log(error);
            });
          setAddedMedicine((current) => [...current, selectedMedicine]);
          setIsShowMedForm(false);
        } else {
          updateBulk({
            actionType: 'updateMedication',
            data: selectedMedicine,
            id: data.id
          })
            .unwrap()
            .then((response) => {
              if (response.status === 'success') {
                setBtnSpinner(true);
              }
            })
            .catch((error) => {
              //  console.log(error)
            });

          setAddedMedicine((current) => [...current, selectedMedicine]);
          setIsShowMedForm(false);
        }
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAlertClose = () => {
    setAlertType('');
    setAlertMessage([]);
  };

  const handleActiveContent = (type, data) => {
    setSelectedInformation(data);
    setActiveContent('green');
    setContentType(type);
  };

  const handleRefetch = () => {
    setItemsPerPage((prev) => prev + 1);
  };

  const closeModal = () => {
    // setSelectedRows([])
    setIsModalOpen(false);
  };

  const handleModalState = (data) => {
    setIsModalOpen(data.modalState);
    setModalType(data.field?.modal_type);
    if (data.type === 'dro') {
      setIsDrDrawerOpen(true);
      setModalType(data.modalType);
    } else if (data.type === 'nsn') {
      setModalType(data.modalType);
    } else if (data.type === 'popt_proc') {
      setModalType(data.modalType);
    } else if (data.type === 'oopt_proc') {
      setModalType(data.modalType);
    } else if (data.type === 'icd10_code') {
      setModalType(data.modalType);
    } else if (data.type === 'medication') {
      setModalType(data.modalType);
    } else if (data.type === 'ivfluid') {
      setModalType(data.modalType);
    } else if (data.type === 'lab_test_imaging') {
      setIsDrDrawerOpen(true);
      // setModalType(data.modalType);
    }
  };

  const handleActiveTab = (id) => {
    tblRef.current.handleOnClick({ type: 'clickedRow', value: userDetailById });
    setActiveTab(id);
  };

  const handleAddMedicine = (e, fieldName) => {
    setSelectedMedicine((prevData) => ({
      ...prevData,
      [fieldName]: e.target.value
    }));
  };

  const handleCheckBox = (data) => {
    if (data.event) {
      setDrRequestForms((prevForms) => [
        ...prevForms,
        {
          patient_id: profileData?.patient_id,
          physician_id: profileData?.admitting_physician,
          test_id: data.type.id,
          lab_category: data.category,
          charge: data.type.charge
        }
      ]);
      setIsOptionDisabled(false);
    } else {
      setDrRequestForms((prevForms) =>
        prevForms.filter((form) => form.test_id !== data.type.id)
      );
      setIsOptionDisabled(true);
    }
  };

  const handleAutoSave = (data) => {
    autoSaveData({
      data: data.value,
      actionType: data.type,
      patient_id: profileData?.patient_id
    })
      .unwrap()
      .then((response) => {
        if (response.status === 'success') {
          setAutoSaveLoader(true);
          refetchUserDetailById();
          refetchCityData();
          refetchMunicipalData();
          refetchBarangayData();
        }
      })
      .catch((error) => {
        if (error.status === 500) {
          console.log(error);
        }
      });
  };

  const handleClickFromSearch = (data) => {
    const { type, value } = data;
    const clickedFromSearch =
      type === 'popt_proc' || type === 'oopt_proc'
        ? {
            code: value.proc_code,
            description: value.proc_desc,
            type
          }
        : type === 'icd10_code'
          ? {
              code: value.icd10_code,
              description: value.icd10_desc,
              type
            }
          : null;

    setClickedValue((prev) => ({
      ...prev,
      [type]: clickedFromSearch
    }));

    let dataClicked = [];
    if (clickedFromSearch !== null) {
      dataClicked = [
        {
          code: clickedFromSearch.code,
          description: clickedFromSearch.description,
          type
        }
      ];
    }

    handleAutoSave({ value: dataClicked[0] });
    setIsModalOpen(false);
    setModalType('');
  };

  const tabsConfig = [
    {
      id: 'tab1',
      label: 'Patient Information and Consent',
      content: () => (
        <ComponentContext.Provider
          value={{
            state: {
              provinceData: provinceData,
              cityData: cityData,
              profileData: profileData,
              municipalityData: municipalityData,
              barangayData: barangayData,
              userDetails: userDetails,
              clickedValue: clickedValue
            },
            onChange: (data) => handleOnChange(data),
            onAutoSave: (data) => handleAutoSave(data),
            onModalOpen: (data) => handleModalState(data)
          }}
        >
          <PatientInformation />
        </ComponentContext.Provider>
      )
    },
    {
      id: 'tab2',
      label: 'S.O.A.P',
      content: () => (
        <ComponentContext.Provider
          value={{
            state: {
              symptomsData: []
            }
          }}
        >
          <Soap />
        </ComponentContext.Provider>
      )

      // <Soap
      //     id="tab2"
      //     onClick={() => {
      //         setIsDrDrawerOpen(true)
      //         setDrRequestForms([])
      //         setAddedMedicine([])
      //         setAlertMessage("")
      //     }}
      // />
    },
    {
      id: 'tab3',
      label: 'Laboratory Results',
      content: () => (
        <LabResult
          tableData={labResultList}
          tableHeader={
            labResultList.length > 0 ? Object.keys(labResultList[0]) : []
          }
        />
      )
    },
    {
      id: 'tab4',
      label: 'Imaging Results',
      content: () => (
        <ImagingResult
          tableData={imgResultList}
          tableHeader={
            imgResultList.length > 0 ? Object.keys(imgResultList[0]) : []
          }
        />
      )
    },
    {
      id: 'tab5',
      label: 'Prescription',
      content: () => (
        <Prescription
          onRefetch={medicationRefetch}
          medication={medicationList}
          medicine={medicineList?.medicines}
          medicineForm={medicineList?.medForm}
          medicineFrequency={medicineList?.medFrequency}
          patientId={profileData?.patient_id}
          physicianId={profileData?.admitting_physician}
        />
      )
    }
  ];

  const tabsConfigIpd = [
    {
      id: 'tab1',
      label: 'Patient Information and Consent',
      content: () => (
        <ComponentContext.Provider
          value={{
            state: {
              provinceData: provinceData,
              cityData: cityData,
              profileData: profileData,
              municipalityData: municipalityData,
              barangayData: barangayData,
              userDetails: userDetails,
              clickedValue: clickedValue
            },
            onChange: (data) => handleOnChange(data),
            onAutoSave: (data) => handleAutoSave(data),
            onModalOpen: (data) => handleModalState(data)
          }}
        >
          <PatientInformation />
        </ComponentContext.Provider>
      )
    },
    {
      id: 'tab2',
      label: 'Medical History',
      content: () => (
        <ComponentContext.Provider
          value={{
            state: {
              profileData: profileData,
              symptomsData: symtomsList
            },
            onAutoSave: (data) => handleAutoSave(data)
          }}
        >
          <ClinicalRecord />
        </ComponentContext.Provider>
      )
      // <MedicalHistory />
    },
    {
      id: 'tab3',
      label: 'Laboratory Results',
      content: () => (
        <LabResult
          tableData={labResultList}
          tableHeader={
            labResultList.length > 0 ? Object.keys(labResultList[0]) : []
          }
        />
      )
    },
    {
      id: 'tab4',
      label: 'Imaging Results',
      content: () => (
        <ImagingResult
          tableData={imgResultList}
          tableHeader={
            imgResultList.length > 0 ? Object.keys(imgResultList[0]) : []
          }
        />
      )
    },
    {
      id: 'tab5',
      label: 'Doctors Orders',
      content: () => (
        <ComponentContext.Provider
          value={{
            state: {
              profileData: profileData
              // doctorOrder: doctorOrderList
            },
            onRemoveData: (data) => handleRemoveData(data),
            onAddData: (data) => handleSubmitButton(data),
            onModalOpen: (data) => handleModalState(data)
          }}
        >
          <DoctorOrder
            data={doctorOrderList}
            refetch={refetchDoctorOrderList}
          />
        </ComponentContext.Provider>
      )
    },
    {
      id: 'tab6',
      label: 'Monitoring Sheets',
      content: () => (
        <HealthMonitor
          onInputtedTemp={(data) => setTemperature(data)}
          onInputtedRR={(data) => setRespiratoryRate(data)}
          onInputtedPR={(data) => setPulseRate(data)}
          onSetHour={(data) => setHour(data)}
          onAddData={() => handleAddData()}
          onClearData={() => handleClearData()}
          data={chartData}
          profileData={profileData}
        />
      )
    },
    {
      id: 'tab7',
      label: 'Nurses Notes',
      content: () => (
        <NurseNote data={nurseNoteList} onModalState={handleModalState} />
      )
    },
    {
      id: 'tab8',
      label: 'Medication Sheet',
      content: () => <MedicationSheet />
    }
  ];

  const pdfConfig = [
    {
      category: 'print-phealth-cf1',
      title: 'PHILHEALTH CF1',
      type: 'printPhilhealthCf1'
    },
    {
      category: 'print-phealth-cf2',
      title: 'PHILHEALTH CF2',
      type: 'printPhilhealthCf2'
    },
    {
      category: 'print-phealth-cf3',
      title: 'PHILHEALTH CF3',
      type: 'printPhilhealthCf3'
    },
    {
      category: 'print-phealth-cf4',
      title: 'PHILHEALTH CF4',
      type: 'printPhilhealthCf4'
    }
  ];
  
  const renderContent = (slug) => {
    switch (slug) {
      case 'in-patient':
        return moduleListLoading ? (
          <SkeletonScreen loadingType="table" />
        ) : (
          <div>
            <div
              className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 pr-[6rem] pl-[6rem] pt-[5rem]`}
              style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
            >
              <div className="font-medium text-xl mb-2 text-gray-600">
                In Patient
              </div>
              <div className="flex justify-between py-1">
                <div className="flex space-x-1">
                  <Button
                    btnIcon="add"
                    onClick={() => {
                      handleActiveContent('addRow', '');
                      setRefetchRTK(true);
                    }}
                  >
                    Add
                  </Button>

                  <Dropdown
                    align="left"
                    width="48"
                    trigger={
                      <button
                        onClick=""
                        className={`${isOptionDisabled ? 'bg-gray-300' : 'bg-indigo-500 hover:bg-indigo-600'} flex items-center text-white text-sm px-2 gap-2 rounded focus:outline-none`}
                        disabled={isOptionDisabled}
                      >
                        <svg
                          dataSlot="icon"
                          fill="none"
                          className="h-4 w-4"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                          />
                        </svg>
                        Options
                      </button>
                    }
                  >
                    {pdfConfig.map(({ category, title, type }) => (
                      <PdfContext.Provider
                        key={category}
                        value={{
                          state: {
                            title: title,
                            isOptionEditDisabled: isOptionEditDisabled
                          },
                          data: {
                            profileData: profileData,
                            category: category
                          },
                          ref: formRef
                        }}
                      >
                        <PdfGenerator category={category} />
                      </PdfContext.Provider>
                    ))}
                  </Dropdown>
                </div>

                <SearchExport>
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        // onChange={e => setSearchQuery(e.target.value)}
                        onChange={(e) => handleSearch(e)}
                        className="border border-gray-300 w-full px-2 py-1 rounded focus:outline-none text-sm flex-grow pl-10"
                        placeholder="Search..."
                      />
                      <svg
                        fill="none"
                        stroke="currentColor"
                        className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </div>

                    <Dropdown
                      align="right"
                      width="48"
                      trigger={
                        <button
                          className="border border-gray-300 bg-white rounded px-2 py-1 ml-1 focus:outline-none"
                          aria-labelledby="Export"
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            className="h-5 w-4"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                            />
                          </svg>
                        </button>
                      }
                    >
                      <DropdownExport>Export as PDF</DropdownExport>
                      <DropdownExport>Export as JSON</DropdownExport>
                    </Dropdown>
                  </div>
                </SearchExport>
              </div>

              <div className="bg-white overflow-hidden border border-gray-300 rounded">
                <TableContext.Provider
                  value={{
                    state: {
                      type: 'inpatient'
                    },
                    tableData: patientData,
                    tableHeader: header,
                    ref: tblRef,
                    onChecked: (data) => handleOnChecked(data),
                    onClick: (data) => handleOnClick(data),
                    onEdit: (data) => handleOnEdit(data),
                    onCheckPatient: (data) => handleCheckPatient(data)
                  }}
                >
                  <Table />
                </TableContext.Provider>
              </div>

              <div className="flex flex-wrap py-1">
                <div className="flex items-center justify-center flex-grow">
                  <Pagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    // onPageChange={newPage => setCurrentPage(newPage)}
                    onPageChange={(newPage) =>
                      handleOnChange({ type: 'newPage', value: newPage })
                    }
                  />
                </div>

                <ItemPerPage className="flex flex-grow">
                  <div className="flex items-center justify-end">
                    <span className="mr-2 mx-2 text-gray-500 uppercase font-medium text-xs">
                      Per Page:
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(e)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                </ItemPerPage>
              </div>
            </div>
            <div
              className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0 ' : 'translate-x-full'}  absolute inset-0 pr-[6rem] pl-[6rem] pt-[3.5rem]`}
              style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
            >
              {contentType === 'addRow' && (
                <>
                  <div className="font-bold text-lg mb-2 text-gray-600 pt-10 px-4">
                    Add In Patient
                  </div>
                  <div className="flex justify-between py-2 px-4">
                    <Button
                      paddingY="2"
                      btnIcon="close"
                      onClick={() => {
                        handleOnClose({ type: 'closeIpd', slug: slug });
                      }}
                    >
                      Close
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        bgColor="indigo"
                        btnIcon="add"
                        onClick={() => formRef.current.handleAddRow()}
                      >
                        Add Row
                      </Button>

                      <Button
                        bgColor={btnSpinner ? 'disable' : 'emerald'}
                        btnIcon={btnSpinner ? 'disable' : 'submit'}
                        btnLoading={btnSpinner}
                        onClick={() => handleSubmitButton({ slug: slug })}
                      >
                        {btnSpinner ? '' : 'Submit'}
                      </Button>
                    </div>
                  </div>

                  <FormContext.Provider
                    value={{
                      title: 'In Patient Form',
                      ref: formRef,
                      initialFields: ipdForms,
                      enableAddRow: true,
                      onSuccess: handleRefetch,
                      onLoading: (data) => setBtnSpinner(data),
                      onSetAlertType: (data) => setAlertType(data),
                      onCloseSlider: () => setActiveContent('yellow'),
                      onAlert: (data) => {
                        setAlertMessage(data.msg);
                        setAlertType(data.type);
                      }
                    }}
                  >
                    <Form />
                  </FormContext.Provider>
                </>
              )}

              {contentType === 'tableRow' && (
                <>
                  <ComponentContext.Provider
                    value={{
                      state: profileData,
                      onClick: () => {
                        setActiveContent('yellow');
                        setRefetchRTK(false);
                        tblRef.current.handleResetState();
                        setIsOptionDisabled(true);
                        setActiveTab('tab1');
                      }
                    }}
                  >
                    <Profile />
                  </ComponentContext.Provider>

                  <Tabs
                    tabsConfig={tabsConfigIpd}
                    onActiveTab={(id) => handleActiveTab(id)}
                  />
                </>
              )}
            </div>
          </div>
        );
      case 'out-patient':
        return moduleListLoading ? (
          <SkeletonScreen loadingType="table" />
        ) : (
          <div>
            <div
              className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 pr-[6rem] pl-[6rem] pt-[5rem]`}
              style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
            >
              <div className="font-medium text-xl mb-2 text-gray-600">
                Out Patient
              </div>
              <div className="flex justify-between py-1">
                <div className="flex space-x-1">
                  <Button
                    btnIcon="add"
                    onClick={() => {
                      handleActiveContent('addRow', ''), setRefetchRTK(true);
                    }}
                  >
                    Add
                  </Button>

                  <Dropdown
                    align="left"
                    width="48"
                    trigger={
                      <button
                        onClick=""
                        className={`${isOptionDisabled ? 'bg-gray-300' : 'bg-indigo-500 hover:bg-indigo-600'} flex items-center text-white text-sm px-2 gap-2 rounded focus:outline-none`}
                        disabled={isOptionDisabled}
                      >
                        <svg
                          dataSlot="icon"
                          fill="none"
                          className="h-4 w-4"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                          />
                        </svg>
                        Options
                      </button>
                    }
                  >
                    <PdfContext.Provider
                      value={{
                        state: {
                          pdfCategory: 'print-prescription',
                          title: 'Generate Prescription',
                          isOptionEditDisabled: isOptionEditDisabled
                        },
                        data: {
                          profileData: profileData,
                          testsData: labResultList,
                          medication: medicationList
                        },
                        ref: formRef,
                        onClick: () =>
                          handleOnClick({ type: 'printPrescription' })
                      }}
                    >
                      <PdfGenerator />
                    </PdfContext.Provider>
                  </Dropdown>
                </div>

                <SearchExport>
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        // onChange={e => setSearchQuery(e.target.value)}
                        onChange={(e) => handleSearch(e)}
                        className="border border-gray-300 w-full px-2 py-1 rounded focus:outline-none text-sm flex-grow pl-10"
                        placeholder="Search..."
                      />
                      <svg
                        fill="none"
                        stroke="currentColor"
                        className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </div>

                    <Dropdown
                      align="right"
                      width="48"
                      trigger={
                        <button
                          className="border border-gray-300 bg-white rounded px-2 py-1 ml-1 focus:outline-none"
                          aria-labelledby="Export"
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            className="h-5 w-4"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                            />
                          </svg>
                        </button>
                      }
                    >
                      <DropdownExport>Export as PDF</DropdownExport>
                      <DropdownExport>Export as JSON</DropdownExport>
                    </Dropdown>
                  </div>
                </SearchExport>
              </div>

              <div className="bg-white overflow-hidden border border-gray-300 rounded">
                <TableContext.Provider
                  value={{
                    state: {
                      type: 'outpatient'
                    },
                    tableHeader: header,
                    tableData: patientData,
                    ref: tblRef,
                    onChecked: (data) => handleOnChecked(data),
                    onClick: (data) => handleOnClick(data),
                    onEdit: (data) => handleOnEdit(data), 
                    onCheckPatient: (data) => handleCheckPatient(data)
                  }}
                >
                  <Table />
                </TableContext.Provider>
              </div>

              <div className="flex flex-wrap py-1">
                <div className="flex items-center justify-center flex-grow">
                  <Pagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    // onPageChange={newPage => setCurrentPage(newPage)}
                    onPageChange={(newPage) =>
                      handleOnChange({ type: 'newPage', value: newPage })
                    }
                  />
                </div>

                <ItemPerPage className="flex flex-grow">
                  <div className="flex items-center justify-end">
                    <span className="mr-2 mx-2 text-gray-500 uppercase font-medium text-xs">
                      Per Page:
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(e)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                </ItemPerPage>
              </div>
            </div>

            <div
              className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0 ' : 'translate-x-full'}  absolute inset-0 pr-[6rem] pl-[6rem] pt-[3.5rem]`}
              style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
            >
              {contentType === 'addRow' && (
                <>
                  <div className="font-medium text-xl mb-2 text-gray-600 pt-10 px-4">
                    Add Out Patient
                  </div>
                  <div className="flex justify-between py-2 px-4">
                    <Button
                      paddingY="2"
                      btnIcon="close"
                      onClick={() => {
                        setActiveContent('yellow');
                        setRefetchRTK(false);
                      }}
                    >
                      Close
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        bgColor="indigo"
                        btnIcon="add"
                        onClick={() => formRef.current.handleAddRow()}
                      >
                        Add Row
                      </Button>

                      <Button
                        bgColor={btnSpinner ? 'disable' : 'emerald'}
                        btnIcon={btnSpinner ? 'disable' : 'submit'}
                        btnLoading={btnSpinner}
                        onClick={() => handleSubmitButton({ slug: slug })}
                      >
                        {btnSpinner ? '' : 'Submit'}
                      </Button>
                    </div>
                  </div>

                  <FormContext.Provider
                    value={{
                      title: 'Out Patient Form',
                      ref: formRef,
                      initialFields: generateOpdForms(physicianList),
                      enableAutoSave: false,
                      enableAddRow: true,
                      onSuccess: handleRefetch,
                      onLoading: (data) => setBtnSpinner(data),
                      onSetAlertType: (data) => setAlertType(data),
                      onCloseSlider: () => setActiveContent('yellow'),
                      onAlert: (data) => {
                        setAlertMessage(data.msg);
                        setAlertType(data.type);
                      }
                    }}
                  >
                    <Form />
                  </FormContext.Provider>
                </>
              )}
              {contentType === 'tableRow' && (
                <>
                  <ComponentContext.Provider
                    value={{
                      state: profileData,
                      onClick: () => {
                        setActiveContent('yellow');
                        setRefetchRTK(false);
                      }
                    }}
                  >
                    <Profile />
                  </ComponentContext.Provider>

                  <Tabs
                    tabsConfig={tabsConfig}
                    onActiveTab={(id) => handleActiveTab(id)}
                  />
                </>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout
      moduleId={slug}
      menuGroup={menuGroup}
      isLoading={moduleListLoading}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div
        className="relative overflow-x-hidden"
        style={{ height: `${contentHeight}px` }}
      >
        {autoSaveLoader && (
          <div className="flex justify-end w-full absolute inset-0 p-8 pt-[6rem] z-50">
            <AutoSaveSpinner />
          </div>
        )}

        <ModalContext.Provider
          value={{
            state: {
              modalType: modalType,
              selectedMedicine: selectedMedicine,
              searchMedicine: searchMedicine,
              isShowMedForm: isShowMedForm,
              isDrDrawerOpen: isDrDrawerOpen,
              addedMedicine: addedMedicine,
              alertMessage: alertMessage,
              medicineList: medicineList?.medicines,
              medicineForm: medicineList?.medForm,
              medicineFrequency: medicineList?.medFrequency,
              medication: medicationList,
              profileData: profileData,
              btnSpinner: btnSpinner
            },
            isOpen: isModalOpen,
            onClose: closeModal,
            onChange: (data) => handleOnChange(data),
            onClick: (data) => handleOnClose(data),
            onRemove: (data) => handleRemoveData(data),
            onLoading: (data) => setBtnSpinner(data),
            onAddMedicine: (data) => handleAddMedicine(data.data, data.field),
            onSubmitData: (data) => handleSubmitButton(data),
            onClickOpenMed: (data) => handleSelectMedicine(data.data),
            onClickFromSearch: (data) => handleClickFromSearch(data)
          }}
        >
          <Modal
            onSelectMedicine={handleSelectMedicine}
            medicineRefetch={medicineRefetch}
            medicationRefetch={medicationRefetch}
          />
        </ModalContext.Provider>

        {alertMessage && (
          <Alert
            alertType={alertType}
            isOpen={alertType !== ''}
            onClose={handleAlertClose}
            message={alertMessage}
          />
        )}

        {renderContent(slug)}

        {isDrDrawerOpen && (
          <ComponentContext.Provider
            value={{
              state: {
                selectedMedicine: selectedMedicine,
                searchMedicine: searchMedicine,
                drRequestForms: drRequestForms,
                isShowMedForm: isShowMedForm,
                isDrDrawerOpen: isDrDrawerOpen,
                addedMedicine: addedMedicine,
                btnSpinner: btnSpinner,
                isOptionDisabled: isOptionDisabled
              },
              patientData: patientData,
              pathologyData: testsData,
              radiologyData: radiologyList,
              medicationData: medicationList,
              isDrDrawerOpen: isDrDrawerOpen,
              alertMessage: alertMessage,
              onAddMedicine: (data) => handleAddMedicine(data.data, data.field),
              onClickOpenMed: (data) => handleSelectMedicine(data),
              onChange: () => handleOnChange,
              onCheck: (data) => handleCheckBox(data),
              onClose: (data) => handleOnClose(data),
              onSubmitDrRequest: (data) => handleSubmitButton(data)
            }}
          >
            <DoctorRequest />
          </ComponentContext.Provider>
        )}
      </div>
    </AppLayout>
  );
};

export default SubModule;
