import React from 'react';
import '../CSS/Search.css';
function Search(props) {
  const searchHandler = (event) => {
    const searchQuery = event.target.value;
    props.onSearch(searchQuery);
  };
  return (
    <input
      type="text"
      onChange={searchHandler}
      id="search"
      placeholder="Search"
    />
  );
}
export default Search;
