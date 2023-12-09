import axios from "axios";
const SecretToken = sessionStorage.getItem("token");
const baseUrl = "https://semesterapi.azurewebsites.net";

async function getUserFromEmail(email) {
  try {
    const storedToken = sessionStorage.getItem("token");
    const response = await axios.get(
      `${baseUrl}/users/usersFromEmail/${email}`,
      {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    const { user, token } = response.data; //response user data and token

    //Store JWT token in session storage if a new token is received
    if (token && token !== "Token is valid") {
      sessionStorage.removeItem("token");
      sessionStorage.setItem("token", token);
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return "Error fetching user";
  }
}

const updateProfile = async (id, username, email, avatar_url) => {
  try {
    const response = await fetch(`${baseUrl}/users/users/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${SecretToken}`, // Assuming user object contains a valid token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email: email,
        image: avatar_url,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return { username, email, avatar_url };
  } catch (error) {
    throw new Error(error.message);
  }
};

export { getUserFromEmail, updateProfile };
