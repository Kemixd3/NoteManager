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
  const [editableItems, setEditableItems] = useState([]);
  const [editedValues, setEditedValues] = useState({});
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
  const handleSubmit = async () => {
    try {
      console.log("Batch submitted:", batch);
      console.log("item selected:", selected);
      const currentDate = new Date();

      // Prepare data to send to the backend
      const data = {
        batch_name: batch[0],
        received_date: currentDate.toISOString(), 
        si_id: selected.SI_number, 
        item_type: selected.item_type, 
        items: [
          {          
          item_name: selected.Name, 
          quantity: selected.quantity, 
          order_id: selected.order_id
          },
        ],
      };
  
      // Send the data to the backend
      const response = await fetch("http://localhost:3001/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers if needed
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        console.log("Batch created successfully");
        // Clear batch or perform any other necessary actions
      } else {
        console.error("Error creating batch:", response.statusText);
        // Handle the error as needed
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      // Handle the error as needed
    }
  };
  

  const handleEditButtonClick = (item) => {
    // Toggle the editing state for the clicked item
    setEditableItems((prevEditableItems) => {
      if (prevEditableItems.includes(item)) {
        return prevEditableItems.filter((editableItem) => editableItem !== item);
      } else {
        return [...prevEditableItems, item];
      }
    });

    // Store the current values of the item for editing
    setEditedValues((prevEditedValues) => ({
      ...prevEditedValues,
      [item.id]: { ...item },
    }));
  };

  const handleInputChange = (event, item) => {
    // Update the edited values when input changes
    const { name, value } = event.target;
    setEditedValues((prevEditedValues) => ({
      ...prevEditedValues,
      [item.id]: {
        ...prevEditedValues[item.id],
        [name]: value,
      },
    }));
  };

  const handleSaveButtonClick = (item) => {
    // Handle saving the edited values
    // Implement the logic to save the edited values, e.g., API call or state update
    console.log("Saving edited values:", editedValues[item.id]);

    // Remove the item from the editableItems array
    setEditableItems((prevEditableItems) =>
      prevEditableItems.filter((editableItem) => editableItem !== item)
    );
  };

  const tableCellStyle = { border: "1px solid black", padding: "8px" };
  const tableHeaderStyle = { border: "1px solid black", padding: "8px", fontWeight: "bold" };


  // Function to handle the button click for each item
  const handleItemButtonClick = (item) => {
    setFilteredBatches(
      batches.filter((element) => element.si_number === item.item_id)
    );
    console.log("filteredBatches",filteredBatches);
    console.log("item",item);

    setSelected(item);
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
              <td style={tableCellStyle}>
                {editableItems.includes(item) ? (
                  <input
                    type="text"
                    name="batch_name"
                    value={editedValues[item.id]?.batch_name || item.batch_name}
                    onChange={(event) => handleInputChange(event, item)}
                  />
                ) : (
                  item.batch_name
                )}
              </td>
              <td style={tableCellStyle}>
                {editableItems.includes(item) ? (
                  <input
                    type="text"
                    name="createdBy"
                    value={editedValues[item.id]?.createdBy || item.createdBy}
                    onChange={(event) => handleInputChange(event, item)}
                  />
                ) : (
                  item.createdBy
                )}
              </td>
              <td style={tableCellStyle}>
                {editableItems.includes(item) ? (
                  <input
                    type="text"
                    name="received_date"
                    value={editedValues[item.id]?.received_date || item.received_date}
                    onChange={(event) => handleInputChange(event, item)}
                  />
                ) : (
                  item.received_date
                )}
              </td>
              <td style={tableCellStyle}>
                {editableItems.includes(item) ? (
                  <button onClick={() => handleSaveButtonClick(item)}>Save</button>
                ) : (
                  <button onClick={() => handleEditButtonClick(item)}>Edit</button>
                )}
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
                  <button onClick={() => handleItemButtonClick(item)}>
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
