// rafce快速生成 by simple react snippets插件

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language }, // api Response內既值 https://developer.themoviedb.org/reference/discover-movie
}) => {
  //  destructure { movie } = ( props )唔洗props.movie.title , set埋movie: { a , b}唔洗以後唔洗{movie.a} {movie.b}
  return (
    <div className="movie-card ">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
      />
      {/* //圖片link https://developer.themoviedb.org/docs/image-basics , 圓點圖link https://www.symbolspy.com/dot-symbol.html */}
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
