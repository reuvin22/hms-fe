// import axios from 'axios';
import axios from 'axios';
import Cookies from 'js-cookie';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useGetUserDetailsQuery, authApi } from '@/service/authService';

export const userLogin = createAsyncThunk(
  'auth/userLogin',
  async ({ ...props }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };

      const { data } = await axios.post(
        `${process.env.API_URL}/login`,
        props,
        config
      );

      Cookies.set('isLoggedIn', data.loggedIn);
      Cookies.set('token', data.token);
      return data;
    } catch (err) {
      if (err.response && err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const userGrants = createAsyncThunk(
  'auth/userModules',
  async (moduleId, { getState, rejectWithValue }) => {
    // console.log(moduleId)
    try {
      const token = getState().auth.userToken;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const data = await axios.get(`${process.env.API_URL}/grants`, {
        params: { moduleId },
        ...config
      });
      // console.log(data)
      return data.data;
    } catch (err) {
      if (err.response && err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(err.message);
    }
  }
);
