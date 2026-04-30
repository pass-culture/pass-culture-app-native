import { OfferStockResponse } from 'api/gen'
import { getHourWording } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { getFormattedHour } from 'features/bookOffer/helpers/getFormattedHour'
import { formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

export const getHourChoiceForSingleStock = (
  stocks: OfferStockResponse[],
  selectedDate: string | undefined,
  offerCredit: number,
  currency: Currency,
  euroToPacificFrancRate: number
): Array<RadioButtonGroupOption> =>
  stocks
    .filter(({ beginningDatetime }) => {
      if (beginningDatetime === undefined || beginningDatetime === null) return false
      return selectedDate && beginningDatetime
        ? formatToKeyDate(beginningDatetime) === selectedDate
        : false
    })
    .sort(
      (a, b) =>
        new Date(a.beginningDatetime ?? '').getTime() -
        new Date(b.beginningDatetime ?? '').getTime()
    )
    .map((stock) => {
      const enoughCredit = stock.price <= offerCredit
      const priceWording = getHourWording(
        stock.price,
        stock.isBookable,
        enoughCredit,
        currency,
        euroToPacificFrancRate
      )
      const joinedFeatures = stock.features.join(' ')

      return {
        key: stock.id.toString(),
        label: getFormattedHour(stock.beginningDatetime),
        description: [joinedFeatures, priceWording].filter(Boolean).join(' - '),
        disabled: !stock.isBookable || !enoughCredit,
      }
    })
