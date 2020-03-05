import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import profile from '~/redux/reducers/profileReducer'

const reducers = combineReducers({
    profile
});

export const initStore = createStore(reducers, applyMiddleware(thunk))
