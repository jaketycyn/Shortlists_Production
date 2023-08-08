import { useRouter } from "next/router";

export const ListHeader = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };
  return (
    <div className="grid h-10 w-full grid-cols-6 flex-row bg-blue-500">
      <button className="col-span-1 flex items-center pl-3" onClick={goBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          className="h-6 w-6 text-white "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
          />
          Back
        </svg>
      </button>
      <h1 className="col-span-4 flex items-center justify-center text-center">
        {/* Header Section for future use */}
      </h1>
      <button className="col-span-1 flex items-center justify-end pr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          className="h-6 w-6 text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
          />
        </svg>
      </button>
    </div>
  );
};
