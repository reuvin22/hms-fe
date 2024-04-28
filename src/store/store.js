import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import authReducer from './reducers/authSlice';
import { authApi } from '../service/authService';
import { icdApi } from '../service/icdService';
import { settingApi } from '../service/settingService';
import { loginApi } from '../service/loginService';
import { pdfApi } from '../service/pdfService';
import { psgcApi } from '../service/psgcService';
import { countryApi } from '../service/countryService';
import { patientApi } from '../service/patientService';
import { hospitalChargeApi } from '../service/chargeService';
import { dohApi } from '../service/dohService';
import { searchApi } from '../service/searchService';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const persisAuthReducer = persistReducer(persistConfig, authReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      // auth: persisAuthReducer,
      [searchApi.reducerPath]: searchApi.reducer,
      [dohApi.reducerPath]: dohApi.reducer,
      [hospitalChargeApi.reducerPath]: hospitalChargeApi.reducer,
      [patientApi.reducerPath]: patientApi.reducer,
      [countryApi.reducerPath]: countryApi.reducer,
      [psgcApi.reducerPath]: psgcApi.reducer,
      [pdfApi.reducerPath]: pdfApi.reducer,
      [icdApi.reducerPath]: icdApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [settingApi.reducerPath]: settingApi.reducer,
      [loginApi.reducerPath]: loginApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        thunk,
        searchApi.middleware,
        dohApi.middleware,
        hospitalChargeApi.middleware,
        patientApi.middleware,
        countryApi.middleware,
        psgcApi.middleware,
        pdfApi.middleware,
        icdApi.middleware,
        authApi.middleware,
        settingApi.middleware,
        loginApi.middleware
      )
  });
  const persistor = persistStore(store);

  return { store, persistor };
};
