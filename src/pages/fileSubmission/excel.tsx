import { useEffect, useState } from "react";
import Papa from "papaparse";
import { trpc } from "../../utils/trpc";
import {
  AddItemsSchema,
  AddMovieItemsSchema,
  AddSongItemsSchema,
  AddTvItemsSchema,
} from "../../server/schema/itemSchema";
import { useAppSelector } from "../../hooks/useTypedSelector";
import FooterNav from "../../components/navigation/FooterNav";

const Excel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [listId, setListId] = useState("");
  const { lists } = useAppSelector((state) => state.list);

  const filterLists = lists?.filter((list) => list.archive !== "trash");
  console.log("lists", lists);
  console.log("filterLists", filterLists);

  useEffect(() => {
    console.log("listId updated:", listId);
  }, [listId]);

  const handleListSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Event object:", e);
    console.log("Selected list ID:", e.target.value);
    setListId(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("selectedValue:", e.target.value);
    setSelectedValue(e.target.value);
  };

  type PersonData = {
    Name: string;
  };

  type SongData = {
    Song: string;
    Album: string;
    Year: number;
    Artist: string;
  };

  type MovieData = {
    Movie: string;
    Year: number;
    Director: string;
  };
  type TvData = {
    Title: string;
    Year: number;
  };

  //!hardcode for now list items will be added to
  //TODO: add listId to the form in form of input or dropdown retrieved from the database

  const { mutateAsync: mutateAsyncSongs } =
    trpc.userItem.addSongItems.useMutation();
  const { mutateAsync: mutateAsyncMovies } =
    trpc.userItem.addMovieItems.useMutation();
  const { mutateAsync: mutateAsyncTv } = trpc.userItem.addTvItems.useMutation();
  const { mutateAsync: mutateAsyncItems } =
    trpc.userItem.addItems.useMutation();
  const handleSubmit = async () => {
    if (!file) return;

    const reader = new FileReader();

    // console.log("file", file);

    if (file && selectedValue === "songs") {
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
                    year: Math.floor(song.Year),
                    album: song.Album,
                    listId: listId,
                    bucket: "music",
                  })) as AddSongItemsSchema;

                  console.log("transformedSongData", transformedSongData);

                  await mutateAsyncSongs(transformedSongData);

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
    }
    if (file && selectedValue === "musicalArtists") {
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const data = e.target.result;
          try {
            // Parse CSV
            if (file.type === "text/csv") {
              Papa.parse(data.toString(), {
                complete: async (parsedData) => {
                  //Skip the header and map over the rest of the rows

                  console.log("parsedData", parsedData);

                  const rows = parsedData.data as string[][];

                  //skip first array cause its the header

                  const artistData = rows.slice(1).map((row: any) => ({
                    Name: row[0],
                  })) as PersonData[];
                  console.log("rows", rows);

                  console.log("artistData", artistData);

                  // Transform the songData to match the addSongItemSchema
                  const transformedArtistData = artistData.map((person) => ({
                    itemTitle: person.Name,
                    listId: listId,
                  })) as AddItemsSchema;

                  console.log("transformedSongData", transformedArtistData);

                  await mutateAsyncItems(transformedArtistData);

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
    }

    if (file && selectedValue === "movies") {
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
                  const movieData = rows.slice(1).map((row: any) => ({
                    Movie: row[0],
                    Year: parseInt(row[1], 10),
                    Director: row[2],
                  })) as MovieData[];

                  // Transform the movieData to match the addMovieItemSchema
                  const transformedMovieData = movieData.map((movie) => ({
                    itemTitle: movie.Movie,
                    listId: listId,
                    year: Math.floor(movie.Year),
                    director: movie.Director,
                    bucket: "movies",
                  })) as AddMovieItemsSchema;

                  console.log("transformedMovieData", transformedMovieData);
                  await mutateAsyncMovies(transformedMovieData);
                  alert("Movies Added!");
                },
              });
            }
          } catch (err: any) {
            console.error("Error parsing JSON", err.message);
            alert("Error processing file. Make sure it is a valid JSON or CSV");
          }
        }
      };
      if (file.type === "text/csv") {
        reader.readAsText(file);
      }
    }
    if (file && selectedValue === "television") {
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
                  const tvData = rows.slice(1).map((row: any) => ({
                    Title: row[0],
                    Year: parseInt(row[1], 10),
                  })) as TvData[];

                  // Transform the tvData to match the addMovieItemSchema
                  const transformedTvShowData = tvData.map((tvShow) => ({
                    itemTitle: tvShow.Title,
                    listId: listId,
                    year: Math.floor(tvShow.Year),
                    bucket: "television",
                  })) as AddTvItemsSchema;

                  console.log("transformedMovieData", transformedTvShowData);
                  await mutateAsyncTv(transformedTvShowData);
                  alert("Tv Show Added!");
                },
              });
            }
          } catch (err: any) {
            console.error("Error parsing JSON", err.message);
            alert("Error processing file. Make sure it is a valid JSON or CSV");
          }
        }
      };
      if (file.type === "text/csv") {
        reader.readAsText(file);
      }
    }
    // if (file && selectedValue === "custom") {
    //   reader.onload = async (e: ProgressEvent<FileReader>) => {
    //     if (e.target?.result) {
    //       const data = e.target.result;
    //       try {
    //         // Parse CSV
    //         if (file.type === "text/csv") {
    //           Papa.parse(data.toString(), {
    //             complete: async (parsedData) => {
    //               //Skip the header and map over the rest of the rows

    //               console.log("parsedData", parsedData);

    //               const rows = parsedData.data as string[][];

    //               //skip first array cause its the header

    //               const artistData = rows.slice(1).map((row: any) => ({
    //                 Name: row[0],
    //               })) as PersonData[];
    //               //console.log("rows", rows);

    //               //console.log("artistData", artistData);

    //               // Transform the songData to match the addSongItemSchema
    //               const transformedArtistData = artistData.map((person) => ({
    //                 itemTitle: person.Name,
    //                 listId: listId,
    //               })) as AddItemsSchema;

    //               //console.log("transformedSongData", transformedArtistData);

    //               await mutateAsyncItems(transformedArtistData);

    //               alert("Songs Added!");
    //             },
    //           });
    //         }
    //         // TODO: Handle other types e.g., Excel
    //       } catch (err: any) {
    //         console.error("Error parsing JSON", err.message);
    //         alert("Error processing file. Make sure it is a valid JSON or CSV");
    //       }
    //     }
    //   };

    //   if (file.type === "text/csv") {
    //     reader.readAsText(file);
    //   }
    // }
    // TODO: Add reading methods for other file types, e.g., Excel
  };

  return (
    <div className="mx-auto flex flex-col items-center justify-center p-4 pt-20">
      <div>
        <select onChange={handleListSelection}>
          <option value="">Select a list</option>
          {filterLists
            ? filterLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))
            : null}
        </select>
        <select
          onChange={handleTypeChange}
          value={selectedValue}
          className="mb-4"
        >
          <option value="">Select a Page</option>
          <option value="songs">Songs</option>
          <option value="musicalArtists">Musical Artists</option>
          <option value="movies">Movies</option>
          <option value="television">Television</option>
          {/* <option value="custom">Custom</option> */}
        </select>
      </div>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 px-4 py-2 text-white"
      >
        Upload Excel Document
      </button>
      <FooterNav />
    </div>
  );
};

export default Excel;
