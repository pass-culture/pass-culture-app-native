import { useBannerQuery } from 'features/home/queries/useBannerQuery'
import { GeolocPermissionState, useLocation } from 'libs/location/location'
import { useOverrideCreditActivationAmount } from 'shared/user/useOverrideCreditActivationAmount'

export function useActivationBanner() {
  const { shouldBeOverriden, amount: overriddenAmount } = useOverrideCreditActivationAmount()
  const { permissionState } = useLocation()

  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data } = useBannerQuery(isGeolocated)

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
