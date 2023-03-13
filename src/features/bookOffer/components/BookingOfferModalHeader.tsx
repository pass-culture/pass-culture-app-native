import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { getBookingSteps } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useModalContent } from 'features/bookOffer/helpers/useModalContent'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  modalLeftIconProps: ModalLeftIconProps
  onClose: VoidFunction
  stocks: OfferStockResponse[]
  isDuo?: boolean
  isEndedUsedBooking?: boolean
}

export const BookingOfferModalHeader = ({
  modalLeftIconProps,
  onClose,
  stocks,
  isDuo,
  isEndedUsedBooking,
}: Props) => {
  const { title } = useModalContent(isEndedUsedBooking)
  const { colors } = useTheme()
  const { bookingState } = useBookingContext()
  const { step } = bookingState

  const totalSteps = getBookingSteps(stocks, isDuo).length
  let progressBarValue = 1
  if (step) {
    progressBarValue = (1 / totalSteps) * step
  }
  const currentStep = step === Step.DUO && stocks.length <= 1 ? step - 1 : step

  return (
    <HeaderContainer>
      <ModalHeader
        title={title}
        {...modalLeftIconProps}
        rightIconAccessibilityLabel="Fermer la modale"
        rightIcon={Close}
        onRightIconPress={onClose}
      />
      {step < Step.CONFIRMATION ? (
        <React.Fragment>
          <ProgressContainer>
            <Spacer.Column numberOfSpaces={4} />
            <Typo.Caption>
              Étape {currentStep} sur {totalSteps}
            </Typo.Caption>
          </ProgressContainer>
          <Spacer.Column numberOfSpaces={2} />
          <ProgressBar progress={progressBarValue} colors={[colors.primary]} height={0} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
    </HeaderContainer>
  )
}

const HeaderContainer = styled.View({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(2),
  paddingHorizontal: getSpacing(6),
  width: '100%',
})

const ProgressContainer = styled.View({ width: '100%', alignItems: 'center' })
