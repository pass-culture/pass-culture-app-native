import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { RoundUnit, convertEuroToPacificFranc } from 'shared/currency/convertEuroToPacificFranc'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

import { FormatPriceOptions } from '../../libs/parsers/getDisplayedPrice'

const getFractionDigits = (princeInEuro: number, options?: FormatPriceOptions): number => {
  if (options?.fractionDigits) return options.fractionDigits
  return princeInEuro === Math.floor(princeInEuro) ? 0 : 2
}

export const formatCurrencyFromCents = (
  priceInCents: number,
  currency: Currency,
  euroToPacificFrancRate: number,
  options?: FormatPriceOptions
) => {
  const priceInEuro = convertCentsToEuros(priceInCents)

  if (currency === Currency.PACIFIC_FRANC_SHORT) {
    const priceInPacificFrancs = convertEuroToPacificFranc(
      priceInEuro,
      euroToPacificFrancRate,
      RoundUnit.UNITS
    )
    const XPFformatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XPF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return XPFformatter.format(priceInPacificFrancs).replace('FCFP', 'F')
  }

  const EURformatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: getFractionDigits(priceInEuro, options),
  })
  return EURformatter.format(priceInEuro)
}
