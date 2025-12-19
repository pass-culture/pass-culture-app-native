import React from 'react'

import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const BookDuoChoice = () => {
  const { bookingState, dispatch } = useBookingContext()

  const updateBookingStepToDuo = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
  }

  const buttonTitle = bookingState.quantity && bookingState.quantity === 1 ? 'Solo' : 'Duo'

  return (
    <ViewGap gap={2}>
      <Typo.Title3 {...getHeadingAttrs(3)} testID="DuoStep">
        Nombre de places
      </Typo.Title3>

      {bookingState.step === Step.DUO ? (
        <DuoChoiceSelector />
      ) : (
        <TouchableOpacity
          onPress={updateBookingStepToDuo}
          accessibilityRole={AccessibilityRole.BUTTON}
          accessibilityLabel={buttonTitle}>
          <Typo.Button>{buttonTitle}</Typo.Button>
        </TouchableOpacity>
      )}
    </ViewGap>
  )
}
