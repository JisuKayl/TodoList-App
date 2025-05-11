import React, { useEffect, useState } from "react";
import { useTaskContext } from "../context/TaskContext";

const PaginationControls = () => {
  const { page, setPage, pagination, loadTasks } = useTaskContext();
  const { totalPages = 1 } = pagination || {};
  const [inputPage, setInputPage] = useState(page);

  useEffect(() => {
    setInputPage(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      loadTasks(newPage);
    } else {
      alert(`Please input a valid page between 1 and  ${totalPages}`);
      setInputPage(page);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          handlePageChange(1);
        }}
        disabled={page === 1}
      >
        First Page
      </button>
      <button
        onClick={() => {
          handlePageChange(page - 1);
        }}
        disabled={page === 1}
      >
        Previous
      </button>
      <span>
        Page{" "}
        <input
          type="number"
          value={inputPage}
          onChange={(e) => {
            setInputPage(e.target.value);
          }}
          onBlur={() => {
            setInputPage(page);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlePageChange(Number(inputPage));
            }
          }}
          min={1}
          max={totalPages}
        />{" "}
        of {totalPages}
      </span>
      <button
        onClick={() => {
          handlePageChange(page + 1);
        }}
        disabled={page === totalPages}
      >
        Next
      </button>
      <button
        onClick={() => {
          handlePageChange(totalPages);
        }}
        disabled={page === totalPages}
      >
        Last Page
      </button>
    </div>
  );
};

export default PaginationControls;
