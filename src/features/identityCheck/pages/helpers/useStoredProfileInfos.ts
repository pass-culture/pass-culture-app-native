import { ActivityIdEnum } from 'api/gen'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { Name, useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import { SuggestedCity } from 'libs/place/types'

export type ValidStoredProfileInfos = {
  name: Name
  city: SuggestedCity
  address: string
  status: ActivityIdEnum
}

export const useStoredProfileInfos = (): ValidStoredProfileInfos | undefined => {
  const name = useName()
  const city = useCity()
  const address = useAddress()
  const status = useStatus()

  const isValid =
    name?.firstName && name?.lastName && city?.name && city?.postalCode && address && status

  if (!isValid) return undefined

  return { name, city, address, status }
}
