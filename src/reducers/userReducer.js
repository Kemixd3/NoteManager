// userReducer.js
const initialState = {
  user: {},
  isLoadingUser: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    // handle other actions related to user state changes

    default:
      return state;
  }
};

export default userReducer;
