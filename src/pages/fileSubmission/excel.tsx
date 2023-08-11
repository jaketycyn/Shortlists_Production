import { useState } from "react";

const movies = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        const json = JSON.parse(e.target.result);
        // await addMoviesAndGenres.mutate(json);
        alert("Data added succesfully!");
      } catch (err: any) {
        console.error("Error parsing JSON", err.message, err.name);
        alert("Error processing file. Make sure it is a valid JSON");
      }
    };
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 px-4 py-2 text-white"
      >
        Upload
      </button>
    </div>
  );
};

export default movies;
