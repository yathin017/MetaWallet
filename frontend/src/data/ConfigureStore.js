import { createStore, combineReducers } from "redux";
import { useReducer } from "./users/reducer";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      users: useReducer,
    })
  );
  return store;
};