import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const psgcApi = createApi({
  reducerPath: 'psgcApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://psgc.gitlab.io/api/'
  }),
  endpoints: (builder) => ({
    getProvinceData: builder.query({
      query: () => ({
        url: '/provinces',
        method: 'GET'
      })
    }),

    getCityData: builder.query({
      query: ({ provinceCode }) => ({
        url: `/provinces/${provinceCode}/cities`,
        method: 'GET'
      })
    }),

    getMunicipalityData: builder.query({
      query: ({ provinceCode }) => ({
        url: `/provinces/${provinceCode}/municipalities`,
        method: 'GET'
      })
    }),

    getBarangayData: builder.query({
      query: ({ apiLink, municipalCode }) => ({
        url: `/${apiLink}/${municipalCode}/barangays`,
        method: 'GET'
      })
    }),

    getSpecificBarangayData: builder.query({
      query: ({ provinceCode }) => ({
        url: `/provinces/${provinceCode}/barangays`,
        method: 'GET'
      })
    })
  })
});

export const {
  useGetProvinceDataQuery,
  useGetCityDataQuery,
  useGetMunicipalityDataQuery,
  useGetBarangayDataQuery,
  useGetSpecificBarangayDataQuery
} = psgcApi;
