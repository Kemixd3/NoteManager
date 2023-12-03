import { useState, useEffect } from "react";
import "./NewBatch.css";
import { current } from "@reduxjs/toolkit";

export default function BatchDialog({
  selectedItem,
  handleCloseDialog,
  recieved_goods,
  userData,
  items,
  
}) {
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
      console.log(recieved_goods, "CMONS2");

      setRecievedGoods(recieved_goods[0]);
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      
      if (!response.ok) {
        throw new Error("Error creating batch");
      }
      const data = await response.json();
      console.log("Batch created successfully:", data);


        const itemData = {
          received_goods_id: 10,
          Name: items[0].barcode,
          Quantity: 10,
          SI_number: "6",
          is_batch: 1,
          createdBy: "KR35aNh3lfPeJbs7bp9rQ1j0be22qfsHvXfQJZkrM",
        };
      
        console.log("right before", itemData);
      
          const itemResponse = await fetch('http://localhost:3001/receiving/received_goods_items', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
          });
        
          console.log("right after");
        
          if (!itemResponse.ok) {
            const errorData = await itemResponse.json();
            console.error("Error creating item:", errorData);
            throw new Error("Error creating item");
          }





    await handleCloseDialog();







  //  try {
  //    items.forEach(async (element) => {
  //      console.log("before", element);
//
  //      const itemData = {
  //        received_goods_id: recievedGoodsData.received_goods_id,
  //        Name: element.barcode,
  //        Quantity: parseInt(element.quantity),
  //        SI_number: formData.SI_number,
  //        is_batch: 1,
  //        createdBy: userData,
  //      };
  //    
  //      console.log("right before", itemData);
  //    
  //        const itemResponse = await fetch('http://localhost:3001/receiving/received_goods_items', {
  //          method: "POST",
  //          headers: {
  //            "Content-Type": "application/json",
  //          },
  //          body: JSON.stringify(itemData),
  //        });
  //      
  //        console.log("right after");
  //      
  //        if (!itemResponse.ok) {
  //          const errorData = await itemResponse.json();
  //          console.error("Error creating item:", errorData);
  //          throw new Error("Error creating item");
  //        }
  //      });
  //    } catch (error) {
  //      console.error("Network error:", error.message);
  //      // Handle the error as needed
  //    }
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

          <h4>
            Creating material for batch
          </h4>
          {items.map((element, index) => (
            <div key={index}>
              <p>Item {index + 1}</p>
              <p>Name: {element.barcode}</p>
              <p>Quantity: {element.quantity}</p>
              {/* Add more details if needed */}
              <hr />
            </div>
          ))}
          {/* Submit here */}
          <button type="submit">Save</button>
          <button onClick={handleCloseDialog}>Close</button>
        </form>
      </dialog>
    </div>
  );
}
