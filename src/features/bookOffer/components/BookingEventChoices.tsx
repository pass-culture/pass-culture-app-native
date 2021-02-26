import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ExpenseDomain, OfferStockResponse } from 'api/gen'
import { BookDateChoice } from 'features/bookOffer/components/BookDateChoice'
import { BookDuoChoice } from 'features/bookOffer/components/BookDuoChoice'
import { BookHourChoice } from 'features/bookOffer/components/BookHourChoice'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { useUserProfileInfo } from 'features/home/api'
import { computeRemainingCredit, computeWalletBalance, sortExpenses } from 'features/profile/utils'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

interface Props {
  dismissModal: () => void
  stocks: OfferStockResponse[]
}

export const BookingEventChoices: React.FC<Props> = ({ dismissModal, stocks }) => {
  const { bookingState, dispatch } = useBooking()
  const { data: user } = useUserProfileInfo()

  if (!user) return <React.Fragment />
  const depositVersion = user.depositVersion && user.depositVersion === 1 ? 1 : 2
  const expenses = user.expenses
  const walletBalance = computeWalletBalance(user.expenses)

  const expense = sortExpenses(depositVersion, expenses).find(
    (expense) => expense.domain === ExpenseDomain.All
  )

  const remainingCredit = expense
    ? computeRemainingCredit(walletBalance, expense.limit, expense.current)
    : null

  const validateOptions = () => {
    dispatch({ type: 'VALIDATE_OPTIONS' })
  }

  if (bookingState.step === Step.CONFIRMATION) {
    return <BookingDetails dismissModal={dismissModal} />
  }

  return (
    <Container>
      <Separator />
      <BookDateChoice stocks={stocks} userRemainingCredit={remainingCredit} />

      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />

      <BookHourChoice />

      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />

      <BookDuoChoice />

      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary title={_(t`Valider ces options`)} onPress={validateOptions} />
      <Spacer.Column numberOfSpaces={4} />
    </Container>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(2) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
})
