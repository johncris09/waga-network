import React, { useState, useEffect } from 'react'
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
import { DeleteOutline, EditSharp, Key } from '@mui/icons-material'
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
const User = ({ cardTitle }) => {
  const [data, setData] = useState([])
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [togglePassword, setTogglePassword] = useState(true)
  const [address, setAddress] = useState([])
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true)

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
      .get('user')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        // toast.error(handleError(error))
        console.info(error.response.data)
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

  const updatePasswordFormValidationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(7, 'Too Short!')
      .max(12, 'Too Long!')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        'Password must have at least 1 uppercase letter, 1 symbol, and be at least 8 characters',
      ),
  })
  const updatePasswordForm = useFormik({
    initialValues: {
      id: '',
      password: '',
    },
    validationSchema: updatePasswordFormValidationSchema,
    onSubmit: (values) => {
      setOperationLoading(true)
      setFetchDataLoading(true)
      api
        .put('user/change_password/' + values.id, values)
        .then((response) => {
          console.info(response.data)
          if (response.data.status) {
            toast.success(response.data.message)
            fetchData()
            setModalChangePasswordFormVisible(false)
          }
        })
        .catch((error) => {
          console.info(error.response.data)
          // toast.error(handleError(error))
        })
        .finally(() => {
          setOperationLoading(false)
          setFetchDataLoading(false)
        })
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

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target
    updatePasswordForm.setFieldValue(name, value)
  }

  const column = [
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },

    {
      accessorKey: 'middle_name',
      header: 'M.I.',
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'contact_number',
      header: 'Contact Number',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'role_type',
      header: 'Role Type',
    },
  ]

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4" style={{ position: 'relative' }}>
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                userRegistrationForm.resetForm()

                setModalFormVisible(!modalFormVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add {cardTitle}
            </CButton>
          </div>
        </CCardHeader>
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
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setOperationLoading(false)
                      console.info(row.original.role_type)
                      userRegistrationForm.setValues({
                        id: row.original.id,
                        last_name: row.original.last_name,
                        first_name: row.original.first_name,
                        middle_name: row.original.middle_name,
                        contact_number: row.original.contact_number,
                        address: row.original.address_id,
                        username: row.original.username,
                        role_type: row.original.role_type,
                        hidePassword: true,
                      })
                      setModalFormVisible(true)
                    }}
                  >
                    <EditSharp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          validationPrompt(() => {
                            let id = row.original.ID
                            setFetchDataLoading(true)
                            api
                              .delete('user/delete/' + id)
                              .then((response) => {
                                fetchData()
                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                // toast.error(handleError(error))
                                console.info(error.response.data)
                              })
                              .finally(() => {
                                setFetchDataLoading(false)
                              })
                          })
                        }
                      })
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Change Password">
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setModalChangePasswordFormVisible(true)
                      updatePasswordForm.setValues({
                        id: row.original.id,
                        password: '',
                      })
                    }}
                  >
                    <Key />
                  </IconButton>
                </Tooltip>
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

            <CRow>
              <CCol md={userRegistrationForm.values.hidePassword ? 12 : 6}>
                <CFormLabel>{requiredField('Username')}</CFormLabel>
                <CFormInput
                  type="text"
                  name="username"
                  onChange={handleInputChange}
                  value={userRegistrationForm.values.username}
                  required
                  placeholder="Username"
                />
                {userRegistrationForm.touched.username && userRegistrationForm.errors.username && (
                  <CFormText className="text-danger">
                    {userRegistrationForm.errors.username}
                  </CFormText>
                )}
              </CCol>
              {!userRegistrationForm.values.hidePassword && (
                <CCol md={6}>
                  <CFormLabel>{requiredField('Password')}</CFormLabel>

                  <CInputGroup>
                    <CFormInput
                      type={togglePassword ? 'password' : 'text'}
                      placeholder="Password"
                      name="password"
                      onChange={handleInputChange}
                      value={userRegistrationForm.values.password}
                    />
                    <CInputGroupText style={{ backgroundColor: 'transparent' }}>
                      <FontAwesomeIcon
                        title="Toggle Hide/Show"
                        onClick={() => {
                          setTogglePassword((prevShowPassword) => !prevShowPassword)
                        }}
                        icon={togglePassword ? faEyeSlash : faEye}
                      />
                    </CInputGroupText>
                  </CInputGroup>

                  {userRegistrationForm.touched.password &&
                    userRegistrationForm.errors.password && (
                      <CFormText className="text-danger">
                        {userRegistrationForm.errors.password}
                      </CFormText>
                    )}
                </CCol>
              )}

              <CCol md={12}>
                <CFormLabel>{requiredField('Role Type')}</CFormLabel>

                <CFormSelect
                  name="role_type"
                  onChange={handleInputChange}
                  value={userRegistrationForm.values.role_type}
                  aria-label="role_type"
                >
                  <option value="">Select</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Reseller">Reseller</option>
                </CFormSelect>

                {userRegistrationForm.touched.role_type &&
                  userRegistrationForm.errors.role_type && (
                    <CFormText className="text-danger">
                      {userRegistrationForm.errors.role_type}
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

      <CModal
        alignment="center"
        visible={modalChangePasswordFormVisible}
        onClose={() => setModalChangePasswordFormVisible(false)}
        size="md"
      >
        <CModalHeader>
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-3 needs-validation"
            onSubmit={updatePasswordForm.handleSubmit}
            style={{ position: 'relative' }}
          >
            <RequiredFieldNote />
            <CCol md={12}>
              <CFormLabel>{requiredField('Password')}</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput
                  type={togglePassword ? 'password' : 'text'}
                  name="password"
                  onChange={handlePasswordInputChange}
                  value={updatePasswordForm.values.password}
                  placeholder="Password"
                />
                <CButton
                  onClick={() => {
                    setTogglePassword((prevShowPassword) => !prevShowPassword)
                  }}
                  type="button"
                  color="secondary"
                  variant="outline"
                >
                  <FontAwesomeIcon icon={togglePassword ? faEye : faEyeSlash} />
                </CButton>
              </CInputGroup>
              {updatePasswordForm.touched.password && updatePasswordForm.errors.password && (
                <CFormText className="text-danger">{updatePasswordForm.errors.password}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                Change Password
              </CButton>
            </CCol>
          </CForm>
          {operationLoading && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default User
