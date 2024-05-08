import React from 'react'
import './../../assets/css/react-paginate.css'
import 'cropperjs/dist/cropper.css'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { Box, IconButton } from '@mui/material'
import { InsertDriveFile } from '@mui/icons-material'
import { api, toSentenceCase } from 'src/components/SystemConfiguration'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'

const Reseller = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: reseller, isLoading: fetchDataLoading } = useQuery({
    queryFn: async () =>
      await api.get('reseller').then((response) => {
        return response.data
      }),
    queryKey: ['reseller'],
    staleTime: Infinity,

    onSuccess: async () => {
      await queryClient.invalidateQueries(['reseller'])
    },
  })

  const column = [
    {
      accessorKey: 'id',
      header: 'Name',
      accessorFn: (row) => `${row.first_name} ${row.middle_name} ${row.last_name}`,
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
      accessorKey: 'total_used_code',
      header: 'Used Code',
    },
    {
      accessorKey: 'total_unused_code',
      header: 'Unused Code',
    },
    {
      accessorKey: 'net_credit',
      header: 'Available Credit',
    },
    {
      accessorKey: 'total_purchase',
      header: 'Total Purchase',
    },
    {
      accessorKey: 'total_credit',
      header: 'Total Credit',
    },
  ]

  return (
    <>
      <CCard className="mb-4" style={{ position: 'relative' }}>
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!fetchDataLoading && reseller}
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
                <tooltip title="View Reseller's Information">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      navigate(
                        '/search/' +
                          toSentenceCase(row.original.last_name) +
                          ', ' +
                          toSentenceCase(row.original.first_name) +
                          ' ' +
                          toSentenceCase(row.original.middle_name),
                        { replace: true },
                      )
                    }}
                  >
                    <InsertDriveFile />
                  </IconButton>
                </tooltip>
              </Box>
            )}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Reseller
