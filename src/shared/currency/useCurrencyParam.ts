import { Platform } from 'react-native'

import { CurrencyEnum } from 'api/gen'

const isWeb = Platform.OS === 'web'

export function getCurrencyFromParam(): CurrencyEnum | undefined {
  if (isWeb) {
    const searchParams = new URLSearchParams(window.location.search)
    const currency = searchParams.get('currency')
    if (currency === CurrencyEnum.XPF) return CurrencyEnum.XPF
  }
  return undefined
}
