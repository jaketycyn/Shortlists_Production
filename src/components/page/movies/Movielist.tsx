import React from "react";

interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
}

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <ul className="min-w-[300px]">
      {movies.map((movie) => (
        <li key={movie.id}>
          {movie.title} ({movie.year})
        </li>
      ))}
    </ul>
  );
};

export default MovieList;
