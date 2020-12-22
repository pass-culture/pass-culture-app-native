import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Alert, AlertButton, Linking, Platform } from 'react-native'
import LN from 'react-native-launch-navigator'
import { AppEnum } from 'react-native-launch-navigator/enum'

import { Coordinates } from 'api/gen'
import { _ } from 'libs/i18n'
import { snakeCaseToUppercaseFirstLetter } from 'libs/parsers/snakeCaseToUppercaseFirstLetter'

import { getOpenStreetMapUrl } from '../../../libs/parsers/getOpenStreetMapUrl'

const appEnumTypeGuard = (app: string): app is AppEnum =>
  Object.values(AppEnum).includes(app as AppEnum)

export const useItinerary = () => {
  const [availableApps, setAvailableApps] = useState<AppEnum[] | undefined>(undefined)
  const getApps = async () => {
    try {
      const appsAvailability = await LN.getAvailableApps()
      const appsKeys = Object.keys(appsAvailability)
      const apps = appsKeys.filter(
        (appKey): appKey is AppEnum => appEnumTypeGuard(appKey) && appsAvailability[appKey]
      )
      setAvailableApps(apps)
    } catch (e: unknown) {
      setAvailableApps([])
    }
  }
  const navigateWithOpenStreetMap = (coordinates: Required<Coordinates>) => {
    const openStreetMapUrl = getOpenStreetMapUrl(coordinates)
    if (Linking.canOpenURL(openStreetMapUrl)) Linking.openURL(openStreetMapUrl)
  }
  const navigateToWithApp = async (coordinates: Required<Coordinates>, app: AppEnum) => {
    try {
      await LN.navigate([coordinates.latitude, coordinates.longitude], { app })
    } catch (e: unknown) {
      /** */
    }
  }
  const navigateTo = (coordinates: Required<Coordinates>) => {
    if (availableApps === undefined) return
    if (availableApps.length === 0) navigateWithOpenStreetMap(coordinates)
    if (availableApps.length === 1) {
      navigateToWithApp(coordinates, availableApps[0])
      return
    }
    const alertButtons: AlertButton[] = availableApps.map((app) => ({
      text: snakeCaseToUppercaseFirstLetter(app),
      onPress: () => navigateToWithApp(coordinates, app),
    }))
    if (Platform.OS === 'ios') alertButtons.push({ text: _(t`Annuler`), style: 'cancel' })
    Alert.alert(
      _(t`Voir l'itinéraire`),
      _(t`Choisissez l'application pour vous rendre sur le lieu de l'offre :`),
      alertButtons,
      { cancelable: true }
    )
  }
  useEffect(() => {
    getApps()
  }, [])
  return { availableApps, navigateTo }
}
