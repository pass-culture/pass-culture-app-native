import { useAddressActions } from './addressStore'
import { useCityActions } from './cityStore'
import { useNameActions } from './nameStore'

export const useResetProfileStores = () => {
  const { resetName } = useNameActions()
  const { resetCity } = useCityActions()
  const { resetAddress } = useAddressActions()

  return () => {
    resetName()
    resetCity()
    resetAddress()
  }
}
