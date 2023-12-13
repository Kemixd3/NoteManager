import {
  tableHeaderStyleSearch,
  tableCellStyleSearch,
} from "../store/cssStore";

const SearchResultTable = ({ searchData, selectedCategory }) => {
  const categoryMetadata = {
    po: ["Order", "Ordered_By", "Ordered", "Expected_Arrival", "Notes"],
    batch: [
      "Batch_ID",
      "Batch_Name",
      "Created_By",
      "Received",
      "Receival_ID",
      "SI_Number",
    ],

    receivedItems: [
      "Received_Item_ID",
      "Name",
      "SI_Number",
      "Quantity",
      "Created_By",
      "Receival_ID",
    ],

    material: ["ID", "Name", "Type"],
    poi: ["ID", "Name", "Quantity", "SI_Number", "Type", "Order"],
  };
  const headers = categoryMetadata[selectedCategory];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust the formatting as needed
  };

  return (
    <div className="searchForm">
      <table className="">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={tableHeaderStyleSearch}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {searchData &&
            searchData.map((item, index) => (
              <tr key={index}>
                {headers.map((header, columnIndex) => (
                  <td key={columnIndex} style={tableCellStyleSearch}>
                    {header === "Ordered" ||
                    header === "Expected_Arrival" ||
                    header === "Received"
                      ? formatDate(item[header])
                      : item[header]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchResultTable;
