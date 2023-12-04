import React, { useState, useEffect, Dialog } from "react";
import { useParams } from "react-router-dom";
import BatchDialog from "../components/NewBatch";
import axios from "axios";
import "./scanning.css";

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
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedButtonIndex, setSelectedButtonIndex] = useState({
    batchDetails: null,
    purchaseOrderDetails: null,
  });

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

  useEffect(() => {
    const handleBarcodeScan = (event) => {
      //Get key code from the scanner
      //scanner sends 'Enter' key after a scan:
      if (event.keyCode === 13) {
        //add line with the scanned barcode value
        addLine(scannedBarcode);
        setScannedBarcode("");
      }
    };

    window.addEventListener("keydown", handleBarcodeScan);

    return () => {
      window.removeEventListener("keydown", handleBarcodeScan);
    };
  }, [scannedBarcode]);

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

        if (Object.keys(selected).length !== 0) {
          setFilteredBatches(
            response.data.filter(
              (element) => element.si_number === selected.SI_number
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching batches:", error);
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
    const batchDetailsButtons = document.querySelectorAll(
      ".batchDetailsButton"
    );

    //remove the class with grey color of all buttons with the class .batchDetailsButton
    batchDetailsButtons.forEach((button) => {
      button.classList.remove("defaultButtonStyle");
    });

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
        setBatchGoods(data.receivedGoodsItems);
      } else {
        const errorMessage = await response.text();
        console.error("Failed to fetch data:", response.status, errorMessage);
      }
    } catch (error) {
      console.error("Error:", error.message);
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
    console.log(batch, "BATCHES");
    setBatchGoods([
      ...batch,
      {
        Name: barcodeValue,
        Quantity: quantity || 1,
        createdBy: userId,
        SI_number: selectedBatch.si_number,
      },
    ]);
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
    setSelectedBatch("");
    setBatchGoods([]);
    setFilteredBatches(
      newbatches.filter((element) => element.si_number == data.SI_number)
    );
    setSelected(data);

    const batchDetailsButtons = document.querySelectorAll(
      ".batchDetailsButton"
    );

    //Reset the background color of all buttons with the class .batchDetailsButton to the default grey
    batchDetailsButtons.forEach((button) => {
      button.classList.add("defaultButtonStyle");
    });

    setSelectedButtonIndex({ ...selectedButtonIndex, batchDetails: null });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);

    getBatches(receivedGoodsData[0].received_goods_id);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1, padding: "0.5%" }}>
        <h2>Stock Receiving</h2>
        <div>
          {Object.keys(selectedBatch).length != 0 && (
            <div>
              <input
                type="text"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <input
                type="text"
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
                placeholder="Scan Barcode Here"
                autoFocus
              />
            </div>
          )}
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
        <button
          onClick={() => {
            handleSubmit();
          }}
        >
          {Object.keys(selectedBatch).length !== 0
            ? "Save Batch"
            : "Submit Batch"}
        </button>
      </div>

      <div style={{ flex: 1, padding: "0.5%" }}>
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
                    <button
                      className="batchDetailsButton"
                      onClick={() => {
                        handleItemSelectButtonClick(item);
                        setSelectedButtonIndex({
                          ...selectedButtonIndex,
                          batchDetails: index,
                        });
                      }}
                      style={{
                        backgroundColor:
                          selectedButtonIndex.batchDetails === index
                            ? "blue"
                            : "",
                      }}
                    >
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

      <div style={{ flex: 1, padding: "0.5%" }}>
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
                  <button
                    onClick={() => {
                      handleRowClick(item);
                      setSelectedButtonIndex({
                        ...selectedButtonIndex,
                        purchaseOrderDetails: index,
                      });
                    }}
                    style={{
                      backgroundColor:
                        selectedButtonIndex.purchaseOrderDetails === index
                          ? "blue"
                          : "",
                    }}
                  >
                    Select
                  </button>
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

//<button onClick={() => addLine(barcode, quantity, userId)}>
//Add Manually
//</button>

//  <button onClick={handleScan}>Scan Barcode</button>
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
