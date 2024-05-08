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
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import {
  RequiredFieldNote,
  WidgetLoading,
  api,
  requiredField,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const User = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const formatErrorMessage = (errorMessage) => {
    let parts = errorMessage.split(' ')
    let lastWord = parts[parts.length - 1]
    lastWord = lastWord.replace('.', '') // Remove the period
    return lastWord + ' already exists!'
  }
  const voucherFormValidationSchema = Yup.object().shape({
    amount: Yup.string().required('Amount is required'),
  })
  const voucherForm = useFormik({
    initialValues: {
      id: '',
      amount: '',
    },
    validationSchema: voucherFormValidationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await update(values)
      } else {
        await insert(values)
      }
    },
  })

  const { data: vouchers, isLoading: fetchDataLoading } = useQuery({
    queryFn: async () =>
      await api.get('voucher').then((response) => {
        return response.data
      }),
    queryKey: ['voucher'],
    staleTime: Infinity,
  })
  const { mutate: insert, isLoading: isLoadingInsert } = useMutation({
    mutationKey: 'insertVoucher',
    mutationFn: (data) => {
      return api.post('voucher/insert', data)
    },
    onSuccess: async (response) => {
      if (response.data) {
        toast.success(response.data.message)
        setModalFormVisible(false)
      }

      await queryClient.invalidateQueries(['voucher'])
    },
    onError: (error) => {
      toast.error(formatErrorMessage(error.response.data.message))
    },
  })

  const { mutate: update, isLoading: isLoadingUpdate } = useMutation({
    mutationKey: 'updateVoucher',
    mutationFn: (data) => {
      return api.put('voucher/update/' + data.id, data)
    },
    onSuccess: async (response) => {
      if (response.data) {
        toast.success(response.data.message)
        setModalFormVisible(false)
      }

      await queryClient.invalidateQueries(['voucher'])
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    },
  })

  const { mutate: deleteData, isLoading: isLoadingDelete } = useMutation({
    mutationKey: 'updateVoucher',
    mutationFn: (data) => {
      return api.delete('voucher/delete/' + data)
    },
    onSuccess: async (response) => {
      if (response.data) {
        toast.success(response.data.message)
        setModalFormVisible(false)
      }

      await queryClient.invalidateQueries(['voucher'])
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target

    voucherForm.setFieldValue(name, value)
  }

  const column = [
    {
      accessorKey: 'amount',
      header: 'Amount',
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
                voucherForm.resetForm()

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
            data={!fetchDataLoading && vouchers}
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
                      console.info(row.original.role_type)
                      voucherForm.setValues({
                        id: row.original.id,
                        amount: row.original.amount,
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
                          let id = row.original.id
                          await deleteData(id)
                        }
                      })
                    }}
                  >
                    <DeleteOutline />
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
        size="md"
      >
        <CModalHeader>
          <CModalTitle>
            {voucherForm.values.id ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm
            className="row g-3 needs-validation mt-4"
            onSubmit={voucherForm.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CRow>
              <CCol md={12}>
                <CFormInput
                  type="number"
                  label={requiredField('Amount')}
                  name="amount"
                  onChange={handleInputChange}
                  value={voucherForm.values.amount}
                  placeholder="Amount"
                />
                {voucherForm.touched.amount && voucherForm.errors.amount && (
                  <CFormText className="text-danger">{voucherForm.errors.amount}</CFormText>
                )}
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {voucherForm.values.id ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          {(isLoadingInsert || isLoadingUpdate || isLoadingDelete) && <WidgetLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default User
