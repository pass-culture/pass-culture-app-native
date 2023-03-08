import React from 'react'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { OfferStockResponse } from 'api/gen'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getPriceWording,
  getRadioSelectorPriceState,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { formatToKeyDate } from 'features/bookOffer/helpers/utils'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { formatToFrenchDecimal } from 'libs/parsers'
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
  const titleID = uuidv4()
  const selectedDate = bookingState.date ? formatToKeyDate(bookingState.date) : undefined

  const selectStock = (stockId: number) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId })
    if (!isDuo) {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }

  const filteredStocks = stocks
    .filter(
      (stock) =>
        !stock.isExpired &&
        stock.beginningDatetime &&
        formatToKeyDate(stock.beginningDatetime) === selectedDate
    )
    .sort((a, b) => b.price - a.price)

  return (
    <React.Fragment>
      <Typo.Title3 {...getHeadingAttrs(3)} testID="PricesStep">
        Prix
      </Typo.Title3>

      <Spacer.Column numberOfSpaces={4} />
      <View accessibilityRole={AccessibilityRole.RADIOGROUP} accessibilityLabelledBy={titleID}>
        <VerticalUl>
          {filteredStocks.map((stock) => {
            return (
              <Li key={stock.id}>
                <RadioSelector
                  label={stock.priceCategoryLabel || ''}
                  onPress={() => selectStock(stock.id)}
                  type={getRadioSelectorPriceState(stock, offerCredit, bookingState.stockId)}
                  description={getPriceWording(stock, offerCredit)}
                  price={formatToFrenchDecimal(stock.price).replace(' ', '')}
                />
                <Spacer.Column numberOfSpaces={2} />
              </Li>
            )
          })}
        </VerticalUl>
      </View>
    </React.Fragment>
  )
}
