import { useState, useEffect, Dialog } from "react";
import { useParams } from "react-router-dom";
import BatchDialog from "../components/NewBatch";

const StockReceiving = ({ userData }) => {
  const [batch, setBatch] = useState([]);
  const [batches, setAllBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [receivedGoods, setReceivedGoods] = useState([]);
  const [reload, ReloadOrders] = useState([]);

  const [barcode, setBarcode] = useState("");
  const { id } = useParams(); // Retrieve the ID from the route parameters

  const [userId, setUserId] = useState(userData.userId);
  console.log(userId, "USER");

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [postsResponse, batchesResponse, receivedGoods] = await Promise.all(
        [
          fetch(`http://localhost:3001/orders/purchase-order-items/${id}`),
          fetch(`http://localhost:3001/batches`),
          fetch(
            `http://localhost:3001/receiving/received-goods/${id}/${userData.userOrg}`
          ),
        ]
      );

      const postsData = await postsResponse.json();
      const batchesData = await batchesResponse.json();

      const receivedData = await receivedGoods.json();

      if (!receivedData.message) {
        console.log(receivedData, "receivedData");

        setReceivedGoods(receivedData);

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

        fetch("http://localhost:3001/receiving/received-goods", {
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
            console.log("RELOAD");
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

    // TODO send the batch data to the backend WITH quantity
    // clear batch
  };

  const handleRowClick = (data) => {
    console.log(data, "THIS");

    if (data.item_type == "Tablet") {
      setSelectedItem(data);
      setIsDialogOpen(true);
    } else {
      console.log("component or tablet");
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null); // Reset selected item
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
              <th style={tableHeaderStyle}>Line</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Made by</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{item.batch_name}</td>
                <td style={tableCellStyle}>{item.createdBy}</td>
                <td style={tableCellStyle}>{item.received_date}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleRowClick(item)}>Edit</button>
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
              <th style={tableHeaderStyle}>Line</th>
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
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{item.Name}</td>
                <td style={tableCellStyle}>{item.Quantity}</td>
                <td style={tableCellStyle}>{item.item_id}</td>
                <td style={tableCellStyle}>{item.item_type}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleRowClick(item)}>Scan</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isDialogOpen && (
          <BatchDialog
            selectedItem={selectedItem}
            handleCloseDialog={handleCloseDialog}
          />
        )}
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
