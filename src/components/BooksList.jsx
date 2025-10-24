import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks, setSortBy, setOrder } from "../redux/booksSlice";
import "./BooksList.css";

const BooksList = () => {
  const dispatch = useDispatch();
  const { list, sortBy, order, loading, error } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleSortChange = (e) => dispatch(setSortBy(e.target.value));
  const handleOrderChange = (e) => dispatch(setOrder(e.target.value));

  const sorted = [...list].sort((a, b) => {
    const valA = a[sortBy]?.toLowerCase() || "";
    const valB = b[sortBy]?.toLowerCase() || "";
    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="books-container">
      <h1>📚 Book List</h1>

      <div className="controls">
        <label>
          Sort by:
          <select
            data-test="sort-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="publisher">Publisher</option>
          </select>
        </label>

        <label>
          Order:
          <select
            data-test="order-select"
            value={order}
            onChange={handleOrderChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <table data-test="books-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((b) => (
            <tr key={b.isbn}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksList;
