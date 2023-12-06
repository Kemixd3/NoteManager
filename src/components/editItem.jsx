import { useState, useEffect } from "react";
import "./NewBatch.css";
import { current } from "@reduxjs/toolkit";

export default function EditDialog({
  edit,
  handleCloseDialog,
}) {
  const [formData, setFormData] = useState({
    Name: edit.Name,
    Quantity: edit.Quantity,
    SI_number: edit.SI_number,
    createdBy: edit.createdBy,
    received_goods_id:edit.received_goods_id,
    received_item_id:edit.received_item_id,
    QuantityPO:edit.QuantityPO
  });
  console.log("sdawdawda",formData);
  const [recievedGoodsData, setRecievedGoods] = useState([]);

  useEffect(() => {
    if (recievedGoodsData) {
      setRecievedGoods(recievedGoodsData[0]);
    }
  }, [edit.Name, edit.Quantity, edit.SI_number, edit.createdBy]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await fetch(`http://localhost:3001/receiving/received_goods_items/${formData.received_item_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: formData.Name,
        Quantity: formData.Quantity,
        SI_number: formData.SI_number,
        createdBy: formData.createdBy,
        QuantityPO: formData.QuantityPO,
        received_goods_id: formData.received_goods_id
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message); // Log the success message
    } else {
      const errorData = await response.json();
      console.error('Error updating received goods item:', errorData.error);
    }

    handleCloseDialog();
  };

  const validateQuantityChange = (e) => {
    const inputQuantity = parseInt(e.target.value);
    setFormData({ ...formData, Quantity: inputQuantity });
  };

  return (
    <div className="backdrop">
      <dialog className="dialog" open>
        <form onSubmit={handleSubmit}>
          {/* Render form fields to edit data */}
          <h4>Editing received goods item {formData.received_item_id}</h4>
          <div>
            <label htmlFor="barcode">Barcode</label>
            <input
              id="barcode"
              type="text"
              value={formData.Name || ""}
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="text"
              value={formData.Quantity || ""}
              onChange={(e) => validateQuantityChange(e)}
            />
          </div>
          {/* Add other fields as needed */}
          <button type="submit">Save</button>
        </form>
        <button onClick={handleCloseDialog}>Close</button>
      </dialog>
    </div>
  );
}
