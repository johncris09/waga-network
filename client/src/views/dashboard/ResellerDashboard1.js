import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import { CButton, CCol, CRow, CWidgetStatsF } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './../../assets/css/custom.css'
import { faPesoSign } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify'
import { Skeleton } from '@mui/material'
import {
  DefaultLoading,
  WholePageLoading,
  api,
  toSentenceCase,
} from 'src/components/SystemConfiguration'
import couponLogo from './../../assets/images/coupon.png'
const ResellerDashboard = ({ cardTitle, userInfo }) => {
  const [data, setData] = useState([])
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [totalCredit, setTotalCredit] = useState([])
  const [operationLoading, setOperationLoading] = useState(false)

  const [fetchTotalCreditLoading, setFetchTotalCreditLoading] = useState(true)
  useEffect(() => {
    fetchData()
    fetchTotalCredit()
  }, [userInfo])
  const fetchData = () => {
    setFetchDataLoading(true)
    api
      .get('reseller/get_voucher/' + userInfo.id)
      .then((response) => {
        console.info(response.data)
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const fetchTotalCredit = () => {
    setFetchTotalCreditLoading(true)
    api
      .get('credit/get_reseller_net_credit/' + userInfo.id)
      .then((response) => {
        setTotalCredit(response.data)
      })
      .catch((error) => {
        console.info(error.response.data)
        // toast.error(handleError(error))
      })
      .finally(() => {
        setFetchTotalCreditLoading(false)
      })
  }

  const handlePurchased = (voucher) => {
    // check if totalCredit is available
    if (parseFloat(voucher.amount) <= totalCredit) {
      Swal.fire({
        title: voucher.amount,
        text: 'Please click okay to confirm',
        html: "Your balance will be deducted upon clicking 'Confirm'.<br/>Are you sure you want to continue?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        icon: 'info',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // get the available code
          setOperationLoading(true)
          api
            .get('code/get_reseller_available_code', {
              params: { amount: voucher.amount, user_id: userInfo.id },
            })
            .then((response) => {
              // has code
              if (response.data) {
                let code_id = response.data.id
                let code = response.data.code

                // insert to purchase
                api
                  .post('purchase/insert', {
                    user_id: userInfo.id,
                    code_id: code_id,
                  })
                  .then((response) => {
                    fetchTotalCredit()
                    if (response.data.status) {
                      Swal.fire({
                        html: 'CODE: <strong>' + code + '</strong>',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showCancelButton: true,
                        icon: 'success',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          //update the code status
                          api.put('code/update/' + code_id, { is_used: 1 }).then((response) => {
                            console.info(response.data)
                          })
                          fetchData()
                        }
                      })
                    }
                  })
                  .catch((error) => {
                    console.info(error.response.data)
                  })
                  .finally(() => {
                    setOperationLoading(false)
                  })
              } else {
                Swal.fire({
                  text: 'No Code Avaiable',
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  showCancelButton: true,
                  icon: 'error',
                })
              }
            })

            .catch((error) => {
              console.info(error.response.data)
            })
            .finally(() => {
              setFetchTotalCreditLoading(false)
            })
          // api
          //   .get('code/get_reseller_available_code', {
          //     params: { amount: voucher.amount, user_id: userInfo.id },
          //   })
          //   .then((response) => {
          //     if (response.data) {
          //       let codeId = response.data.id
          //       Swal.fire({
          //         html: 'CODE: <strong>' + response.data.code + '</strong>',
          //         allowOutsideClick: false,
          //         allowEscapeKey: false,
          //         showCancelButton: true,
          //         icon: 'success',
          //         // text: "You won't be able to revert this!",
          //         // icon: 'info',
          //       }).then(async (result) => {
          //         if (result.isConfirmed) {
          //           //update the code status
          //           // console.info(voucher.id)
          //           api.put('code/update/' + codeId, { is_used: 1 }).then((response) => {
          //             console.info(response.data)
          //           })
          //         }
          //       })
          //     } else {
          //       Swal.fire({
          //         text: 'No Code Avaiable',
          //         allowOutsideClick: false,
          //         allowEscapeKey: false,
          //         showCancelButton: true,
          //         icon: 'success',
          //         // text: "You won't be able to revert this!",
          //         // icon: 'info',
          //       })
          //     }
          //   })
          //   .catch((error) => {
          //     toast.error(handleError(error))
          //   })
          //   .finally(() => {
          //     setFetchDataLoading(false)
          //   })
        }
      })
    } else {
      Swal.fire({
        title: 'Insufficient Credits',
        text: 'Please top-up your credit',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        icon: 'error',
      })
    }
  }
  return (
    <>
      <ToastContainer />
      {operationLoading && <WholePageLoading />}
      <h4>Welcome {userInfo && toSentenceCase(userInfo.first_name)}</h4>

      <CRow>
        <CCol md={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<FontAwesomeIcon icon={faPesoSign} height={30} />}
            title="Total Credit"
            value={
              fetchTotalCreditLoading ? (
                <Skeleton variant="rounded" width={100} />
              ) : (
                totalCredit.toLocaleString()
              )
            }
          />
        </CCol>
        <CCol md={8}>
          <CRow>
            {fetchDataLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <CCol key={i} md={6} className="mb-2">
                    <div className="coupon">
                      <div className="main">
                        <div className="co-img">
                          <Skeleton variant="circular" width={90} height={90} />
                        </div>
                        <div className="vertical"></div>
                        <div className="content">
                          <h2>
                            <Skeleton variant="text" width={100} height={25} />
                          </h2>

                          <h1>
                            <Skeleton variant="text" width={100} />
                          </h1>
                          <p>
                            <Skeleton variant="text" width={100} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </CCol>
                ))}
              </>
            ) : (
              data.map((row, index) => (
                <>
                  <CCol
                    key={index}
                    md={6}
                    className="mb-2"
                    onClick={() =>
                      row.total_available_code > 0
                        ? handlePurchased(row)
                        : Swal.fire({
                            text: 'No Code Avaiable',
                            showCancelButton: true,
                            icon: 'error',
                          })
                    }
                  >
                    <div
                      className={row.total_available_code > 0 ? 'coupon' : 'coupon bg-secondary'}
                    >
                      <div className="main">
                        <div className="co-img">
                          <img src={couponLogo} alt="" />
                        </div>
                        <div className="vertical"></div>
                        <div className="content">
                          <h2>Voucher</h2>
                          <h1>{parseFloat(row.amount).toLocaleString()}</h1>
                          <p>
                            {row.total_available_code > 1
                              ? row.total_available_code + ' codes available '
                              : row.total_available_code + ' code available '}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CCol>
                </>
              ))
            )}
          </CRow>

          {/* {fetchDataLoading && <DefaultLoading />} */}
        </CCol>
      </CRow>
    </>
  )
}

export default ResellerDashboard
