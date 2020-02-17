import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import AuthReducer from "./reducers/AuthReducer";
import logger from 'redux-logger'


const reducers = combineReducers({auth: AuthReducer});


export const initStore = (initialState = {}) => {
   return createStore(
       reducers,
       initialState,
       composeWithDevTools(applyMiddleware(thunkMiddleware, logger))
   )
};