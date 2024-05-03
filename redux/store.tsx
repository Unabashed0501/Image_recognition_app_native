import { legacy_createStore as createStore } from "redux";
import favoritesReducer from "./reducers";

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(favoritesReducer);

export default store;
