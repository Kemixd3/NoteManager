import { useState, useEffect } from "react";
import "./NewBatch.css";
import { current } from "@reduxjs/toolkit";

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
      console.log(formData, "formdatassss");
    }
    if (recieved_goods) {
      console.log(recieved_goods, "CMONS2");

      setRecievedGoods(recieved_goods[0]);
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items && items.length > 0) {
      const filteredItems = items.filter((item) => !item.received_item_id);

      const requestBody = {
        batch_id: selectedBatch.batch_id,
        receivedGoodsItems: filteredItems,
      };

      try {
        const response = await fetch(
          "http://localhost:3001/receiving/received_goods_items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Received goods items added:", data.message);
          // Perform any additional actions after successful addition of items
        } else {
          console.error("Failed to add received goods items:", response.status);
          // Handle the error scenario
        }
      } catch (error) {
        console.error("Error adding received goods items:", error);
        // Handle the error scenario
      }
    } else {
      const currentDate = new Date().toISOString().split("T")[0];

      const batchData = {
        received_date: currentDate, // Consider formatting the date as required by your backend
        batch_name: formData.Name,
        si_number: formData.SI_number, // Ensure the correct case for keys
        createdBy: userData,
        received_goods_received_goods_id: recievedGoodsData.received_goods_id,
      };

      const response = await fetch("http://localhost:3001/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchData),
      });
      const data = await response.json();
      console.log("Batch created successfully:", data);
      handleCloseDialog();

      if (!response.ok) {
        throw new Error("Error creating batch");
      }
    }
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
