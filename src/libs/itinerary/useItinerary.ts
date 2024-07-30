import { useEffect, useRef } from 'react'
import { Alert, AlertButton, Platform } from 'react-native'
import LN from 'react-native-launch-navigator'

import { snakeCaseToUppercaseFirstLetter } from 'libs/parsers/snakeCaseToUppercaseFirstLetter'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { openGoogleMapsItinerary } from './openGoogleMapsItinerary'
import { UseItineraryResult } from './types'

enum AppEnum {
  APPLE_MAPS = 'apple_maps',
  GOOGLE_MAPS = 'google_maps',
  WAZE = 'waze',
  CITYMAPPER = 'citymapper',
  NAVIGON = 'navigon',
  TRANSIT_APP = 'transit_app',
  YANDEX = 'yandex',
  UBER = 'uber',
  TOMTOM = 'tomtom',
  BING_MAPS = 'bing_maps',
  SYGIC = 'sygic',
  HERE_MAPS = 'here_maps',
  MOOVIT = 'moovit',
  LYFT = 'lyft',
  MAPS_ME = 'maps_me',
  CABIFY = 'cabify',
  BAIDU = 'baidu',
  TAXIS_99 = 'taxis_99',
  GAODE = 'gaode',
}

const appEnumTypeGuard = (app: string): app is AppEnum =>
  Object.values<string>(AppEnum).includes(app)

enum BackupSolution {
  GOOGLE_MAPS_WEB,
  SNACKBAR_ERROR,
}

export const useItinerary = (): UseItineraryResult => {
  const availableAppsRef = useRef<AppEnum[] | undefined>(undefined)
  const { showInfoSnackBar } = useSnackBarContext()

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
    if (availableAppsRef.current.length === 1) {
      // @ts-expect-error: because of noUncheckedIndexedAccess
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
        const appsKeys = Object.keys(appsAvailability)
        const apps = appsKeys.filter(
          // @ts-expect-error: because of noUncheckedIndexedAccess
          (appKey): appKey is AppEnum => appEnumTypeGuard(appKey) && appsAvailability[appKey]
        )
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
