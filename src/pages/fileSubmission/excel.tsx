import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { trpc } from "../../utils/trpc";
import { addSongItems } from "../../server/schema/itemSchema";

const Excel = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const { mutateAsync } = trpc.userItem.addSongItems.useMutation();

  type SongData = {
    Song: string;
    Album: string;
    Year: number;
    Artist: string;
  };

  const listIdValue = "60f6b6b0c9b0f1b4e0b3b0b8";
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
              complete: async (parsedData) => {
                // Explicitly cast parsedData.data to a 2d string array
                const rows = parsedData.data as string[][];

                //Skip the header and map over the rest of the rows
                const songData = rows.slice(1).map((row: any) => ({
                  Song: row[0],
                  Album: row[1],
                  Year: parseInt(row[2], 10),
                  Artist: row[3],
                })) as SongData[];

                // Transform the songData to match the addSongItemSchema
                const transformedSongData = songData.map((song) => ({
                  itemTitle: song.Song,
                  artist: song.Artist,
                  year: song.Year,
                  album: song.Album,
                  listId: listIdValue,
                })) as addSongItem[];

                console.log("transformedSongData", transformedSongData);
                // await mutateAsync(songData);

                alert("Songs Added!");
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
