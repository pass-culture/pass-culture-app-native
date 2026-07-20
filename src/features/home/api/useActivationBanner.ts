import { useEffect } from 'react'

import { BannerName } from 'api/gen'
import { useBannerQuery } from 'features/home/queries/useBannerQuery'
import { GeolocPermissionState } from 'libs/location/location'
import { useLocationV2 } from 'libs/locationV2/location.store'
import { eventMonitoring } from 'libs/monitoring/services'
import { useOverrideCreditActivationAmount } from 'shared/user/useOverrideCreditActivationAmount'

export type ActivationBanner = {
  title: string
  text?: string
  name?: BannerName
}

const defaultTitle = 'Débloque ton crédit pour bénéficier du pass Culture'

export const useActivationBanner = (): { banner: ActivationBanner } => {
  const { shouldBeOverriden, amount: overriddenAmount } = useOverrideCreditActivationAmount()
  const { permissionState } = useLocationV2()

  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data, isError, error } = useBannerQuery(isGeolocated)

  useEffect(() => {
    if (isError) eventMonitoring.captureException(error)
  }, [error, isError])

  if (shouldBeOverriden) {
    return {
      banner: {
        title: overriddenAmount ? `Débloque tes ${overriddenAmount}` : defaultTitle,
        text: data?.banner?.text,
        name: data?.banner?.name,
      },
    }
  }

  return {
    banner: {
      title: data?.banner?.title ?? defaultTitle,
      text: data?.banner?.text,
      name: data?.banner?.name,
    },
  }
}
