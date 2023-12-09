import axios from "axios";

const token = sessionStorage.getItem("token");

export async function fetchBatches(receivedGoodsId) {
  try {
    const response = await axios.get(
      `http://localhost:3001/batches/${receivedGoodsId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw new Error("Failed to fetch batches");
  }
}

export async function deleteBatch(batchId) {
  try {
    await axios.delete(`http://localhost:3001/batches/batches/${batchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting batch:", error.message);
    throw new Error("Failed to delete batch");
  }
}


export async function editBatchC(batchId,batchData) {
  try {
    const response = await axios.put(
      `http://localhost:3001/batches/batches/${batchId}`,
      batchData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error updating batch:', error.message);
    throw new Error('Failed to update batch');
  }
}
