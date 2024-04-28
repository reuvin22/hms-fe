import { useRouter } from 'next/router';
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  useContext,
  memo
} from 'react';
import {
  useCreateUserBatchMutation,
  useCreateBulkMutation
} from '@/service/settingService';
import { useGetPhysicianChargeQuery } from '@/service/patientService';
import Select from 'react-select';
import {
  useComponentContext,
  useFormContext,
  useModalContext
} from '@/utils/context';
import { generateInfoForms } from '@/utils/forms';
import Modal from './Modal';

const styleDropdown = {
  control: (provided) => ({
    ...provided,
    // border: '1px solid gray',
    margin: 0,
    padding: 0,
    boxShadow: 'none',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    backgroundColor: 'rgb(243 244 246)',
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
};

const dispositionArray = [
  { name: 'improved', label: 'Improved' },
  { name: 'unimproved', label: 'Unimproved' },
  { name: 'transferred', label: 'Transferred' },
  { name: 'hama', label: 'HAMA' },
  { name: 'absconded', label: 'Absconded' },
  { name: 'expired', label: 'Expired' },
  { name: 'u48h', label: 'under 48 hours', parent: 'expired' },
  { name: 'm48h', label: 'more than 48 hours', parent: 'expired' }
];

const Form = forwardRef(
  ({ initialFields = [], loginBtn, onClick, style }, ref) => {
    const modalContext = useModalContext();
    const context = useFormContext();
    const componentContext = useComponentContext();
    const router = useRouter();
    const [formData, setFormData] = useState([]);
    const [idCounter, setIdCounter] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [updatedFormData, setUpdatedFormData] = useState([]);

    const [alertType, setAlertType] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState([]);
    const [resetFormTimer, setResetFormTimer] = useState(false);

    const [
      createBulk,
      {
        isLoading: createBulkLoading,
        isError,
        error,
        isSuccess: createUserSuccess
      }
    ] = useCreateBulkMutation();

    const { data: physicianChargeMaster } = useGetPhysicianChargeQuery();

    // console.log(modalContext?.state?.profileData.patient_id)

    useImperativeHandle(context?.ref, () => ({
      handleSubmit: (actionType) => handleSubmit(actionType),
      handleAddRow
    }));

    useEffect(() => {
      setFormData([
        {
          id: `_${Date.now()}${Math.random()}`,
          patientId: modalContext?.state?.profileData.patient_id || '',
          fields: context?.initialFields.reduce(
            (acc, field) => ({
              ...acc,
              [field.name]: ''
            }),
            {}
          )
        }
      ]);

      let timer;
      if (resetFormTimer) {
        timer = setTimeout(() => {
          context?.onCloseSlider?.();
          handleResetForm();
          setResetFormTimer(false);
        }, 500);
      }

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [resetFormTimer, context?.data]);

    const calculatedAge = (birthdate) => {
      const birthDate = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const calculateBMI = (ht, wt) => {
      if (ht && wt) {
        const heightInMeters = ht / 100; // assuming height is in centimeters
        const computedBMI = wt / (heightInMeters * heightInMeters);
        return computedBMI.toFixed(2);
      }
      return null;
    };

    // console.log(formData)

    const handleInputChange = useCallback(
      (e, rowIndex, fieldName) => {
        setFormData((prev) => {
          const updatedRow = { ...prev[rowIndex] };
          const updatedFields = { ...updatedRow.fields };
          if (fieldName === 'birth_date') {
            const age = calculatedAge(e.target.value);
            updatedFields.age = age;
            updatedFields.birth_date = e.target.value;
          } else if (fieldName === 'vs_height' || fieldName === 'vs_weight') {
            const ht = updatedFields.vs_height || '';
            const wt = updatedFields.vs_weight || '';
            const calculatedBMI = calculateBMI(ht, wt);
            updatedFields.vs_bmi = calculatedBMI || '';
            updatedFields[fieldName] = e.target.value;
          } else if (fieldName === 'admitting_physician') {
            updatedFields[fieldName] = e?.value;
            updatedFields.standard_charge = physicianChargeMaster?.find(
              (charge) => charge.doctor_id === e?.value
            )?.standard_charge;
          } else if (
            [
              'gender',
              'roles',
              'bed',
              'bed_type',
              'bed_group',
              'bed_floor',
              'charge_type',
              'charge_category',
              'doctor_id',
              'doctor_er',
              'patho_category_id',
              'patho_param_id',
              'radio_cat_id'
            ].includes(fieldName)
          ) {
            updatedFields[fieldName] = e?.value;
          } else if (fieldName === 'province') {
            updatedFields.province = e?.value;
            context?.onSelectedProvince(e?.value);
          } else if (fieldName === 'municipality') {
            updatedFields.municipality = e?.value;
            context?.onSelectedMunicipality(e?.value);
          } else if (fieldName === 'barangay') {
            updatedFields.barangay = e?.value;
          } else if (fieldName === 'appointment_color') {
            updatedFields.appointment_color = e?.value;
          } else if (e.target) {
            const { value, type, checked } = e?.target;
            const fieldValue = type === 'checkbox' ? checked : value;
            updatedFields[fieldName] = fieldValue;
          }
          updatedRow.fields = updatedFields;
          return [
            ...prev.slice(0, rowIndex),
            updatedRow,
            ...prev.slice(rowIndex + 1)
          ];
        });
      },
      [physicianChargeMaster]
    );

    const handleResetForm = () => {
      setFormData([
        {
          id: `_${Date.now()}${Math.random()}`,
          fields: context?.initialFields.reduce(
            (acc, field) => ({
              ...acc,
              [field.name]: ''
            }),
            {}
          )
        }
      ]);
    };

    const handleAlertClose = () => {
      setAlertType('');
      setAlertMessage([]);
      setAlertOpen(false);
    };

    const handleAddRow = () => {
      const newRow = { ...context?.initialFields[0], id: idCounter };
      setFormData((prev) => [...prev, { id: idCounter + 1, fields: [] }]);
      setIdCounter((prevCount) => prevCount + 1);
    };

    const handleRemoveRow = (rowIndex) => {
      setFormData((prev) => prev.filter((_, index) => index !== rowIndex));
    };

    const handleSubmit = (actionType) => {
      createBulk({ actionType, data: formData })
        .unwrap()
        .then((response) => {
          if (response.status === 'success') {
            context.onLoading(true);
            setResetFormTimer(true);
            context.onSuccess(1);
          }
        })
        .catch((error) => {
          if (error.status === 500) {
            console.log(error);
            context?.onAlert({ msg: 'Unsuccessfull', type: 'error' });
            // onSetAlertType("error")
            // onSetAlertMessage("Unsuccessful")
            // setAlertMessage("Unsuccessful")
            // setAlertOpen(true)
          }
        });
    };

    const handleOnClick = (data) => {
      if (data.action === 'clickedFas') {
        onClick();
      } else if (data.action === 'clickedModal') {
        setModalOpen(true);
        context?.onModalOpen(data);
      } else {
      }
    };

    const renderForm = (row, rowIndex) =>
      context?.initialFields?.map((field, index) => (
        <div key={field.name}>
          {field.name === 'soap_subj_symptoms' &&
            field.category === 'with_modal' && (
              <div>
                <div className="flex justify-center gap-4 py-6">
                  <div className="pt-2">
                    <h3 className="text-gray-400 text-center font-bold uppercase text-medium">
                      Doctor's Notes
                    </h3>
                  </div>
                  <div>
                    <button
                      onClick={() => handleOnClick({ action: 'clickedFas' })}
                      title="Doctor Request's"
                      className="fixed p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg focus:outline-none"
                    >
                      <svg
                        fill="#ffffff"
                        height={20}
                        width={20}
                        version="1.1"
                        id="Capa_1"
                        viewBox="0 0 201.324 201.324"
                        transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
                        stroke="#ffffff"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          stroke="#CCCCCC"
                          strokeWidth="0.805296"
                        />
                        <g id="SVGRepo_iconCarrier">
                          {' '}
                          <circle cx="95.596" cy="10.083" r="10.083" />{' '}
                          <circle cx="149.018" cy="10.083" r="10.083" />
                          <path d="M179.06,19.254c-5.123-8.873-14.298-14.17-24.544-14.17v10c6.631,0,12.568,3.428,15.884,9.17 c3.316,5.743,3.316,12.599,0.001,18.342l-32.122,55.636c-3.315,5.742-9.253,9.17-15.884,9.171c-6.631,0-12.569-3.428-15.885-9.171 L74.389,42.595c-3.315-5.742-3.315-12.599,0-18.341s9.254-9.171,15.885-9.171v-10c-10.246,0-19.422,5.297-24.545,14.171 s-5.123,19.468,0,28.341l32.121,55.636c4.272,7.399,11.366,12.299,19.545,13.727v26.832c0,26.211-15.473,47.535-34.492,47.535 c-19.019,0-34.491-21.324-34.491-47.535v-31.948C59.802,109.52,68.4,99.424,68.4,87.356c0-13.779-11.21-24.989-24.989-24.989 s-24.989,11.21-24.989,24.989c0,12.067,8.598,22.163,19.989,24.486v31.948c0,31.725,19.959,57.535,44.492,57.535 c24.532,0,44.491-25.81,44.491-57.535v-26.832c8.178-1.428,15.273-6.328,19.544-13.727l32.122-55.636 C184.184,38.722,184.184,28.127,179.06,19.254z" />
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
                <hr className="drop-shadow-md py-6" />
              </div>
            )}

          {field.type === 'text' && !field.disabled && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className=" text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}
              </label>
              <input
                required
                type={field.type}
                id={field.name}
                name={field.name}
                value={row.fields[field.name]}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                onClick={
                  field.category === 'with_modal'
                    ? () =>
                        handleOnClick({
                          action: 'clickedModal',
                          field,
                          modalState: true
                        })
                    : undefined
                }
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder={field.placeholder}
              />
            </div>
          )}

          {field.type === 'text' && field.disabled && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className="block text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}
              </label>
              <input
                required
                type={field.type}
                id={field.name}
                name={field.name}
                value={row.fields[field.name]}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                className=" bg-gray-200 px-3 py-2 text-sm focus:outline-none w-full cursor-not-allowed"
                placeholder={field.placeholder}
                disabled
              />
            </div>
          )}

          {field.type === 'datetime-local' && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className="block text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}
              </label>
              <input
                required
                type={field.type}
                id={field.name}
                name={field.name}
                value={row.fields[field.name]}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                className=" border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder={field.placeholder}
              />
            </div>
          )}

          {field.type === 'password' && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className="block text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}
              </label>
              <input
                required
                type={field.type}
                id={field.name}
                name={field.name}
                value={row.fields[field.name]}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder={field.placeholder}
              />
            </div>
          )}

          {field.type === 'email' && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className="block text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}
              </label>
              <input
                required
                type={field.type}
                id={field.name}
                name={field.name}
                value={row.fields[field.name]}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder={field.placeholder}
              />
            </div>
          )}

          {field.type === 'date' && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className="block text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}
              </label>
              <input
                required
                type={field.type}
                id={field.name}
                name={field.name}
                value={row.fields[field.name]}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none"
                placeholder={field.placeholder}
              />
            </div>
          )}

          {field.type === 'number' && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className="block text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}
              </label>
              <input
                required
                type={field.type}
                id={field.name}
                name={field.name}
                value={row.fields[field.name]}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder={field.placeholder}
              />
            </div>
          )}

          {field.type === 'dropdown' && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className="block text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}:
              </label>
              <Select
                options={field.options?.map((option) => ({
                  value: option.value,
                  label: option.label,
                  isDisabled: option.isDisabled,
                  isUser: option.isUser
                }))}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                isSearchable
                isClearable
                placeholder={`Select ${field.label.toLowerCase()}...`}
                classNamePrefix=""
                styles={styleDropdown}
                value={field.options?.find(
                  (option) => option.value === row.fields[field.name]
                )}
                getOptionLabel={(option) => (
                  <div className="">
                    {option.isDisabled ? (
                      <p className="text-sm text-red-500 cursor-not-allowed ">
                        {option.label} (not available)
                      </p>
                    ) : (
                      option.label
                    )}
                  </div>
                )}
              />
            </div>
          )}

          {field.type === 'textarea' && (
            <div className="grid grid-cols-1">
              <label
                htmlFor={field.name}
                className="block text-gray-500 font-medium text-sm capitalize"
              >
                {field.label}:
              </label>
              <textarea
                required
                type={field.type}
                id={field.name}
                name={field.name}
                value={row.fields[field.name]}
                onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
                placeholder={field.placeholder}
              />
            </div>
          )}
        </div>
      ));

    return (
      <div className="tab-content px-4">
        <form onSubmit={handleSubmit}>
          {/* <form> */}
          {formData?.map((row, rowIndex) => (
            <div>
              <div
                className={`${context.enableAddRow ? 'bg-white border border-gray-300 rounded py-5' : ''}`}
              >
                <div key={row.id} className="flex gap-4">
                  <div className="md:flex md:flex-col  w-full gap-4">
                    {context?.state !== null ? (
                      <div>
                        <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-3">
                          {context?.title}
                        </h3>
                        <hr className="drop-shadow-md pb-5" />
                      </div>
                    ) : (
                      ''
                    )}
                    {renderForm(row, rowIndex)}
                  </div>

                  {formData?.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(rowIndex)}
                      className="static w-10  hover:bg-gray-200 rounded-md px-2 min-h-full focus:outline-none text-[#cb4949] "
                    >
                      <svg
                        fill="none"
                        className="h-6 w-6"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <br />
            </div>
          ))}

          {loginBtn && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          )}
        </form>
      </div>
    );
  }
);

export default Form;
