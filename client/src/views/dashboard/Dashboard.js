import React, { useState, useEffect } from 'react'

import CountUp from 'react-countup'

import { CChartBar } from '@coreui/react-chartjs'
import './../../assets/css/widget.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPager, faTimes, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  CDateRangePicker,
  CForm,
  CFormInput,
  CFormText,
  CInputGroup,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react-pro'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { api, placeholder } from 'src/components/SystemConfiguration'
import { CardHeader, Skeleton } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from 'react-query'
const Dashboard = ({ cardTitle }) => {
  const queryClient = useQueryClient()

  const { data: totalReseller, isLoading: fetchtotalResellerLoading } = useQuery({
    queryFn: async () =>
      await api.get('total_reseller').then((response) => {
        return response.data
      }),
    queryKey: ['totalReseller'],
    refetchIntervalInBackground: true,
    // staleTime: Infinity,
    // onSuccess: async () => {
    //   await queryClient.invalidateQueries(['totalReseller'])
    // },
  })

  const { data: totalUser, isLoading: fetchtotalUserLoading } = useQuery({
    queryFn: async () =>
      await api.get('total_user').then((response) => {
        return response.data
      }),
    queryKey: ['totalUser'],
    refetchIntervalInBackground: true,
    // staleTime: Infinity,
    // onSuccess: async () => {
    //   await queryClient.invalidateQueries(['totalUser'])
    // },
  })

  const getRandomPercentage = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min + '%'
  }

  const filterFormValidationSchema = Yup.object().shape({
    start_date: Yup.string().required('Start Date is required'),
    end_date: Yup.string().required('End Date is required'),
  })

  const filterForm = useFormik({
    initialValues: {
      start_date: '2024/01/01',
      end_date: '2024/01/01',
    },
    validationSchema: filterFormValidationSchema,
    onSubmit: async (values) => {
      // console.info(values)
      await getSalesAddressVoucher(values)
    },
  })

  const {
    data: salesAddressVoucher,
    isLoading: fetchSalesAddressVoucherLoading,
    refetch,
  } = useQuery({
    queryFn: async (data) => {
      const response = await api.get('get_sales_by_address_by_voucher')
      // console.info(data.queryKey)
      return response.data
    },
    placeholderData: placeholder,
    refetchIntervalInBackground: true,
    // staleTime: Infinity,
    queryKey: [
      'salesAddressVoucher',
      {
        start_date: '2024/01/01',
        end_date: '2024/06/01',
      },
    ],
    // refetchInterval: 1000,
    onSuccess: async () => {
      // await queryClient.invalidateQueries(['resellerCredit'])
      // await queryClient.invalidateQueries(['resellerVoucher'])
      // await queryClient.invalidateQueries(['salesAddressVoucher'])
    },
    // queryClient,
  })
  const { mutate: getSalesAddressVoucher } = useMutation({
    mutationFn: (data) => {
      // console.info(data)
      return api
        .get('get_sales_by_address_by_voucher', { params: data })
        .then((response) => response.data) // Ensure you return data
    },
    onSuccess: async (data, filter) => {
      // const formattedData = {
      //   start_date: formatDate(filter.start_date),
      //   end_date: formatDate(filter.end_date),
      // }
      // console.info(data)
      await queryClient.setQueryData(['salesAddressVoucher', filter], data)
    },
    onError: (error) => {
      console.error(error.response.data.message)
    },
  })
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}/${month}/${day}`
  }
  return (
    <>
      <div className="container bootstrap snippets bootdey">
        <CRow className="mb-3">
          <CCol md={4} sm={6} xs={12}>
            {fetchtotalResellerLoading ? (
              <Skeleton variant="rectangular" width="100%" height={106} />
            ) : (
              <div className="mini-stat clearfix bg-widget1 rounded">
                <span className="mini-stat-icon">
                  <FontAwesomeIcon icon={faUsers} className="fg-widget1" />
                </span>

                <div className="mini-stat-info">
                  <span>
                    <CountUp end={totalReseller} />
                  </span>
                  Reseller
                </div>
              </div>
            )}
          </CCol>
          <CCol md={4} sm={6} xs={12}>
            {fetchtotalUserLoading ? (
              <Skeleton variant="rectangular" width="100%" height={106} />
            ) : (
              <div className="mini-stat clearfix bg-widget2 rounded">
                <span className="mini-stat-icon">
                  <FontAwesomeIcon icon={faUser} className="fg-widget2" />
                </span>

                <div className="mini-stat-info">
                  <span>
                    <CountUp end={totalUser} />
                  </span>
                  User
                </div>
              </div>
            )}
          </CCol>
        </CRow>
        <CRow>
          <CCol md={12}>
            <CCard>
              <CCardBody>
                <CForm
                  id="filterForm"
                  className="row g-3 needs-validation mb-4"
                  onSubmit={filterForm.handleSubmit}
                >
                  <CInputGroup className="mb-3">
                    <CDateRangePicker
                      label="Filter sales by date"
                      endDate={filterForm.values.end_date}
                      locale="en-US"
                      startDate={filterForm.values.start_date}
                      name="date"
                      size="sm"
                      onStartDateChange={(date) => filterForm.setFieldValue('start_date', date)}
                      onEndDateChange={(date) => filterForm.setFieldValue('end_date', date)}
                    />
                    <CButton type="submit" color="primary" variant="outline" size="sm">
                      <FontAwesomeIcon icon={faFilter} /> Filter
                    </CButton>
                    <CButton
                      onClick={() => {
                        filterForm.resetForm()
                        refetch()
                      }}
                      color="danger"
                      variant="outline"
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </CButton>
                  </CInputGroup>
                  {filterForm.touched.start_date && filterForm.errors.start_date && (
                    <CFormText className="text-danger">{filterForm.errors.start_date}</CFormText>
                  )}
                  {filterForm.touched.end_date && filterForm.errors.end_date && (
                    <CFormText className="text-danger">{filterForm.errors.end_date}</CFormText>
                  )}
                </CForm>
                {fetchSalesAddressVoucherLoading}
                {fetchSalesAddressVoucherLoading ? (
                  <>
                    <div className="d-grid gap-2 d-md-flex mt-3 mb-3 justify-content-md-center">
                      <Skeleton variant="rounded" height={10} width={300} />
                    </div>
                    <div className="d-grid gap-2 d-md-flex mt-3 mb-3 justify-content-md-center">
                      <Skeleton variant="rounded" height={10} width={'10%'} />
                      <Skeleton variant="rounded" height={10} width={'10%'} />
                      <Skeleton variant="rounded" height={10} width={'10%'} />
                      <Skeleton variant="rounded" height={10} width={'10%'} />
                    </div>
                    <CTable>
                      <CTableBody>
                        {[...Array(20)].map((_, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>
                              <Skeleton
                                variant="rounded"
                                width={getRandomPercentage(10, 20)}
                                height={10}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <Skeleton
                                variant="rounded"
                                width={getRandomPercentage(30, 70)}
                                height={10}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </>
                ) : (
                  <>
                    <CChartBar
                      height={350}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Earnings for each address and for each voucher',
                          },
                        },
                      }}
                      data={salesAddressVoucher}
                    />
                  </>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </>
  )
}

export default Dashboard
