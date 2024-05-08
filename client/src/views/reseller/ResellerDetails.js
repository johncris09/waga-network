import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { Article, DeleteOutline, EditSharp, InsertDriveFile, Key } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  handleError,
  requiredField,
  toSentenceCase,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'

import { useNavigate } from 'react-router-dom'

const User = ({ cardTitle }) => {
  const [data, setData] = useState([])
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [togglePassword, setTogglePassword] = useState(true)
  const [address, setAddress] = useState([])
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
    fetchAddress()
  }, [])
  const fetchAddress = () => {
    api
      .get('barangay')
      .then((response) => {
        setAddress(response.data)
      })
      .catch((error) => {
        console.info(error.response.data)
      })
      .finally(() => {
        setFetchAddressLoading(false)
      })
  }
  const fetchData = () => {
    api
      .get('reseller')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        console.info(error.response.data)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const formatErrorMessage = (errorMessage) => {
    let parts = errorMessage.split(' ')
    let lastWord = parts[parts.length - 1]
    return lastWord + ' already exists!'
  }
  const userRegistrationFormValidationSchema = Yup.object().shape({
    last_name: Yup.string().required('Last Name is required'),
    first_name: Yup.string().required('First Name is required'),
    address: Yup.string().required('Address is required'),
    contact_number: Yup.string().required('Contact # is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().when('hidePassword', {
      is: false,
      then: (schema) =>
        schema
          .required('Password is required')
          .min(7, 'Too Short!')
          .max(12, 'Too Long!')
          .matches(
            /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
            'Password must have at least 1 uppercase letter, 1 symbol, and be at least 8 characters',
          ),
      otherwise: (schema) => schema,
    }),
    role_type: Yup.string().required('Role Type is required'),
  })
  const userRegistrationForm = useFormik({
    initialValues: {
      id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      address: '',
      contact_number: '',
      username: '',
      password: '',
      hidePassword: false,
      role_type: '',
      form_type: 'Insert',
    },
    validationSchema: userRegistrationFormValidationSchema,
    onSubmit: (values) => {
      console.info(values)
      setOperationLoading(true)
      setFetchDataLoading(true)
      if (values.hidePassword) {
        api
          .put('user/update/' + values.id, values)
          .then((response) => {
            if (response.data.status) {
              toast.success(response.data.message)
              fetchData()
              setModalFormVisible(false)
            }
          })
          .catch((error) => {
            if (error.response.data.code === 1062) {
              toast.error(formatErrorMessage(error.response.data.message))
            }
          })
          .finally(() => {
            setOperationLoading(false)
            setFetchDataLoading(false)
          })
      } else {
        api
          .post('user/register', values)
          .then((response) => {
            console.info(response.data)
            if (response.data.status) {
              toast.success(response.data.message)
              fetchData()
              setModalFormVisible(false)
            }
          })
          .catch((error) => {
            if (error.response.data.code === 1062) {
              toast.error(formatErrorMessage(error.response.data.message))
            }
          })
          .finally(() => {
            setOperationLoading(false)
            setFetchDataLoading(false)
          })
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    if (type === 'text' && name !== 'username' && name !== 'password') {
      userRegistrationForm.setFieldValue(name, toSentenceCase(value))
    } else {
      userRegistrationForm.setFieldValue(name, value)
    }
  }

  const column = [
    {
      accessorKey: 'id',
      header: 'Name',
      accessorFn: (row) => `${row.first_name} ${row.middle_name} ${row.last_name}`,
    },

    {
      accessorKey: 'contact_number',
      header: 'Contact Number',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
  ]

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4" style={{ position: 'relative' }}>
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={data}
            state={{
              isLoading: fetchDataLoading,
              isSaving: fetchDataLoading,
              showLoadingOverlay: fetchDataLoading,
              showProgressBars: fetchDataLoading,
              showSkeletons: fetchDataLoading,
            }}
            muiCircularProgressProps={{
              color: 'secondary',
              thickness: 5,
              size: 55,
            }}
            muiSkeletonProps={{
              animation: 'pulse',
              height: 28,
            }}
            enableGrouping={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            initialState={{
              density: 'compact',
              columnPinning: { left: ['mrt-row-actions'] },
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <tooltip title="View Reseller's Information">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      navigate('/reseller/' + row.original.id, { replace: true })
                    }}
                  >
                    <InsertDriveFile />
                  </IconButton>
                </tooltip>
              </Box>
            )}
          />
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        visible={modalFormVisible}
        onClose={() => setModalFormVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {userRegistrationForm.values.hidePassword
              ? `Edit ${cardTitle}`
              : `Add New ${cardTitle}`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm
            className="row g-3 needs-validation mt-4"
            onSubmit={userRegistrationForm.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CRow>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label={requiredField('First Name')}
                  name="first_name"
                  onChange={handleInputChange}
                  value={userRegistrationForm.values.first_name}
                  required
                  placeholder="First Name"
                />
                {userRegistrationForm.touched.first_name &&
                  userRegistrationForm.errors.first_name && (
                    <CFormText className="text-danger">
                      {userRegistrationForm.errors.first_name}
                    </CFormText>
                  )}
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label="Middle Initial"
                  name="middle_name"
                  onChange={handleInputChange}
                  value={userRegistrationForm.values.middle_name}
                  placeholder="Middle Initial"
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label={requiredField('Last Name')}
                  name="last_name"
                  onChange={handleInputChange}
                  value={userRegistrationForm.values.last_name}
                  required
                  placeholder="Last Name"
                />
                {userRegistrationForm.touched.last_name &&
                  userRegistrationForm.errors.last_name && (
                    <CFormText className="text-danger">
                      {userRegistrationForm.errors.last_name}
                    </CFormText>
                  )}
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormLabel>{requiredField(' Contact Number')}</CFormLabel>
                <CFormInput
                  type="text"
                  name="contact_number"
                  onChange={handleInputChange}
                  value={userRegistrationForm.values.contact_number}
                  required
                  placeholder="Contact Number"
                />
                {userRegistrationForm.touched.contact_number &&
                  userRegistrationForm.errors.contact_number && (
                    <CFormText className="text-danger">
                      {userRegistrationForm.errors.contact_number}
                    </CFormText>
                  )}
              </CCol>
              <CCol md={6}>
                <CFormLabel>
                  {
                    <>
                      {fetchAddressLoading && <CSpinner size="sm" />}
                      {requiredField(' Address')}
                    </>
                  }
                </CFormLabel>
                <CFormSelect
                  name="address"
                  onChange={handleInputChange}
                  value={userRegistrationForm.values.address}
                  aria-label="address"
                >
                  <option>Select</option>
                  {address.map((row, index) => (
                    <option key={index} value={row.id}>
                      {row.barangay}
                    </option>
                  ))}
                </CFormSelect>

                {userRegistrationForm.touched.address && userRegistrationForm.errors.address && (
                  <CFormText className="text-danger">
                    {userRegistrationForm.errors.address}
                  </CFormText>
                )}
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {userRegistrationForm.values.hidePassword ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          {operationLoading && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default User
