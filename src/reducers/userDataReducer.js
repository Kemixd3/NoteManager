// userDataReducer.js
const initialState = {
  userData: {},
  isLoadingUserData: false,
};

const userDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
      };
    // handle other actions related to user data state changes

    default:
      return state;
  }
};

export default userDataReducer;
