import { useState, useEffect } from "react";
import "./NewBatch.css";
import { current } from "@reduxjs/toolkit";
import { editBatchC } from "../Controller/BatchesController";

export default function EditBatchDialog({
  edit,
  handleCloseDialog,
}) {
  console.log(edit);
  const [formData, setFormData] = useState({
    BatchName: edit.batch_name,
    CreatedBy: edit.createdBy,
    ReceivedGoodsID: edit.received_goods_received_goods_id,
    SIDate: edit.received_date,
    SINumber: edit.si_number,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editBatchC(edit.batch_id,formData);
    handleCloseDialog();
  };

  return (
    <div className="backdrop">
      <dialog className="dialog" open>
        <form onSubmit={handleSubmit}>
          <h4>Editing batch {edit.batch_id}</h4>
          <div>
            <label htmlFor="batchName">Batch Name</label>
            <input
              id="batchName"
              type="text"
              value={formData.BatchName || ""}
              onChange={(e) =>
                setFormData({ ...formData, BatchName: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="createdBy">Created By</label>
            <input
              id="createdBy"
              type="text"
              value={formData.CreatedBy || ""}
              onChange={(e) =>
                setFormData({ ...formData, CreatedBy: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="receivedGoodsID">Received Goods ID</label>
            <input
              id="receivedGoodsID"
              type="text"
              value={formData.ReceivedGoodsID || ""}
              onChange={(e) =>
                setFormData({ ...formData, ReceivedGoodsID: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="siDate">SI Date</label>
            <input
              id="siDate"
              type="text"
              value={formData.SIDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, SIDate: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="siNumber">SI Number</label>
            <input
              id="siNumber"
              type="text"
              value={formData.SINumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, SINumber: e.target.value })
              }
            />
          </div>
          <button type="submit">Save</button>
        </form>
        <button onClick={handleCloseDialog}>Close</button>
      </dialog>
    </div>
  );
}
