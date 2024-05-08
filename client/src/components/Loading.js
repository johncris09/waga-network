import React from 'react'
import { Oval } from 'react-loader-spinner'

const DefaultLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Oval
        height={40}
        width={40}
        color="#34aadc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#34aadc"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

const WidgetLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.001)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Oval
        height={30}
        width={30}
        color="#34aadc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#34aadc"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}
export { DefaultLoading, WidgetLoading }
