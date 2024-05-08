import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { jwtDecode } from 'jwt-decode'
// routes config
import routes from '../routes'

const AppContent = () => {
  let user = []
  const isTokenExist = localStorage.getItem('wagaToken') !== null
  if (isTokenExist) {
    user = jwtDecode(localStorage.getItem('wagaToken'))
  }
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            const isRoleInRoutes = route.user.some((r) => r.includes(user.role_type))

            if (isRoleInRoutes) {
              if (route.element) {
                return (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element userInfo={user} cardTitle={route.name} />}
                  />
                )
              }
              return null
            }
          })}
          {/* Wildcard route for unmatched paths */}
          {/* <Route path="*" name="Page404" element={<Navigate to="/404" replace />} /> */}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
