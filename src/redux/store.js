import { combineReducers, createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import searchReducer from './searchReducer'
import favoritesReducer from './favoritesReducer'

const rootReducer = combineReducers({
  search: searchReducer,
  favorites: favoritesReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store
