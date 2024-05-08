import React, { useEffect, useRef, useState } from 'react'
import {
  CivilStatus,
  DefaultLoading,
  Sex,
  WidgetLoading,
  api,
  calculateAge,
  requiredField,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import './../../assets/css/custom.css'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Select from 'react-select'
import logo from './../../assets/images/logo.png'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { Skeleton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
const isProduction = true
const BasicInfo = ({ id }) => {
  const avatarRef = useRef(null)
  const imageRef = useRef(null)
  const selectAddressIputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [data, setData] = useState([])
  const [fetchApplicationDetailsLoading, setFetchApplicationDetailsLoading] = useState(true)
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [profilePhotoLoading, setProfilePhotoLoading] = useState(false)
  const [address, setAddress] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [cropper, setCropper] = useState(null)
  const [cropPhotoModalVisible, setCropPhotoModalVisible] = useState(false)
  const cropperRef = useRef(null)
  const [cropData, setCropData] = useState('https://avatars0.githubusercontent.com/u/3456749?s=160')

  useEffect(() => {
    fetchData()
    fetchAddress()
  }, [id])

  const fetchData = async () => {
    setFetchDataLoading(true)
    await api
      .get('reseller/get/' + id)
      .then((response) => {
        setData(response.data)
        resellerDetailsForm.setFieldValue('id', response.data.id)
        resellerDetailsForm.setFieldValue('last_name', toSentenceCase(response.data.last_name))
        resellerDetailsForm.setFieldValue('first_name', toSentenceCase(response.data.first_name))
        resellerDetailsForm.setFieldValue('middle_name', response.data.middle_name)
        resellerDetailsForm.setFieldValue('contact_number', response.data.contact_number)
        resellerDetailsForm.setFieldValue('address', response.data.address)
      })
      .catch((error) => {
        console.info(error.response.data)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const fetchAddress = async () => {
    await api
      .get('barangay')
      .then((response) => {
        setAddress(response.data)
      })
      .catch((error) => {
        console.info(error.response.data)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchAddressLoading(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    resellerDetailsForm.setFieldValue(name, value)
    setFetchApplicationDetailsLoading(false)
  }

  const validationSchema = Yup.object().shape({
    last_name: Yup.string().required('Last Name is required'),
    first_name: Yup.string().required('First Name is required'),
    address: Yup.string().required('Address is required'),
  })
  const resellerDetailsForm = useFormik({
    initialValues: {
      id: '',
      last_name: '',
      first_name: '',
      middle_name: '',
      contact_number: '',
      address: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setOperationLoading(true)
      // setFetchDataLoading(true)
      api
        .put('user/update/' + values.id, values)
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message)
          }
        })
        .catch((error) => {
          console.info(error.response.data)
          // toast.error(handleError(error))
        })
        .finally(() => {
          setOperationLoading(false)
        })
    },
  })

  return (
    <>
      <CForm
        id="reseller-details-form"
        className="g-3 needs-validation"
        onSubmit={resellerDetailsForm.handleSubmit}
        style={{ position: 'relative' }}
      >
        <CRow>
          {operationLoading && <WidgetLoading />}
          <CCol md={12}>
            <CTable responsive>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    {requiredField('Last Name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    <CFormInput
                      type="text"
                      name="last_name"
                      onChange={handleInputChange}
                      value={resellerDetailsForm.values.last_name}
                    />
                    {resellerDetailsForm.touched.last_name &&
                      resellerDetailsForm.errors.last_name && (
                        <CFormText className="text-danger">
                          {resellerDetailsForm.errors.last_name}
                        </CFormText>
                      )}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    {requiredField('First Name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    <CFormInput
                      type="text"
                      name="first_name"
                      onChange={handleInputChange}
                      value={resellerDetailsForm.values.first_name}
                    />
                    {resellerDetailsForm.touched.first_name &&
                      resellerDetailsForm.errors.first_name && (
                        <CFormText className="text-danger">
                          {resellerDetailsForm.errors.first_name}
                        </CFormText>
                      )}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    Middle Name
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    <CFormInput
                      type="text"
                      name="middle_name"
                      onChange={handleInputChange}
                      value={resellerDetailsForm.values.middle_name}
                    />
                    {resellerDetailsForm.touched.middle_name &&
                      resellerDetailsForm.errors.middle_name && (
                        <CFormText className="text-danger">
                          {resellerDetailsForm.errors.middle_name}
                        </CFormText>
                      )}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    {requiredField('Contact Number')}
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    <CFormInput
                      type="text"
                      name="contact_number"
                      onChange={handleInputChange}
                      value={resellerDetailsForm.values.contact_number}
                    />
                    {resellerDetailsForm.touched.contact_number &&
                      resellerDetailsForm.errors.contact_number && (
                        <CFormText className="text-danger">
                          {resellerDetailsForm.errors.contact_number}
                        </CFormText>
                      )}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    {requiredField('Address')}
                  </CTableHeaderCell>
                  <CTableHeaderCell style={{ whiteSpace: 'nowrap' }} scope="row">
                    <CFormSelect
                      name="address"
                      onChange={handleInputChange}
                      value={resellerDetailsForm.values.address}
                      aria-label="address"
                    >
                      <option>Select</option>
                      {address.map((row, index) => (
                        <option key={index} value={row.id}>
                          {row.barangay}
                        </option>
                      ))}
                    </CFormSelect>

                    {resellerDetailsForm.touched.address && resellerDetailsForm.errors.address && (
                      <CFormText className="text-danger">
                        {resellerDetailsForm.errors.address}
                      </CFormText>
                    )}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <div className="d-grid gap-2">
              <CButton color="primary" type="submit" variant="outline">
                <FontAwesomeIcon icon={faPencil} /> Update Reseller&apos;s Info
              </CButton>
            </div>
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default BasicInfo
