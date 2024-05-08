import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilDollar, cilPeople, cilSpeedometer, cilUser } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = (userInfo) => {
  let items = []

  // Super Admin
  if (userInfo.role_type === 'Super Admin') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Reseller',
        to: '/reseller',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },

      {
        component: CNavItem,
        name: 'Voucher',
        to: '/voucher',
        icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'User',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ]
  }
  // Reseller
  if (userInfo.role_type === 'Reseller') {
    items = [
      {
        component: CNavItem,
        name: 'Home',
        to: '/home',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
    ]
  }

  return items
}

export default _nav
