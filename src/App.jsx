import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { fetchJobs, toggleFavorite } from './redux/actions'

const API = 'https://strive-benchmark.herokuapp.com/api/jobs'

function JobRow({ job, isFavorite, onToggleFavorite, onCompanyClick }) {
  return (
    <div className="job-row">
      <button
        className={`star-btn ${isFavorite ? 'starred' : ''}`}
        onClick={() => onToggleFavorite(job)}
        aria-label="toggle favorite"
      >
        ★
      </button>
      <span className="company-name" onClick={() => onCompanyClick(job.company_name)}>
        {job.company_name}
      </span>
      <a className="job-title" href={job.url} target="_blank" rel="noreferrer">
        {job.title}
      </a>
    </div>
  )
}

function JobList({ jobs, isFavorite, onToggleFavorite, onCompanyClick }) {
  if (!jobs.length) return <p className="empty">No jobs found.</p>
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <JobRow
          key={job._id}
          job={job}
          isFavorite={isFavorite(job._id)}
          onToggleFavorite={onToggleFavorite}
          onCompanyClick={onCompanyClick}
        />
      ))}
    </div>
  )
}

function App() {
  const [view, setView] = useState('search') // search | favorites | company
  const [search, setSearch] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyJobs, setCompanyJobs] = useState([])

  const dispatch = useDispatch()
  const jobs = useSelector((state) => state.search.jobs)
  const favorites = useSelector((state) => state.favorites.favorites)

  const isFavorite = (id) => favorites.some((f) => f._id === id)
  const onToggleFavorite = (job) => dispatch(toggleFavorite(job))

  // ponytail: plain setTimeout debounce, no lib needed for one input
  useEffect(() => {
    if (view !== 'search') return
    const t = setTimeout(() => {
      dispatch(fetchJobs(search))
    }, 300)
    return () => clearTimeout(t)
  }, [search, view, dispatch])

  useEffect(() => {
    if (view !== 'company' || !companyName) return
    fetch(`${API}?company_name=${encodeURIComponent(companyName)}&limit=100`)
      .then((r) => r.json())
      .then((data) => setCompanyJobs(data.data || []))
  }, [view, companyName])

  const openCompany = (name) => {
    setCompanyName(name)
    setView('company')
  }

  return (
    <div className="app">
      <h1>Remote Jobs Search</h1>
      <button
        className="favorites-btn"
        onClick={() => setView(view === 'favorites' ? 'search' : 'favorites')}
      >
        {view === 'favorites' ? 'Home' : 'Favourites'}
      </button>

      {view === 'search' && (
        <>
          <div className="search-bar">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')}>
                ×
              </button>
            )}
          </div>
          <JobList
            jobs={jobs}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onCompanyClick={openCompany}
          />
        </>
      )}

      {view === 'favorites' && (
        <JobList
          jobs={favorites}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          onCompanyClick={openCompany}
        />
      )}

      {view === 'company' && (
        <>
          <button className="back-btn" onClick={() => setView('search')}>
            ← Back
          </button>
          <h2>{companyName}</h2>
          <JobList
            jobs={companyJobs}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onCompanyClick={openCompany}
          />
        </>
      )}
    </div>
  )
}

export default App
