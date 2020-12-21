import { useEffect, useState } from 'react'
import LN from 'react-native-launch-navigator'
import { AppEnum } from 'react-native-launch-navigator/enum'

export const useItinerary = () => {
  const [availableApps, setAvailableApps] = useState<AppEnum[] | undefined>(undefined)
  const getApps = async () => {
    try {
      const appsAvailability = await LN.getAvailableApps()

      const appsKeys: AppEnum[] = Object.keys(appsAvailability) as AppEnum[]
      const apps = appsKeys.filter((key) => appsAvailability[key])
      setAvailableApps(apps)
    } catch (e: unknown) {
      setAvailableApps([])
    }
  }
  useEffect(() => {
    getApps()
  }, [])
  return { availableApps }
}
