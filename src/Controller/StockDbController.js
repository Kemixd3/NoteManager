import axios from "axios";

const token = sessionStorage.getItem("token");

const API = axios.create({
  baseURL: import.meta.env.VITE_LOCALHOST,
  headers: {
    Accept: "application/json",
  },
});

const fetchData = async (searchTerm, selectedCategory) => {
  let url = `/search/search/${
    searchTerm ? searchTerm : -1
  }/${selectedCategory}`;

  try {
    const response = await API.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export { fetchData };
