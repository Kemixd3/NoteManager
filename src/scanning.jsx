import React, { useState, useEffect } from "react";
import { useDarkMode } from "./Context/DarkmodeContext";
import { useParams } from "react-router-dom";

const StockReceiving = ({ userData }) => {
  const [batch, setBatch] = useState([]);
  const [batches, setAllBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [posts, setPosts] = useState([]);

  const [selected, setSelected] = useState([]);
  const [barcode, setBarcode] = useState("");
  const { id } = useParams(); // Retrieve the ID from the route parameters


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
  
      // batch details: 

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
    setFilteredBatches(batches.filter((element) => element.si_number === itemId))
    console.log(filteredBatches);
    setSelected(itemId);
  };

  // TEST function to generate a random barcode
  const generateRandomBarcode = () => {
    return Math.floor(Math.random() * 1000000000).toString();
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={sectionStyle}>
        <h2>Stock Receiving</h2>
          <div style={buttonContainerStyle}>
        <div>
          <input
            type="text"
            placeholder="Enter barcode"
            value={barcode}
            onChange={handleManualEntry}
            style={{ width: "24%", padding: "8px" }} // Adjust width and padding
          />
            <button style={buttonStyle} onClick={() => addLine(barcode)}>
              Add Manually
            </button>
            <button style={buttonStyle} onClick={handleScan}>
              Scan Barcode
            </button>
            <button style={buttonStyle} onClick={handleSubmit}>
              Submit Batch
            </button>
          </div>
        </div>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>


            <tbody>
              {batch.map((item, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>{index+1}</td>
                  <td style={tableCellStyle}>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
      
        </div>
      </div>



      <div style={{ flex: 1, padding: "46px" }}>
        <h2>Batch Details</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Made by</th>
              <th style={tableHeaderStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{item.batch_name}</td>
                <td style={tableCellStyle}>{item.createdBy}</td>
                <td style={tableCellStyle}>{item.received_date}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1, padding: "46px" }}>
        <h2>Product Order Details</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}></th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Quantity</th>
              <th style={tableHeaderStyle}>SI Number</th>
              <th style={tableHeaderStyle}>Type</th>
              <th style={tableHeaderStyle}>Vælg</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{index+1}</td>
                <td style={tableCellStyle}>{item.Name}</td>
                <td style={tableCellStyle}>{item.Quantity}</td>
                <td style={tableCellStyle}>{item.item_id}</td>
                <td style={tableCellStyle}>{item.type_id}</td>

                <td style={tableCellStyle}>
                  <button style={cellButton} onClick={() => handleItemButtonClick(item.item_id)}>
                    Scan
                  </button>
                </td>
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
const sectionStyle = {
  flex: 1,
  padding: "46px",
};

const cellButton = {
  padding: 0, // Remove padding
  width: "100%",
  height: "100%",
};

const buttonContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0px", 
};

const buttonStyle = {
  padding: "8px",
  
  width: "25%", 
};

export default StockReceiving;
