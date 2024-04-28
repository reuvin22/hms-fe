import Form from '@/components/Form';
import Select from 'react-select';
import { ComponentContext, FormContext } from '@/utils/context';
import { generateSoapForms } from '@/utils/forms';
import React, { useState, useEffect, useRef } from 'react';
import HighlightWithinTextarea from 'react-highlight-within-textarea';
import DoctorRequest from './DoctorRequest';

function Soap({ onClick, physiciansOrder }) {
  const [formData, setFormData] = useState({
    soap_subj_symptoms: '',
    soap_obj_findings: '',
    soap_assessment: '',
    soap_plan: ''
  });
  const [patientInfo, setPatientInfo] = useState([]);
  const [leftItems, setLeftItems] = useState('');
  const [rightItems, setRightItems] = useState([]);
  const [otherRequest, setOtherRequest] = useState({});
  const [othersSelected, setOthersSelected] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const textAreaRef = useRef(null);
  const searchBarRef = useRef(null);

  const [subjectiveText, setSubjectiveText] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100; // assuming height is in centimeters
      const computedBMI = weight / (heightInMeters * heightInMeters);
      setBMI(computedBMI.toFixed(2)); // keep two decimal places
    } else {
      setBMI(null);
    }
  }, [height, weight]);

  useEffect(() => {
    if (formData) {
      const data = generateSoapForms(formData);
      setPatientInfo(data);
    }
  }, [formData]);

  const moveItemToRight = (id) => {
    const item = leftItems.find((item) => item.id === id);
    setLeftItems((prev) => prev.filter((item) => item.id !== id));
    setRightItems((prev) => [...prev, item]);
  };

  const moveItemToLeft = (id) => {
    const item = rightItems.find((item) => item.id === id);
    setRightItems((prev) => prev.filter((item) => item.id !== id));
    setLeftItems((prev) => [...prev, item]);
  };

  const handleOnClick = () => {
    onClick();
  };

  const highlightAll = (content) => content;
  const labelCss = 'ml-2 mb-2 text-gray-500 font-bold uppercase text-xs';

  const handleBlur = () => {
    searchBarRef.current.style.display = 'block';
  };

  const handleFocus = () => {
    searchBarRef.current.style.display = 'none';
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

  return (
    <div>
      {/* <div className="border-none overflow-hidden disable-selecting-text py-2 px-4"> */}
      <div>
        <div>
          <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">
            Doctors' Notes
          </h3>
          <hr className="drop-shadow-md pb-5" />
        </div>
        <div className="xl:pl-[23rem] xl:pr-[23rem] lg:pl-0 lg:pr-0 md:pl-0 md:pr-0 pb-7">
          <div className="grid grid-cols-1 relative">
            <label className=" text-gray-500 font-medium text-sm capitalize">
              Subjective Symptoms:{' '}
            </label>
            <Select
              // options={barangayData?.map(barangay => ({ value: barangay.code, label: barangay.name }))}
              // onChange={(e) => handleOnChange({type:"barangay", value: e?.value})}
              // onBlur={handleBlur}
              // isSearchable={true}
              // isClearable={true}
              // placeholder="Select Symptoms"
              // classNamePrefix="react-select"
              styles={styleDropdown({ isDisabled: false })}
              // value={barangayData?.filter(option => option.code === formData?.barangay).map(option => ({
              //     value: option.code,
              //     label: option.name
              // }))[0]}
            />
            {/* <textarea
                                ref={textAreaRef}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                type="text"
                                name="soap_subj_symptoms"
                                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
                                placeholder="Type..."
                            />
                            <button className="add-button absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                                Add
                            </button> 
                            <div ref={searchBarRef}  className="search-bar absolute top-8 right-2 w-64 p-2 hidden">
                                
                                {/* <input type="text" className="w-full" placeholder="Search..." /> 
                            </div> */}
          </div>
          {/* <FormContext.Provider value={{
                            initialFields: patientInfo,
                            enableAutoSave:true
                        }}>
                            <Form
                                onClick={handleOnClick} 
                            />
                        </FormContext.Provider> */}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default React.memo(Soap);
