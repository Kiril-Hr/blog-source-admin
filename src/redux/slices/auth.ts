import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params: object) => {
  const { data } = await axios.post('/auth-admin', params);
  return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me');
  return data;
});

const initialState = {
  data: null,
  status: 'loading',
};

function addFetchCases(
  builder: any,
  fetchAction: any
) {
  builder
    .addCase(fetchAction.pending, (state: any) => {
      state.status = 'loading';
      state.data = null;
    })
    .addCase(fetchAction.fulfilled, (state: any, action: any) => {
      state.status = 'loaded';
      state.data = action.payload;
    })
    .addCase(fetchAction.rejected, (state: any) => {
      state.status = 'error';
      state.data = null;
    });
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null
        }
    },
    extraReducers: (builder) => {
        addFetchCases(builder, fetchAuth);
        addFetchCases(builder, fetchAuthMe);
    }
})

export const selectIsAuth = (state: any) => Boolean(state.auth.data)

export const authReducer = authSlice.reducer

export const { logout } = authSlice.actions