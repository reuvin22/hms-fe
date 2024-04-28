import { createContext, useContext } from 'react';

export const PdfContext = createContext({
  data: null,
  state: null,
  ref: null,
  onClick: () => {},
  onGeneratePdf: () => {}
});

export const ComponentContext = createContext({
  data: null,
  state: null,
  alertMessage: '',
  patientData: null,
  pathologyData: null,
  radiologyData: null,
  medicationData: null,
  isDrawerOpen: false,
  onAutoSave: () => {},
  onAddMedicine: () => {},
  onChange: () => {},
  onClose: () => {},
  onSubmitData: () => {},
  onClick: () => {},
  onClickOpenMed: () => {},
  onClickCloseMed: () => {},
  onSubmitDrRequest: () => {},
  onAddData: () => {},
  onRemoveData: () => {},
  onModalOpen: () => {}
  // onSet
});

export const FormContext = createContext({
  // PatientInformation component
  title: null,
  state: null,
  data: null,
  provinceData: null,
  municipalityData: null,
  barangayData: null,
  initialFields: [],
  enableAutoSave: false,
  onModalOpen: () => {},
  onFormChange: () => {},
  onSelectedProvince: () => {},
  onSelectedMunicipality: () => {},
  onAlert: () => {},

  // Add OPD Form Context
  ref: null,
  // data: null,
  // enableAutoSave: false,
  enableAddRow: false,
  onSuccess: () => {},
  onLoading: () => {},
  onCloseSlider: () => {},
  onSetAlertType: () => {},
  onSetAlertMessage: () => {},

  onClickFAB: () => {}
});

export const TableContext = createContext({
  state: null,
  // Table component
  tableHeader: null,
  tableData: null,
  isLoading: false,
  disableCheckbox: false,
  disableRow: false,
  // onSelectAll: () => {},
  onChecked: () => {},
  onClick: () => {},
  onEdit: () => {},
  onCheckPatient: () => {}
});

export const ModalContext = createContext({
  state: null,
  isOpen: false,
  isModalOpen: false,
  onClickFromSearch: () => {},
  onLoading: () => {},
  onClose: () => {},
  onClick: () => {},
  onClickBack: () => {},
  onClickOpenMed: () => {},
  onSubmitData: () => {},
  onRemoveData: () => {}
});

export const BigCalendarContext = createContext({
  state: null,
  calendarData: null,
  onClick: () => {},
  onEdit: () => {}
});

export const usePdfContext = () => useContext(PdfContext);
export const useFormContext = () => useContext(FormContext);
export const useModalContext = () => useContext(ModalContext);
export const useTableContext = () => useContext(TableContext);
export const useComponentContext = () => useContext(ComponentContext);
export const useBigCalendarContext = () => useContext(BigCalendarContext);
