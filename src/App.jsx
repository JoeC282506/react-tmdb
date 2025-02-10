import React, { useState, useEffect } from "react"; // rafce快速生成 by simple react snippets插件
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "../appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json", //https://developer.themoviedb.org/reference/discover-movie
    Authorization: `Bearer ${API_KEY}`,
  },
};
// TMDB_API_KEY = ""; 轉去.env.local 內容
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]); //電影結果
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); //輸入延遲

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  // deps變動時 , 將setState改為searchTerm > useEffect值同deps由searchTerm轉為bounce個state (輸入間隔0.5秒)

  const fetchMovies = async (query = "") => {
    try {
      setIsLoading(true); //loading圖 > 清空error msg > 出資料 > fin清空loading圖
      setErrorMessage("");
      const endpoint = query // query係tmdb search movie api必要既param , endpoint如有param就用search,否就discover
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` // https://developer.themoviedb.org/docs/search-and-query-for-details , https://developer.themoviedb.org/reference/search-movie
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`; // TMDB devloper doc -> discover-movie
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        //成功獲取
        throw new Error("failed to fetch movies");
      }
      const data = await response.json();
      /* console.log(data); */
      if (data.Response === "False") {
        // .Response係TMDB API官方設既值
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []); //頁面電影內容

      if (query && data.results.length > 0) {
        //如果search有值&結果 , 觸發更新or生成data
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fecthing movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies(); // 拎appwrite資料

      setTrendingMovies(movies); // 將獲得資料輸入落trending
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    //頁面更新後冇query所以用左discover movie個api show電影
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]); // 唔set deps = 第一次and 所有render , [] = 第一次render , [內容] , 第一次and 該值變動

  useEffect(() => {
    loadTrendingMovies();
  }, []); // 只在第一次

  return (
    <main>
      <div className="pattern" /> {/* wallpaper bg */}
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span>You'll Enjoy!!
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <h1 className="text-white">{searchTerm}</h1>
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? ( //係咪loading > yes就icon ,no就再問係咪有error > yes出msg, no就出結果
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} /> // movie係props
              ))}
            </ul>
          )}
          {/*  {errorMessage && <p className="text-red-500">{errorMessage}</p>}{" "} */}
          {/* && 同三元運算一樣 https://zh-hans.legacy.reactjs.org/docs/conditional-rendering.html */}
        </section>
      </div>
    </main>
  );
};

export default App;
