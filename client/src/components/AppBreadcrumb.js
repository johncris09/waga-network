import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { toSentenceCase } from './SystemConfiguration'
import { jwtDecode } from 'jwt-decode'

const AppBreadcrumb = () => {
  let status = useParams()['*']
  let user = []
  const isTokenExist = localStorage.getItem('wagaToken') !== null
  if (isTokenExist) {
    user = jwtDecode(localStorage.getItem('wagaToken'))
  }
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      if (routeName) {
        breadcrumbs.push({
          pathname: '/#' + currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      } else {
        if (array.length == 4 && currentPathname === '/applicant/details') {
          breadcrumbs.push({
            name: 'Details',
            active: index + 1 !== array.length && true,
          })
        }

        if (array.length == 3 && currentPathname === '/status') {
          breadcrumbs.push({
            name: 'Status / ' + toSentenceCase(status.replace('status/', '')),
            active: index + 1 === array.length ? true : false,
          })
        }
      }
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <>
      <CBreadcrumb className="m-0 ms-2">
        <CBreadcrumbItem href={user.school !== null ? '/#/home' : '/#/dashboard'} replace>
          Home
        </CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>
          )
        })}
      </CBreadcrumb>
    </>
  )
}

export default React.memo(AppBreadcrumb)
