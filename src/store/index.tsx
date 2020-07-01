import { createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer, { JwtInfoState } from "./ducks/jwtInfoState";

/** The initial store */
const store: Store & JwtInfoState = createStore(reducer, composeWithDevTools());

export default store;
