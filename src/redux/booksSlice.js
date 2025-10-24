import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const NYT_API_KEY = "86176d77c4msh9bf3262d830a881p16eb44jsna994e3627c55"; // Replace with actual key
const NYT_URL = 'https://new-york-times-books.p.rapidapi.com/lists/current/hardcover-fiction.json';;

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const res = await axios.get(NYT_URL);
  return res.data.results.books.map((b) => ({
    title: b.title,
    author: b.author,
    publisher: b.publisher,
    isbn: b.primary_isbn13,
  }));
});

const booksSlice = createSlice({
  name: "books",
  initialState: {
    list: [],
    sortBy: "title",
    order: "asc",
    loading: false,
    error: null,
  },
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSortBy, setOrder } = booksSlice.actions;
export default booksSlice.reducer;
