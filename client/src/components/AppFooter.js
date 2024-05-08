import React, { useEffect, useState } from 'react'
import { CFooter } from '@coreui/react'
import { AlternateEmailRounded } from '@mui/icons-material'
import { api } from './SystemConfiguration'
import { Skeleton } from '@mui/material'
const AppFooter = () => {
  const [config, setConfig] = useState([])
  const [fetchConfigLoading, setFetchConfigLoading] = useState(false)

  const [sy, setSY] = useState('')
  const [semester, setSemester] = useState('')
  const currentYear = new Date().getFullYear()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('config')
      .then((response) => {
        setSemester(response.data[0].current_semester)
        setSY(response.data[0].current_sy.replace(/SY: /g, ''))
      })
      .catch((error) => {
        console.info(error.response.data)
      })
      .finally(() => {
        setFetchConfigLoading(false)
      })
  }

  return (
    <CFooter>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Waga Network
        </a>
        <AlternateEmailRounded /> {currentYear}
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
