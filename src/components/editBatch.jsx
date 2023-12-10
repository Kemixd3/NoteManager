import { useState } from "react";
import "./NewBatch.css";
import { UpdateBatch } from "../Controller/BatchesController";

export default function EditBatchDialog({ edit, handleCloseDialog }) {
  const [formData, setFormData] = useState({
    BatchName: edit.batch_name,
    CreatedBy: edit.createdBy,
    ReceivedGoodsID: edit.received_goods_received_goods_id,
    SIDate: edit.received_date,
    SINumber: edit.si_number,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await UpdateBatch(edit.batch_id, formData);
    handleCloseDialog();
  };

  return (
    <div className="backdrop">
      <dialog className="dialog" open>
        <form onSubmit={handleSubmit}>
          <h4>Editing batch {edit.batch_id}</h4>
          <label htmlFor="batchName">Batch Name</label>
          <div>
            <input
              id="batchName"
              type="text"
              value={formData.BatchName || ""}
              onChange={(e) =>
                setFormData({ ...formData, BatchName: e.target.value })
              }
            />
          </div>

          <label htmlFor="receivedGoodsID">Received Goods ID</label>
          <div>
            <input
              id="receivedGoodsID"
              type="text"
              value={formData.ReceivedGoodsID || ""}
              onChange={(e) =>
                setFormData({ ...formData, ReceivedGoodsID: e.target.value })
              }
            />
          </div>

          <label htmlFor="siNumber">SI Number</label>
          <div>
            <input
              id="siNumber"
              type="text"
              value={formData.SINumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, SINumber: e.target.value })
              }
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
