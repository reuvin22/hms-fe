import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import {
  FormContext,
  useFormContext,
  useComponentContext,
  ComponentContext,
  TableContext
} from '@/utils/context';
import Select from 'react-select';
import { data } from 'node_modules/autoprefixer/lib/autoprefixer';
import {
  useGetProvinceDataQuery,
  useGetCityDataQuery,
  useGetMunicipalityDataQuery,
  useGetBarangayDataQuery
} from '@/service/psgcService';
import {
  useGetAboutUsQuery,
  useGetModuleNameListQuery,
  useCreateBulkMutation,
  useUpdateBulkMutation
} from '@/service/settingService';
import Pagination from '@/components/Pagination';
import ItemPerPage from '@/components/ItemPerPage';
import AboutUs from './System/SystemForms/AboutUs';
import Form from '../Form';
import Button from '../Button';
import Tabs from '../Tabs';
import Table from '../Table';
import Modal from '../Modal';
import CustomCKEditor from '../CustomCKEditor';
import SearchItemPage from '../SearchItemPage';

// const aboutUs = [
//     {hospital_name: "Category Charge 1", street_name: "Procedures", code: "PCC11"},
//     {hospital_name: "Biochemistry", street_name: "Investigations", code: "ABG's"},
//     {hospital_name: "General Surgery", street_name: "Operation Theatre", code: "Knee Surgery"},
// ]

const tableContent = [
  { header1: 'Test1', header2: 'Test2', header3: 'Test3' },
  {
    header1: 'Hospital Name',
    header2: 'Street Name',
    header3: 'Barangay Name'
  },
  {}
];

const renderModalContentByTab = (tab) => {
  switch (tab) {
    case 'tab1':
      return <></>;
    case 'tab2':
      return (
        <>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name of HCI
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Accreditation number
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Street
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            barangay
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            city
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            province
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            postal code
          </th>
        </>
      );
    case 'tab3':
      return <>{console.log(tab)}</>;
    case 'tab4':
      return <>{console.log(tab)}</>;
    case 'tab5':
      return <>{console.log(tab)}</>;
  }
};

const renderTableContentByTab = (tab) => {
  switch (tab) {
    case 'tab1':
      return (
        <div>
          <div className="flex justify-items-start">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white ml-2 mb-4 mr-2 px-4 py-2 focus:outline-none flex items-center space-x-2 rounded"
            >
              <span>SAVE</span>
              <svg
                fill="none"
                stroke="currentColor"
                className="h-6 w-6"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            <button className="bg-sky-500 hover:bg-sky-600 text-white mb-4 mr-2 px-4 py-2 focus:outline-none flex items-center space-x-2 rounded">
              <span>PUBLISHED</span>
              <svg
                fill="none"
                stroke="currentColor"
                className="h-6 w-6"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </button>
          </div>
          <CustomCKEditor /* onChange={(data) => setEditorData(data)} */ />
        </div>
      );
    case 'tab2':
      return (
        <div>
          <div className="flex justify-items-start">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white ml-2 mb-4 mr-2 px-4 py-2 focus:outline-none flex items-center space-x-2 rounded"
            >
              <span>SAVE</span>
              <svg
                fill="none"
                stroke="currentColor"
                className="h-6 w-6"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <Button btnIcon="add" onClick={() => setActiveContent('green')}>
              Add
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

function System({ slug }) {
  const context = useContext(FormContext);
  const componentContext = useComponentContext();
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorData, setEditorData] = useState('');
  const [contentHeight, setContentHeight] = useState(0);
  const [resetFormTimer, setResetFormTimer] = useState(false);
  const [activeContent, setActiveContent] = useState('yellow');
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [provinceCode, setProvinceCode] = useState('');
  const [municipalCode, setMunicipalCode] = useState(null);
  const [barangayCode, setBarangayCode] = useState(null);
  const [clickedValue, setClickedValue] = useState(null);
  const [apiLink, setApiLink] = useState(null);
  const { data: provinceData } = useGetProvinceDataQuery();
  const [formData, setFormData] = useState([]);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [state, setState] = useState({
    isShowedForm: false,
    selectedRow: null
  });
  const [updateBulk] = useUpdateBulkMutation();
  const [isDisabled, setIsDisabled] = useState({
    selectedCity: false,
    selectedMunicipality: false
  });

  const [
    createBulk,
    {
      isLoading: createBulkLoading,
      isError,
      error,
      isSuccess: createUserSuccess
    }
  ] = useCreateBulkMutation();

  useEffect(() => {
    let spinnerTimer;
    if (btnSpinner) {
      spinnerTimer = setTimeout(() => {
        setBtnSpinner(false);
      }, 500);
    }

    return () => {
      if (spinnerTimer) {
        clearTimeout(spinnerTimer);
      }
      // clearTimeout(highlightTimeout)
    };
  }, [btnSpinner]);

  const test = [
    {
      name: 'category_name',
      type: 'text',
      label: 'Category Name',
      placeholder: 'Enter Category Name'
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter Description'
    }
  ];
  const { data: cityData, refetch: refetchCityData } = useGetCityDataQuery({
    provinceCode,
    enabled: !!provinceCode
  });
  const { data: municipalityData, refetch: refetchMunicipalData } =
    useGetMunicipalityDataQuery({
      provinceCode,
      enabled: !!provinceCode
    });
  const { data: barangayData, refetch: refetchBarangayData } =
    useGetBarangayDataQuery(
      {
        municipalCode,
        apiLink
      },
      {
        enabled: !!municipalCode
      }
    );
  const tblRef = useRef(null);
  const formRef = useRef(null);

  const {
    data: aboutUsData,
    isLoading: aboutUsLoading,
    isError: aboutUsError,
    isSuccess: aboutUsSuccess,
    refetch: aboutUsRefetch
  } = useGetAboutUsQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  const aboutUsList = aboutUsData?.data ?? [];
  const aboutUsHeaders = aboutUsData?.columns ?? [];
  const aboutUsPagination = aboutUsData?.pagination ?? [];

  console.log(aboutUsData);
  const {
    data: modulesData,
    isLoading: modulesLoading,
    isError: modulesError,
    isSuccess: modulesSuccess,
    refetch: modulesRefetch
  } = useGetModuleNameListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  const moduleList = modulesData?.data ?? [];
  const moduleHeader = modulesData?.columns ?? [];
  const modulePagination = modulesData?.pagination ?? [];

  console.log(modulesData);
  let paginations = [];

  switch (activeTab) {
    case 'tab1':
      paginations = aboutUsData?.pagination ?? [];
      break;
    case 'tab6':
      paginations = modulesData?.pagination ?? [];
      break;
    // Add cases for other tabs as needed
    default:
      paginations = [];
      break;
  }

  // tab 6
  const modulesTab = [
    {
      name: 'module_id',
      type: 'text',
      label: 'Module Id',
      placeholder: 'Enter Module Name'
    },
    {
      name: 'type',
      type: 'text',
      label: 'Type',
      placeholder: 'Input "" if none, type sub if sub module'
    },
    {
      name: 'name',
      type: 'text',
      label: 'Module Name',
      placeholder: 'Enter Module Name'
    },
    {
      name: 'menu_group',
      type: 'text',
      label: 'Module Group',
      placeholder: 'Type true if yes, false if no'
    }
  ];

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
  };

  const handleNewPage = (newPage) => {
    setCurrentPage(newPage);
    // setRefetchData(true)
    // setItemsPerPage(prev => prev + 1)
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleRefetch = () => {
    setItemsPerPage((prev) => prev + 1);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
  };

  const handleExportToPDF = () => {};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleActiveTab = (id) => {
    setActiveTab(id);
    setState({
      isShowedForm: false
    });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleUpdate = (e) => {
    const { value, name } = e.target;
    setState((prev) => ({
      ...prev,
      selectedRow: {
        ...prev.selectedRow,
        [name]: value
      }
    }));
  };

  const handleOnClick = (data) => {
    switch (data.type) {
      case 'tabClicked':
        setActiveTab(data.value);
        break;

      case 'rowClicked':
        setState((prev) => ({
          ...prev,
          isShowedForm: true,
          selectedRow: data.value
        }));
        break;

      case 'backBtn':
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        break;

      case 'updateAboutUs':
        updateBulk({
          actionType: 'updateAboutUs',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        aboutUsRefetch();
        break;

      default:
        break;
    }
  };

  const handleSubmitButton = (tabs) => {
    if (tabs === 'tab6') {
      formRef.current.handleSubmit('createModule');
    }
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

      case 'barangay':
        setApiLink(data.category);
        setBarangayCode(data.value);
        break;

      default:
        break;
    }
  };

  const handleOnUpdate = (data) => {
    switch (data.type) {
      case 'province':
        setState((prev) => ({
          ...prev,
          selectedRow: {
            ...prev.selectedRow,
            province: data.value,
            provinceName: provinceData?.find(
              (option) => option.code === data.value
            )?.name,
            city_of: '',
            municipality: ''
          }
        }));
        handleOnChange({ type: 'province', value: data.value });
        setIsDisabled({
          selectedCity: false,
          selectedMunicipality: false
        });
        break;

      case 'city_of':
        setState((prev) => ({
          isShowedForm: true,
          selectedRow: {
            ...prev.selectedRow,
            city: data.value,
            cityName: cityData?.find((option) => option.code === data.value)
              ?.name,
            municipality: ''
          }
        }));
        handleOnChange({
          type: 'city_of',
          value: data.value,
          category: 'cities'
        });
        setIsDisabled({
          selectedCity: false,
          selectedMunicipality: true
        });
        break;

      case 'municipality':
        setState((prev) => ({
          isShowedForm: true,
          selectedRow: {
            ...prev.selectedRow,
            municipality: data.value,
            municipalityName: municipalityData?.find(
              (option) => option.code === data.value
            )?.name,
            city_of: '',
            barangay: ''
          }
        }));
        handleOnChange({
          type: 'municipality',
          value: data.value,
          category: 'municipalities'
        });
        setIsDisabled({
          selectedCity: true,
          selectedMunicipality: false
        });
        break;
      case 'barangay':
        setState((prev) => ({
          isShowedForm: true,
          selectedRow: {
            ...prev.selectedRow,
            barangay: data.value,
            barangayName: barangayData?.find(
              (option) => option.code === data.value
            )?.name
          }
        }));
        break;

      default:
        break;
    }
  };

  const styleDropdown = ({ isDisabled = false }) => ({
    control: (provided) => ({
      ...provided,
      // border: '1px solid gray',
      margin: 0,
      padding: 0,
      boxShadow: 'none',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      backgroundColor: isDisabled ? 'rgb(229 231 235)' : 'rgb(243 244 246)',
      '&:hover': {
        borderColor: 'gray',
        border: '1px solid gray'
      },
      '&:focus': {
        border: 'none'
      }
    }),
    input: (provided) => ({
      ...provided,
      inputOutline: 'none'
    })
  });
  const tabsConfig = [
    {
      id: 'tab1',
      label: 'Home',
      content: () => <></>
    },
    {
      id: 'tab2',
      label: 'About Us',
      content: () => (
        <>
          {state?.isShowedForm ? (
            renderUpdateFormByTab(activeTab)
          ) : (
            <TableContext.Provider
              value={{
                tableData: aboutUsList,
                tableHeader: aboutUsHeaders,
                isLoading: aboutUsLoading,
                disableCheckbox: true,
                onClick: (tblBody) => {
                  handleOnClick({ type: 'rowClicked', value: tblBody.value });
                }
              }}
            >
              <Table />
            </TableContext.Provider>
          )}
        </>
      )
    },
    {
      id: 'tab3',
      label: 'Services',
      content: () => <></>
    },
    {
      id: 'tab4',
      label: 'Doctors',
      content: () => <></>
    },
    {
      id: 'tab5',
      label: 'Contact Us',
      content: () => <></>
    },
    {
      id: 'tab6',
      label: 'Modules',
      content: () => (
        <>
          {state?.isShowedForm ? (
            renderUpdateFormByTab(activeTab)
          ) : (
            <TableContext.Provider
              value={{
                tableData: moduleList,
                tableHeader: moduleHeader,
                isLoading: modulesLoading,
                disableCheckbox: true,
                onClick: (tblBody) => {
                  handleOnClick({ type: 'rowClicked', value: tblBody.value });
                }
              }}
            >
              <Table />
            </TableContext.Provider>
          )}
        </>
      )
    }
  ];

  // const tableHeaderByTab = (tab) => {
  //   switch (tab) {
  //     case 'tab6':
  //       return (
  //         <>
  //           <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //             Modules
  //           </th>
  //         </>
  //       );
  //   }
  // }

  const renderUpdateFormByTab = (tab) => {
    switch (tab) {
      case 'tab1':
        break;

      case 'tab2':
        return (
          <>
            <div className="px-56 py-10">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  HCI Name:
                </label>
                <input
                  type="text"
                  name="hci_name"
                  className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                  value={state?.selectedRow?.hci_name}
                  onChange={handleUpdate}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Accreditation Number:
                </label>
                <input
                  type="text"
                  name="accreditation_no"
                  className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                  value={state?.selectedRow?.accreditation_no}
                  onChange={handleUpdate}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Province:
                </label>
                <Select
                  key={resetFormTimer}
                  options={provinceData?.map((province) => ({
                    value: province.code,
                    label: province.name
                  }))}
                  onChange={(e) =>
                    handleOnUpdate({ type: 'province', value: e?.value })
                  }
                  // onBlur={handleBlur}
                  isSearchable
                  isClearable
                  placeholder="Select province"
                  classNamePrefix="react-select"
                  styles={styleDropdown({ isDisabled: false })}
                  value={
                    provinceData
                      ?.filter((option) => option.code === formData?.province)
                      .map((option) => ({
                        value: option.code,
                        label: option.name
                      }))[0]
                  }
                  // value={provinceData?.find(option => option.code === formData.province)?.name}
                />
                <label className="block text-sm font-medium text-gray-700">
                  City:
                </label>
                <Select
                  key={resetFormTimer}
                  options={cityData?.map((province) => ({
                    value: province.code,
                    label: province.name
                  }))}
                  onChange={(e) =>
                    handleOnUpdate({ type: 'city_of', value: e?.value })
                  }
                  isSearchable
                  isClearable
                  placeholder="Select City"
                  classNamePrefix="react-select"
                  styles={styleDropdown({ isDisabled: false })}
                  value={
                    cityData
                      ?.filter((option) => option.code === cityData.city_of)
                      .map((option) => ({
                        value: option.code,
                        label: option.name
                      }))[0]
                  }
                  // value={provinceData?.find(option => option.code === formData.province)?.name}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Municipality:
                </label>
                <Select
                  key={resetFormTimer}
                  options={municipalityData?.map((municipality) => ({
                    value: municipality.code,
                    label: municipality.name
                  }))}
                  onChange={(e) =>
                    handleOnUpdate({ type: 'municipality', value: e?.value })
                  }
                  isSearchable
                  isClearable
                  placeholder="Select Municipality"
                  classNamePrefix="react-select"
                  styles={styleDropdown({ isDisabled: false })}
                  value={
                    municipalityData
                      ?.filter(
                        (option) => option.code === formData?.municipality
                      )
                      .map((option) => ({
                        value: option.code,
                        label: option.name
                      }))[0]
                  }
                  // value={provinceData?.find(option => option.code === formData.province)?.name}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Barangay:
                </label>
                <Select
                  key={resetFormTimer}
                  options={barangayData?.map((barangay) => ({
                    value: barangay.code,
                    label: barangay.name
                  }))}
                  onChange={(e) =>
                    handleOnUpdate({ type: 'barangay', value: e?.value })
                  }
                  isSearchable
                  isClearable
                  placeholder="Select barangay"
                  classNamePrefix="react-select"
                  styles={styleDropdown({ isDisabled: false })}
                  value={
                    barangayData
                      ?.filter((option) => option.code === formData?.barangay)
                      .map((option) => ({
                        value: option.code,
                        label: option.name
                      }))[0]
                  }
                  // value={provinceData?.find(option => option.code === formData.province)?.name}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Street:
                </label>
                <input
                  type="text"
                  name="street"
                  className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                  value={state?.selectedRow?.street}
                  onChange={handleUpdate}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Subdivision/Village:
                </label>
                <input
                  type="text"
                  name="subdivision_village"
                  className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                  value={state?.selectedRow?.subdivision_village}
                  onChange={handleUpdate}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Building No:
                </label>
                <input
                  type="text"
                  name="building_no"
                  className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                  value={state?.selectedRow?.building_no}
                  onChange={handleUpdate}
                />
                <label className="block text-sm font-medium text-gray-700">
                  No/Blk/Lot:
                </label>
                <input
                  type="text"
                  name="blk"
                  className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                  value={state?.selectedRow?.blk}
                  onChange={handleUpdate}
                />
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code:
                </label>
                <input
                  type="text"
                  name="postal_code"
                  className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                  value={state?.selectedRow?.postal_code}
                  onChange={handleUpdate}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOnClick({ type: 'backBtn' })}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() =>
                    handleOnClick({
                      type: 'updateAboutUs',
                      value: state?.selectedRow
                    })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  const renderPaginationByTab = (tab) => {
    switch (tab) {
      case 'tab1':
        break;

      case 'tab2':
        return (
          <>
            {!state?.isShowedForm && (
              <div className="flex flex-wrap py-2">
                <div className="flex items-center justify-center flex-grow">
                  <Pagination
                    currentPage={aboutUsPagination.current_page}
                    totalPages={aboutUsPagination.total_pages}
                    // onPageChange={newPage => setCurrentPage(newPage)}
                    onPageChange={(newPage) => handleNewPage(newPage)}
                  />
                </div>

                <ItemPerPage className="flex flex-grow">
                  <div className="flex items-center justify-end">
                    <span className="mr-2 mx-2 text-gray-700">Per Page:</span>
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
            )}
          </>
        );

      case 'tab6':
        return (
          <>
            {!state?.isShowedForm && (
              <div className="flex flex-wrap py-2">
                <div className="flex items-center justify-center flex-grow">
                  <Pagination
                    currentPage={modulePagination.current_page}
                    totalPages={modulePagination.total_pages}
                    // onPageChange={newPage => setCurrentPage(newPage)}
                    onPageChange={(newPage) => handleNewPage(newPage)}
                  />
                </div>

                <ItemPerPage className="flex flex-grow">
                  <div className="flex items-center justify-end">
                    <span className="mr-2 mx-2 text-gray-700">Per Page:</span>
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
            )}
          </>
        );
    }
  };

  //       {state?.isShowedForm === false &&
  //         activeTab === 'tab2' &&
  //         aboutUsList.map((tblBody) => (
  //           <tr
  //             key={tblBody.id}
  //             onClick={() =>
  //               handleOnClick({ type: 'rowClicked', value: tblBody })
  //             }
  //             className="hover:bg-gray-200 cursor-pointer"
  //           >
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.hci_name}
  //             </td>
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.accreditation_no}
  //             </td>
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.province_name}
  //             </td>
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.municipality_name}
  //             </td>
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.city_name}
  //             </td>
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.barangay_name}
  //             </td>
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.street}
  //             </td>
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.blk}
  //             </td>
  //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  //               {tblBody.postal_code}
  //             </td>
  //           </tr>
  //         ))}

  // //       {state?.isShowedForm === false &&
  // //         activeTab === 'tab6' &&
  // //         moduleList.map((tblBody) => (
  // //           <tr
  // //             key={tblBody.id}
  // //             className="hover:bg-gray-200 cursor-pointer"
  // //           >
  // //             <td className="px-6 py-2 whitespace-nowrap text-sm">
  // //               {tblBody.name}
  // //             </td>
  // //           </tr>
  // //         ))}
  // //     </tbody>
  // //   </table>
  // // );

  const renderContent = () => (
    <>
      <div
        className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
        style={{ height: `100vh`, overflowY: 'auto' }}
      >
        <div className="font-bold text-xl mb-2 text-gray-600">
          System Configuration
        </div>
        <div className="flex gap-2 py-1">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 flex items-center text-white px-2 gap-2 py-1 rounded text-sm focus:outline-none"
          >
            <svg
              fill="none"
              stroke="currentColor"
              className="h-6 w-6"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Save</span>
          </button>

          <button className="bg-sky-500 hover:bg-sky-600 flex items-center text-white px-2 gap-2 py-1 rounded text-sm focus:outline-none">
            <svg
              fill="none"
              stroke="currentColor"
              className="h-6 w-6"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              />
            </svg>
            <span>Published</span>
          </button>
          <Button btnIcon="add" onClick={() => setActiveContent('green')}>
            Add
          </Button>
        </div>
        <Tabs
          tabsConfig={tabsConfig}
          onActiveTab={(id) => handleActiveTab(id)}
        />
        {state?.isShowedForm ? null : renderPaginationByTab(activeTab)}
      </div>
      <div
        className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
        style={{ height: `100vh`, overflowY: 'auto' }}
      >
        {activeTab === 'tab6' && (
          <div className="flex justify-between py-1 px-4">
            <Button
              paddingY="2"
              btnIcon="close"
              onClick={() => setActiveContent('yellow')}
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
                onClick={() => handleSubmitButton(activeTab)}
              >
                {btnSpinner ? '' : 'Submit'}
              </Button>
            </div>
          </div>
        )}
        <div>
          {activeTab === 'tab2' && (
            <FormContext.Provider
              value={{
                state: {
                  provinceData,
                  cityData,
                  municipalityData,
                  barangayData,
                  formData,
                  setFormData,
                  setActiveContent,
                  activeTab,
                  aboutUsRefetch
                },
                onChange: (data) => handleOnChange(data),
                onLoading: (data) => setBtnSpinner(data),
                onSuccess: () => handleRefetch(),
                onCloseSlider: () => setActiveContent('yellow'),
                onAlert: (data) => {
                  setAlertMessage(data.msg);
                  setAlertType(data.type);
                }
              }}
            >
              <AboutUs />
            </FormContext.Provider>
          )}

          {activeTab === 'tab6' && (
            <FormContext.Provider
              value={{
                title: 'Modules',
                ref: formRef,
                initialFields: modulesTab,
                enableAddRow: true,
                onLoading: (data) => setBtnSpinner(data),
                onCloseSlider: () => setActiveContent('yellow'),
                onAlert: (data) => {
                  setAlertMessage(data.msg);
                  setAlertType(data.type);
                }
              }}
            >
              <Form />
            </FormContext.Provider>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div>
      {/* <Modal slug={slug} isOpen={isModalOpen} onClose={closeModal}>
        {renderTableContent()}
      </Modal> */}

      {renderContent()}
    </div>
  );
}

export default System;
