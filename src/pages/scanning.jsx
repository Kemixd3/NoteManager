import React, { useState, useEffect, Dialog } from "react";
import { useParams } from "react-router-dom";
import BatchDialog from "../components/NewBatch";
import axios from "axios";

const StockReceiving = ({ userData }) => {
  const [post, setPost] = React.useState(null);
  const [selected, setSelected] = useState([]);
  const [newbatches, newsetAllBatches] = useState([]);
  const [editableItems, setEditableItems] = useState([]);  // State to track editable items
  const [editedValues, setEditedValues] = useState({}); 
  const [batch, setBatch] = useState([]);
  const [batches, setAllBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [receivedGoodsData, setReceivedGoods] = useState([]);
  const [reload, ReloadOrders] = useState([]);


  const [SelectedBatchItems, setSelectedBatchItems] = useState([]);
  const [EditableItemsInBatch, setEditableItemsInBatch] = useState([]);  // State to track editable items

  

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
        console.log("receivedData",receivedData);
        setReceivedGoods(receivedData.receivedGoods);

        let tempBatches = [];

        //batchesData.batches.forEach((element) => {
        //  if (element.purchase_order_id == id) {
        //    tempBatches.push(element);
        //  }
        //});

        axios
          .get(
            `http://localhost:3001/batches/${receivedData.receivedGoods[0].received_goods_id}`
          )
          .then((response) => {
            console.log(response.data);
            newsetAllBatches(response.data);
          });

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

  const handleEditButtonClick = (item) => {
    setEditableItems([item]);
  };






  
  const handleItemSaveButtonClick = (item) => {
    setEditableItemsInBatch((SelectedBatchItems) =>
      SelectedBatchItems.filter((EditableItemsInBatch) => EditableItemsInBatch !== item)
    );
  };

const handleItemSelectButtonClick = async (item) => {
  console.log("item", item);

  try {
    const response = await fetch(`/received_goods_items?received_goods_id=${item.received_goods_received_goods_id}&si_number=${item.si_number}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setSelectedBatchItems([item]);
    } else {
      console.error('Failed to fetch data:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};






  const handleInputChange = (event, item) => {
    const { name, value } = event.target;
    setEditedValues((prevValues) => ({
      ...prevValues,
      [item.id]: {
        ...prevValues[item.id],
        [name]: value,
      },
    }));
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
    console.log("fuck",batch);
    if (selected.item_type == "Tablet") {
      setSelectedItem(selected);
      setIsDialogOpen(true);
    } else {
      console.log("component or tablet");
    }

  };

  const handleRowClick = (data) => {
    setFilteredBatches(newbatches.filter((element) => element.si_number == data.SI_number));


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


      <div style={{ flex: 1, padding: "46px", position: "absolute", bottom: 0 }}>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {SelectedBatchItems.map((item, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>{index + 1}</td>
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
            <td style={tableCellStyle}>Select</td>

            <th style={tableHeaderStyle}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredBatches.map((item, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{index + 1}</td>

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
                  <button onClick={() => handleItemSaveButtonClick(item)}>Save</button>
                ) : (
                  <button onClick={() => handleItemSelectButtonClick(item)}>Select</button>
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
                <td style={tableCellStyle}>{item.SI_number}</td>
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
            selectedItem={selected}
            handleCloseDialog={handleCloseDialog}
            recieved_goods={receivedGoodsData}
            userData={userId}
            items={batch}
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
