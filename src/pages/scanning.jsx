import React, { useState, useEffect, Dialog } from "react";
import { useParams } from "react-router-dom";
import BatchDialog from "../components/NewBatch";
import axios from "axios";

const StockReceiving = ({ userData }) => {
  const [post, setPost] = React.useState(null);
  const [selected, setSelected] = useState([]);
  const [newbatches, newsetAllBatches] = useState([]);
  const [editableItems, setEditableItems] = useState([]); // State to track editable items
  const [editedValues, setEditedValues] = useState({});
  const [batch, setBatchGoods] = useState([]);
  const [batches, setAllBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [quantity, setQuantity] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState({});

  const [receivedGoodsData, setReceivedGoods] = useState([]);
  const [reload, ReloadOrders] = useState([]);

  const [EditableItemsInBatch, setEditableItemsInBatch] = useState([]); // State to track editable items

  const [barcode, setBarcode] = useState("");
  const { id } = useParams(); // Retrieve the ID from the route parameters

  const [userId, setUserId] = useState(userData.userId);

  console.log(userData, "USER");

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
        console.log("receivedData", receivedData);
        setReceivedGoods(receivedData.receivedGoods);

        getBatches(receivedData.receivedGoods[0].received_goods_id);

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

  async function getBatches(received_goods_id) {
    await axios
      .get(`http://localhost:3001/batches/${received_goods_id}`)
      .then((response) => {
        console.log(response.data);
        newsetAllBatches(response.data);
      });
  }

  const handleEditButtonClick = (item) => {
    setEditableItems([item]);
  };

  const handleItemSaveButtonClick = (item) => {
    setEditableItemsInBatch((SelectedBatchItems) =>
      SelectedBatchItems.filter(
        (EditableItemsInBatch) => EditableItemsInBatch !== item
      )
    );
  };

  const handleItemSelectButtonClick = async (item) => {
    setSelectedBatch(item);

    setBatchGoods([]);

    try {
      const response = await fetch(
        `http://localhost:3001/receiving/received_goods_items/${item.batch_id}/${item.si_number}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        //setSelectedBatchItems(data.receivedGoodsItems);
        setBatchGoods(data.receivedGoodsItems); // Assuming the response has a 'receivedGoodsItems' property
      } else {
        const errorMessage = await response.text();
        console.error("Failed to fetch data:", response.status, errorMessage);
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Handle network errors or other exceptions
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

  const addLine = (barcodeValue, quantityValue, userId) => {
    console.log(selectedBatch.si_number);

    //FIX quantity and barcodeValue
    setBatchGoods([
      ...batch,
      {
        Name: barcodeValue,
        Quantity: 10,
        createdBy: userId,
        SI_number: selectedBatch.si_number,
      },
    ]);
  };

  //Manual barcode
  const handleManualEntry = (event) => {
    const { value } = event.target;
    setBarcode(value);
  };

  //Function to handle scanning
  const handleScan = () => {
    //TEST Simulating a scanned barcode value - FIX replace with actual scanning
    const scannedBarcode = generateRandomBarcode();
    setBarcode(scannedBarcode);
    addLine(scannedBarcode);
  };

  //Function to select batch before batchDialog
  const handleSubmit = () => {
    if (selected.item_type == "Tablet") {
      setSelectedItem(selected);
      setIsDialogOpen(true);
    } else {
      console.log("component or tablet");
    }
  };

  const handleRowClick = (data) => {
    //setSelectedBatchItems([]);
    setBatchGoods([]);
    setFilteredBatches(
      newbatches.filter((element) => element.si_number == data.SI_number)
    );

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
        <button onClick={() => addLine(barcode, quantity, userId)}>
          Add Manually
        </button>
        <button onClick={handleScan}>Scan Barcode</button>
        <button onClick={handleSubmit}>Submit Batch</button>
        <h2>Stock Receiving</h2>
        <div>
          <input
            type="text"
            placeholder="Enter barcode manually"
            value={barcode}
            onChange={handleManualEntry}
          />
          <input
            type="text"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Line</th>
                <th style={tableHeaderStyle}>Barcode*</th>
                <th style={tableHeaderStyle}>Quantity</th>
                <th style={tableHeaderStyle}>SI Number</th>
              </tr>
            </thead>
            <tbody>
              {batch.map((item, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{item.Name}</td>
                  <td style={tableCellStyle}>{item.Quantity}</td>
                  <td style={tableCellStyle}>{item.SI_number}</td>
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
              <th style={tableHeaderStyle}>SI Number</th>
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
                      value={
                        editedValues[item.id]?.batch_name || item.batch_name
                      }
                      onChange={(event) => handleInputChange(event, item)}
                    />
                  ) : (
                    item.batch_name
                  )}
                </td>
                <td style={tableCellStyle}>{item.createdBy}</td>

                <td style={tableCellStyle}>{item.si_number}</td>

                <td style={tableCellStyle}>
                  {editableItems.includes(item) ? (
                    <button onClick={() => handleItemSaveButtonClick(item)}>
                      Save
                    </button>
                  ) : (
                    <button onClick={() => handleItemSelectButtonClick(item)}>
                      Select
                    </button>
                  )}
                </td>
                <td style={tableCellStyle}>
                  {editableItems.includes(item) ? (
                    <button onClick={() => handleSaveButtonClick(item)}>
                      Save
                    </button>
                  ) : (
                    <button onClick={() => handleEditButtonClick(item)}>
                      Edit
                    </button>
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
              <th style={tableHeaderStyle}>Select</th>
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
                  <button onClick={() => handleRowClick(item)}>Select</button>
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
            selectedBatch={selectedBatch}
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

//{batch.map((item, index) => (
//  <tr key={index}>
//    <td style={tableCellStyle}>{item.barcode}</td>
//    <td style={tableCellStyle}>{item.quantity}</td>
//  </tr>
// ))}

//          <td style={tableCellStyle}>
//        </td>            {editableItems.includes(item) ? (
//              <input
//                type="text"
//                name="received_date"
//                value={
//                  editedValues[item.id]?.received_date ||
//                  item.received_date
//                }
//                onChange={(event) => handleInputChange(event, item)}
//              />
//            ) : (
//              item.received_date
//          )}
//          </td>
