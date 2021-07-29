import { useEffect, useState } from 'react'

export const useItinerary = () => {
  const [availableApps] = useState<undefined>(undefined)
  const getApps = async () => true
  const navigateTo = () => true
  useEffect(() => {
    getApps()
  }, [])
  return { availableApps, navigateTo }
}
