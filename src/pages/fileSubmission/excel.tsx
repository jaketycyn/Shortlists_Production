import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const Excel = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const data = e.target.result;
        try {
          // Parse CSV
          if (file.type === "text/csv") {
            Papa.parse(data.toString(), {
              complete: (parsedData) => {
                console.log("parsedData", parsedData);
              },
            });
          }
          // TODO: Handle other types e.g., Excel
        } catch (err: any) {
          console.error("Error parsing JSON", err.message);
          alert("Error processing file. Make sure it is a valid JSON or CSV");
        }
      }
    };

    if (file.type === "text/csv") {
      reader.readAsText(file);
    }
    // TODO: Add reading methods for other file types, e.g., Excel
  };

  return (
    <div className="mx-auto flex flex-col items-center justify-center p-4 pt-20">
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 px-4 py-2 text-white"
      >
        Upload Excel Document
      </button>
    </div>
  );
};

export default Excel;
