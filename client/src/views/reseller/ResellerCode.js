import React, { useCallback, useEffect, useState } from 'react'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
} from 'src/components/SystemConfiguration'
import 'cropperjs/dist/cropper.css'
import Swal from 'sweetalert2'
import { useDropzone } from 'react-dropzone'
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
  CRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudDownload, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons'
import MaterialReactTable from 'material-react-table'

import { useMutation, useQuery, useQueryClient } from 'react-query'

const ResellerCode = ({ id }) => {
  const queryClient = useQueryClient()
  const [csvData, setCsvData] = useState([])
  const [data, setData] = useState([])
  const [fetchDataLoading, setFetchDataLoading] = useState(false)
  const [resellerCreditModalVisible, setResellerCreditModalVisible] = useState(false)
  const [uploadCsvLoading, setUploadCsvLoading] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)

  const { data: code, isLoading: fetchCodeLoading } = useQuery({
    queryFn: async () =>
      await api.get('reseller/get_code/' + id).then((response) => {
        return response.data
      }),
    queryKey: ['code', id],
    staleTime: Infinity,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries(['code'])
    },
  })

  const { mutate: uploadCode, isLoading: isLoadinguploadCode } = useMutation({
    mutationKey: 'insertVoucher',
    mutationFn: () => {
      csvData.forEach((item) => {
        item.user_id = id
      })
      return api.post('code/insert', csvData)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data) {
        toast.success(response.data.message)
      }

      await queryClient.invalidateQueries(['code'])
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    },
  })
  const column = [
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
    },
    {
      accessorKey: 'date_created',
      header: 'Date Created',
    },
    {
      accessorKey: 'time_created',
      header: 'Time Created',
    },
    {
      accessorKey: 'is_used',
      header: 'Used',
      accessorFn: (row) => (row.is_used == 1 ? 'Yes' : 'No'),
    },
  ]

  const onDrop = useCallback((acceptedFiles) => {
    // Check if only one file is dropped
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0]
      if (file.type !== 'text/csv') {
        Swal.fire({
          text: 'Please upload specified file only.',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          icon: 'error',
        })
      } else {
        const reader = new FileReader()
        reader.onload = (event) => {
          const csvData = event.target.result
          const transformedData = transformData(csvData)
          setCsvData(transformedData)
        }

        reader.readAsText(file)
      }
    } else {
      Swal.fire({
        text: 'Please upload only one file.',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        icon: 'error',
      })
    }
  }, [])

  const transformData = (csvData) => {
    // Split the CSV data by new line
    const rows = csvData.split('\n')

    // Initialize an empty array to store the final data
    const dataArray = []
    // Iterate over each row
    rows.forEach((row) => {
      // Split each row by comma
      const [code, amount] = row.split(',')
      if (code && amount) {
        // Create an object for each row
        const dataObject = {
          code: code,
          amount: parseFloat(amount), // Assuming you want amount, parse if needed
        }

        // Add the object to the data array
        dataArray.push(dataObject)
      }
    })

    return dataArray
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.csv',
  })

  const dropzoneStyle = {
    border: '4px dashed blue',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
  }
  const csvColumn = [
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',

      accessorFn: (row) => {
        return parseFloat(row.amount).toLocaleString()
      },
    },
  ]

  return (
    <>
      <CRow className="px-3 py-3">
        {fetchCodeLoading && <DefaultLoading />}
        <CCol md={6}>
          <h5>Upload Code Here</h5>
          <div className="mb-4" {...getRootProps()} style={dropzoneStyle}>
            <input
              {...getInputProps()}
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            {isDragActive ? (
              <p>Drop the Excel file here...</p>
            ) : (
              <>
                <p>
                  <FontAwesomeIcon icon={faCloudDownload} style={{ color: 'blue', fontSize: 70 }} />
                </p>
                <p> Drag and drop an .csv file here, or click to select one </p>
              </>
            )}
          </div>
          <MaterialReactTable
            columns={csvColumn}
            data={csvData}
            state={{
              isLoading: uploadCsvLoading,
              isSaving: uploadCsvLoading,
              showLoadingOverlay: uploadCsvLoading,
              showProgressBars: uploadCsvLoading,
              showSkeletons: uploadCsvLoading,
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
            // paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            // enableStickyHeader
            // enableStickyFooter
            // // enableRowActions
            initialState={{
              density: 'compact',
              columnPinning: { left: ['mrt-row-actions'] },
            }}
            renderTopToolbarCustomActions={({ row, table }) => (
              <>
                <Button
                  color="warning"
                  variant="contained"
                  style={{ fontSize: 12 }}
                  onClick={async () => {
                    if (csvData.length > 0) {
                      await uploadCode()
                    } else {
                      Swal.fire({
                        text: 'No Imported Code',
                        showCancelButton: true,
                        icon: 'error',
                      })
                    }
                  }}
                >
                  <FontAwesomeIcon style={{ marginRight: 5 }} icon={faDownload} /> Upload Code
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    setCsvData([])
                  }}
                >
                  <FontAwesomeIcon style={{ marginRight: 5 }} icon={faTimes} /> Clear Data
                </Button>
              </>
            )}
          />
        </CCol>

        <CCol md={6}>
          <h5>Code List</h5>

          <MaterialReactTable
            columns={column}
            data={!fetchCodeLoading && code}
            state={{
              isLoading: fetchCodeLoading,
              isSaving: fetchCodeLoading,
              showLoadingOverlay: fetchCodeLoading,
              showProgressBars: fetchCodeLoading,
              showSkeletons: fetchCodeLoading,
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
            initialState={{
              density: 'compact',
              columnPinning: { left: ['mrt-row-actions'] },
            }}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default ResellerCode
