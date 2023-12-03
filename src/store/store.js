// store/store.js
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "../reducers/userReducer";
import userDataReducer from "../reducers/userDataReducer"; // Adjust the path accordingly

const rootReducer = combineReducers({
  user: userReducer,
  userData: userDataReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
