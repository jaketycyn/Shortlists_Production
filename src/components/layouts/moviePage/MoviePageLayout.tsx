import type { NextPage } from "next";
import MovieList from "../../page/movies/Movielist";
import { motion } from "framer-motion";
import SmallCarousel from "../../carousels/SmallCarousel";
import MovieListCard from "../../cards/MovieListCard";

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
  const otherpersontop10 = [
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

  // if this component needs to fire/render

  // retrieve from database lists pertaining to this for both user, friends & from SL

  // mock data for now

  const lists = [
    {
      id: "list1",
      title: "Top 5 Action Movies",
      userID: "user1",
      category: "movies",
    },
    {
      id: "list2",
      title: "Romantic Movies to Watch",
      userID: "user1",
      category: "movies",
    },
    {
      id: "list3",
      title: "Must-See Sci-Fi Movies",
      userID: "user1",
      category: "movies",
    },
    {
      id: "list4",
      title: "Upcoming New Releases",
      userID: "user1",
      category: "movies",
    },
  ];

  const items = [
    // Items for "Top 5 Action Movies"
    {
      id: "Die Hard",
      userId: "user1",
      listID: "list1",
    },
    {
      id: "Bourne Identity",
      userId: "user1",
      listID: "list1",
    },
    {
      id: "James Bond: Casino Royale",
      userId: "user1",
      listID: "list1",
    },
    {
      id: "Lethal Weapon",
      userId: "user1",
      listID: "list1",
    },
    {
      id: "Mad Max: Fury Road",
      userId: "user1",
      listID: "list1",
    },
    // Items for "Romantic Movies to Watch"
    {
      id: "Love Actually",
      userId: "user1",
      listID: "list2",
    },
    {
      id: "The Notebook",
      userId: "user1",
      listID: "list2",
    },
    {
      id: "Titanic",
      userId: "user1",
      listID: "list2",
    },
    {
      id: "When Harry Met Sally",
      userId: "user1",
      listID: "list2",
    },
    {
      id: "You've Got Mail",
      userId: "user1",
      listID: "list2",
    },
    // Items for "Must-See Sci-Fi Movies"
    {
      id: "The Matrix",
      userId: "user1",
      listID: "list3",
    },
    {
      id: "Star Wars: A New Hope",
      userId: "user1",
      listID: "list3",
    },
    {
      id: "Alien",
      userId: "user1",
      listID: "list3",
    },
    {
      id: "Blade Runner: 2049",
      userId: "user1",
      listID: "list3",
    },
    {
      id: "Terminator 2: Judgement Day",
      userId: "user1",
      listID: "list3",
    },
  ];

  // dispatch Call to post lists to redux store

  //   console.log("imdbTop10", imdbTop10);
  return (
    <div className="flex h-screen w-full flex-col ">
      {/* Header Section - Start */}
      <h1>MoviePage info</h1>
      {/* Header Section - End */}
      {/* Featured MovieLists Section - Start */}
      <div className=" flex w-full items-center justify-center">
        {/* SmallCarousel Test - Start */}
        {/* <SmallCarousel>
          {lists.map((list) => (
            <MovieListCard key={list.id} title={list.title} />
          ))}
        </SmallCarousel> */}
        {/* SmallCarousel Test - End */}
      </div>
      {/* Featured MovieLists Section - End */}
    </div>
  );
};

export default MoviePageLayout;
