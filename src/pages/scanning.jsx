import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const StockReceiving = ({ userData }) => {
  const [batch, setBatch] = useState([]);
  const [batches, setAllBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [receivedOrder, setReceivedOrder] = useState([]);
  const [reload, ReloadOrders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [barcode, setBarcode] = useState("");
  const { id } = useParams(); // Retrieve the ID from the route parameters

  useEffect(() => {
    const fetchData = async () => {
      const [postsResponse, batchesResponse, receivedOrders] =
        await Promise.all([
          fetch(`http://localhost:3001/orders/purchase-order-items/${id}`),
          fetch(`http://localhost:3001/batches`),
          fetch(
            `http://localhost:3001/receiving/received-orders/${id}/${userData.userOrg}`
          ),
        ]);

      const postsData = await postsResponse.json();
      const batchesData = await batchesResponse.json();

      const receivedData = await receivedOrders.json();

      if (!receivedData.message) {
        console.log(receivedData, "receivedData");

        setReceivedOrder(receivedData);

        let tempBatches = [];

        batchesData.batches.forEach((element) => {
          if (element.purchase_order_id == id) {
            tempBatches.push(element);
          }
        });
        console.log(tempBatches);
        setPosts(postsData.purchaseOrderItems);
        setAllBatches(tempBatches);
      } else {
        const currentDate = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        fetch("http://localhost:3001/receiving/received-orders", {
          method: "POST",
          body: JSON.stringify({
            received_date: currentDate,
            purchase_order_id: id,
            Organization: userData.userOrg,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }).then((response) => {
          if (response.status === 201) {
            ReloadOrders([]);
          }
        });
      }
    };

    fetchData();
  }, [id, reload]);

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

  const handleEditButtonClick = (item) => {
    // Call edit batch
    console.log(item);
  };

  // Function to handle the button click for each item
  const handleItemButtonClick = (itemId) => {
    setFilteredBatches(
      batches.filter((element) => element.si_number === itemId)
    );
    console.log(filteredBatches);
    setSelected(itemId);
  };

  // TEST function to generate a random barcode
  const generateRandomBarcode = () => {
    return Math.floor(Math.random() * 1000000000).toString();
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1, padding: "46px" }}>
        <h2>Stock Receiving</h2>
        <div>
          <input
            type="text"
            placeholder="Enter barcode manually"
            value={barcode}
            onChange={handleManualEntry}
          />
          <button onClick={() => addLine(barcode)}>Add Manually</button>
          <button onClick={handleScan}>Scan Barcode</button>
          <button onClick={handleSubmit}>Submit Batch</button>
        </div>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {batch.map((item, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>{index + 1}</td>
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
              <th style={tableHeaderStyle}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{item.batch_name}</td>
                <td style={tableCellStyle}>{item.createdBy}</td>
                <td style={tableCellStyle}>{item.received_date}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleEditButtonClick(item)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1, padding: "46px" }}>
        <h2>Purchase Order Details</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
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
                <td style={tableCellStyle}>{item.Name}</td>
                <td style={tableCellStyle}>{item.Quantity}</td>
                <td style={tableCellStyle}>{item.item_id}</td>
                <td style={tableCellStyle}>{item.item_type}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleItemButtonClick(item.item_id)}>
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

export default StockReceiving;
