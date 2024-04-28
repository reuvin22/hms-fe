import { useComponentContext } from '@/utils/context';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const heentData = [
  { id: 1, code: 'hesn', name: 'Essential Normal' },
  { id: 2, code: 'abpr', name: 'Abnormal pupillary reaction' },
  { id: 3, code: 'ics', name: 'Icteric Sclerae' },
  { id: 4, code: 'pconj', name: 'Pale Conjunctiva' },
  { id: 5, code: 'sunke', name: 'Sunken Eyeball' },
  { id: 6, code: 'sunkf', name: 'Sunken Fontanelle' },
  { id: 7, code: 'cervl', name: 'Cervical Lymphadenopathy' },
  { id: 8, code: 'dmm', name: 'Dry Mucuos Membrane' },
  { id: 9, code: 'others', name: 'Others' }
];

const chestLungsData = [
  { id: 1, code: 'chesn', name: 'Essential Normal' },
  { id: 2, code: 'lochesb', name: 'Lumps over chest/breast' },
  { id: 3, code: 'asymchex', name: 'Asymmetrical chest expansion' },
  { id: 4, code: 'rr', name: 'Rales/Ronchi' },
  { id: 5, code: 'decbs', name: 'Decreased breath sounds' },
  {
    id: 6,
    code: 'intrclavr',
    name: 'Intercostal retractions/clavicular retractions'
  },
  { id: 7, code: 'whiz', name: 'Wheezes' },
  { id: 9, code: 'others', name: 'Others' }
];

const cvsData = [
  { id: 1, code: 'cvesn', name: 'Essentially Normal' },
  { id: 2, code: 'dabeat', name: 'Displaced apex beat' },
  { id: 3, code: 'hthrills', name: 'Heaves/thrills' },
  { id: 4, code: 'pbulge', name: 'Pericardial bulge' },
  { id: 5, code: 'irregrhy', name: 'Irregular rhythm' },
  { id: 6, code: 'muffhrtsnds', name: 'Muffled heart sounds' },
  { id: 7, code: 'mrmr', name: 'Murmur' },
  { id: 8, code: 'others', name: 'Others' }
];

const abdomenData = [
  { id: 1, code: 'abesn', name: 'Essentially Normal' },
  { id: 2, code: 'abdrig', name: 'Abdominal rigidity' },
  { id: 3, code: 'abdtend', name: 'Abdomen tenderness' },
  { id: 4, code: 'hypactbs', name: 'Hyperactive bowel sounds' },
  { id: 5, code: 'pmass', name: 'Palpable mass(es' },
  { id: 6, code: 'tympdabd', name: 'Tympanitic/dull abdomen' },
  { id: 7, code: 'utercont', name: 'Uterine contraction' },
  { id: 8, code: 'others', name: 'Others' }
];

const guIeData = [
  { id: 1, code: 'guesn', name: 'Essentially Normal' },
  { id: 2, code: 'bstainief', name: 'Blood stained in exam finger' },
  { id: 3, code: 'crvdltn', name: 'Cervical dilatation' },
  { id: 4, code: 'presofad', name: 'Presence of abnormal discharge' },
  { id: 5, code: 'others', name: 'Others' }
];

const skinExtremitiesData = [
  { id: 1, code: 'seesn', name: 'Essentially Normal' },
  { id: 2, code: 'clbng', name: 'Clubbing' },
  { id: 3, code: 'coldcs', name: 'Cold clammy skin' },
  { id: 4, code: 'pbulge', name: 'Pericardial bulge' },
  { id: 5, code: 'cyanmotsk', name: 'Cyanosis/mottled skin' },
  { id: 6, code: 'edmaswel', name: 'Edema/swelling' },
  { id: 7, code: 'decmob', name: 'Decreased mobility' },
  { id: 8, code: 'pailnb', name: 'Pale nailbeds' },
  { id: 9, code: 'poorsk', name: 'Poor skin turgor' },
  { id: 10, code: 'rashpet', name: 'Rashes/petechiae' },
  { id: 11, code: 'weakpls', name: 'Weak pulses' },
  { id: 12, code: 'others', name: 'Others' }
];

const neuronData = [
  { id: 1, code: 'neoesn', name: 'Essentially Normal' },
  { id: 2, code: 'abgait', name: 'Abnormal gait' },
  { id: 3, code: 'abposens', name: 'Abnormal position sense' },
  { id: 4, code: 'abdecsens', name: 'Abnormal/ decreased sensation' },
  { id: 5, code: 'abreflex', name: 'Abnormal reflexes' },
  { id: 6, code: 'poormem', name: 'Poor/altered memory' },
  { id: 7, code: 'poormustren', name: 'Poor muscle tone/strength' },
  { id: 8, code: 'poorcond', name: 'Poor coordination' },
  { id: 9, code: 'others', name: 'Others' }
];

function ClinicalRecord() {
  const componentContext = useComponentContext();
  const symptoms = componentContext?.state?.symptomsData || [];
  const cr_symptoms =
    componentContext?.state?.profileData?.cr_symptoms?.split(',') || [];
  const cr_heent =
    componentContext?.state?.profileData?.cr_heent?.split(',') || [];
  const cr_chest_lungs =
    componentContext?.state?.profileData?.cr_chest_lungs?.split(',') || [];
  const cr_cvs = componentContext?.state?.profileData?.cr_cvs?.split(',') || [];
  const cr_neurological_exam =
    componentContext?.state?.profileData?.cr_neurological_exam?.split(',') ||
    [];
  const patientData = componentContext?.state?.profileData;
  const [generalSurveyTickbox, setGeneralSurveyTickbox] = useState(null);
  const [formData, setFormData] = useState({
    allergic_to: '',
    cr_chief_complain: '',
    cr_history_present_ill: '',
    cr_ob_history: '',
    cr_past_med_history: '',
    cr_personal_soc_history: '',
    cr_family_history: '',
    cr_general_survey: '',
    vital_bp: '',
    vital_hr: '',
    vital_temp: '',
    vital_o2sat: '',
    vital_height: '',
    vital_weight: '',
    vital_bmi: ''
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState(cr_symptoms);

  const [heentChecks, setHeentChecks] = useState(
    heentData.map((item) => ({ ...item, checked: false }))
  );

  const [chestLungChecks, setChestLungChecks] = useState(
    chestLungsData.map((item) => ({ ...item, checked: false }))
  );

  const [cvsChecks, setCvsChecks] = useState(
    cvsData.map((item) => ({ ...item, checked: false }))
  );

  const [neuronChecks, setNeuronChecks] = useState(
    neuronData.map((item) => ({ ...item, checked: false }))
  );

  useEffect(() => {
    const updateCheckboxes = (data, setState) => {
      setState((prev) =>
        prev.map((item) => ({
          ...item,
          checked: data.includes(item.code)
        }))
      );
    };

    updateCheckboxes(cr_heent, setHeentChecks);
    updateCheckboxes(cr_chest_lungs, setChestLungChecks);
    updateCheckboxes(cr_cvs, setCvsChecks);
    updateCheckboxes(cr_neurological_exam, setNeuronChecks);

    if (patientData) {
      setFormData({
        allergic_to: patientData?.allergic_to,
        cr_chief_complain: patientData?.cr_chief_complain,
        cr_history_present_ill: patientData?.cr_history_present_ill,
        cr_ob_history: patientData?.cr_ob_history,
        cr_past_med_history: patientData?.cr_past_med_history,
        cr_personal_soc_history: patientData?.cr_personal_soc_history,
        cr_family_history: patientData?.cr_family_history,
        cr_general_survey: patientData?.cr_general_survey,
        vital_bp: patientData?.vital_bp,
        vital_hr: patientData?.vital_hr,
        vital_temp: patientData?.vital_temp,
        vital_o2sat: patientData?.vital_o2sat,
        vital_height: patientData?.vital_height,
        vital_weight: patientData?.vital_weight,
        vital_bmi: patientData?.vital_bmi
      });
      setSelectedSymptoms(patientData?.cr_symptoms?.split(',') || []);
    }
  }, [patientData]);

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

  const handleCheckboxChange = (data) => {
    switch (data.type) {
      case 'heent':
        setHeentChecks((prev) => {
          const itemIndex = prev.findIndex((item) => item.id === data.item.id);
          if (itemIndex !== -1) {
            return [
              ...prev.slice(0, itemIndex),
              { ...prev[itemIndex], checked: data.event.target.checked },
              ...prev.slice(itemIndex + 1)
            ];
          }
          return data.event.target.checked
            ? [...prev, { ...data.item.code, checked: true }]
            : prev;
        });
        break;

      case 'chest_lungs':
        setChestLungChecks((prev) => {
          const itemIndex = prev.findIndex((item) => item.id === data.item.id);
          if (itemIndex !== -1) {
            return [
              ...prev.slice(0, itemIndex),
              { ...prev[itemIndex], checked: data.event.target.checked },
              ...prev.slice(itemIndex + 1)
            ];
          }
          return data.event.target.checked
            ? [...prev, { ...data.item.code, checked: true }]
            : prev;
        });
        break;

      case 'cvs':
        setCvsChecks((prev) => {
          const itemIndex = prev.findIndex((item) => item.id === data.item.id);
          if (itemIndex !== -1) {
            return [
              ...prev.slice(0, itemIndex),
              { ...prev[itemIndex], checked: data.event.target.checked },
              ...prev.slice(itemIndex + 1)
            ];
          }
          return data.event.target.checked
            ? [...prev, { ...data.item.code, checked: true }]
            : prev;
        });
        break;

      case 'neurological_exam':
        setNeuronChecks((prev) => {
          const itemIndex = prev.findIndex((item) => item.id === data.item.id);
          if (itemIndex !== -1) {
            return [
              ...prev.slice(0, itemIndex),
              { ...prev[itemIndex], checked: data.event.target.checked },
              ...prev.slice(itemIndex + 1)
            ];
          }
          return data.event.target.checked
            ? [...prev, { ...data.item.code, checked: true }]
            : prev;
        });
        break;

      default:
        break;
    }
  };

  const handleSelectChange = (data) => {
    switch (data.type) {
      case 'cr_symptoms':
        const selectedSymptomCodes = data.value.map((symptom) => {
          const selectedSymptom = symptoms.find(
            (item) => item.name === symptom.label
          );
          return selectedSymptom ? selectedSymptom.code : '';
        });

        console.log(selectedSymptomCodes);
        setSelectedSymptoms(selectedSymptomCodes);
        break;
    }
  };

  const calculateBMI = (ht, wt) => {
    if (ht && wt) {
      const heightInMeters = ht / 100; // assuming height is in centimeters
      const computedBMI = wt / (heightInMeters * heightInMeters);
      return computedBMI.toFixed(2);
    }
    return null;
  };

  const handleOnChange = (data) => {
    switch (data.type) {
      case 'vital_bp':
      case 'vital_hr':
      case 'vital_temp':
      case 'vital_o2sat':
      case 'vital_height':
      case 'vital_weight':
      case 'cr_history_present_ill':
      case 'cr_history_present_ill':
      case 'cr_ob_history':
      case 'cr_past_med_history':
      case 'cr_personal_soc_history':
      case 'cr_family_history':
      case 'cr_chief_complain':
        setFormData((prev) => ({
          ...prev,
          [data.type]: data.value,
          vital_bmi: calculateBMI(
            formData?.vital_height,
            formData?.vital_weight
          )
        }));
        break;

      case 'cr_general_survey':
        setGeneralSurveyTickbox(data.event ? data.value : null);
        setFormData((prev) => ({
          ...prev,
          cr_general_survey: data.value
        }));
        break;
      default:
        break;
    }
  };

  const getSelectedSymptomsData = () => selectedSymptoms;

  const getSelectedHeentData = () =>
    heentChecks.filter((item) => item.checked).map((item) => item.code);

  const getSelectedChestLungData = () =>
    chestLungChecks.filter((item) => item.checked).map((item) => item.code);

  const getSelectedCvsData = () =>
    cvsChecks.filter((item) => item.checked).map((item) => item.code);

  const getSelectedNeuronData = () =>
    neuronChecks.filter((item) => item.checked).map((item) => item.code);

  const handleBlur = (data) => {
    switch (data.type) {
      case 'clinical_record':
        componentContext?.onAutoSave({
          type: 'updatePatientDetails',
          value: formData
        });
        break;
      case 'symptoms':
        componentContext?.onAutoSave({
          type: 'updatePatientSymptoms',
          value: getSelectedSymptomsData()
        });
      case 'heent':
        componentContext?.onAutoSave({
          type: 'updatePatientHeent',
          value: getSelectedHeentData()
        });
        break;
      case 'chest_lungs':
        componentContext?.onAutoSave({
          type: 'updatePatientChestLung',
          value: getSelectedChestLungData()
        });
        break;
      case 'cvs':
        componentContext?.onAutoSave({
          type: 'updatePatientCvs',
          value: getSelectedCvsData()
        });
        break;
      case 'neuron':
        componentContext?.onAutoSave({
          type: 'updatePatientNeuron',
          value: getSelectedNeuronData()
        });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div>
        <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5">
          Patient Clinical Record
        </h3>
        <hr className="drop-shadow-md pb-5" />
      </div>

      <div className="xl:ml-[25rem] xl:mr-[25rem] lg:pl-0 lg:pr-0 md:pl-0 md:pr-0 sm:pl-0 sm:pr-0 space-y-5">
        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm capitalize">
            Chief Complaint:{' '}
          </label>
          <input
            type="text"
            name="cr_chief_complain"
            value={formData.cr_chief_complain || patientData?.cr_chief_complain}
            onChange={(e) =>
              handleOnChange({
                type: 'cr_chief_complain',
                value: e.target.value
              })
            }
            onBlur={() => handleBlur({ type: 'clinical_record' })}
            className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
            placeholder="Type..."
          />
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            History of Present Illness:{' '}
          </label>
          <textarea
            type="text"
            name="cr_history_present_ill"
            value={
              formData.cr_history_present_ill ||
              patientData?.cr_history_present_ill
            }
            onChange={(e) =>
              handleOnChange({
                type: 'cr_history_present_ill',
                value: e.target.value
              })
            }
            onBlur={() => handleBlur({ type: 'clinical_record' })}
            className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
            placeholder="Type..."
          />
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            Symptoms:{' '}
          </label>
          <Select
            options={symptoms
              ?.map((symptom) => ({ value: symptom.code, label: symptom.name }))
              .filter((option) => !selectedSymptoms.includes(option.value))}
            onChange={(e) =>
              handleSelectChange({ type: 'cr_symptoms', value: e })
            }
            onBlur={() => handleBlur({ type: 'symptoms' })}
            isMulti
            isSearchable
            isClearable
            closeMenuOnSelect={false}
            placeholder="Select symptoms..."
            classNamePrefix="react-select"
            className="basic-multi-select"
            styles={styleDropdown({ isDisabled: false })}
            value={selectedSymptoms.map((symptomCode) => ({
              value: symptomCode,
              label:
                symptoms.find((symptom) => symptom.code === symptomCode)
                  ?.name || ''
            }))}

            // value={genderOption?.find(option =>
            //     option.value === formData.gender || profileData?.gender
            // )}
          />
          {/* <textarea
                        type="text"
                        name="cr_history_present_ill"
                        value={formData.cr_history_present_ill || patientData?.cr_history_present_ill}
                        onChange={(e) => handleOnChange({type:"cr_history_present_ill", value: e.target.value})}
                        onBlur={() => handleBlur({type: 'clinical_record'})}
                        className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500 h-40"
                        placeholder="Type..."
                    /> */}
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            OB/GYN History:{' '}
          </label>
          <input
            type="text"
            name="cr_ob_history"
            value={formData.cr_ob_history || patientData?.cr_ob_history}
            onChange={(e) =>
              handleOnChange({ type: 'cr_ob_history', value: e.target.value })
            }
            onBlur={() => handleBlur({ type: 'clinical_record' })}
            className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
            placeholder="If applicable: G___P___(____-____-____-____) LMP_____"
          />
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm capitalize">
            Past Medical History:{' '}
          </label>
          <input
            type="text"
            name="cr_past_med_history"
            value={
              formData.cr_past_med_history || patientData?.cr_past_med_history
            }
            onChange={(e) =>
              handleOnChange({
                type: 'cr_past_med_history',
                value: e.target.value
              })
            }
            onBlur={() => handleBlur({ type: 'clinical_record' })}
            className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
            placeholder="Type..."
          />
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            Personal and Social History:{' '}
          </label>
          <input
            type="text"
            name="cr_personal_soc_history"
            value={
              formData.cr_personal_soc_history ||
              patientData?.cr_personal_soc_history
            }
            onChange={(e) =>
              handleOnChange({
                type: 'cr_personal_soc_history',
                value: e.target.value
              })
            }
            onBlur={() => handleBlur({ type: 'clinical_record' })}
            className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
            placeholder="Type..."
          />
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            Allergies:{' '}
          </label>
          <input
            type="text"
            name="allergic_to"
            value={formData.allergic_to || patientData?.allergic_to}
            onChange={(e) =>
              handleOnChange({ type: 'allergic_to', value: e.target.value })
            }
            onBlur={() => handleBlur({ type: 'clinical_record' })}
            className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
            placeholder="Type..."
          />
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            Family History:{' '}
          </label>
          <input
            type="text"
            name="cr_family_history"
            value={formData.cr_family_history || patientData?.cr_family_history}
            onChange={(e) =>
              handleOnChange({
                type: 'cr_family_history',
                value: e.target.value
              })
            }
            onBlur={() => handleBlur({ type: 'clinical_record' })}
            className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
            placeholder="Type..."
          />
        </div>
      </div>

      <div>
        <h3 className="text-gray-400 text-center font-bold uppercase text-medium py-5 pt-[5rem]">
          Physical Examination
        </h3>
        <hr className="drop-shadow-md pb-5" />
      </div>

      <div className="xl:ml-[25rem] xl:mr-[25rem] lg:pl-0 lg:pr-0 md:pl-0 md:pr-0 sm:pl-0 sm:pr-0 space-y-5">
        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            General Survey:{' '}
          </label>
          <div className="flex flex-row space-x-3 w-3/5">
            {['awake_alert', 'altered_sensorium'].map((service, index) => (
              <div className="flex items-center space-x-1">
                <input
                  key={index}
                  type="checkbox"
                  name="cr_general_survey"
                  checked={
                    service === generalSurveyTickbox ||
                    service === patientData?.cr_general_survey
                  }
                  onChange={(e) =>
                    handleOnChange({
                      type: 'cr_general_survey',
                      event: e.target.checked,
                      value: service
                    })
                  }
                  onBlur={() => handleBlur({ type: 'clinical_record' })}
                  className="w-5 h-5"
                />
                <label className="text-gray-500 font-bold text-xs">
                  {service.toUpperCase()}:{' '}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            Vital Sign:{' '}
          </label>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className=" text-gray-500 font-medium text-sm mr-3 w-24">
                BP:{' '}
              </label>
              <input
                type="text"
                name="vital_bp"
                value={formData.vital_bp || patientData?.vital_bp}
                onChange={(e) =>
                  handleOnChange({ type: 'vital_bp', value: e.target.value })
                }
                onBlur={() => handleBlur({ type: 'clinical_record' })}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder="Systolic/Diastolic (e.g., 120/80 mmHg)"
              />
            </div>

            <div className="flex items-center">
              <label className=" text-gray-500 font-medium text-sm mr-3 w-24">
                HR:{' '}
              </label>
              <input
                type="text"
                name="vital_hr"
                value={formData.vital_hr || patientData?.vital_hr}
                onChange={(e) =>
                  handleOnChange({ type: 'vital_hr', value: e.target.value })
                }
                onBlur={() => handleBlur({ type: 'clinical_record' })}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder="(e.g., 70-100 bpm)"
              />
            </div>

            <div className="flex items-center">
              <label className=" text-gray-500 font-medium text-sm mr-3 w-24">
                Temp:{' '}
              </label>
              <input
                type="text"
                name="vital_temp"
                value={formData.vital_temp || patientData?.vital_temp}
                onChange={(e) =>
                  handleOnChange({ type: 'vital_temp', value: e.target.value })
                }
                onBlur={() => handleBlur({ type: 'clinical_record' })}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder="(e.g., 36.5 °C)"
              />
            </div>

            <div className="flex items-center">
              <label className=" text-gray-500 font-medium text-sm mr-3 w-24">
                O2 Sat:{' '}
              </label>
              <input
                type="text"
                name="vital_o2sat"
                value={formData.vital_o2sat || patientData?.vital_o2sat}
                onChange={(e) =>
                  handleOnChange({ type: 'vital_o2sat', value: e.target.value })
                }
                onBlur={() => handleBlur({ type: 'clinical_record' })}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder="SpO2 (%)"
              />
            </div>

            <div className="flex items-center">
              <label className=" text-gray-500 font-medium text-sm mr-3 w-24">
                Height:{' '}
              </label>
              <input
                type="text"
                name="vital_height"
                value={formData.vital_height || patientData?.vital_height}
                onChange={(e) =>
                  handleOnChange({
                    type: 'vital_height',
                    value: e.target.value
                  })
                }
                onBlur={() => handleBlur({ type: 'clinical_record' })}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder="(cm)"
              />
            </div>

            <div className="flex items-center">
              <label className=" text-gray-500 font-medium text-sm mr-3 w-24">
                Weight:{' '}
              </label>
              <input
                type="text"
                name="vital_weight"
                value={formData.vital_weight || patientData?.vital_weight}
                onChange={(e) =>
                  handleOnChange({
                    type: 'vital_weight',
                    value: e.target.value
                  })
                }
                onBlur={() => handleBlur({ type: 'clinical_record' })}
                className="border border-gray-300 bg-gray-100 text-sm w-full px-3 py-2 focus:outline-none focus:border-gray-500"
                placeholder="(kg)"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">HEENT: </label>
          <div className="flex flex-col space-y-2 w-3/5">
            {heentData.map((item) => (
              <div className="flex items-center space-x-1">
                <input
                  key={item.id}
                  type="checkbox"
                  name="heent"
                  checked={
                    heentChecks.find((data) => data.code === item.code).checked
                  }
                  onChange={(e) =>
                    handleCheckboxChange({ type: 'heent', event: e, item })
                  }
                  onBlur={() => handleBlur({ type: 'heent' })}
                  className="w-5 h-5"
                />
                <label className="text-gray-500 font-bold text-xs capitalize">
                  {item.name}{' '}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            CHEST/LUNGS:{' '}
          </label>
          <div className="flex flex-col space-y-2 w-3/5">
            {chestLungsData.map((item) => (
              <div className="flex items-center space-x-1">
                <input
                  key={item.id}
                  type="checkbox"
                  name="chest_lungs"
                  checked={
                    chestLungChecks.find((data) => data.code === item.code)
                      .checked
                  }
                  onChange={(e) =>
                    handleCheckboxChange({
                      type: 'chest_lungs',
                      event: e,
                      item
                    })
                  }
                  onBlur={() => handleBlur({ type: 'chest_lungs' })}
                  className="w-5 h-5"
                />
                <label className="text-gray-500 font-bold text-xs capitalize">
                  {item.name}{' '}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">CVS: </label>
          <div className="flex flex-col space-y-2 w-3/5">
            {cvsData.map((item) => (
              <div className="flex items-center space-x-1">
                <input
                  key={item.id}
                  type="checkbox"
                  name="cvs"
                  checked={
                    cvsChecks.find((data) => data.code === item.code).checked
                  }
                  onChange={(e) =>
                    handleCheckboxChange({ type: 'cvs', event: e, item })
                  }
                  onBlur={() => handleBlur({ type: 'cvs' })}
                  className="w-5 h-5"
                />
                <label className="text-gray-500 font-bold text-xs capitalize">
                  {item.name}{' '}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <label className=" text-gray-500 font-medium text-sm">
            NEUROLOGICAL EXAMINATION:{' '}
          </label>
          <div className="flex flex-col space-y-2 w-3/5">
            {neuronData.map((item) => (
              <div className="flex items-center space-x-1">
                <input
                  key={item.id}
                  type="checkbox"
                  name="neurological_exam"
                  checked={
                    neuronChecks.find((data) => data.code === item.code).checked
                  }
                  onChange={(e) =>
                    handleCheckboxChange({
                      type: 'neurological_exam',
                      event: e,
                      item
                    })
                  }
                  onBlur={() => handleBlur({ type: 'neuron' })}
                  className="w-5 h-5"
                />
                <label className="text-gray-500 font-bold text-xs capitalize">
                  {item.name}{' '}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div className="text-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded mr-2 font-bold uppercase text-xs"
              // onClick={handleClose}
            >
              Comprehensive Neurological Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicalRecord;
