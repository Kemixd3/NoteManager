import React, { useState, useEffect, Dialog } from "react";
import { useParams } from "react-router-dom";
import BatchDialog from "../components/NewBatch";
import axios from "axios";

const StockReceiving = ({ userData }) => {
  const [post, setPost] = React.useState(null);
  const [selected, setSelected] = useState([]);

  const [batch, setBatch] = useState([]);
  const [batches, setAllBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [receivedGoodsData, setReceivedGoods] = useState([]);
  const [reload, ReloadOrders] = useState([]);

  const [barcode, setBarcode] = useState("");
  const { id } = useParams(); // Retrieve the ID from the route parameters

  const [userId, setUserId] = useState(userData.userId);
  console.log(userId, "USER");

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [postsResponse, receivedGoods] = await Promise.all([
        fetch(`http://localhost:3001/orders/purchase-order-items/${id}`),

        fetch(
          `http://localhost:3001/receiving/received-goods/${id}/${userData.userOrg}`
        ),
      ]);

      const postsData = await postsResponse.json();

      const receivedData = await receivedGoods.json();

      if (!receivedData.message) {
        setReceivedGoods(receivedData.receivedGoods);

        let tempBatches = [];

        //batchesData.batches.forEach((element) => {
        //  if (element.purchase_order_id == id) {
        //    tempBatches.push(element);
        //  }
        //});

        axios
          .get(
            "http://localhost:3001/batches/" +
              receivedData.receivedGoods[0].received_goods_id
          )
          .then((response) => {
            setAllBatches(response.data);
            console.log(batches, "THEBATCH");
          });

        console.log(batches, "THEBATCH");
        console.log(tempBatches);
        setPosts(postsData.purchaseOrderItems);
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

  const handleSaveButtonClick = (item) => {
    console.log("Saving edited values:", editedValues[item.id]);

    setEditableItems((prevEditableItems) =>
      prevEditableItems.filter((editableItem) => editableItem !== item)
    );
  };

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
    const currentDate = new Date();

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
    
    if (response.ok) {
      console.log("Batch created successfully");
      // Clear batch or perform any other necessary actions
    } else {
      console.error("Error creating batch:", response.statusText);
      // Handle the error as needed
    }

    if (selected.item_type == "Tablet") {
      setSelectedItem(selected);
      setIsDialogOpen(true);
    } else {
      console.log("component or tablet");
    }


    // TODO send the batch data to the backend WITH quantity
    // clear batch
  };

  const handleRowClick = (data) => {
    console.log("a",data);
    console.log("bbbbbb",receivedGoodsData);

    setFilteredBatches(
      receivedGoodsData.filter((element) => element.received_goods_id === data.SI_number)
    );
    console.log("ffff",filteredBatches);
    setSelected(data);
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
            recieved_goods={receivedGoodsData}
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
