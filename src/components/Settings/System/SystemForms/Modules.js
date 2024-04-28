import React, { useState, useEffect, useRef, useContext } from 'react';
import Select from 'react-select';
import { ComponentContext, useFormContext } from '@/utils/context';
import { useCreateBulkMutation } from '@/service/settingService';
import Button from '@/components/Button';
import { data } from 'node_modules/autoprefixer/lib/autoprefixer';
import Alert from '@/components/Alert';

function Modules({ slug }) {
  const formRef = useRef();
  const formContext = useFormContext();
  const [btnSpinner, setBtnSpinner] = useState(false);
  const formData = formContext?.state?.formData;
  const setFormData = formContext?.state?.setFormData;
  const setActiveContent = formContext?.state?.setActiveContent;
  const modulesRefetch = formContext?.state?.modulesRefetchRefetch;
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const [resetFormTimer, setResetFormTimer] = useState(false);

  const [createBulk] = useCreateBulkMutation();

  const handleResetForm = () => {
    setFormData({
      module_name: ''
    });
  };

  console.log(formData);
  useEffect(() => {
    let spinnerTimer;
    let timer;

    if (resetFormTimer) {
      timer = setTimeout(() => {
        formContext?.onCloseSlider?.();
        setResetFormTimer(false);
      }, 500);
    }

    if (btnSpinner) {
      spinnerTimer = setTimeout(() => {
        setBtnSpinner(false);
      }, 500);
    }

    return () => {
      if (spinnerTimer) {
        clearTimeout(spinnerTimer);
      }

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [btnSpinner, resetFormTimer]);

  const handleSubmit = () => {
    createBulk({ actionType: 'createModule', data: formData })
      .unwrap()
      .then((response) => {
        if (response.status === 'success') {
          formContext.onLoading(true);
          setBtnSpinner(true);
          modulesRefetch();
          handleResetForm();
          setResetFormTimer(true);
        }
      })
      .catch((error) => {
        if (error.status === 500) {
          console.log(error);
          formContext?.onAlert({ msg: 'Unsuccessfull', type: 'error' });
        }
      });
  };

  const handleItemsPerPageChange = (item) => {
    setItemsPerPage(item);
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
  };

  const handleExportToPDF = () => {};

  const handleActiveTab = (id) => {
    // tblRef.current.handleOnClick({type: 'clickedRow', value: userDetailById})
    setActiveTab(id);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleClose = () => {
    handleResetForm();
    setActiveContent('yellow');
    formContext.onLoading(true);
  };

  const handleAlertClose = () => {
    setAlertType('');
    setAlertMessage([]);
    setAlertOpen(false);
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

  console.log(formData);
  const renderForm = () => (
    <div>
      <div>
        <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">
          Modules
        </h3>
        <hr className="drop-shadow-md pb-5" />
      </div>
      <h1>{formContext?.state?.handle}</h1>
      <div className="xl:mr-[25rem] lg:pl-0 lg:pr-0 md:pl-0 md:pr-0 sm:pl-0 sm:pr-0 space-y-5 w-full">
        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm capitalize">
            Name of Module:{' '}
          </label>
          <input
            type="text"
            name="module_name"
            value={formData.module_name_name}
            onChange={handleInput}
            // onBlur={handleBlur}
            className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
            placeholder="Enter Module Name"
          />
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div className="flex justify-between py-1 px-4">
        <Button paddingY="2" btnIcon="close" onClick={() => handleClose()}>
          Close
        </Button>

        <div className="flex gap-2">
          <Button
            bgColor={btnSpinner ? 'disable' : 'emerald'}
            btnIcon={btnSpinner ? 'disable' : 'submit'}
            btnLoading={btnSpinner}
            onClick={() => handleSubmit()}
          >
            {btnSpinner ? '' : 'Submit'}
          </Button>
        </div>
      </div>

      {alertMessage && (
        <Alert
          alertType={alertType}
          isOpen={alertType !== ''}
          onClose={handleAlertClose}
          message={alertMessage}
        />
      )}
      <form onSubmit={handleSubmit}>{renderForm()}</form>
    </div>
  );
}

export default Modules;
