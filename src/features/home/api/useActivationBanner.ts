import { useEffect } from 'react'

import { useBannerQuery } from 'features/home/queries/useBannerQuery'
import { GeolocPermissionState, useLocation } from 'libs/location/location'
import { eventMonitoring } from 'libs/monitoring/services'
import { useOverrideCreditActivationAmount } from 'shared/user/useOverrideCreditActivationAmount'

export function useActivationBanner() {
  const { shouldBeOverriden, amount: overriddenAmount } = useOverrideCreditActivationAmount()
  const { permissionState } = useLocation()

  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data, isError, error } = useBannerQuery(isGeolocated)

  useEffect(() => {
    if (isError) eventMonitoring.captureException(error)
  }, [error, isError])

  if (shouldBeOverriden) {
    return {
      banner: {
        title: overriddenAmount ? `Débloque tes ${overriddenAmount}` : `Débloque ton crédit`,
        text: data?.banner?.text,
        name: data?.banner?.name,
      },
    }
  }
  return { banner: { ...data?.banner } }
}
