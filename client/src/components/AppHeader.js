import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './../assets/css/custom.css'
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CImage,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, cilX } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { api, toSentenceCase } from './SystemConfiguration'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const isProduction = true
const AppHeader = () => {
  const typeAheadRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState([])
  const navigate = useNavigate()
  const [user, setUser] = useState([])

  useEffect(() => {
    const isTokenExist = localStorage.getItem('wagaToken') !== null
    if (isTokenExist) {
      setUser(jwtDecode(localStorage.getItem('wagaToken')))
    }
  }, [])

  const handleSearch = async (query) => {
    setIsLoading(true)

    await api
      .get('advance_search', { params: { query } })
      .then((response) => {
        setOptions(response.data)
      })
      .catch((error) => {
        // console.info(error)
        console.info(error.response.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const filterBy = () => true

  const handleSelection = (selected) => {
    if (selected && selected.length > 0 && selected[0].first_name) {
      // Access the firstname property here
      navigate(
        '/search/' +
          toSentenceCase(selected[0].last_name) +
          ', ' +
          toSentenceCase(selected[0].first_name) +
          ' ' +
          toSentenceCase(selected[0].middle_name),
        { replace: true },
      )
    }
  }
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        {user.role_type === 'Super Admin' && (
          <CHeaderToggler
            className="ps-1"
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
        )}
        {user.role_type === 'Super Admin' ? (
          <CHeaderNav className="me-auto" id="async-search" style={{ position: 'relative' }}>
            <AsyncTypeahead
              id="async-search-input"
              ref={typeAheadRef}
              align="justify"
              filterBy={filterBy}
              // isLoading={isLoading}
              labelKey={(option) =>
                `${toSentenceCase(option.last_name)}, ${toSentenceCase(
                  option.first_name,
                )} ${toSentenceCase(option.middle_name)}`
              }
              highlightClassName="rbt-highlight-text"
              minLength={2}
              highlightOnlyResult={true}
              autoFocus={true}
              onSearch={handleSearch}
              onChange={handleSelection}
              options={options}
              maxResults={5}
              placeholder="Search applicant ..."
              inputProps={{ style: { paddingLeft: 40, borderRadius: 20 } }}
              renderMenuItemChildren={(row) => {
                return (
                  <span>
                    {toSentenceCase(row.last_name)}, {toSentenceCase(row.first_name)}{' '}
                    {toSentenceCase(row.middle_name)}
                  </span>
                )
              }}
              renderToken={(option, props, index) => (
                <span key={index}>
                  {`${toSentenceCase(option.last_name)}, ${toSentenceCase(
                    option.first_name,
                  )} ${toSentenceCase(option.middle_name)}`}
                </span>
              )}
            />
            {!isLoading ? (
              <lord-icon
                src="https://cdn.lordicon.com/kkvxgpti.json"
                trigger="hover"
                delay="2000"
                colors="primary:#b4b4b4"
                style={{
                  width: '30px',
                  height: '30px',
                  position: 'absolute',
                  top: '50%',
                  left: '5px',
                  transform: 'translateY(-50%)',
                }}
              ></lord-icon>
            ) : (
              <CSpinner
                size="sm"
                style={{
                  width: '20px',
                  height: '20px',
                  position: 'absolute',
                  top: '20%',
                  left: '10px',
                  color: '#b4b4b4',
                  // transform: 'translateY(-50%)',
                }}
              />
            )}
            {options.length > 0 && (
              <CIcon
                icon={cilX}
                onClick={() => {
                  setOptions([])
                  typeAheadRef.current.clear()
                }}
                style={{
                  position: 'absolute',
                  color: '#b4b4b4',
                  top: '50%',
                  right: '15px',
                  transform: 'translateY(-50%)',
                }}
              />
            )}
          </CHeaderNav>
        ) : (
          <CHeaderNav>
            <h5>
              <strong>WAGA</strong>Network
            </h5>
          </CHeaderNav>
        )}

        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {user.role_type === 'Super Admin' && (
        <>
          <CHeaderDivider />
          <CContainer fluid>
            <AppBreadcrumb />
          </CContainer>
        </>
      )}
    </CHeader>
  )
}

export default AppHeader
