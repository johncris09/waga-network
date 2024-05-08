import React, { useState, useEffect } from 'react'
import { CAvatar, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { WholePageLoading } from '../SystemConfiguration'
import userPhoto from 'src/assets/images/avatars/user.png'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [operationLoading, setOperationLoading] = useState(false)
  const [userId, setUserId] = useState('')

  const handleLogout = async (e) => {
    e.preventDefault()
    const isTokenExist = localStorage.getItem('wagaToken') !== null
    setOperationLoading(true)
    if (isTokenExist) {
      setTimeout(() => {
        setOperationLoading(false)
        localStorage.removeItem('wagaToken')
        navigate('/login', { replace: true })
      }, 1000)
    }
  }
  return (
    <>
      <CDropdown className="_avatar" variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 " caret={false}>
          <CAvatar src={userPhoto} />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem href="#/login" onClick={handleLogout}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      {operationLoading && <WholePageLoading />}
    </>
  )
}

export default AppHeaderDropdown
