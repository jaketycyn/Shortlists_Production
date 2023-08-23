import type { NextPage } from "next";
import MovieList from "../../page/movies/Movielist";
import { motion } from "framer-motion";

const MoviePageLayout: NextPage = () => {
  // test movieDB

  const imdbTop10 = [
    {
      id: 1,
      title: "The Shawshank Redemption",
      director: "Frank Darabont",
      year: 1994,
    },
    {
      id: 2,
      title: "The Godfather",
      director: "Francis Ford Coppola",
      year: 1972,
    },
    {
      id: 3,
      title: "The Godfather: Part II",
      director: "Francis Ford Coppola",
      year: 1974,
    },
    {
      id: 4,
      title: "The Dark Knight",
      director: "Christopher Nolan",
      year: 2008,
    },
    {
      id: 5,
      title: "12 Angry Men",
      director: "Sidney Lumet",
      year: 1957,
    },
    {
      id: 6,
      title: "Schindler's List",
      director: "Steven Spielberg",
      year: 1993,
    },
    {
      id: 7,
      title: "The Lord of the Rings: The Return of the King",
      director: "Peter Jackson",
      year: 2003,
    },
    {
      id: 8,
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      year: 1994,
    },
    {
      id: 9,
      title: "Fight Club",
      director: "David Fincher",
      year: 1999,
    },
    {
      id: 10,
      title: "Forrest Gump",
      director: "Robert Zemeckis",
      year: 1994,
    },
  ];

  //   console.log("imdbTop10", imdbTop10);
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        {/* Header Section - Start */}
        <h1>MoviePage info</h1>
        {/* Header Section - End */}
        {/* Featured MovieLists Section - Start */}
        <div className="flex flex-col items-center justify-center">
          <h1>Top 10 Imdb Movies</h1>
          <MovieList movies={imdbTop10} />
          {/* Featured MovieLists Section - End */}
        </div>
      </div>
    </div>
  );
};

export default MoviePageLayout;
