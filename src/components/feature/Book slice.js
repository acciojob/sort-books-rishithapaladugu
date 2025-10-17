import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import 'regenerator-runtime/runtime';

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const url = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=EfwOAsiF9zj83gstD5EkdFlAI65C9aQg`
      const res = await fetch(url)

      if (!res.ok) {
        const errorData = await res.json()
        return rejectWithValue(errorData)
      }

      const data = await res.json()
      const books = (data.results && data.results.books) || []

      const normalized = books.map((b) => ({
        title: b.title || '',
        author: b.author || '',
        publisher: b.publisher || '',
        isbn: b.primary_isbn13 || b.primary_isbn10 || '',
        description: b.description || ''
      }))

      return normalized
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    items: [],
    loading: false,
    error: null,
    sortBy: 'title',
    order: 'asc'
  },
  reducers: {
    setSortBy(state, action) {
      state.sortBy = action.payload
    },
    setOrder(state, action) {
      state.order = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch books'
      })
  }
})

export const { setSortBy, setOrder } = booksSlice.actions
export default booksSlice.reducer

const selectItems = (state) => state.books.items
const selectSortBy = (state) => state.books.sortBy
const selectOrder = (state) => state.books.order

export const selectSortedBooks = createSelector(
  [selectItems, selectSortBy, selectOrder],
  (items, sortBy, order) => {
    const copy = [...items]
    const key = (obj) => (obj[sortBy] || '').toString().toLowerCase()

    copy.sort((a, b) => {
      const A = key(a)
      const B = key(b)
      if (A < B) return order === 'asc' ? -1 : 1
      if (A > B) return order === 'asc' ? 1 : -1
      return 0
    })

    return copy
  }
)
