import { useState } from "react";
import "../App.scss";
import { fetchData } from "../Controller/StockDbController";
import SearchResultTable from "../components/SearchResultTable";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("po");
  const [searchData, setSearchData] = useState(null);
  document.title = "Search";

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSearchData(null);
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData(searchTerm, selectedCategory);

      setSearchData(response);
    } catch (error) {
      console.log("No Results");
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
          style={{ borderRadius: "5px 5px 5px 5px", flex: "1", width: "150px" }}
        />

        <select
          style={{
            borderRadius: "5px 5px 5px 5px",
            margin: "0",
            width: "150px",
            height: "48px",
            marginRight: "2px",
            marginLeft: "2px",
          }}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="po">PO</option>
          <option value="batch">Batch</option>
          <option value="receivedItems">Received Items</option>
          <option value="material">Material</option>
          <option value="poi">PO items</option>
        </select>
        <button
          style={{
            borderRadius: "5px 5px 5px 5px",
            width: "150px",
            height: "48px",
            marginRight: "2px",
            marginLeft: "2px",
          }}
          type="submit"
        >
          Search
        </button>
      </form>

      {searchData && (
        <SearchResultTable
          searchData={searchData}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
};

export default Search;
