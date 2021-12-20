import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Alert, AlertButton, Platform } from 'react-native'
import LN from 'react-native-launch-navigator'
import { AppEnum } from 'react-native-launch-navigator/enum'

import { snakeCaseToUppercaseFirstLetter } from 'libs/parsers/snakeCaseToUppercaseFirstLetter'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { openGoogleMapsItinerary } from './openGoogleMapsItinerary'
import { UseItineraryResult } from './types'

const appEnumTypeGuard = (app: string): app is AppEnum =>
  Object.values(AppEnum).includes(app as AppEnum)

enum BackupSolution {
  GOOGLE_MAPS_WEB,
  SNACKBAR_ERROR,
}

export const useItinerary = (): UseItineraryResult => {
  const [availableApps, setAvailableApps] = useState<AppEnum[] | undefined>(undefined)
  const { showInfoSnackBar } = useSnackBarContext()
  const getApps = async () => {
    try {
      const appsAvailability = await LN.getAvailableApps()
      const appsKeys = Object.keys(appsAvailability)
      const apps = appsKeys.filter(
        (appKey): appKey is AppEnum => appEnumTypeGuard(appKey) && appsAvailability[appKey]
      )
      setAvailableApps(apps)
    } catch {
      setAvailableApps([])
    }
  }

  const navigateToWithApp = async (
    address: string,
    app: AppEnum,
    backupSolution: BackupSolution
  ) => {
    try {
      if (!address) {
        throw Error()
      }
      await LN.navigate(address, { app })
    } catch {
      switch (backupSolution) {
        case BackupSolution.GOOGLE_MAPS_WEB:
          openGoogleMapsItinerary(address)
          return
        case BackupSolution.SNACKBAR_ERROR:
          showInfoSnackBar({
            message: t`Une erreur s’est produite, veuillez passer par une autre application de géolocalisation pour trouver l’itinéraire vers ce lieu.`,
            timeout: 10000,
          })
          return
      }
    }
  }
  const navigateTo = (address: string) => {
    if (availableApps === undefined) return
    if (availableApps.length === 0) {
      openGoogleMapsItinerary(address)
      return
    }
    if (availableApps.length === 1) {
      navigateToWithApp(address, availableApps[0], BackupSolution.GOOGLE_MAPS_WEB)
      return
    }
    const alertButtons: AlertButton[] = availableApps.map((app) => ({
      text: snakeCaseToUppercaseFirstLetter(app),
      onPress: () => navigateToWithApp(address, app, BackupSolution.SNACKBAR_ERROR),
    }))
    if (Platform.OS === 'ios') alertButtons.push({ text: t`Annuler`, style: 'cancel' })
    Alert.alert(
      t`Voir l'itinéraire`,
      t`Choisissez l'application pour vous rendre sur le lieu de l'offre\u00a0:`,
      alertButtons,
      { cancelable: true }
    )
  }

  useEffect(() => {
    getApps()
  }, [])

  return { navigateTo }
}
