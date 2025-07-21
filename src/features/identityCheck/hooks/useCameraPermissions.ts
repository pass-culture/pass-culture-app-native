import { useEffect, useState } from 'react'

import {
  checkCameraPermission,
  requestCameraPermission,
} from 'libs/permissions/cameraPermissions.android'

export function useCameraPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isRequesting, setIsRequesting] = useState(false)

  const requestPermission = async () => {
    if (isRequesting) return

    setIsRequesting(true)
    try {
      const granted = await requestCameraPermission()
      setHasPermission(granted)
      return granted
    } finally {
      setIsRequesting(false)
    }
  }

  const checkPermission = async () => {
    try {
      const granted = await checkCameraPermission()
      setHasPermission(granted)
      return granted
    } catch {
      setHasPermission(false)
      return false
    }
  }

  useEffect(() => {
    checkPermission()
  }, [])

  return {
    hasPermission,
    isRequesting,
    requestPermission,
    checkPermission,
  }
}
