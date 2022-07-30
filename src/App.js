import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [moviesData, setMoviesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        "https://react-http-fd88b-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        setError(true);
        throw new Error("Something went wrong");
      }

      const movies = await response.json();

      const loadedMovies = [];

      for (const key in movies) {
        loadedMovies.push({
          id: key,
          title: movies[key].title,
          releaseDate: movies[key].releaseDate,
          openingText: movies[key].openingText,
        });
      }

      // const tranformedMoviesData = movies.results.map((movie) => {
      //   return {
      //     id: movie.episode_id,
      //     title: movie.title,
      //     releaseDate: movie.release_date,
      //     openingText: movie.opening_crawl,
      //   };
      // });

      setMoviesData(loadedMovies);
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  }, []);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-fd88b-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
    fetchMoviesHandler();
  }

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>No movies found.</p>;

  if (moviesData.length > 0) {
    content = <MoviesList movies={moviesData} />;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (error) {
    content = <p>Something went wrong.</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
