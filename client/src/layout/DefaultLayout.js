import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import { Login } from '@mui/icons-material'
import { jwtDecode } from 'jwt-decode'

document.addEventListener('mousemove', updateActivity)
document.addEventListener('click', updateActivity)
document.addEventListener('keydown', updateActivity)

let timeInterval = setInterval(checkInactivity, 1000)

function updateActivity() {
  localStorage.setItem('lastActivity', new Date())
}

function checkInactivity() {
  let lastActivity = localStorage.getItem('lastActivity')
  if (lastActivity) {
    let diffMs = Math.abs(new Date(lastActivity) - new Date()) // milliseconds between now & last activity
    let seconds = Math.floor(diffMs / 1000)
    let minutes = Math.floor(seconds / 60)
    if (minutes == process.env.REACT_APP_MINUTES_NO_ACTIVITY) {
      localStorage.removeItem('wagaToken')
      window.location.reload()
      clearInterval(timeInterval)
      //code for logout or anything...
    }
  }
}
const DefaultLayout = () => {
  const [user, setUser] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const isTokenExist = localStorage.getItem('wagaToken') !== null

    if (!isTokenExist) {
      // If the token is set, navigate to the login
      navigate('/login', { replace: true })
    } else {
      setUser(jwtDecode(localStorage.getItem('wagaToken')))
    }
  }, [])

  return (
    <>
      {user.role_type === 'Super Admin' && <AppSidebar />}

      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </>
  )
}

export default DefaultLayout
