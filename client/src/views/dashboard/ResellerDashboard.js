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
import { useMutation, useQuery, useQueryClient } from 'react-query'

const ResellerDashboard = ({ cardTitle, userInfo }) => {
  const queryClient = useQueryClient()

  const { data: resellerVoucher, isLoading: fetchResellerVoucherLoading } = useQuery({
    queryFn: async () =>
      await api.get('reseller/get_voucher/' + userInfo.id).then((response) => {
        return response.data
      }),
    queryKey: ['resellerVoucher'],
    refetchInterval: 1000,
  })

  const { data: resellerCredit, isLoading: fetchResellerCreditLoading } = useQuery({
    queryFn: async () =>
      await api.get('credit/get_reseller_net_credit/' + userInfo.id).then((response) => {
        return response.data
      }),
    queryKey: ['resellerCredit'],
    refetchInterval: 1000,
  })
  useEffect(() => {}, [userInfo])

  const { mutate: reseller_available_code, isLoading: fetchResellerAvailableCodeLoading } =
    useMutation({
      mutationFn: (data) => {
        return api.get('code/get_reseller_available_code', {
          params: { amount: data.amount, user_id: userInfo.id },
        })
      },

      onSuccess: async (response) => {
        if (response.data) {
          await insertPurchase(response.data)
        }
      },
      queryKey: ['voucher'],

      staleTime: Infinity,
    })

  const { mutate: insertPurchase, isLoading: isLoadingInsertPurchase } = useMutation({
    mutationKey: 'insertPurchase',
    mutationFn: (data) => {
      return api.post('purchase/insert', {
        user_id: userInfo.id,
        code_id: data.id,
      })
    },
    onSuccess: async (response, data) => {
      if (response.data.status) {
        Swal.fire({
          html: 'CODE: <strong>' + data.code + '</strong>',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: true,
          icon: 'success',
        }).then(async (result) => {
          if (result.isConfirmed) {
            // update the code status
            api.put('code/update/' + data.id, { is_used: 1 })

            await queryClient.invalidateQueries(['resellerCredit'])
            await queryClient.invalidateQueries(['resellerVoucher'])
            await queryClient.invalidateQueries(['salesAddressVoucher'], {
              exact: true,
              refetchInterval: 100,
            })
          }
        })
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(formatErrorMessage(error.response.data.message))
    },

    // queryClient,
  })

  const handlePurchased = (voucher) => {
    // check if totalCredit is available
    if (parseFloat(voucher.amount) <= resellerCredit) {
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
          await reseller_available_code(voucher)
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
      <h4>Welcome {userInfo && toSentenceCase(userInfo.first_name)}</h4>

      {isLoadingInsertPurchase && <WholePageLoading />}
      <CRow>
        <CCol md={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<FontAwesomeIcon icon={faPesoSign} height={30} />}
            title="Total Credit"
            value={
              fetchResellerCreditLoading ? (
                <Skeleton variant="rounded" width={100} />
              ) : (
                resellerCredit.toLocaleString()
              )
            }
          />
        </CCol>
        <CCol md={8}>
          <CRow>
            {fetchResellerVoucherLoading ? (
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
              resellerVoucher.map((row, index) => (
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
        </CCol>
      </CRow>
    </>
  )
}

export default ResellerDashboard
