import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['UserDetails'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    prepareHeaders: (headers, { getState }) => {
      // const token = getState().auth.userToken
      const token = Cookies.get('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        return headers;
      }
    }
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/user',
          method: 'GET',
          params: {
            selectedDB: session
          }
        };
      }
    }),

    getUserById: builder.query({
      query: (args) => {
        const { user_id } = args;
        const session = Cookies.get('session');
        return {
          url: '/user-by-id',
          method: 'GET',
          params: {
            selectedDB: session,
            user_id
          }
        };
      }
    }),

    grantUserModule: builder.mutation({
      query: (dataArray) => {
        const session = Cookies.get('session');
        return {
          url: '/grant-user-modules',
          method: 'POST',
          body: {
            data: dataArray,
            selectedDB: session
          }
        };
      }
    }),

    getGrantModule: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { user_id, auth_id } = args;
        return {
          url: '/grant-module',
          method: 'GET',
          params: {
            selectedDB: session,
            user_id,
            auth_id
          }
        };
      }
    }),

    getUserModules: builder.query({
      query: (args) => {
        const { moduleId } = args;
        const session = Cookies.get('session');
        return {
          url: '/grants',
          method: 'GET',
          params: {
            moduleId,
            selectedDB: session
          }
        };
      }
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST'
      })
    })
  })
});

export const {
  useGetUserDetailsQuery,
  useGetUserByIdQuery,
  useLogoutMutation,
  useGetUserModulesQuery,
  useGetGrantModuleQuery,
  useGrantUserModuleMutation
} = authApi;
// export const { authApi }
