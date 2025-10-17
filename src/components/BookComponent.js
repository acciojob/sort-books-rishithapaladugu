import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  setSortBy,
  setOrder,
  selectSortedBooks,
} from "./feature/BookSlice";

export default function BookComponent() {
  const dispatch = useDispatch();
  const books = useSelector(selectSortedBooks);
  const loading = useSelector((s) => s.books.loading);
  const error = useSelector((s) => s.books.error);
  const sortBy = useSelector((s) => s.books.sortBy);
  const order = useSelector((s) => s.books.order);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const onSortByChange = (e) => dispatch(setSortBy(e.target.value));
  const onOrderChange = (e) => dispatch(setOrder(e.target.value));

  return (
    <div className="container">
      <h1>Books List</h1>

      <div
        className="controls"
        style={{ display: "flex", gap: "1rem", alignItems: "center" }}
      >
        <label>
          Sort by:
          <select
            data-testid="sort-by"
            value={sortBy}
            onChange={onSortByChange}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="publisher">Publisher</option>
          </select>
        </label>

        <label>
          Order:
          <select data-testid="order" value={order} onChange={onOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <button
          data-testid="refresh-btn"
          onClick={() => dispatch(fetchBooks())}
          className="btn-refresh"
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading books…</p>}
      {error && <p className="error">Error: {String(error)}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 && !loading ? (
              <tr>
                <td colSpan={4}>No books available.</td>
              </tr>
            ) : (
              books.map((b, idx) => (
                <tr key={`${b.isbn}-${idx}`}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publisher}</td>
                  <td>{b.isbn}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
