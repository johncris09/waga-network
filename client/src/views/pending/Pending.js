import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import { toast } from 'react-toastify'
import ManageApplication from '../manage_application/ManageApplication'

const Pending = ({ cardTitle }) => {
  const [activeKey, setActiveKey] = useState(1)

  useEffect(() => {}, [])
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <CNav variant="pills" layout="justified">
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 1}
                component="button"
                role="tab"
                aria-controls="senior-high-tab-pane"
                aria-selected={activeKey === 1}
                onClick={() => {
                  setActiveKey(1)
                  toast.dismiss()
                }}
              >
                Senior High
              </CNavLink>
            </CNavItem>
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 2}
                component="button"
                role="tab"
                aria-controls="college-tab-pane"
                aria-selected={activeKey === 2}
                onClick={() => {
                  setActiveKey(2)
                  toast.dismiss()
                }}
              >
                College
              </CNavLink>
            </CNavItem>
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 3}
                component="button"
                role="tab"
                aria-controls="tvet-tab-pane"
                aria-selected={activeKey === 3}
                onClick={() => {
                  setActiveKey(3)
                  toast.dismiss()
                }}
              >
                Tvet
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane
              role="tabpanel"
              aria-labelledby="senior-high-tab-pane"
              visible={activeKey === 1}
              style={{ position: 'relative' }}
            >
              <hr />
              <ManageApplication
                hasBulkApproved={true}
                hasBulkDisapproved={true}
                hasDeleteSelectedRows={true}
                app_status="pending"
                scholarship_type="senior_high"
              />
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="college-tab-pane"
              visible={activeKey === 2}
              style={{ position: 'relative' }}
            >
              <hr />
              <ManageApplication
                hasBulkApproved={true}
                hasBulkDisapproved={true}
                hasDeleteSelectedRows={true}
                app_status="pending"
                scholarship_type="college"
              />
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="tvet-tab-pane"
              visible={activeKey === 3}
              style={{ position: 'relative' }}
            >
              <hr />
              <ManageApplication
                hasBulkApproved={true}
                hasBulkDisapproved={true}
                hasDeleteSelectedRows={true}
                app_status="pending"
                scholarship_type="tvet"
              />
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Pending
