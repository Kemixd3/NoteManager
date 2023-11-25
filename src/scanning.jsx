import React, { useState, useEffect } from "react";
import { useDarkMode } from "./Context/DarkmodeContext";
import { useParams } from "react-router-dom";

const StockReceiving = ({ userData }) => {
  const [batch, setBatch] = useState([]);
  const [batches, setAllBatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [barcode, setBarcode] = useState("");
  const { id } = useParams(); // Retrieve the ID from the route parameters
  console.log("Received ID:", id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, batchesResponse] = await Promise.all([
          fetch(`http://localhost:3001/orders/product-order-items/${id}`),
          fetch(`http://localhost:3001/batches`)
        ]);
  
        const postsData = await postsResponse.json();
        const batchesData = await batchesResponse.json();
        console.log("postsData",postsData);
        console.log("batchesData",batchesData);

        let tempBatches = []
        batchesData.batches.forEach(element => {
          if (element.product_order_id == id){
            tempBatches.push(element)
          }
        });
        console.log(tempBatches);
        setPosts(postsData.productOrderItems);
        setAllBatches(tempBatches);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [id]);
  
  


  
  // get all batches where PO id, after that only show if item id er samme som selected
  




  const addLine = (barcodeValue) => {
    setBatch([...batch, barcodeValue]);
  };

  // Manual entry of barcode
  const handleManualEntry = (event) => {
    const { value } = event.target;
    setBarcode(value);
  };

  // Function to handle scanning
  const handleScan = () => {
    // TEST Simulating a scanned barcode value - replace with actual scanning
    const scannedBarcode = generateRandomBarcode(); // TODO replace with actual barcode scanning logic
    setBarcode(scannedBarcode);
    addLine(scannedBarcode);
  };

  // Function to submit the batch
  const handleSubmit = () => {
    console.log("Batch submitted:", batch);
    console.log("item selected:", selected);
    // TODO send the batch data to the backend WITH quantity
    // clear batch
  };

  // Function to handle the button click for each item
  const handleItemButtonClick = (itemId) => {
    // TODO: Add your logic for handling the button click for the specific item
    setSelected(itemId);
  };

  // TEST function to generate a random barcode
  const generateRandomBarcode = () => {
    return Math.floor(Math.random() * 1000000000).toString();
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1>Stock Receiving</h1>
        <div>
          <input
            type="text"
            placeholder="Enter barcode manually"
            value={barcode}
            onChange={handleManualEntry}
          />
          <button onClick={() => addLine(barcode)}>Add Manually</button>
          <button onClick={handleScan}>Scan Barcode</button>
        </div>
        <div>
          <h2>Batch Details</h2>
          <ul>
            {batch.map((barcodeValue, index) => (
              <li key={index}>{barcodeValue}</li>
            ))}
          </ul>
          <button onClick={handleSubmit}>Submit Batch</button>
        </div>
      </div>
      <div style={{ marginLeft: "auto", padding: "46px" }}>
        <h2>Product Order Details</h2>
        {/* Display items in a table with lines between cells */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Quantity</th>
              <th style={tableHeaderStyle}>SI Number</th>
              <th style={tableHeaderStyle}>Vælg</th>
              {/* Add other table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {posts.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{item.Name}</td>
                <td style={tableCellStyle}>{item.Quantity}</td>
                <td style={tableCellStyle}>{item.item_id}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleItemButtonClick(item.item_id)}>
                    Scan
                  </button>
                </td>
                {/* Add other table cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tableHeaderStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default StockReceiving;
