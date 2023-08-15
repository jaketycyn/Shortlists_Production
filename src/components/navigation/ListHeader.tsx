import { useState } from "react";
import { useRouter } from "next/router";

export const ListHeader = ({ title }: { title: string | undefined }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const goBack = () => {
    router.back();
  };
  console.log("title", title);
  return (
    <div className="grid h-20 w-full grid-cols-6 flex-row bg-blue-500 p-2">
      <button className="col-span-1 flex items-center pl-3" onClick={goBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="h-6 w-6 text-white "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
          />
          Back
        </svg>
      </button>
      <h1 className="col-span-4 flex items-center justify-center text-center text-lg font-semibold text-white">
        {/* Header Section for future use */}
        {title}
      </h1>
      <div className="relative col-span-1 flex items-center justify-end pr-3">
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {/* SVG for Three Dots */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}

        <div
          className={`text-md fixed left-0 top-0 z-50 h-36 w-full transform bg-neutral-800 font-semibold text-white  transition-transform duration-300 ease-in-out ${
            isDropdownOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="grid grid-cols-4 items-center justify-center  p-4 text-center">
            {/* share */}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="col-span-1 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>
            <button
              className="col-span-3 block w-full px-4 py-2 text-left"
              onClick={() => console.log("Share")}
            >
              Share
            </button>
            {/* archive */}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="col-span-1 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            <button
              className="col-span-3 block w-full px-4 py-2 text-left"
              onClick={() => console.log("Archive")}
            >
              Archive
            </button>
            {/* delete */}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="col-span-1 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            <button
              className="col-span-3 block w-full px-4 py-2 text-left"
              onClick={() => console.log("Delete")}
            >
              Delete
            </button>
          </div>
          {/* ... Add more items as required ... */}
        </div>
      </div>

      {/* When the dropdown is open, we add an overlay to close the dropdown when clicked */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
};
