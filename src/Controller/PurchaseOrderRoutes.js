const token2 = sessionStorage.getItem("token");
import axios from "axios";

async function getPosts(org, token) {
  try {
    if (
      token ||
      (token2 && token !== "Bearer null") ||
      token2 !== "Bearer null"
    ) {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCALHOST}/orders/purchase-orders?org=${org}`,
        {
          headers: {
            Authorization: `Bearer ${token || token2}`,
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } else {
      //Return a resolved promise i token is invalid or null
      return null;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

async function fetchPurchaseOrderItems(id) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_LOCALHOST}/orders/purchase-order-items/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token2}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase order items:", error);
    throw new Error("Failed to fetch purchase order items");
  }
}

export { getPosts, fetchPurchaseOrderItems };
