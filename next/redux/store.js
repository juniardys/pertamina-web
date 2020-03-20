import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import profile from '~/redux/reducers/profileReducer'
import user from '~/redux/reducers/userReducer'

const reducers = combineReducers({
    profile, user
});

export const initStore = createStore(reducers, applyMiddleware(thunk))
