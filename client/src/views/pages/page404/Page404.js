import React, { useEffect, useState } from 'react'
import { CButton, CCol, CContainer, CImage, CRow } from '@coreui/react'
import logo from './../../../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fa4, faHomeAlt } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const Page404 = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol>
            <div className="clearfix">
              <div className="text-center">
                <h1>Waga Network</h1>
              </div>
              <div className="text-center">
                <span className="my-5" style={{ fontSize: 150 }}>
                  <FontAwesomeIcon icon={fa4} />
                </span>
                <CImage
                  rounded
                  src={logo}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '130px',
                    maxHeight: '130px',
                    marginBottom: 100,
                  }}
                />
                <span className="my-5" style={{ fontSize: 150 }}>
                  <FontAwesomeIcon icon={fa4} />
                </span>
              </div>
              <div className="text-center">
                <h1>Page Not Found</h1>
                <CButton
                  className="text-white mt-3"
                  color="info"
                  onClick={() => {
                    navigate('/', { replace: true })
                  }}
                >
                  <FontAwesomeIcon icon={faHomeAlt} /> Back to Home
                </CButton>
              </div>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
