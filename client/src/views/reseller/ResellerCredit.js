import React, { useEffect, useState } from 'react'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
} from 'src/components/SystemConfiguration'
import 'cropperjs/dist/cropper.css'
import './../../assets/css/custom.css'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import MaterialReactTable from 'material-react-table'
import { EditSharp } from '@mui/icons-material'

import { useMutation, useQuery, useQueryClient } from 'react-query'

const ResellerCredit = ({ id }) => {
  const queryClient = useQueryClient()
  const [resellerCreditModalVisible, setResellerCreditModalVisible] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0.0) // Initialize totalAmount state

  const calculateTotalAmount = (transactions) => {
    let total = 0
    transactions.forEach((transaction) => {
      total += parseFloat(transaction.amount)
    })
    setTotalAmount(total) // Update totalAmount state
  }
  const column = [
    {
      accessorKey: 'amount',
      header: 'Amount',
      Footer: () => totalAmount.toFixed(2).toLocaleString(), // Display totalAmount in the Footer
    },
    {
      accessorKey: 'date_created',
      header: 'Date Added',
    },

    {
      accessorKey: 'time_created',
      header: 'Time Added',
    },
  ]

  const resellerCreditFormValidationSchema = Yup.object().shape({
    amount: Yup.string().required('Amount is required'),
  })
  const resellerCreditForm = useFormik({
    initialValues: {
      id: '',
      amount: '',
    },
    validationSchema: resellerCreditFormValidationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await update(values)
      } else {
        let formattedValues = { ...values, user_id: id }
        await insertResellerCredit(formattedValues)
      }
    },
  })

  const { data: credits, isLoading: fetchCreditLoading } = useQuery({
    queryFn: async () =>
      await api.get('reseller/get_credit/' + id).then((response) => {
        calculateTotalAmount(response.data)
        return response.data
      }),
    queryKey: ['credit', id],
    staleTime: Infinity,
  })

  const { mutate: insertResellerCredit, isLoading: isLoadingInsertResellerCredit } = useMutation({
    mutationKey: 'insertResellerCredit',
    mutationFn: (data) => {
      return api.post('reseller/insert_credit', data)
    },
    onSuccess: async (response) => {
      if (response.data) {
        toast.success(response.data.message)
        setResellerCreditModalVisible(false)
      }

      await queryClient.invalidateQueries(['credit'])
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    },
  })

  const { mutate: update, isLoading: isLoadingUpdate } = useMutation({
    mutationKey: 'updateCredit',
    mutationFn: (data) => {
      return api.put('credit/update/' + data.id, data)
    },
    onSuccess: async (response) => {
      if (response.data) {
        toast.success(response.data.message)
        setResellerCreditModalVisible(false)
      }

      await queryClient.invalidateQueries(['credit'])
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target

    resellerCreditForm.setFieldValue(name, value)
  }

  return (
    <>
      <h5>Credit List</h5>
      <MaterialReactTable
        columns={column}
        data={!fetchCreditLoading && credits}
        state={{
          isLoading: fetchCreditLoading,
          isSaving: fetchCreditLoading,
          showLoadingOverlay: fetchCreditLoading,
          showProgressBars: fetchCreditLoading,
          showSkeletons: fetchCreditLoading,
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
        paginationDisplayMode="pages"
        enableFacetedValues={true}
        enableGrouping={true}
        columnFilterDisplayMode="popover"
        positionToolbarAlertBanner="bottom"
        enableStickyHeader
        enableStickyFooter
        enableRowActions
        muiTablePaginationProps={{
          color: 'secondary',
          rowsPerPageOptions: [10, 20, 30],
          shape: 'rounded',
          variant: 'outlined',
        }}
        initialState={{
          density: 'compact',
          columnPinning: { left: ['mrt-row-actions'] },
        }}
        renderTopToolbarCustomActions={({ row, table }) => (
          <Button
            color="warning"
            variant="contained"
            style={{ fontSize: 12 }}
            onClick={() => {
              resellerCreditForm.resetForm()
              setResellerCreditModalVisible(true)
            }}
          >
            <FontAwesomeIcon style={{ marginRight: 5 }} icon={faPlus} /> Add Credit
          </Button>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            <Tooltip title="Edit">
              <IconButton
                color="warning"
                onClick={() => {
                  resellerCreditForm.setFieldValue('id', row.original.id)
                  resellerCreditForm.setFieldValue('amount', row.original.amount)
                  setResellerCreditModalVisible(true)
                }}
              >
                <EditSharp />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <CModal
        alignment="center"
        visible={resellerCreditModalVisible}
        onClose={() => setResellerCreditModalVisible(false)}
        size="md"
      >
        <CModalHeader>
          <CModalTitle>Add Credit</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-3 needs-validation"
            onSubmit={resellerCreditForm.handleSubmit}
            style={{ position: 'relative' }}
          >
            <RequiredFieldNote />
            <CCol md={12}>
              <CFormLabel>{requiredField('Amount')}</CFormLabel>

              <CFormInput
                type="number"
                name="amount"
                className="text-right"
                onChange={handleInputChange}
                value={resellerCreditForm.values.amount}
                placeholder="0.00"
              />

              {resellerCreditForm.touched.amount && resellerCreditForm.errors.amount && (
                <CFormText className="text-danger">{resellerCreditForm.errors.amount}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                Submit
              </CButton>
            </CCol>
          </CForm>
          {fetchCreditLoading && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default ResellerCredit
