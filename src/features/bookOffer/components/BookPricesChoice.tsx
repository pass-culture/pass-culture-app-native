import React from 'react'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { OfferStockResponse } from 'api/gen'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getPriceWording,
  getStockSortedByPriceFromHour,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Li } from 'ui/components/Li'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  stocks: OfferStockResponse[]
  isDuo?: boolean
}

export const BookPricesChoice = ({ stocks, isDuo }: Props) => {
  const { bookingState, dispatch } = useBookingContext()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const titleID = uuidv4()
  const selectedHour = bookingState.hour ?? ''

  const selectStock = (stockId: number) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId })
    if (!isDuo) {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }

  const filteredStocks = getStockSortedByPriceFromHour(stocks, selectedHour)
  const radioGroupLabel = 'Prix'

  return (
    <React.Fragment>
      <Typo.Title3 {...getHeadingAttrs(3)} testID="PricesStep">
        {radioGroupLabel}
      </Typo.Title3>

      <Spacer.Column numberOfSpaces={4} />
      <View accessibilityRole={AccessibilityRole.RADIOGROUP} accessibilityLabelledBy={titleID}>
        <VerticalUl>
          {filteredStocks.map((stock) => (
            <Li key={stock.id}>
              <RadioSelector
                radioGroupLabel={radioGroupLabel}
                label={stock.priceCategoryLabel ?? ''}
                onPress={() => selectStock(stock.id)}
                checked={stock.id === bookingState.stockId}
                disabled={stock.isSoldOut || stock.price > offerCredit}
                description={getPriceWording(stock, offerCredit)}
                rightText={formatCurrencyFromCents(stock.price, currency, euroToPacificFrancRate)}
              />
              <Spacer.Column numberOfSpaces={2} />
            </Li>
          ))}
        </VerticalUl>
      </View>
    </React.Fragment>
  )
}
