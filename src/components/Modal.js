import React, {
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
  useRef,
  useEffect
} from 'react';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { useDeleteDataMutation } from '@/service/patientService';
import {
  useGrantUserModuleMutation,
  useGetUserByIdQuery,
  authApi
} from '@/service/authService';
import {
  ComponentContext,
  FormContext,
  useModalContext
} from '@/utils/context';
import { debounce } from 'lodash';
import { useSearchQuery, searchApi } from '@/service/searchService';
import Form from './Form';
import NavTab from './NavTab';
import Prescription from './Patient/OPD/Prescription';
import Medication from './Patient/IPD/Medication';

const genderOPD = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const physicianOPD = [
  {
    id: 1,
    physician_charge: 1000,
    user_id: 'QOS-P2SXCL134',
    name: 'Dr John Smith'
  },
  {
    id: 2,
    physician_charge: 1500,
    user_id: 'QOS-P2SXCL135',
    name: 'Dr John Doe'
  }
];

const ancillaryOPD = [
  { id: 1, label: 'None', value: 'none' },
  { id: 2, label: 'ECG', value: 'ecg' },
  { id: 3, label: 'X-RAY', value: 'xray' },
  { id: 4, label: 'Ultrasound', value: 'ultrasound' }
];

const dispositionOPD = [
  { id: 1, label: 'Admission', value: 'admission' },
  { id: 2, label: 'Discharged', value: 'discharged' }
];

// const bedGroup = [
//     {}
// ]

const bedType = [
  { id: 1, bed_type: 'Ward' },
  { id: 2, bed_type: 'Room' },
  { id: 3, bed_type: 'Bed' }
];

const styleDropdown = {
  control: (provided) => ({
    ...provided,
    // border: '1px solid gray',
    padding: '0.1em',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'gray',
      border: '1px solid gray'
    }
  }),
  input: (provided) => ({
    ...provided,
    inputOutline: 'none'
  })
};

const bedRoomData = [
  {
    id: 1,
    type: 'ward',
    roomNo: 2,
    description: 'Wider room',
    status: 'available'
  },
  {
    id: 2,
    type: 'ward',
    roomNo: 3,
    description: 'Wider room with aircon',
    status: 'available'
  },
  {
    id: 3,
    type: 'bed',
    roomNo: 1,
    description: 'With more patients',
    status: 'available'
  },
  {
    id: 4,
    type: 'bed',
    roomNo: 2,
    description: 'Wider room with aircon',
    status: 'available'
  },
  {
    id: 5,
    type: 'bed',
    roomNo: 3,
    description: 'Wider bed with aircon',
    status: 'available'
  },
  {
    id: 6,
    type: 'bed',
    roomNo: 4,
    description: 'Wider bed ',
    status: 'occupied'
  }
];

const nurseNoteField = [
  {
    name: 'no_notes',
    type: 'textarea',
    label: 'Remarks',
    placeholder: 'Type...'
  }
];

const doctorOrderField = [
  {
    name: 'do_po_medication',
    type: 'text',
    label: 'Medication',
    placeholder: 'Type...'
  },
  {
    name: 'do_po_ivfluids',
    type: 'text',
    label: 'IV Fluids',
    placeholder: 'Type...'
  },
  {
    name: 'do_po_lab_tests',
    type: 'text',
    label: 'Labs and Tests',
    placeholder: 'Type...'
  },
  {
    name: 'do_po_imaging',
    type: 'text',
    label: 'Imaging',
    placeholder: 'Type...'
  },
  {
    name: 'do_po_instructions',
    type: 'textarea',
    label: 'Instructions',
    placeholder: 'Type...'
  }
];

const doctorPassword = [
  {
    name: 'doctor_password',
    type: 'text',
    label: 'Doctor Password',
    placeholder: 'Enter your password'
  }
];

const vitalSignField = [
  {
    name: 'vs_bp',
    type: 'text',
    label: 'Blood Pressure',
    placeholder: 'Systolic/Diastolic (e.g., 120/80 mmHg)'
  },
  {
    name: 'vs_hr',
    type: 'text',
    label: 'Heart Rate',
    placeholder: '(e.g., 70-100 bpm)'
  },
  {
    name: 'vs_temp',
    type: 'text',
    label: 'Temperature',
    placeholder: '(e.g., 36.5 °C)'
  },
  { name: 'vs_o2sat', type: 'text', label: 'O2 Sat', placeholder: 'SpO2 (%)' },
  { name: 'vs_height', type: 'text', label: 'Height', placeholder: '(cm)' },
  { name: 'vs_weight', type: 'text', label: 'Weight', placeholder: '(kg)' },
  { name: 'vs_bmi', type: 'text', label: 'BMI', disabled: true }
];

const ivFluidField = [
  {
    name: 'ivf_bottle_no',
    type: 'text',
    label: 'Bottle No',
    placeholder: 'Type...'
  },
  {
    name: 'ivf_type_iv',
    type: 'text',
    label: 'Type of IV and Drug Incorporated',
    placeholder: 'Type...'
  },
  {
    name: 'ivf_volumn_ml',
    type: 'text',
    label: 'Volume in ml',
    placeholder: 'Type...'
  },
  {
    name: 'ivf_rate_flow',
    type: 'text',
    label: 'Rate of Flow',
    placeholder: 'Type...'
  },
  {
    name: 'ivf_date_time_start',
    type: 'datetime-local',
    label: 'Date/Time Started'
  },
  {
    name: 'ivf_date_time_end',
    type: 'datetime-local',
    label: 'Date/Time Consumed'
  },
  {
    name: 'ivf_nurse_duty',
    type: 'text',
    label: 'Nurse on Duty',
    placeholder: 'Type...'
  },
  {
    name: 'ivf_remarks',
    type: 'textarea',
    label: 'Remarks',
    placeholder: 'Type...'
  }
];

const labelCss = 'ml-2 mb-2 text-gray-500 font-bold uppercase text-xs';

const medicationData = [
  {
    name: 'brand_name',
    type: 'text',
    label: 'Brand Name',
    placeholder: 'Type...'
  },
  {
    name: 'generic_name',
    type: 'text',
    label: 'Generic Name',
    placeholder: 'Type...'
  }
];
function Modal({
  data,
  isOpen,
  onClose,
  permission,
  moduleData,
  slug,
  selectedRowId,
  tabNumber,
  onSuccess,
  openId,
  onSetAlertMessage,
  onSetAlertType,
  patientData,
  children,
  onSelectMedicine,
  medicationRefetch,
  medicineRefetch,
  ...props
}) {
  const router = useRouter();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const context = useModalContext();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [activeTab, setActiveTab] = useState('tab1');
  const [deleteData] = useDeleteDataMutation();
  const handleClose = () => {
    context?.onClose();
    setSearchInput('');
    setSearchResults([]);
    // setCheckedItem([])
    // setFormData({})
  };
  const [btnSpinner, setBtnSpinner] = useState(false);

  const handleSubmitButton = (type) => {
    switch (type) {
      case 'tab1':
        formRef.current.handleSubmit('createNurseNote');
        break;
      case 'tab2':
        formRef.current.handleSubmit('createNurseIVF');
        break;
      case 'tab3':
        formRef.current.handleSubmit('createNurseMedication');
        break;
      case 'tab4':
        formRef.current.handleSubmit('createNurseVitalS');
        break;

      case 'publishPassword':
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    // e.preventDefault()
    if (slug === 'out-patient') {
      // console.log(formData)
    }

    if (slug === 'settings') {
      formRef.current.handleSubmit();
    }
  };

  useEffect(() => {
    if (searchInput) {
      debouncedFetchData(searchInput);
    } else {
      setSearchInput(null);
    }
  }, [searchInput]);
  // const { data: searchResults } = useSearchQuery({ keywords: searchQuery, model: "icd-codes" })
  const debouncedFetchData = debounce((searchQuery) => {
    setIsLoading(true);
    dispatch(
      searchApi.endpoints.search.initiate({
        keywords: searchQuery,
        model: context?.state.modalType
      })
    )
      .unwrap()
      .then((data) => {
        setSearchResults(data);
        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error)
      });
  }, 500);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleRemoveData = (data) => {
    if (data.slug === 'remove-row-medication') {
      deleteData({
        id: data.id,
        url: 'delete-patient-medication',
        actionType: 'deletePatientMedicationById'
      });
      medicationRefetch();
      medicineRefetch();
    }
  };

  const handleCallBackData = (data) => {
    if (data?.field === 'selectMedicine') {
      onSelectMedicine(data.data);
    } else if (data === 'backToList') {
      context?.onClick(data);
    } else if (data?.link === 'add-medicine') {
      context?.onSubmitData(data);
    }
  };

  return (
    <div
      className={`grid fixed p-10 right-0 left-0 z-50 pt-[4rem] w-full place-items-center ${context?.isOpen ? 'visible' : 'hidden'}`}
    >
      <div
        className={`fixed inset-0 p-4 w-full bg-black opacity-50 transition-opacity ${context?.isOpen ? 'visible' : 'hidden'}`}
      />
      <div className="relative p-4 w-full max-w-2xl">
        <div className=" bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t">
            {['icd10_code', 'popt_proc', 'oopt_proc'].includes(
              context?.state?.modalType
            ) && (
              <div className="relative">
                <input
                  type="text"
                  // value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e)}
                  className="border-none w-full px-2 py-1 rounded focus:outline-none text-sm flex-grow pl-10"
                  placeholder="Search..."
                />
                <svg
                  fill="none"
                  stroke="currentColor"
                  className="mx-2 h-6 w-4 text-sm text-gray-400 absolute top-1/2 transform -translate-y-1/2 left-1"
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
            )}

            {context?.state?.modalType === 'physician-order' && (
              <div className="px-2">
                <h5 class="inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400">
                  <svg
                    class="w-4 h-4 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  Doctor's Order
                </h5>
              </div>
            )}

            {context?.state?.modalType === 'nurses-notes' && (
              <div className="flex justify-items-center border-gray-300">
                <div className="rounded-tl-lg ml-3">
                  <button
                    onClick={() => setActiveTab('tab1')}
                    className={`${activeTab === 'tab1' ? 'bg-gray-200 rounded-md' : ''} hover:bg-gray-200 p-2 rounded-sm text-xs uppercase font-medium text-gray-500`}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('tab2')}
                    className={`${activeTab === 'tab2' ? 'bg-gray-200 rounded-md' : ''} hover:bg-gray-200 p-2 rounded-sm text-xs uppercase font-medium text-gray-500`}
                  >
                    IV Fluids
                  </button>
                  <button
                    onClick={() => setActiveTab('tab3')}
                    className={`${activeTab === 'tab3' ? 'bg-gray-200 rounded-md' : ''} hover:bg-gray-200 p-2 rounded-sm text-xs uppercase font-medium text-gray-500`}
                  >
                    Medication
                  </button>
                  <button
                    onClick={() => setActiveTab('tab4')}
                    className={`${activeTab === 'tab4' ? 'bg-gray-200 rounded-md' : ''} hover:bg-gray-200 p-2 rounded-sm text-xs uppercase font-medium text-gray-500`}
                  >
                    Vital Sign
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div
            className={`p-2 md:p-5 space-y-1 scroll-custom overflow-y-auto ${searchResults.length > 0 ? 'h-[30rem]' : ''}`}
          >
            {/* <div className="p-4 md:p-5 space-y-1 scroll-custom" style={{ height: `${contentHeight}px`, overflowY: 'auto' }}> */}
            {isLoading ? (
              <div className="p-10 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 animate-spin text-gray-400"
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
              </div>
            ) : searchResults.length > 0 ? (
              ['icd10_code', 'popt_proc', 'oopt_proc'].includes(
                context?.state.modalType
              ) &&
              searchResults.map((item, index) => (
                <div className="divide-dashed divide-y-2 divide-gray-300">
                  <div
                    key={item.id}
                    className="p-3 rounded bg-gray-50 cursor-pointer text-sm text-gray-500 hover:text-gray-800"
                    onClick={() =>
                      context?.onClickFromSearch({
                        modalState: false,
                        value: item,
                        type: context?.state.modalType,
                        clicked: true
                      })
                    }
                  >
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          context?.state.modalType === 'icd10_code'
                            ? `${item.icd10_code} &bull; ${item.icd10_desc}`
                            : context?.state.modalType === 'popt_proc'
                              ? `${item.proc_code} &bull; ${item.proc_desc}`
                              : context?.state.modalType === 'oopt_proc'
                                ? `${item.proc_code} &bull; ${item.proc_desc}`
                                : ''
                      }}
                    />
                  </div>
                  <div />
                </div>
              ))
            ) : context?.state?.modalType === 'physician-order' ? (
              <FormContext.Provider
                value={{
                  initialFields: doctorOrderField
                }}
              >
                <Form />
              </FormContext.Provider>
            ) : context?.state?.modalType === 'nurses-notes' ? (
              activeTab === 'tab1' ? (
                <FormContext.Provider
                  value={{
                    ref: formRef,
                    initialFields: nurseNoteField,
                    onLoading: (data) => context?.onLoading(data)
                  }}
                >
                  <Form />
                </FormContext.Provider>
              ) : activeTab === 'tab2' ? (
                <FormContext.Provider
                  value={{
                    ref: formRef,
                    initialFields: ivFluidField,
                    onLoading: (data) => context?.onLoading(data)
                  }}
                >
                  <Form />
                </FormContext.Provider>
              ) : activeTab === 'tab3' ? (
                <Medication />
              ) : activeTab === 'tab4' ? (
                <FormContext.Provider
                  value={{
                    ref: formRef,
                    initialFields: vitalSignField,
                    onLoading: (data) => context?.onLoading(data)
                  }}
                >
                  <Form />
                </FormContext.Provider>
              ) : (
                ''
              )
            ) : context?.state?.modalType === 'medication' ? (
              <ComponentContext.Provider
                value={{
                  onRemoveData: (data) => handleRemoveData(data)
                }}
              >
                <Medication />
              </ComponentContext.Provider>
            ) : context?.state?.modalType === 'publish' ? (
              <>
                <FormContext.Provider
                  value={{
                    ref: formRef,
                    initialFields: doctorPassword,
                    onLoading: (data) => context?.onLoading(data),
                    onSubmit: (data) => handleSubmitButton(data)
                  }}
                >
                  <Form />
                </FormContext.Provider>
                <div className="flex items-center justify-center gap-2 w-full">
                  <button
                    onClick={handleClose}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Back
                  </button>
                  <button
                    // onClick={() =>
                    //   handleOnClick({
                    //     type: 'submitParameter',
                    //     value: state?.selectedRow
                    //   })
                    // }
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Publish
                  </button>
                </div>
              </>
            ) : (
              <span>No Records Found</span>
            )}
          </div>
          <div className="flex items-center justify-end p-4 text-xs text-gray-400 border-t border-gray-300 rounded-b">
            {context?.state?.modalType === 'icd-codes' ||
              (context?.state?.modalType === 'opt-procedure' && (
                <span>ASB</span>
              ))}

            {context?.state?.modalType === 'nurses-notes' && (
              <button
                onClick={() => handleSubmitButton(activeTab)}
                className={`${context?.state?.btnSpinner ? 'bg-gray-300' : 'bg-emerald-500 hover:bg-emerald-600'} flex items-center text-white text-sm px-2 py-1 gap-2 rounded focus:outline-none`}
                disabled={context?.state?.btnSpinner}
              >
                {context?.state?.btnSpinner ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 animate-spin"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="32"
                      stroke-width="8"
                      stroke="currentColor"
                      strokeDasharray="50.26548245743669 50.26548245743669"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
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
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                )}
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
