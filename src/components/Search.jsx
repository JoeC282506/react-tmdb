import React from "react"; // rafce

const Search = ({ searchTerm, setSearchTerm }) => {
  // destructure { searchTerm, setSearchTerm } = ( props )
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm} // searchTerm = props.searchTerm
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
