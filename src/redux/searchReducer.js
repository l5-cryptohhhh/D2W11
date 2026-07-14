import { SEARCH_JOBS_SUCCESS } from './actions'

const initialState = {
  jobs: [],
}

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_JOBS_SUCCESS:
      return { ...state, jobs: action.payload }
    default:
      return state
  }
}

export default searchReducer
