import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormText,
  CRow,
  CImage,
} from '@coreui/react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { DefaultLoading, api } from 'src/components/SystemConfiguration'
import { ToastContainer, toast } from 'react-toastify'
import logo from './../../../assets/images/logo.png'

const Login = () => {
  const [togglePassword, setTogglePassword] = useState(true)
  const [signInFormLoading, setSignInFormLoading] = useState(false)
  const [loginErrorVisible, setLoginErrorVisible] = useState(false)

  const navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target
    signInForm.setFieldValue(name, value)
  }

  const signInFormValidationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  })
  const signInForm = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: signInFormValidationSchema,
    onSubmit: (values) => {
      setSignInFormLoading(true)
      api
        .post('login', values)
        .then(async (response) => {
          if (response.data.status) {
            toast.success(response.data.message)
            localStorage.setItem('wagaToken', response.data.token)
            if (response.data.role_type === 'Reseller') {
              navigate('/home', { replace: true })
            } else {
              navigate('/dashboard', { replace: true })
            }
          } else {
            // toast.error(response.data.message)
            setLoginErrorVisible(true)
          }
        })
        .catch((error) => {
          console.info(error.response.data)
          // toast.error('The server is closed. Please try again later.')

          // toast.error(handleError(error))
        })
        .finally(() => {
          setSignInFormLoading(false)
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
                <CCardBody>
                  <div className="text-center">
                    <CImage src={logo} height={120} />
                  </div>
                  <CForm className="row g-3 needs-validation" onSubmit={signInForm.handleSubmit}>
                    {signInFormLoading && <DefaultLoading />}
                    <h3 className="text-center">Login</h3>
                    <CAlert hidden={!loginErrorVisible} color="danger" dismissible>
                      Invalid Username/Password. Please try again.
                    </CAlert>
                    <div>
                      <CFormInput
                        className="py-2"
                        style={{ borderRadius: 50 }}
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleInputChange}
                        value={signInForm.values.username}
                      />

                      {signInForm.touched.username && signInForm.errors.username && (
                        <CFormText className="text-danger">{signInForm.errors.username}</CFormText>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <CFormInput
                        className="py-2"
                        style={{ borderRadius: 50 }}
                        type={togglePassword ? 'password' : 'text'}
                        placeholder="Password"
                        name="password"
                        onChange={handleInputChange}
                        value={signInForm.values.password}
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
                      {signInForm.touched.password && signInForm.errors.password && (
                        <CFormText className="text-danger">{signInForm.errors.password}</CFormText>
                      )}
                    </div>
                    <CButton className="mb-4" type="submit" shape="rounded-pill" color="primary">
                      Login
                    </CButton>

                    <p>
                      Not a member? <a href="/#/register">Register here</a>
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

export default Login
