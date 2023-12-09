import axios from "axios";

const token = sessionStorage.getItem("token");

async function fetchBatches(siNumber) {
  console.log("fetchBatches", siNumber);
  try {
    const response = await axios.get(
      `http://localhost:3001/batches/${siNumber}`,
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

async function deleteBatch(batchId) {
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

async function UpdateBatch(batchId, batchData) {
  try {
    await axios.put(
      `http://localhost:3001/batches/batches/${batchId}`,
      batchData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error updating batch:", error.message);
    throw new Error("Failed to update batch");
  }
}

export { fetchBatches, deleteBatch, UpdateBatch };
