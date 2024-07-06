import React from "react";

export default function FilterBadge(props) {
  return (
    <>
      <div
        className={`${
            props.filter ? "inline-flex" : "hidden"
        } items-center justify-between space-x-1 bg-${props.color}-100 text-${props.color}-800 px-2 py-1 mx-2 rounded-md`}
      >
        <svg
          onClick={props.clearFilter}
          className={`cursor-pointer h-4 w-4 text-${props.color}-900`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <div className={`select-none text-${props.color}-900`}>{props.name}</div>
      </div>
    </>
  );
}
