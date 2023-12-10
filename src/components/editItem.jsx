import { useState, useEffect } from "react";
import "./NewBatch.css";
import { updateReceivedGoodsItem } from "../Controller/RecievedGoodsController";

export default function EditDialog({ edit, handleCloseDialog }) {
  const [formData, setFormData] = useState({
    Name: edit.Name,
    Quantity: edit.Quantity,
    SI_number: edit.SI_number,
    createdBy: edit.createdBy,
    received_goods_id: edit.received_goods_id,
    received_item_id: edit.received_item_id,
    QuantityPO: edit.QuantityPO,
  });
  const [recievedGoodsData, setRecievedGoods] = useState([]);

  useEffect(() => {
    if (recievedGoodsData) {
      setRecievedGoods(recievedGoodsData[0]);
    }
  }, [edit.Name, edit.Quantity, edit.SI_number, edit.createdBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateReceivedGoodsItem(formData);

      handleCloseDialog();
    } catch (error) {
      handleCloseDialog();
    }
  };

  const validateQuantityChange = (e) => {
    const inputQuantity = parseInt(e.target.value);
    setFormData({ ...formData, Quantity: inputQuantity });
  };

  return (
    <div className="backdrop">
      <dialog className="dialog" open>
        <form onSubmit={handleSubmit}>
          <h4>Editing received goods item {formData.received_item_id}</h4>
          <label htmlFor="barcode">Barcode</label>
          <div>
            <input
              id="barcode"
              type="text"
              value={formData.Name || ""}
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
            />
          </div>
          <label htmlFor="quantity">Quantity</label>
          <div>
            <input
              id="quantity"
              type="text"
              value={formData.Quantity || ""}
              onChange={(e) => validateQuantityChange(e)}
            />
          </div>
          <button className="me-5" type="submit">
            Save
          </button>
          <button type="button" onClick={handleCloseDialog}>
            Close
          </button>
        </form>
      </dialog>
    </div>
  );
}
