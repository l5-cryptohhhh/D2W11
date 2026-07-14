import { useEffect, useState } from 'react'
import './App.css'

const API = 'https://strive-benchmark.herokuapp.com/api/jobs'
const FAVORITES_KEY = 'favoriteJobs'

function useFavorites() {
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  )

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = (id) => favorites.some((f) => f._id === id)

  const toggleFavorite = (job) =>
    setFavorites((prev) =>
      isFavorite(job._id) ? prev.filter((f) => f._id !== job._id) : [...prev, job]
    )

  return { favorites, isFavorite, toggleFavorite }
}

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
  const [jobs, setJobs] = useState([])
  const [companyName, setCompanyName] = useState('')
  const [companyJobs, setCompanyJobs] = useState([])

  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  // ponytail: plain setTimeout debounce, no lib needed for one input
  useEffect(() => {
    if (view !== 'search') return
    const t = setTimeout(() => {
      fetch(`${API}?search=${encodeURIComponent(search)}&limit=20`)
        .then((r) => r.json())
        .then((data) => setJobs(data.data || []))
    }, 300)
    return () => clearTimeout(t)
  }, [search, view])

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
            onToggleFavorite={toggleFavorite}
            onCompanyClick={openCompany}
          />
        </>
      )}

      {view === 'favorites' && (
        <JobList
          jobs={favorites}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
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
            onToggleFavorite={toggleFavorite}
            onCompanyClick={openCompany}
          />
        </>
      )}
    </div>
  )
}

export default App
