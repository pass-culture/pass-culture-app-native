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
import { theme } from 'theme'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  const totalSteps = offerIsDuo ? 3 : 2

  let progressBarValue = 1
  if (step) {
    progressBarValue = (1 / totalSteps) * step
  }

  if (!user) return <React.Fragment />

  const validateOptions = () => {
    if (enablePricesByCategories) {
      if (step === Step.DATE) {
        dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
      }
      if (step === Step.HOUR && offerIsDuo) {
        dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
      }
      if ((step === Step.HOUR && !offerIsDuo) || step === Step.DUO) {
        dispatch({ type: 'VALIDATE_OPTIONS' })
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
        case Step.HOUR: {
          return stockId !== undefined
        }
        case Step.DUO: {
          return quantity !== undefined
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
          return 'Valider lʼhoraire'
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

  const shouldDisplayDateSelection =
    (step === Step.DATE && enablePricesByCategories) || !enablePricesByCategories
  const shouldDisplayHourSelection =
    (step === Step.HOUR && enablePricesByCategories) || !enablePricesByCategories
  return (
    <Container>
      {!!enablePricesByCategories && (
        <React.Fragment>
          <ProgressContainer>
            <Spacer.Column numberOfSpaces={4} />
            <Typo.Hint>
              Étape {step} sur {totalSteps}
            </Typo.Hint>
          </ProgressContainer>
          <ProgressBar progress={progressBarValue} colors={[theme.colors.primary]} />
        </React.Fragment>
      )}
      {!enablePricesByCategories && <Separator />}
      {!!shouldDisplayDateSelection && (
        <BookDateChoice
          stocks={stocks}
          userRemainingCredit={creditForOffer}
          enablePricesByCategories={enablePricesByCategories}
        />
      )}

      {!enablePricesByCategories && <Spacer.Column numberOfSpaces={6} />}

      {!!(step && step >= Step.HOUR) && (
        <React.Fragment>
          {!enablePricesByCategories && <Separator />}

          {!!shouldDisplayHourSelection && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={enablePricesByCategories ? 2 : 6} />
              <BookHourChoice enablePricesByCategories={enablePricesByCategories} />

              <Spacer.Column numberOfSpaces={6} />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {!!(step && step >= Step.DUO) && (
        <React.Fragment>
          {!enablePricesByCategories && <Separator />}
          <Spacer.Column numberOfSpaces={enablePricesByCategories ? 2 : 6} />

          <BookDuoChoice enablePricesByCategories={enablePricesByCategories} />

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
const ProgressContainer = styled.View({ width: '100%', alignItems: 'center' })
