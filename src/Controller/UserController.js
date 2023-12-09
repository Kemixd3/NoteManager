import axios from "axios";

async function getUserFromEmail(email) {
  try {
    const response = await axios.get(
      `http://localhost:3001/users/usersFromEmail/${email}`
    );

    const { user, token } = response.data; // Assuming the response contains user data and a token

    // Store token in session storage if a new token is received
    if (token && token !== "Bearer null") {
      sessionStorage.removeItem("token");
      sessionStorage.setItem("token", token);
    }

    return user;
  } catch (error) {
    // Handle error
    console.error("Error fetching user:", error);
    return "Error fetching user";
  }
}

export { getUserFromEmail };
