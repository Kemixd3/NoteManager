import React, { useState, useEffect } from "react";
import { useDarkMode } from "./Context/DarkmodeContext";
import { useParams } from "react-router-dom";

const StockReceiving = ({userData }) => {
  const [batch, setBatch] = useState([]);
  const [posts, setPosts] = useState([]);
  const [barcode, setBarcode] = useState("");
  const { id } = useParams(); // Retrieve the ID from the route parameters
  console.log("Received ID:", id);

  //const { darkMode, setDarkMode } = useDarkMode();
  //console.log(darkMode, "Scan");


  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch(`http://localhost:3001/orders/product-order-items/${id}`);
        const data = await response.json();
        console.log("a", data);
        setPosts(data);  // Change this line to setBatch
        
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  
    getPosts();
  }, [id]);  // Include id in the dependency array to re-run the effect when id changes
  
  console.log(posts);

  const addLine = (barcodeValue) => {
    setBatch([...batch, barcodeValue]);
  };

  //Manual entry of barcode
  const handleManualEntry = (event) => {
    const { value } = event.target;
    setBarcode(value);
  };

  // Function to handle scanning
  const handleScan = () => {
    //TEST Simulating a scanned barcode value - replace with actual scanning
    const scannedBarcode = generateRandomBarcode(); //TODO replace with actual barcode scanning logic
    setBarcode(scannedBarcode);
    addLine(scannedBarcode);
  };

  //Function to submit the batch
  const handleSubmit = () => {
    console.log("Batch submitted:", batch);
    //TODO send the batch data to backend or add more fields
  };

  //TEST function to generate a random barcode
  const generateRandomBarcode = () => {
    return Math.floor(Math.random() * 1000000000).toString();
  };

  return (
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
  );
};

export default StockReceiving;
