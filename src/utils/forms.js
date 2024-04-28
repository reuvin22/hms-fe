export const userRegistration = (designationList) => {
  const designationOptions = designationList?.map((position) => ({
    value: position.id,
    label: position.pos_desc
  }));

  return [
    {
      name: 'first_name',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter First Name'
    },
    {
      name: 'last_name',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Enter Last Name'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter email'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter password'
    },
    {
      name: 'roles',
      type: 'dropdown',
      label: 'Roles',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
      ]
    },
    {
      name: 'designation',
      type: 'dropdown',
      label: 'Designation',
      options: designationOptions
    }
  ];
};

export const generateOpdForms = (physicianList) => {
  const phyisicianOptions = physicianList?.map((ph) => ({
    value: ph.user_id,
    label: `Dr. ${ph.identity?.first_name} ${ph.identity?.last_name}`
  }));

  return [
    {
      name: 'last_name',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Type...'
    },
    {
      name: 'first_name',
      type: 'text',
      label: 'Given Name',
      placeholder: 'Type...'
    },
    {
      name: 'middle_name',
      type: 'text',
      label: 'Middle Name',
      placeholder: 'Type...'
    },
    { name: 'birth_date', type: 'date', label: 'Birthdate' },
    { name: 'age', type: 'text', value: null, label: 'Age', disabled: true },
    {
      name: 'gender',
      type: 'dropdown',
      label: 'Gender',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]
    },
    {
      name: 'admitting_physician',
      type: 'dropdown',
      label: 'Physician',
      options: phyisicianOptions
    },
    {
      name: 'standard_charge',
      type: 'text',
      value: null,
      label: 'Standard Charge',
      disabled: true
    }
  ];
};

export const generateErForms = (physicianList, activeBedList) => {
  const isBedAvailable = (bed) => !bed.is_active;

  const physicOptions = physicianList?.map((ph) => ({
    value: ph.user_id,
    label: `Dr. ${ph.identity?.first_name} ${ph.identity?.last_name}`
  }));

  const bedOptions = activeBedList?.map((bed) => ({
    value: bed.id,
    label: `${bed.name} • ${bed.bed_group?.name} • ${bed.bed_group?.bed_floor?.floor}`,
    isDisabled: isBedAvailable(bed)
  }));

  return [
    {
      name: 'last_name',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Type...'
    },
    {
      name: 'first_name',
      type: 'text',
      label: 'Given Name',
      placeholder: 'Type...'
    },
    {
      name: 'middle_name',
      type: 'text',
      label: 'Middle Name',
      placeholder: 'Type...'
    },
    {
      name: 'bed',
      type: 'dropdown',
      label: 'Bed',
      options: bedOptions
    },
    { name: 'birth_date', type: 'date', label: 'Birthdate' },
    { name: 'age', type: 'text', label: 'Age', disabled: true },
    {
      name: 'gender',
      type: 'dropdown',
      label: 'Gender',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]
    },
    {
      name: 'admitting_physician',
      type: 'dropdown',
      label: 'Physician',
      options: physicOptions
    },
    {
      name: 'standard_charge',
      type: 'text',
      label: 'Standard Charge',
      disabled: true
    },
    { name: 'chief_complain', type: 'textarea', label: 'Chief Complain' }
  ];
};

export const generateIpdForms = (physicianList, activeBedList) => {
  const isBedAvailable = (bed) => !bed.is_active;

  const physicOptions = physicianList?.map((ph) => ({
    value: ph.user_id,
    label: `Dr. ${ph.identity?.first_name} ${ph.identity?.last_name}`
  }));

  const bedOptions = activeBedList?.map((bed) => ({
    value: bed.id,
    label: `${bed.name} • ${bed.bed_group?.name} • ${bed.bed_group?.bed_floor?.floor}`,
    isDisabled: isBedAvailable(bed)
  }));

  // console.log(activeBedList)

  return [
    {
      name: 'last_name',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Type...'
    },
    {
      name: 'first_name',
      type: 'text',
      label: 'Given Name',
      placeholder: 'Type...'
    },
    {
      name: 'middle_name',
      type: 'text',
      label: 'Middle Name',
      placeholder: 'Type...'
    },
    {
      name: 'bed',
      type: 'dropdown',
      label: 'Bed',
      options: bedOptions
    },
    { name: 'birth_date', type: 'date', label: 'Birthdate' },
    { name: 'age', type: 'text', label: 'Age', disabled: true },
    {
      name: 'gender',
      type: 'dropdown',
      label: 'Gender',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]
    },
    {
      name: 'admitting_physician',
      type: 'dropdown',
      label: 'Physician',
      options: physicOptions
    },
    {
      name: 'standard_charge',
      type: 'text',
      label: 'Standard Charge',
      disabled: true
    }
  ];
};

export const generateInfoForms = (
  data,
  province,
  municipality,
  barangay /* icd10code */
) => {
  // console.log(province)
  const provOptions = province?.map((data) => ({
    label: data.name,
    value: data.code
  }));

  const municipalOptions = municipality?.map((data) => ({
    label: data.name,
    value: data.code
  }));

  const brgyOptions = barangay?.map((data) => ({
    label: data.name,
    value: data.code
  }));

  // const icd10CodeOptions = icd10code?.map(data => ({
  //     label: `${icd.icd10_code} ${icd.icd10_desc}`,
  //     value: data.icd10_code
  // }))

  return [
    // #######################################################################################################################
    {
      name: 'last_name',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Type...'
    },
    {
      name: 'first_name',
      type: 'text',
      label: 'Given Name',
      placeholder: 'Type...'
    },
    {
      name: 'middle_name',
      type: 'text',
      label: 'Middle Name',
      placeholder: 'Type...'
    },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Type...' },
    { name: 'birth_date', type: 'date', label: 'Birthdate' },
    {
      name: 'birth_place',
      type: 'text',
      label: 'Birth Place',
      placeholder: 'Type...'
    },
    {
      name: 'gender',
      type: 'dropdown',
      label: 'Gender',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]
    },
    {
      name: 'civil_status',
      type: 'dropdown',
      label: 'Civil Status',
      options: [
        { value: 's', label: 'Single' },
        { value: 'm', label: 'Married' },
        { value: 'sep', label: 'Separated' },
        { value: 'w', label: 'Widow' }
      ]
    },
    { name: 'contact_no', type: 'number', label: 'Contact No' },
    { name: 'age', type: 'text', label: 'Age', disabled: true },
    {
      name: 'province',
      type: 'dropdown',
      label: 'Province',
      options: provOptions
    },
    {
      name: 'municipality',
      type: 'dropdown',
      label: 'Municipality',
      options: municipalOptions
    },
    {
      name: 'barangay',
      type: 'dropdown',
      label: 'Barangay',
      options: brgyOptions
    },

    { name: 'street', type: 'text', label: 'Street', placeholder: 'Type...' },
    {
      name: 'no_blk_lot',
      type: 'number',
      label: 'No/Blk/Lot',
      placeholder: 'Type...'
    },
    {
      name: 'nationality',
      type: 'text',
      label: 'Nationality',
      placeholder: 'Type...'
    },
    {
      name: 'religion',
      type: 'text',
      label: 'Religion',
      placeholder: 'Type...'
    },
    // employer details
    // {name: 'occupation', type: 'text', value: formData.occupation, label: 'Occupation', placeholder: 'Type...'},
    // {name: 'employer_name', type: 'text', value: formData.employer_name, label: 'Employer', placeholder: 'Type...'},
    // {name: 'employer_address', type: 'text', value: formData.employer_address, label: 'Employer Address', placeholder: 'Type...'},
    // {name: 'employer_contact', type: 'number', value: formData.contact, label: 'Employer Contact', placeholder: 'Type...'},
    // family details
    {
      name: 'father_name',
      type: 'text',
      label: 'Father Name',
      placeholder: 'Type...'
    },
    {
      name: 'father_address',
      type: 'text',
      label: 'Father Address',
      placeholder: 'Type...'
    },
    {
      name: 'father_contact',
      type: 'text',
      label: 'Father Contact',
      placeholder: 'Type...'
    },
    {
      name: 'mother_name',
      type: 'text',
      label: 'Mother Name',
      placeholder: 'Type...'
    },
    {
      name: 'mother_address',
      type: 'text',
      label: 'Mother Address',
      placeholder: 'Type...'
    },
    {
      name: 'mother_contact',
      type: 'text',
      label: 'Mother Contact',
      placeholder: 'Type...'
    },
    {
      name: 'spouse_name',
      type: 'text',
      label: 'Spouse Name',
      placeholder: 'Type...'
    },
    {
      name: 'spouse_address',
      type: 'text',
      label: 'Spouse Address',
      placeholder: 'Type...'
    },
    {
      name: 'spouse_contact',
      type: 'text',
      label: 'Spouse Contact',
      placeholder: 'Type...'
    },

    // patient details
    { name: 'admission_date', type: 'date', label: 'Admission Date | Time' },
    { name: 'discharge_date', type: 'date', label: 'Discharge Date | Time' },
    {
      name: 'total_no_day',
      type: 'text',
      label: 'Total No of Day',
      disabled: true
    },
    {
      name: 'admitting_physician',
      type: 'text',
      label: 'Admitting Physician',
      disabled: true
    },
    {
      name: 'admitting_clerk',
      type: 'text',
      label: 'Admitting Clerk',
      disabled: true
    },
    {
      name: 'type_visit',
      type: 'text',
      label: 'Type of Admission',
      disabled: true
    },
    {
      name: 'referred_by',
      type: 'text',
      label: 'Referred By (Physician/Health Facility)',
      placeholder: 'Type...'
    },
    {
      name: 'soc_serv_classification',
      type: 'checkbox',
      category: 'socserv',
      label: 'Social Service Classification'
    },
    {
      name: 'allergic_to',
      type: 'text',
      label: 'Allergic To',
      placeholder: 'Type..'
    },
    {
      name: 'hospitalization_plan',
      type: 'text',
      label: 'Hospitalization Plan',
      placeholder: 'Type..'
    },
    {
      name: 'health_insurance_name',
      type: 'text',
      label: 'Health Insurance Name',
      placeholder: 'Type..'
    },
    { name: 'phic', type: 'checkbox', category: 'phic', label: 'PHIC' },
    {
      name: 'data_furnished_by',
      type: 'text',
      label: 'Data Furnished By',
      disabled: true
    },
    {
      name: 'address_of_informant',
      type: 'text',
      label: 'Address of Informant',
      placeholder: 'Type..'
    },
    {
      name: 'relation_to_patient',
      type: 'text',
      label: 'Relation to Patient',
      placeholder: 'Type..'
    },

    // other patient details
    {
      name: 'admission_diagnosis',
      type: 'textarea',
      label: 'Admission Diagnosis',
      placeholder: 'Type...'
    },
    {
      name: 'discharge_diagnosis',
      type: 'textarea',
      label: 'Discharge Diagnosis',
      placeholder: 'Type Principal Diagnosis/Other Diagnosis'
    },
    {
      name: 'principal_opt_proc',
      type: 'text',
      category: 'with_modal',
      modal_type: 'opt-procedure',
      label: 'Principal Operation/Procedures',
      placeholder: 'Click to search...'
    },
    {
      name: 'other_opt_proc',
      type: 'text',
      category: 'with_modal',
      modal_type: 'opt-procedure',
      label: 'Other Operation/Procedures',
      placeholder: 'Click to search...'
    },
    {
      name: 'accident_injury_poison',
      type: 'textarea',
      label: 'Accident/Injuries/Poisoning',
      placeholder: 'Type...'
    },
    {
      name: 'icdo10_code',
      type: 'text',
      category: 'with_modal',
      modal_type: 'icd-codes',
      label: 'ICD/RUV CODE',
      placeholder: 'Click to search...'
    },
    {
      name: 'disposition',
      type: 'checkbox',
      category: 'disposition',
      label: 'Disposition'
    }
  ];
};

export const generateSoapForms = (formData) => [
  {
    name: 'soap_subj_symptoms',
    type: 'textarea',
    category: 'with_modal',
    label: 'Subjective Symptoms',
    placeholder: 'Type...'
  },
  {
    name: 'soap_obj_findings',
    type: 'textarea',
    label: 'Objective Findings',
    placeholder: 'Type...'
  },
  {
    name: 'soap_assessment',
    type: 'textarea',
    label: 'Assessment',
    placeholder: 'Type...'
  },
  { name: 'soap_plan', type: 'textarea', label: 'Plan', placeholder: 'Type...' }
];

export const generateEyeCenterForms = (calendarList) => {
  // const dateOptions = calendarList?.map((item) => ({
  //   value: item.appointment_date,
  //   label: item.appointment_date
  // }));

  // // Define the function to filter out unavailable times for a selected date
  // const getAvailableTimes = (selectedDate) => {
  //   const appointment = calendarList.find((item) => item.appointment_date === selectedDate);
  //   return appointment ? appointment.available_times : [];
  // };

  return [
    {
      name: 'patient_name',
      type: 'text',
      label: 'Patient Name',
      placeholder: 'Enter Patient Name'
    },
    {
      name: 'doctors_agenda',
      type: 'text',
      label: 'Agenda',
      placeholder: 'Enter Agenda'
    },
    {
      name: 'appointment_date',
      type: 'datetime-local',
      label: 'Appointment Date | Time'
      // onChange: (selectedDate) => {
      //   const availableTimes = getAvailableTimes(selectedDate);
      // }
    },
    {
      name: 'appointment_color',
      type: 'dropdown',
      label: 'Label',
      options: [
        { value: 'red', label: 'Red' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'lime', label: 'Lime' },
        { value: 'green', label: 'Green' },
        { value: 'teal', label: 'Teal' },
        { value: 'cyan', label: 'Cyan' },
        { value: 'blue', label: 'Blue' },
        { value: 'indigo', label: 'Indigo' },
        { value: 'violet', label: 'Violet' },
        { value: 'purple', label: 'Purple' },
        { value: 'pink', label: 'Pink' }
      ]
    }
  ];
};
