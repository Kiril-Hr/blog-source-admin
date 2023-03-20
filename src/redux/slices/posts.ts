import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('/posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts/check/all')
  return data
})

export const fetchRemovePost = createAsyncThunk("/posts/fetchRemovePost", async (id: string) => {
  axios.delete(`/posts/check/remove/${id}`)
})

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
};

export const posts = createSlice({
  name: 'posts',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.posts.items = []
        state.posts.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'loaded';
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = []
        state.posts.status = 'error';
      });
/////////////////////// - remove
    builder
      .addCase(fetchRemovePost.pending, (state, action) => {
        const id = action.meta.arg as any
        if (id) {
        state.posts.items = state.posts.items.filter((item: any) => item._id !== id)
        }
      })
  },
});

export const postReducer =  posts.reducer;
