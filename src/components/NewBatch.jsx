import React, { useState, useEffect } from "react";

export default function BatchDialog({ selectedItem, handleCloseDialog }) {
  const [formData, setFormData] = useState({});
  console.log(selectedItem, "formdata");
  const [receivedOrderId, setReceivedOrderId] = useState("");

  useEffect(() => {
    //populate form
    if (selectedItem) {
      setFormData(selectedItem);
      console.log(formData, "formdata");
    }
  }, [selectedItem]);

  const handleSubmit = () => {
    //handle form submission (e.g., API calls)
    //send data to your backend

    console.log(formData, "formdata");
    //close dialog
    handleCloseDialog();
  };

  return (
    <dialog open>
      <form onSubmit={handleSubmit}>
        {/* here render form fields to edit data */}
        <input
          type="text"
          value={formData.Name || ""}
          onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
        />

        {/* Submit here */}
        <button type="submit">Save</button>
      </form>
      <button onClick={handleCloseDialog}>Close</button>
    </dialog>
  );
}
