import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { CCard, CCol, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane } from '@coreui/react'
import { ToastContainer } from 'react-toastify'
import { api } from 'src/components/SystemConfiguration'
import { useParams } from 'react-router-dom'
import BasicInfo from '../registration/BasicInfo'
import ResellerCredit from '../reseller/ResellerCredit'
import ResellerCode from '../reseller/ResellerCode'
import ResellerTransaction from '../reseller/ResellerTransaction'

const SearchResult = ({ cardTitle }) => {
  const { id } = useParams()

  const [activeKey, setActiveKey] = useState(1)
  const [resellerId, setResellerId] = useState('')
  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    await api
      .get('advance_search', {
        params: {
          query: id,
        },
      })
      .then((response) => {
        setResellerId(response.data[0].id)
      })
      .catch((error) => {
        console.info(error.response.data)
      })
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <>
          <CRow className="px-3 py-3">
            <CCol md={12} className="mb-5">
              <div className="m-2">
                <h5>Reseller Details</h5>
              </div>
              <BasicInfo id={resellerId} />
            </CCol>

            <CCol md={12}>
              <CNav variant="tabs" role="tablist">
                <CNavItem role="presentation">
                  <CNavLink
                    active={activeKey === 1}
                    component="button"
                    role="tab"
                    aria-controls="credit-pane"
                    aria-selected={activeKey === 1}
                    onClick={() => {
                      setActiveKey(1)
                    }}
                  >
                    Credit
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation">
                  <CNavLink
                    active={activeKey === 2}
                    component="button"
                    role="tab"
                    aria-controls="code-pane"
                    aria-selected={activeKey === 2}
                    onClick={() => {
                      setActiveKey(2)
                    }}
                  >
                    Code
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation">
                  <CNavLink
                    active={activeKey === 3}
                    component="button"
                    role="tab"
                    aria-controls="transaction-pane"
                    aria-selected={activeKey === 3}
                    onClick={() => {
                      setActiveKey(3)
                    }}
                  >
                    Transaction
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane role="tabpanel" aria-labelledby="credit-pane" visible={activeKey === 1}>
                  <hr />
                  <ResellerCredit id={resellerId} />
                </CTabPane>
                <CTabPane role="tabpanel" aria-labelledby="code-pane" visible={activeKey === 2}>
                  <hr />
                  <ResellerCode id={resellerId} />
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="transaction-pane"
                  visible={activeKey === 3}
                >
                  <hr />
                  <ResellerTransaction id={resellerId} />
                </CTabPane>
              </CTabContent>
            </CCol>
          </CRow>
        </>
      </CCard>
    </>
  )
}

export default SearchResult
