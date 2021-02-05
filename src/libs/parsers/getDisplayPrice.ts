import { t } from '@lingui/macro'

import { _ } from 'libs/i18n'
import { CENTS_IN_EURO } from 'libs/parsers/pricesConversion'

const EURO_SYMBOL = '€'

const formatToFrenchDecimal = (cents: number) => {
  const euros = cents / CENTS_IN_EURO
  // we show 2 decimals if price is not round. Ex: 21,50 €
  const fixed = euros === Math.floor(euros) ? euros : euros.toFixed(2)
  return `${fixed.toString().replace('.', ',')} ${EURO_SYMBOL}`
}

const getPricePerPlace = (prices: number[]): string => {
  const uniquePrices = Array.from(new Set(prices.filter((p) => p > 0)))
  if (uniquePrices.length === 1) return `${formatToFrenchDecimal(uniquePrices[0])}`
  return `Dès ${formatToFrenchDecimal(uniquePrices.sort()[0])}`
}

export const getDisplayPrice = (prices: number[] | undefined): string => {
  if (!prices || prices.length === 0) return ''
  if (prices.includes(0)) return _(t`Gratuit`)
  return getPricePerPlace(prices)
}

export const getDisplayPriceWithDuoMention = (prices: number[] | undefined): string => {
  if (!prices || prices.length === 0) return ''
  if (prices.includes(0)) return _(t`Gratuit`)
  return `${getPricePerPlace(prices)} ${_(t`/ place`)}`
}
