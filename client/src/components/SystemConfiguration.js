import React from 'react'
import CryptoJS from 'crypto-js'
import { MagnifyingGlass, Oval, RotatingLines } from 'react-loader-spinner'
import Swal from 'sweetalert2'
import axios from 'axios'

const isProduction = false

const api = axios.create({
  baseURL: isProduction
    ? process.env.REACT_APP_BASEURL_PRODUCTION
    : process.env.REACT_APP_BASEURL_DEVELOPMENT,

  auth: {
    username: process.env.REACT_APP_API_USERNAME,
    password: process.env.REACT_APP_API_PASSWORD,
  },
})

const asterisk = () => {
  return <span className="text-danger">*</span>
}

const CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) }
    if (cipherParams.iv) j.iv = cipherParams.iv.toString()
    if (cipherParams.salt) j.s = cipherParams.salt.toString()
    return JSON.stringify(j)
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr)
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    })
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
    return cipherParams
  },
}

const decrypted = (data) => {
  const decryptedData = JSON.parse(
    CryptoJS.AES.decrypt(data, process.env.REACT_APP_ENCRYPTION_KEY, {
      format: CryptoJSAesJson,
    }).toString(CryptoJS.enc.Utf8),
  )

  return JSON.parse(decryptedData)
}
const encrypt = (data) => {
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_ENCRYPTION_KEY, {
    format: CryptoJSAesJson,
  }).toString()

  return encrypted
}

const toSentenceCase = (value) => {
  try {
    return value
      .toLowerCase()
      .split(' ')
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(' ')
  } catch (error) {
    return value
  }
}

const getFirstLetters = (value) => {
  const words = value.split(' ').map((word) => word.charAt(0).toUpperCase())
  return words.join('')
}

const DefaultLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: -15,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.03)', // Adjust the background color and opacity as needed
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

const MagnifyingGlassLoading = () => {
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
      <MagnifyingGlass
        visible={true}
        height={80}
        width={80}
        ariaLabel="magnifying-glass-loading"
        wrapperStyle={{}}
        wrapperClass="magnifying-glass-wrapper"
        glassColor="#c0efff"
        color="#321fdb"
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

const WholePageLoading = () => {
  return (
    <div
      style={{
        position: 'fixed',
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
      <div>
        <RotatingLines
          visible={true}
          color="#34aadc"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
          height={40}
          width={40}
          strokeWidthSecondary={2}
        />
        <p style={{ marginLeft: '-20px', fontSize: '16px' }}>Please wait...</p>
      </div>
    </div>
  )
}

const RequiredFieldNote = (label) => {
  return (
    <>
      <div>
        <small className="text-muted">
          Note: <span className="text-danger">*</span> is required
        </small>
      </div>
    </>
  )
}
const requiredField = (label) => {
  return (
    <>
      <span>
        {label} <span className="text-danger">*</span>
      </span>
    </>
  )
}

const validationPrompt = (operationCallback) => {
  try {
    Swal.fire({
      title: 'Please enter the secret key to proceed.',
      input: 'password',
      icon: 'info',
      customClass: {
        validationMessage: 'my-validation-message',
        alignment: 'text-center',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('This field is required')
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then(async function (result) {
      if (result.isConfirmed) {
        if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
          operationCallback()
        } else {
          Swal.fire({
            title: 'Error!',
            html: 'Invalid Secret Key',
            icon: 'error',
          })
        }
      }
    })
  } catch (error) {
    return false
  }
}

const currentDate = new Date()
const formattedCurrentDate =
  currentDate.getFullYear() +
  '/' +
  ('0' + (currentDate.getMonth() + 1)).slice(-2) +
  '/' +
  ('0' + currentDate.getDate()).slice(-2)

const endDate = formattedCurrentDate
const placeholder = [
  {
    labels: [
      'Apil',
      'Binuangan',
      'Bolibol',
      'Buenavista',
      'Bunga',
      'Buntawan',
      'Burgos',
      'Canubay',
      'Ciriaco Pastrano',
      'Clarin Settlement',
      'Dolipos Alto',
      'Dolipos Bajo',
      'Dulapo',
      'Dullan Norte',
      'Dullan Sur',
      'Layawan',
      'Lower Lamac',
      'Lower Langcangan',
      'Lower Loboc',
      'Lower Rizal',
      'Malindang',
      'Mialen',
      'Mobod',
      'Paypayan',
      'Pines',
      'Poblacion I',
      'Poblacion II',
      'Proper Langcangan',
      'San Vicente Alto',
      'San Vicente Bajo',
      'Sebucal',
      'Senote',
      'Taboc Norte',
      'Taboc Sur',
      'Talairon',
      'Talic',
      'Tipan',
      'Toliyok',
      'Tuyabang Alto',
      'Tuyabang Bajo',
      'Tuyabang Proper',
      'Upper Lamac',
      'Upper Langcangan',
      'Upper Loboc',
      'Upper Rizal',
      'Victoria',
      'Villaflor',
    ],
    datasets: [
      {
        label: '10',
        data: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        backgroundColor: '#0dcaf0',
      },
      {
        label: '20',
        data: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        backgroundColor: '#FFC55A',
      },
      {
        label: '100',
        data: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        backgroundColor: '#E1ACAC',
      },
      {
        label: '450',
        data: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        backgroundColor: '#8DECB4',
      },
    ],
  },
]
export {
  placeholder,
  endDate,
  validationPrompt,
  requiredField,
  RequiredFieldNote,
  DefaultLoading,
  MagnifyingGlassLoading,
  WidgetLoading,
  WholePageLoading,
  toSentenceCase,
  decrypted,
  encrypt,
  asterisk,
  api,
}
