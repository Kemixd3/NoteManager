import { useState } from "react";
import { useDarkMode } from "./Context/DarkmodeContext";
import { useParams } from "react-router-dom";

const StockReceiving = () => {
  const [batch, setBatch] = useState([]);
  const [barcode, setBarcode] = useState("");
  const { darkMode, setDarkMode } = useDarkMode();
  const { id } = useParams(); // Retrieve the ID from the route parameters

  console.log(darkMode, "Scan");
  console.log("Received ID:", id);

  //Add a new line to the batch
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
