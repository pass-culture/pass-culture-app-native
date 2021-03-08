import { t } from '@lingui/macro'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import { OfferStockResponse } from 'api/gen'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { _ } from 'libs/i18n'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { Step } from '../pages/reducer'

import { Calendar } from './Calendar/Calendar'

interface Props {
  stocks: OfferStockResponse[]
  userRemainingCredit: number | null
}

export const BookDateChoice: React.FC<Props> = ({ stocks, userRemainingCredit }) => {
  const { bookingState, dispatch } = useBooking()

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Title4 testID="DateStep">{_(t`Date`)}</Typo.Title4>
      {bookingState.step === Step.DATE ? (
        <Calendar stocks={stocks} userRemainingCredit={userRemainingCredit} />
      ) : (
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          onPress={() => dispatch({ type: 'CHANGE_STEP', payload: Step.DATE })}>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.ButtonText>
            {bookingState.date ? formatToCompleteFrenchDate(bookingState.date) : ''}
          </Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}
