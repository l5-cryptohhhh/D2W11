import { TOGGLE_FAVORITE } from './actions'

const FAVORITES_KEY = 'favoriteJobs'

const initialState = {
  favorites: JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'),
}

const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_FAVORITE: {
      const job = action.payload
      const exists = state.favorites.some((f) => f._id === job._id)
      const favorites = exists
        ? state.favorites.filter((f) => f._id !== job._id)
        : [...state.favorites, job]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      return { ...state, favorites }
    }
    default:
      return state
  }
}

export default favoritesReducer
