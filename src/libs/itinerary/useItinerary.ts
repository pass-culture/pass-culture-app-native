import { useEffect, useRef } from 'react'
import { Alert, AlertButton, Platform } from 'react-native'
import LN from 'react-native-launch-navigator'

import { snakeCaseToUppercaseFirstLetter } from 'libs/parsers/snakeCaseToUppercaseFirstLetter'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { openGoogleMapsItinerary } from './openGoogleMapsItinerary'
import { UseItineraryResult } from './types'

enum BackupSolution {
  GOOGLE_MAPS_WEB,
  SNACKBAR_ERROR,
}

export const useItinerary = (): UseItineraryResult => {
  const availableAppsRef = useRef<string[] | undefined>(undefined)
  const { showInfoSnackBar } = useSnackBarContext()

  const navigateToWithApp = async (
    address: string,
    app: string,
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
            message:
              'Une erreur s’est produite, veuillez passer par une autre application de géolocalisation pour trouver l’itinéraire vers ce lieu.',
            timeout: SNACK_BAR_TIME_OUT_LONG,
          })
          return
      }
    }
  }
  const navigateTo = (address: string) => {
    if (availableAppsRef.current === undefined) return
    if (availableAppsRef.current.length === 0) {
      openGoogleMapsItinerary(address)
      return
    }
    if (availableAppsRef.current.length === 1 && availableAppsRef.current[0]) {
      navigateToWithApp(address, availableAppsRef.current[0], BackupSolution.GOOGLE_MAPS_WEB)
      return
    }
    const alertButtons: AlertButton[] = availableAppsRef.current.map((app) => ({
      text: snakeCaseToUppercaseFirstLetter(app),
      onPress: () => navigateToWithApp(address, app, BackupSolution.SNACKBAR_ERROR),
    }))
    if (Platform.OS === 'ios') alertButtons.push({ text: 'Annuler', style: 'cancel' })
    Alert.alert(
      'Voir l’itinéraire',
      'Choisissez l’application pour vous rendre sur le lieu de l’offre\u00a0:',
      alertButtons,
      { cancelable: true }
    )
  }

  useEffect(() => {
    let isMounted = true

    LN.getAvailableApps()
      .then((appsAvailability) => {
        const apps = Object.keys(appsAvailability).filter((appName) => appsAvailability[appName])
        if (isMounted) availableAppsRef.current = apps
      })
      .catch(() => {
        availableAppsRef.current = []
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { navigateTo }
}
