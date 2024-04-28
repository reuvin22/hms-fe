import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useFormContext } from '@/utils/context';
import { useCreateBulkMutation } from '@/service/settingService';
import Button from '@/components/Button';
import Alert from '@/components/Alert';

const AboutUs = ({ slug }) => {
  const formRef = useRef();
  const formContext = useFormContext();
  const [btnSpinner, setBtnSpinner] = useState(false);
  const provinceData = formContext?.state?.provinceData;
  const cityData = formContext?.state?.cityData;
  const municipalityData = formContext?.state?.municipalityData;
  const barangayData = formContext?.state?.barangayData;
  const formData = formContext?.state?.formData;
  const setFormData = formContext?.state?.setFormData;
  const setActiveContent = formContext?.state?.setActiveContent;
  const aboutUsRefetch = formContext?.state?.aboutUsRefetch;
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const [resetFormTimer, setResetFormTimer] = useState(false);

  const [isDisabled, setIsDisabled] = useState({
    selectedCity: false,
    selectedMunicipality: false
  });

  const [createBulk] = useCreateBulkMutation();

  const handleResetForm = () => {
    setFormData({
      hci_name: '',
      accreditation_no: '',
      postal_code: '',
      street: '',
      blk: ''
    });
  };

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
    createBulk({ actionType: 'createAboutUs', data: formData })
      .unwrap()
      .then((response) => {
        if (response.status === 'success') {
          formContext.onLoading(true);
          setBtnSpinner(true);
          aboutUsRefetch();
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

  const handleOnChange = (data) => {
    const city_name = cityData?.find(
      (option) => option.code === formData?.city
    )?.name;
    const municipality_name = municipalityData?.find(
      (option) => option.code === formData?.municipality
    )?.name;
    const province_name = provinceData?.find(
      (option) => option.code === formData?.province
    )?.name;

    setFormData((prev) => ({
      ...prev,
      province_name: province_name,
      municipality_name: municipality_name,
      city_name: city_name
    }));
    switch (data.type) {
      case 'province':
        setFormData((prev) => ({
          ...prev,
          province: data.value,
          city_of: '',
          municipality: ''
        }));
        formContext?.onChange({ type: 'province', value: data.value });
        setIsDisabled({
          selectedCity: false,
          selectedMunicipality: false
        });
        break;

      case 'city_of':
        setFormData((prev) => ({
          ...prev,
          city: data.value,
          city_name: cityData?.find((option) => option.code === data.value)
            ?.name,
          municipality: ''
        }));
        formContext?.onChange({
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
        setFormData((prev) => ({
          ...prev,
          municipality: data.value,
          municipality_name: municipalityData?.find(
            (option) => option.code === data.value
          )?.name,
          city_of: '',
          barangay: ''
        }));
        formContext?.onChange({
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
        setFormData((prev) => ({
          ...prev,
          barangay: data.value,
          barangay_name: barangayData?.find(
            (option) => option.code === data.value
          )?.name
        }));
        break;

      default:
        break;
    }
  };

  const styleDropdown = ({ isDisabled = false }) => {
    return {
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
    };
  };

  console.log(formData);
  const renderForm = () => {
    return (
      <div>
        <div>
          <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">
            About Us
          </h3>
          <hr className="drop-shadow-md pb-5" />
        </div>
        <h1>{formContext?.state?.handle}</h1>
        <div className="xl:mr-[25rem] lg:pl-0 lg:pr-0 md:pl-0 md:pr-0 sm:pl-0 sm:pr-0 space-y-5 w-full">
          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              Name of HCI:{' '}
            </label>
            <input
              type="text"
              name="hci_name"
              value={formData.hci_name}
              onChange={handleInput}
              // onBlur={handleBlur}
              className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
              placeholder="Enter HCI Name"
            />
          </div>
          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              Accreditation Number:{' '}
            </label>
            <input
              type="text"
              name="accreditation_no"
              value={formData.accreditation_no}
              onChange={handleInput}
              // onBlur={handleBlur}
              className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
              placeholder="Enter Accreditation Number"
            />
          </div>
          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              Province:{' '}
            </label>
            <Select
              name="province"
              key={resetFormTimer}
              options={provinceData?.map((province) => ({
                value: province.code,
                label: province.name
              }))}
              onChange={(e) =>
                handleOnChange({ type: 'province', value: e?.value })
              }
              // onBlur={handleBlur}
              isSearchable={true}
              isClearable={true}
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
          </div>
          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              City:{' '}
            </label>
            <Select
              name="city"
              key={resetFormTimer}
              options={cityData?.map((province) => ({
                value: province.code,
                label: province.name
              }))}
              onChange={(e) =>
                handleOnChange({ type: 'city_of', value: e?.value })
              }
              isSearchable={true}
              isClearable={true}
              placeholder="Select City"
              classNamePrefix="react-select"
              isDisabled={
                !!isDisabled.selectedCity || formData?.municipality !== ''
              }
              styles={styleDropdown({ isDisabled: false })}
              value={
                cityData
                  ?.filter((option) => option.code === formData?.city_of)
                  .map((option) => ({
                    value: option.code,
                    label: option.name
                  }))[0]
              }
              // value={provinceData?.find(option => option.code === formData.province)?.name}
            />
          </div>
          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              Municipality:{' '}
            </label>
            <Select
              name="municipality"
              key={resetFormTimer}
              options={municipalityData?.map((municipality) => ({
                value: municipality.code,
                label: municipality.name
              }))}
              onChange={(e) =>
                handleOnChange({ type: 'municipality', value: e?.value })
              }
              isSearchable={true}
              isClearable={true}
              placeholder="Select Municipality"
              classNamePrefix="react-select"
              styles={styleDropdown({ isDisabled: false })}
              isDisabled={
                !!isDisabled.selectedMunicipality || formData?.city_of !== ''
              }
              value={
                municipalityData
                  ?.filter((option) => option.code === formData?.municipality)
                  .map((option) => ({
                    value: option.code,
                    label: option.name
                  }))[0]
              }
              // value={provinceData?.find(option => option.code === formData.province)?.name}
            />
          </div>
          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              Barangay:{' '}
            </label>
            <Select
              key={resetFormTimer}
              name="barangay"
              options={barangayData?.map((barangay) => ({
                value: barangay.code,
                label: barangay.name
              }))}
              onChange={(e) =>
                handleOnChange({ type: 'barangay', value: e?.value })
              }
              isSearchable={true}
              isClearable={true}
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
          </div>

          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              Street:{' '}
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInput}
              // onBlur={handleBlur}
              className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
              placeholder="Enter Street"
            />
          </div>
          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              No/Blk/Lot:{' '}
            </label>
            <input
              type="text"
              name="blk"
              value={formData.blk}
              onChange={handleInput}
              // onBlur={handleBlur}
              className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
              placeholder="Enter No/Blk/Lot"
            />
          </div>
          <div className="grid grid-cols-1">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              Postal Code:{' '}
            </label>
            <input
              type="number"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInput}
              // onBlur={handleBlur}
              className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
              placeholder="Enter Postal Code"
            />
          </div>
        </div>
      </div>
    );
  };
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
};

export default AboutUs;
