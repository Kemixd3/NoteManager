import { useState, useEffect } from "react";
import "./NewBatch.css";
import { current } from "@reduxjs/toolkit";
import { submitReceivedGoods } from "../Controller/RecievedGoodsController";

export default function BatchDialog({
  selectedItem,
  handleCloseDialog,
  recieved_goods,
  userData,
  items,
  selectedBatch,
}) {
  const [recievedGoodsData, setRecievedGoods] = useState([]);
  const [formData, setFormData] = useState({});
  const [formQuantityLimit, setQuantity] = useState(selectedItem.Quantity);

  useEffect(() => {
    //populate form
    if (selectedItem) {
      setFormData(selectedItem);
    }
    if (recieved_goods) {
      setRecievedGoods(recieved_goods[0]);
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await submitReceivedGoods(
      items,
      selectedBatch,
      userData,
      formData,
      recievedGoodsData
    )
      .then((data) => {
        console.log(data, "Submitted");
        handleCloseDialog();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const validateQuantityChange = (e) => {
    if (e.target.value == "") {
      e.target.value = 0;
    }
    const inputQuantity = parseInt(e.target.value);

    const maxQuantity = formQuantityLimit; //set Quantity to the max limit of PO
    if (!isNaN(inputQuantity) && inputQuantity <= maxQuantity) {
      setFormData({ ...formData, Quantity: inputQuantity });
    } else {
      alert("MAX Quantity in the PO is " + maxQuantity);
    }
  };

  return (
    <div className="backdrop">
      <dialog className="dialog" open>
        {items && items.length > 0 ? (
          <div>
            <h4>Adding materials to batch</h4>
            {items.map((element, index) => (
              <div key={index}>
                <p>Item {index + 1}</p>
                <p>SI Number: {element.SI_number}</p>
                <p>Barcode: {element.Name}</p>
                <p>Quantity: {element.Quantity}</p>
                {/* Add more details if needed */}
                <hr />
              </div>
            ))}
            <button onClick={handleSubmit}>Save</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* here render form fields to edit data */}
            <h4>
              Creating a batch for Material {formData.item_type}{" "}
              {formData.SI_number}
            </h4>
            <input
              label="Batch Name"
              type="text"
              value={formData.Name || ""}
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
            />

            <input
              label="Quantity of batch"
              type="text"
              value={formData.Quantity || ""}
              onChange={(e) => validateQuantityChange(e)}
            />
            <button type="submit">Save</button>
          </form>
        )}

        {/* Submit here */}

        <button onClick={handleCloseDialog}>Close</button>
      </dialog>
    </div>
  );
}
