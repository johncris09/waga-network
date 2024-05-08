import { CAvatar } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import { api } from '../SystemConfiguration'

const isProduction = true
const Avatar = ({ userId }) => {
  const [photo, setPhoto] = useState('')
  useEffect(() => {
    api
      .get('user/find/' + userId)
      .then((response) => {
        if (response.data.photo) {
          if (isProduction) {
            setPhoto(
              process.env.REACT_APP_BASEURL_PRODUCTION + 'assets/image/user/' + response.data.photo,
            )
          } else {
            setPhoto(
              process.env.REACT_APP_BASEURL_DEVELOPMENT +
                'assets/image/user/' +
                response.data.photo,
            )
          }
        } else {
          if (isProduction) {
            setPhoto(
              process.env.REACT_APP_BASEURL_PRODUCTION + 'assets/image/user/defaultAvatar.png',
            )
          } else {
            setPhoto(
              process.env.REACT_APP_BASEURL_DEVELOPMENT + 'assets/image/user/defaultAvatar.png',
            )
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        // setFetchSenifororHighSchoolLoading(false)
      })
  }, [userId])
  return (
    <>
      <CAvatar
        src={photo}
        title="Profile Photo"
        size="md"
        alt="Profile Photo"
        style={{ width: '50px', height: '50px' }}
      />
    </>
  )
}

export default Avatar
