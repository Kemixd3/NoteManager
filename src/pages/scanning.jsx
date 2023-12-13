import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BatchDialog from "../components/NewBatch";
import EditDialog from "../components/editItem";
import {
  trashIconStyle,
  defaultIconStyle,
  tableHeaderStyle,
  tableCellStyle,
} from "../store/cssStore";
import EditBatchDialog from "../components/editBatch";
import { Trash3Fill, FilePlusFill, GearFill } from "react-bootstrap-icons";
import { FormProvider, useForm } from "react-hook-form";
import ScanForm from "../components/ScanForm";
import "./scanning.css";
import {
  fetchReceivedGoods,
  postReceivedGoods,
  fetchReceivedGoodsItemsApi,
  deleteReceivingItemApi,
} from "../Controller/RecievedGoodsController";
import { fetchBatches, deleteBatch } from "../Controller/BatchesController";
import { fetchPurchaseOrderItems } from "../Controller/PurchaseOrderRoutes";

const StockReceiving = ({ userData }) => {
  const [selected, setSelected] = useState([]);
  const [batches, setAllBatches] = useState([]);
  const [recieved_goods_items, setBatchGoods] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState({});
  const [receivedGoodsData, setReceivedGoods] = useState([]);
  const [reload, ReloadOrders] = useState([]);
  const { id } = useParams(); //Get PO ID from the route
  const userId = userData.userid;
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [EditItem, setEditItem] = useState(null);
  const [EditBatch, setEditBatch] = useState(null);
  const [Reseived_goods_id, setReceivedGoodsId] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [filePlusFillColors, setFilePlusFillColors] = useState({});
  const [selectedButtonIndex, setSelectedButtonIndex] = useState({
    batchDetails: null,
    purchaseOrderDetails: null,
  });
  const methods = useForm();
  document.title = "Scanning";

  useEffect(() => {
    const fetchData = async () => {
      const [postsResponse, receivedGoods] = await Promise.all([
        fetchPurchaseOrderItems(id),
        fetchReceivedGoods(id, userData.Organization),
      ]);

      const postsData = postsResponse;
      const receivedData = receivedGoods;

      if (receivedData) {
        setReceivedGoods(receivedData.receivedGoods);
        setReceivedGoodsId(receivedData.receivedGoods[0].received_goods_id);
        setPosts(postsData.purchaseOrderItems);
      } else {
        const success = await postReceivedGoods(id, userData.Organization);
        if (success) {
          //Rerun the useffect
          ReloadOrders([]);
        }
      }
    };
    fetchData();
  }, [id, reload]);

  useEffect(() => {
    const handleBarcodeScan = (event) => {
      //Get key code from the scanner
      //scanner sends 'Enter' key after a scan:
      if (event.keyCode === 13) {
        addLine(scannedBarcode); //add line with the scanned barcode value
        setScannedBarcode("");
      }
    };
    window.addEventListener("keydown", handleBarcodeScan);
    return () => {
      window.removeEventListener("keydown", handleBarcodeScan);
    };
  }, [scannedBarcode]);

  async function getBatches(received_goods_id, si_number) {
    fetchBatches(received_goods_id, si_number)
      .then((data) => {
        setAllBatches(data);
        if (data) {
          setFilteredBatches(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const fetchReceivedGoodsItems = async (batchId, siNumber) => {
    await fetchReceivedGoodsItemsApi(batchId, siNumber)
      .then((receivedGoodsItems) => {
        //received goods items data
        setBatchGoods(receivedGoodsItems);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleItemSelectButtonClick = async (item) => {
    const batchDetailsButtons = document.querySelectorAll(
      ".batchDetailsButton"
    );

    //Remove class with grey color of all buttons with the class .batchDetailsButton
    batchDetailsButtons.forEach((button) => {
      button.classList.remove("defaultButtonStyle");
    });

    setSelectedBatch(item);
    setBatchGoods([]);

    try {
      await fetchReceivedGoodsItems(item.batch_id, item.si_number);
    } catch (error) {
      console.log("Error getting Goods");
    }
  };

  const addLine = (barcodeValue, quantityValue) => {
    if (
      selectedBatch.si_number &&
      quantityValue &&
      userId &&
      receivedGoodsData[0].received_goods_id
    ) {
      setBatchGoods([
        ...recieved_goods_items,
        {
          Name: barcodeValue,
          Quantity: quantityValue || 1,
          createdBy: userId,
          SI_number: selectedBatch.si_number || "error",
          received_goods_id: receivedGoodsData[0].received_goods_id,
        },
      ]);
    }
  };

  //Function to select batch before batchDialog
  const handleSubmit = () => {
    if (["Tablet", "Part", "Component"].includes(selected.item_type)) {
      setSelectedItem(selected);
      setIsDialogOpen(true);
    } else {
      console.log("component, tablet or part types only");
    }
  };

  const handleEditItem = async (item) => {
    posts.forEach((element) => {
      if (element.SI_number == item.SI_number) {
        item.QuantityPO = element.Quantity;
        setEditItem(item);
        setItemDialogOpen(true);
      }
    });
  };

  const handleEditBatch = async (item) => {
    filteredBatches.forEach((element) => {
      if (element.batch_id == item.batch_id) {
        setEditBatch(item);
        setBatchDialogOpen(true);
      }
    });
  };

  const handleRowClick = async (data, index) => {
    const updatedColors = {};
    for (let i = 0; i < posts.length; i++) {
      updatedColors[i] = "";
    }
    updatedColors[index] =
      selectedButtonIndex.purchaseOrderDetails !== index ? "blue" : "";

    setFilePlusFillColors({ ...updatedColors });
    await getBatches(Reseived_goods_id, data.SI_number);

    setSelectedBatch({});
    setBatchGoods([]);
    setFilteredBatches(
      batches.filter((element) => element.si_number == data.SI_number)
    );
    setSelected(data);

    const batchDetailsButtons = document.querySelectorAll(
      ".batchDetailsButton"
    );

    batchDetailsButtons.forEach((svg) => {
      svg.classList.add("defaultButtonStyle"); //Reset the background color of all buttons with the class .batchDetailsButton to the default grey
      svg.classList.remove("batchDetailsButtons");
    });

    setSelectedButtonIndex({ ...selectedButtonIndex, batchDetails: null });
  };

  //FIX THE NAMING HERE ON THESE TWO
  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
    setEditItem(null);
    fetchReceivedGoodsItems(selectedBatch.batch_id, selectedBatch.si_number);
  };
  const handleBatchDelete = async (batchId) => {
    await deleteBatch(batchId)
      .then(() => {
        getBatches(receivedGoodsData[0].received_goods_id, selected.SI_number);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCloseBatchDialog = async () => {
    try {
      setBatchDialogOpen(false);
      setEditBatch(null);
    } catch (error) {
      console.error("Error updating batch:", error.message);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    getBatches(receivedGoodsData[0].received_goods_id, selected.SI_number);
  };

  async function deleteReceivingItem(line, index) {
    if (!line && index >= 0 && index < recieved_goods_items.length) {
      //Slice the array into two parts (above and below elements index)
      const itemsAboveIndex = recieved_goods_items.slice(0, index); //before
      const itemsBelowIndex = recieved_goods_items.slice(index + 1); //after
      const updatedBatch = itemsAboveIndex.concat(itemsBelowIndex); //Combine arrays to create updated array
      setBatchGoods(updatedBatch);
    } else {
      await deleteReceivingItemApi(line)
        .then((isDeleted) => {
          if (isDeleted) {
            fetchReceivedGoodsItems(
              selectedBatch.batch_id,
              selectedBatch.si_number
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1, padding: "0.5%" }}>
        <h2>Purchase Order Details</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>#</th>
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
                  <FilePlusFill
                    size={40}
                    onClick={() => {
                      setSelectedButtonIndex({
                        ...selectedButtonIndex,
                        purchaseOrderDetails: index,
                      });
                      handleRowClick(item, index);
                    }}
                    style={{
                      ...defaultIconStyle,
                      color: filePlusFillColors[index],
                    }}
                  />
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
            items={recieved_goods_items}
            selectedBatch={selectedBatch}
          />
        )}
        {itemDialogOpen && (
          <EditDialog
            edit={EditItem}
            handleCloseDialog={handleCloseItemDialog}
          />
        )}
        {batchDialogOpen && (
          <EditBatchDialog
            edit={EditBatch}
            handleCloseDialog={handleCloseBatchDialog}
          />
        )}
      </div>

      <div style={{ flex: 1, padding: "0.5%" }}>
        <h2>Batch Details</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>#</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Made by</th>
              <th style={tableHeaderStyle}>SI Number</th>
              <th style={tableHeaderStyle}>Select</th>
              <th style={tableHeaderStyle}>Edit</th>
              <th style={tableHeaderStyle}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{item.batch_name}</td>
                <td style={tableCellStyle}>{item.createdBy}</td>

                <td style={tableCellStyle}>{item.si_number}</td>
                <td style={tableCellStyle}>
                  <FilePlusFill
                    size={40}
                    className="batchDetailsButton"
                    onClick={() => {
                      handleItemSelectButtonClick(item);
                      setSelectedButtonIndex({
                        ...selectedButtonIndex,
                        batchDetails: index,
                      });
                    }}
                    style={{
                      ...defaultIconStyle,
                      color:
                        selectedButtonIndex.batchDetails === index
                          ? "blue"
                          : "inherit",
                    }}
                  />
                </td>

                <td style={tableCellStyle}>
                  <GearFill
                    size={33}
                    onClick={() => {
                      handleEditBatch(item);
                    }}
                    style={defaultIconStyle}
                  />
                </td>

                <td style={tableCellStyle}>
                  <Trash3Fill
                    size={33}
                    style={trashIconStyle}
                    onClick={() => handleBatchDelete(item.batch_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1, padding: "0.5%" }}>
        <h2>Stock Receiving</h2>

        <div>
          {Object.keys(selectedBatch).length != 0 && (
            <FormProvider {...methods}>
              <ScanForm addLine={addLine} />
            </FormProvider>
          )}
        </div>

        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>#</th>
                <th style={tableHeaderStyle}>Batch/Serial number*</th>
                <th style={tableHeaderStyle}>Quantity</th>
                <th style={tableHeaderStyle}>SI Number</th>
                <th style={tableHeaderStyle}>Edit</th>
                <th style={tableHeaderStyle}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {recieved_goods_items.map((item, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{item.Name}</td>
                  <td style={tableCellStyle}>{item.Quantity}</td>
                  <td style={tableCellStyle}>{item.SI_number}</td>
                  <td style={tableCellStyle}>
                    <GearFill
                      size={33}
                      onClick={() => {
                        handleEditItem(item);
                      }}
                      style={defaultIconStyle}
                    />
                  </td>
                  <td style={tableCellStyle}>
                    <Trash3Fill
                      size={33}
                      style={trashIconStyle}
                      onClick={() => {
                        deleteReceivingItem(item.received_item_id, index);
                      }}
                    />
                  </td>
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
    </div>
  );
};

export default StockReceiving;
