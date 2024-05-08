import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CFormText,
  CRow,
  CImage,
} from '@coreui/react'

import * as Yup from 'yup'
import { useFormik } from 'formik'
import { DefaultLoading, api, toSentenceCase } from 'src/components/SystemConfiguration'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify'
import logo from './../../../assets/images/logo.png'

const Register = () => {
  const [togglePassword, setTogglePassword] = useState(true)
  const [address, setAddress] = useState([])
  const [signUpFormLoading, setSignUpFormLoading] = useState(false)
  useEffect(() => {
    fetchAddress()
  }, [])

  const fetchAddress = () => {
    api.get('barangay').then((response) => {
      setAddress(response.data)
    })
    // .catch((error) => {
    //   toast.error(handleError(error))
    // })
    // .finally(() => {
    //   setFetchAddressLoading(false)
    // })
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'username' || name === 'password') {
      signupForm.setFieldValue(name, value)
    } else {
      signupForm.setFieldValue(name, toSentenceCase(value))
    }
  }

  const signupFormValidationSchema = Yup.object().shape({
    last_name: Yup.string().required('Last Name is required'),
    first_name: Yup.string().required('First Name is required'),
    address: Yup.string().required('Address is required'),
    contact_number: Yup.string().required('Contact # is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(7, 'Too Short!')
      // .max(12, 'Too Long!')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        'Password must have at least 1 uppercase letter, 1 symbol, and be at least 8 characters',
      ),
  })
  const signupForm = useFormik({
    initialValues: {
      last_name: '',
      first_name: '',
      middle_name: '',
      address: '',
      contact_number: '',
      username: '',
      password: '',
      role_type: 'Reseller',
      form_type: 'Signup',
    },
    validationSchema: signupFormValidationSchema,
    onSubmit: (values) => {
      setSignUpFormLoading(true)

      api
        .post('user/register', values)
        .then((response) => {
          console.info(response.data.status)
          if (response.data.status) {
            toast.success(response.data.message)
          }

          signupForm.resetForm()
        })
        .catch((error) => {
          // console.info(error.response.data)
          toast.error(error.response.data.message)
        })
        .finally(() => {
          setSignUpFormLoading(false)
        })
    },
  })

  return (
    <>
      <ToastContainer />
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="p-4">
                <div className="text-center">
                  <CImage src={logo} height={120} />
                </div>
                <CCardBody>
                  <CForm className="row g-3 needs-validation" onSubmit={signupForm.handleSubmit}>
                    {signUpFormLoading && <DefaultLoading />}

                    <h3 className="text-center">Register</h3>

                    <CFormInput
                      className="py-2"
                      style={{ borderRadius: 50 }}
                      type="text"
                      placeholder="First Name"
                      name="first_name"
                      onChange={handleInputChange}
                      value={signupForm.values.first_name}
                    />
                    {signupForm.touched.first_name && signupForm.errors.first_name && (
                      <CFormText className="text-danger">{signupForm.errors.first_name}</CFormText>
                    )}
                    <CFormInput
                      className="py-2"
                      style={{ borderRadius: 50 }}
                      type="text"
                      placeholder="Middle Name (optional)"
                      name="middle_name"
                      onChange={handleInputChange}
                      value={signupForm.values.middle_name}
                    />
                    <CFormInput
                      className="py-2"
                      style={{ borderRadius: 50 }}
                      type="text"
                      placeholder="Last Name"
                      name="last_name"
                      onChange={handleInputChange}
                      value={signupForm.values.last_name}
                    />

                    {signupForm.touched.last_name && signupForm.errors.last_name && (
                      <CFormText className="text-danger">{signupForm.errors.last_name}</CFormText>
                    )}

                    <CFormInput
                      className="py-2"
                      style={{ borderRadius: 50 }}
                      type="text"
                      placeholder="Contact #"
                      name="contact_number"
                      onChange={handleInputChange}
                      value={signupForm.values.contact_number}
                    />

                    {signupForm.touched.contact_number && signupForm.errors.contact_number && (
                      <CFormText className="text-danger">
                        {signupForm.errors.contact_number}
                      </CFormText>
                    )}
                    <CFormSelect
                      name="address"
                      onChange={handleInputChange}
                      value={signupForm.values.address}
                      aria-label="address"
                      style={{ borderRadius: 50 }}
                    >
                      <option>Address</option>
                      {address.map((row, index) => (
                        <option key={index} value={row.id}>
                          {row.barangay}
                        </option>
                      ))}
                    </CFormSelect>

                    {signupForm.touched.address && signupForm.errors.address && (
                      <CFormText className="text-danger">{signupForm.errors.address}</CFormText>
                    )}
                    <CFormInput
                      className="py-2"
                      style={{ borderRadius: 50 }}
                      type="text"
                      placeholder="Username"
                      name="username"
                      onChange={handleInputChange}
                      value={signupForm.values.username}
                    />

                    {signupForm.touched.username && signupForm.errors.username && (
                      <CFormText className="text-danger">{signupForm.errors.username}</CFormText>
                    )}

                    <div style={{ position: 'relative' }}>
                      <CFormInput
                        className="py-2"
                        style={{ borderRadius: 50 }}
                        type={togglePassword ? 'password' : 'text'}
                        placeholder="Password"
                        name="password"
                        onChange={handleInputChange}
                        value={signupForm.values.password}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 20,
                        }}
                      >
                        <FontAwesomeIcon
                          title="Toggle Hide/Show"
                          onClick={() => {
                            setTogglePassword((prevShowPassword) => !prevShowPassword)
                          }}
                          icon={togglePassword ? faEyeSlash : faEye}
                        />
                      </div>
                      {signupForm.touched.password && signupForm.errors.password && (
                        <CFormText className="text-danger">{signupForm.errors.password}</CFormText>
                      )}
                    </div>
                    <CButton className="mb-4" type="submit" shape="rounded-pill" color="primary">
                      Register
                    </CButton>

                    <p>
                      Already have an account? <a href="/#/login">Login here</a>
                    </p>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Register
