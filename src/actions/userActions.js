import axios from "axios";
export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});

export const setUserData = (userdata) => ({
  type: "SET_USER_DATA",
  payload: userdata,
});

export const fetchUserData = (token) => async (dispatch) => {
  try {
    // Handle API call to fetch user data and dispatch setUser or any other related actions
    console.log(token, "AYEEEEEEEEEEEEEE");
    if (token) {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log(res.data, "OMG WORKS");

      // Assuming setUser is a dispatched action creator, pass dispatch as an argument
      dispatch(setUser(res.data));

      if (res.data && res.data.email) {
        const getUser = await axios.get(
          `http://localhost:3001/users/usersFromEmail/${res.data.email}`
        );
        const response = getUser.data;
        console.log(response, "her!!!");

        if (response.message !== "User not found") {
          const userData = {
            userId: res.data.uid,
            userName: response.user.name,
            userEmail: response.user.email,
            userImage: response.user.image,
            userOrg: response.user.Organization || "", // Add a check for undefined Organization
          };

          // Assuming setUserData is a dispatched action creator, pass userData to it
          dispatch(setUserData(userData));
          console.log(userData, "fetchUserProfile");
        } else {
          console.log("User not found");
        }
      }
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Handle error - dispatch an action to set an error state if needed
  }
};
