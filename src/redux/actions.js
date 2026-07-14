const API = 'https://strive-benchmark.herokuapp.com/api/jobs'

export const SEARCH_JOBS_SUCCESS = 'SEARCH_JOBS_SUCCESS'
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE'

export const searchJobsSuccess = (jobs) => ({
  type: SEARCH_JOBS_SUCCESS,
  payload: jobs,
})

export const toggleFavorite = (job) => ({
  type: TOGGLE_FAVORITE,
  payload: job,
})

// async action creator (thunk)
export const fetchJobs = (search) => async (dispatch) => {
  const res = await fetch(`${API}?search=${encodeURIComponent(search)}&limit=20`)
  const data = await res.json()
  dispatch(searchJobsSuccess(data.data || []))
}
