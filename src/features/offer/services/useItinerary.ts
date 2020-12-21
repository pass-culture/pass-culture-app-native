import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import LN from 'react-native-launch-navigator'
import { AppEnum } from 'react-native-launch-navigator/enum'

import { Coordinates } from 'api/gen'
import { _ } from 'libs/i18n'
import { snakeCaseToUppercaseFirstLetter } from 'libs/parsers/snakeCaseToUppercaseFirstLetter'

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
  const navigateToWithApp = async (coordinates: Required<Coordinates>, app: AppEnum) => {
    try {
      await LN.navigate([coordinates.latitude, coordinates.longitude], { app })
    } catch (e: unknown) {
      /** */
    }
  }
  const navigateTo = (coordinates: Required<Coordinates>) => {
    if (!availableApps) return
    if (availableApps.length === 1) {
      navigateToWithApp(coordinates, availableApps[0])
      return
    }
    Alert.alert(
      _(t`Voir l'itinéraire`),
      _(t`Choisissez l'application pour vous rendre sur le lieu de l'offre :`),
      availableApps.map((app) => ({
        text: snakeCaseToUppercaseFirstLetter(app),
        onPress: () => navigateToWithApp(coordinates, app),
      }))
    )
  }
  useEffect(() => {
    getApps()
  }, [])
  return { availableApps, navigateTo }
}
