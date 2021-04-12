import React, { useContext, useEffect } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { useAppStateChange } from 'libs/appState'
import { useSafeState } from 'libs/hooks'
import { storage } from 'libs/storage'

import { checkGeolocPermission } from './checkGeolocPermission'
import { getPosition } from './getPosition'
import { GeolocPermissionState } from './permissionState.d'
import { requestGeolocPermission } from './requestGeolocPermission'

type RequestGeolocPermissionParams = {
  onAcceptance?: () => void
  onRefusal?: () => void
  onSubmit?: () => void
}

export interface IGeolocationContext {
  position: GeoCoordinates | null
  appGeolocPermission: boolean
  phoneSettingsGeolocPermission: GeolocPermissionState
  setAppGeolocPermission: (newPermission: boolean) => void
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
}

export const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  appGeolocPermission: false,
  phoneSettingsGeolocPermission: GeolocPermissionState.DENIED,
  setAppGeolocPermission() {
    // nothing
  },
  async requestGeolocPermission() {
    // nothing
  },
})

async function getInitialAppGeolocPermission() {
  const isGrantedInPhoneSettings: GeolocPermissionState = await checkGeolocPermission()
  if (isGrantedInPhoneSettings !== GeolocPermissionState.GRANTED) {
    return false
  }
  const isGrantedInApp = await storage.readObject<boolean>('has_allowed_geolocation')
  if (!isGrantedInApp) {
    return false
  }
  return true
}

export const GeolocationWrapper = ({ children }: { children: Element }) => {
  const [position, setPosition] = useSafeState<GeoCoordinates | null>(null)

  const [appGeolocPermission, setAppGeolocPermission] = useSafeState<boolean>(true)
  const [phoneSettingsGeolocPermission, _setPhoneSettingsGeolocPermission] = useSafeState<
    GeolocPermissionState
  >(GeolocPermissionState.GRANTED)
  function setPhoneSettingsGeolocPermission(newPermission: GeolocPermissionState) {
    if (
      !isGeolocPermissionGranted(phoneSettingsGeolocPermission) &&
      isGeolocPermissionGranted(newPermission)
    ) {
      setAppGeolocPermission(true)
    }
    if (!isGeolocPermissionGranted(newPermission)) {
      setAppGeolocPermission(false)
    }
    _setPhoneSettingsGeolocPermission(newPermission)
  }

  useEffect(() => {
    getInitialAppGeolocPermission().then(setAppGeolocPermission)
    synchronizePhoneSettingsPermissionWithState()
  }, [])

  useEffect(() => {
    storage.saveObject('has_allowed_geolocation', appGeolocPermission)
  }, [appGeolocPermission])

  // reset position every time user updates his choice on the app or in his phone settings
  // if user choice is not consistent with OS permissions, position is set to null
  useEffect(() => {
    if (isGeolocPermissionGranted(phoneSettingsGeolocPermission) && appGeolocPermission) {
      getPosition(setPosition)
    } else {
      setPosition(null)
    }
  }, [appGeolocPermission, phoneSettingsGeolocPermission])

  // this function is used to set OS permissions according to user choice on native geolocation popup
  async function contextualRequestGeolocPermission(params?: RequestGeolocPermissionParams) {
    const newPhoneSettingsGeolocPermission = await requestGeolocPermission()
    setPhoneSettingsGeolocPermission(newPhoneSettingsGeolocPermission)

    const isPermissionGranted = isGeolocPermissionGranted(newPhoneSettingsGeolocPermission)
    if (params?.onSubmit) {
      params.onSubmit()
    }
    if (isPermissionGranted && params?.onAcceptance) {
      params.onAcceptance()
    } else if (!isPermissionGranted && params?.onRefusal) {
      params.onRefusal()
    }
  }

  // WARNING: the reference of synchronizePhoneSettingsPermissionWithState() changes between
  // - the registration of the "onAppBecomeActive" handler in the "useAppStateChange" effect
  // - and its execution (when app becomes active).
  // that's why it's very important to add the 'permissionState' to the dependencies of the "useAppStateChange" effect
  useAppStateChange(synchronizePhoneSettingsPermissionWithState, onAppBecomeInactive, [
    phoneSettingsGeolocPermission,
  ])
  // in case user updates his preferences in his phone settings we check if his local
  // storage choice is consistent with phone permissions, and update position if not
  async function synchronizePhoneSettingsPermissionWithState() {
    const newPhoneSettingsGeolocPermission: GeolocPermissionState = await checkGeolocPermission()
    setPhoneSettingsGeolocPermission(newPhoneSettingsGeolocPermission)
  }
  async function onAppBecomeInactive() {
    // nothing
  }

  return (
    <GeolocationContext.Provider
      value={{
        position,
        appGeolocPermission,
        phoneSettingsGeolocPermission,
        setAppGeolocPermission,
        requestGeolocPermission: contextualRequestGeolocPermission,
      }}>
      {children}
    </GeolocationContext.Provider>
  )
}

function isGeolocPermissionGranted(permission: GeolocPermissionState): boolean {
  return permission === GeolocPermissionState.GRANTED
}

export function useGeolocation(): IGeolocationContext {
  return useContext(GeolocationContext)
}
