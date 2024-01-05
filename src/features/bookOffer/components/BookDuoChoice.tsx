import React from 'react'

import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const BookDuoChoice = () => {
  const { bookingState, dispatch } = useBookingContext()

  const updateBookingStepToDuo = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
  }

  const buttonTitle = bookingState.quantity && bookingState.quantity === 1 ? 'Solo' : 'Duo'

  return (
    <React.Fragment>
      <Typo.Title3 {...getHeadingAttrs(3)} testID="DuoStep">
        Nombre de places
      </Typo.Title3>

      <Spacer.Column numberOfSpaces={2} />
      {bookingState.step === Step.DUO ? (
        <DuoChoiceSelector />
      ) : (
        <TouchableOpacity onPress={updateBookingStepToDuo}>
          <Typo.ButtonText>{buttonTitle}</Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}
