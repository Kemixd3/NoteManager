import { useState, useEffect } from "react";
import "./NewBatch.css";
import { current } from "@reduxjs/toolkit";

export default function BatchDialog({
  selectedItem,
  handleCloseDialog,
  recieved_goods,
}) {
  console.log(recieved_goods, "CMONS2");
  const [recievedGoodsData, setRecievedGoods] = useState([]);
  const [formData, setFormData] = useState({});
  const [formQuantityLimit, setQuantity] = useState(selectedItem.Quantity);

  console.log(formQuantityLimit, "formQuantityLimit");
  //const [receivedOrderId, setReceivedOrderId] = useState("");

  useEffect(() => {
    //populate form
    if (selectedItem) {
      setFormData(selectedItem);
      console.log(formData, "formdatassss");
    }
    if (recieved_goods) {
      setRecievedGoods(recieved_goods[0]);
    }
  }, [selectedItem]);

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const batchData = {
      received_date: currentDate, // Consider formatting the date as required by your backend
      batch_name: formData.Name,
      si_number: formData.SI_number, // Ensure the correct case for keys
      createdBy: "KR35aNh3lfPeJbs7bp9rQ1j0be22",
      received_goods_received_goods_id: recievedGoodsData.received_goods_id,
    };

    try {
      const response = await fetch("http://localhost:3001/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchData),
      });

      if (!response.ok) {
        throw new Error("Error creating batch");
      }

      const data = await response.json();
      console.log("Batch created successfully:", data);
      handleCloseDialog();
    } catch (error) {
      console.error("Error creating batch:", error.message);
      // Handle error: show message to the user, retry logic, etc.
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
      <dialog open>
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
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
          />

          <input
            label="Quantity of batch"
            type="text"
            value={formData.Quantity || ""}
            onChange={(e) => validateQuantityChange(e)}
          />

          {/* Submit here */}
          <button type="submit">Save</button>
          <button onClick={handleCloseDialog}>Close</button>
        </form>
      </dialog>
    </div>
  );
}
