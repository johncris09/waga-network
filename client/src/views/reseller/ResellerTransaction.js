import React, { useEffect, useState } from 'react'
import { api } from 'src/components/SystemConfiguration'
import 'cropperjs/dist/cropper.css'
import './../../assets/css/custom.css'
import MaterialReactTable from 'material-react-table'
import { useQuery, useQueryClient } from 'react-query'

const ResellerTransaction = ({ id }) => {
  const queryClient = useQueryClient()
  const [totalAmount, setTotalAmount] = useState(0)
  const { data: purchase, isLoading: fetchPurchaseLoading } = useQuery({
    queryFn: async () =>
      await api.get('reseller/get_purchase/' + id).then((response) => {
        calculateTotalAmount(response.data)
        return response.data
      }),
    queryKey: ['purchase', id],
    staleTime: Infinity,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['purchase'])
    },
  })
  const calculateTotalAmount = (transactions) => {
    let total = 0
    transactions.forEach((transaction) => {
      total += parseFloat(transaction.amount)
    })
    setTotalAmount(total) // Update totalAmount state
  }
  const column = [
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      Footer: () => totalAmount.toFixed(2), // Display totalAmount in the Footer
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
  return (
    <>
      <h5>Transaction List</h5>
      <MaterialReactTable
        columns={column}
        data={!fetchPurchaseLoading && purchase}
        state={{
          isLoading: fetchPurchaseLoading,
          isSaving: fetchPurchaseLoading,
          showLoadingOverlay: fetchPurchaseLoading,
          showProgressBars: fetchPurchaseLoading,
          showSkeletons: fetchPurchaseLoading,
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
      />
    </>
  )
}

export default ResellerTransaction
