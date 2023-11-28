import { useState, useEffect } from "react";
import "./NewBatch.css";

export default function BatchDialog({ selectedItem, handleCloseDialog }) {
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
  }, [selectedItem]);

  const handleSubmit = () => {
    //handle form submission (e.g., API calls)
    //send data to your backend

    console.log(formData, "SAVED!!");
    //close dialog
    handleCloseDialog();
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
