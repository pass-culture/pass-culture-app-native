import React from 'react'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookDateChoice } from 'features/bookOffer/components/BookDateChoice'
import { BookDuoChoice } from 'features/bookOffer/components/BookDuoChoice'
import { BookHourChoice } from 'features/bookOffer/components/BookHourChoice'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  stocks: OfferStockResponse[]
  offerIsDuo?: boolean
}

export const BookingEventChoices: React.FC<Props> = ({ stocks, offerIsDuo }) => {
  const { bookingState, dispatch } = useBookingContext()
  const { user } = useAuthContext()
  const creditForOffer = useCreditForOffer(bookingState.offerId)
  const { step, quantity, stockId, date } = bookingState
  const enablePricesByCategories = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES)

  if (!user) return <React.Fragment />

  const validateOptions = () => {
    if (enablePricesByCategories) {
      if (step === Step.DATE) {
        dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
      }
      if (step === Step.HOUR && offerIsDuo) {
        dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
      }
      return
    }
    dispatch({ type: 'VALIDATE_OPTIONS' })
  }

  if (bookingState.step === Step.CONFIRMATION) {
    return <BookingDetails stocks={stocks} />
  }

  const getButtonState = () => {
    if (enablePricesByCategories) {
      switch (step) {
        case Step.DATE: {
          return date !== undefined
        }
      }
    }
    return typeof stockId === 'number' && typeof quantity === 'number'
  }

  // We only need those 2 informations to book an offer (and thus proceed to the next page)
  const enabled = getButtonState()

  const wordingButton = () => {
    if (enablePricesByCategories) {
      switch (step) {
        case Step.DATE: {
          return 'Valider la date'
        }
        case Step.HOUR: {
          return `Valider l'horaire`
        }
        case Step.DUO: {
          return 'Finaliser ma réservation'
        }
      }
    }

    if (enabled) {
      return 'Valider ces options'
    }

    return 'Choisir les options'
  }

  return (
    <Container>
      <Separator />
      <BookDateChoice
        stocks={stocks}
        userRemainingCredit={creditForOffer}
        enablePricesByCategories={enablePricesByCategories}
      />

      <Spacer.Column numberOfSpaces={6} />
      {!!(step && step >= Step.HOUR) && (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <BookHourChoice />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      {!!(step && step >= Step.DUO) && (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <BookDuoChoice />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      <ButtonPrimary wording={wordingButton()} onPress={validateOptions} disabled={!enabled} />
    </Container>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(2) })
const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
}))
