import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const ResellerDashboard = React.lazy(() => import('./views/dashboard/ResellerDashboard'))
const SearchResult = React.lazy(() => import('./views/search_result/SearchResult'))
const Reseller = React.lazy(() => import('./views/reseller/Reseller'))
const Voucher = React.lazy(() => import('./views/voucher/Voucher'))
const User = React.lazy(() => import('./views/user/User'))

const routes = [
  {
    path: '/home',
    user: ['Reseller'],
    name: 'Home',
    element: ResellerDashboard,
  },
  {
    path: '/dashboard',
    user: ['Super Admin'],
    name: 'Dashboard',
    element: Dashboard,
  },

  { path: '/reseller', user: ['Super Admin'], name: 'Reseller', element: Reseller },
  {
    path: '/voucher',
    user: ['Super Admin'],
    name: 'Voucher',
    element: Voucher,
  },

  {
    path: '/search/:id',
    user: ['Super Admin'],
    name: 'Reseller Details',
    element: SearchResult,
  },
  { path: '/user', user: ['Super Admin'], name: 'User', element: User },
]

export default routes
