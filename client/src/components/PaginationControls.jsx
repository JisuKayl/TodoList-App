import React from "react";
import { useTaskContext } from "../context/TaskContext";

const PaginationControls = () => {
  const { page, setPage, pagination, loadTasks } = useTaskContext();
  const { totalPages } = pagination;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      loadTasks(newPage);
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
        Page {page} of {totalPages}
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
