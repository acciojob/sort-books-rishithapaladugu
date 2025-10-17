import {configureStore} from '@reduxjs/toolkit';
import booksReducer from '../feature/BookSlice'
const Store = configureStore({
  reducer:{
    books:booksReducer
  }
})

export default Store;
