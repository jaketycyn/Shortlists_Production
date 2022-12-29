import dynamic from "next/dynamic";

const MoviePageComponent = dynamic(
  async () => await import("../components/layouts/moviepage/MoviePageLayout"),
  {
    ssr: false,
  }
);

function MoviePage() {
  return (
    <div>
      <MoviePageComponent />
    </div>
  );
}

export default MoviePage;
