import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { DepositType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { getAge } from 'shared/user/getAge'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Typo, Spacer, TypoDS } from 'ui/theme'
import { LINE_BREAK, SPACE } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
  from: StepperOrigin
  children?: never
}

export const FinishSubscriptionModal: FunctionComponent<Props> = ({ visible, hideModal, from }) => {
  const { user } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const zero = formatCurrencyFromCents(0, currency, euroToPacificFrancRate)

  const navigateToStepper = useCallback(() => {
    hideModal()
    navigate('Stepper', { from })
  }, [hideModal, navigate, from])

  const title = 'Débloque ton crédit' + LINE_BREAK + 'pour réserver cette offre'

  const depositAmountByAge = useGetDepositAmountsByAge(user?.birthDate)
  const depositLabel = depositAmountByAge ? (
    <Deposit depositAmountByAge={depositAmountByAge} />
  ) : (
    ' ton crédit '
  )

  const buttonLabel = user?.requiresIdCheck ? 'Vérifier mon identité' : 'Confirmer mes informations'

  const userAge = getAge(user?.birthDate)
  const isUserTransitioningTo18 = userAge === 18 && user?.depositType === DepositType.GRANT_15_17

  return (
    <AppModalWithIllustration
      visible={visible}
      title={title}
      Illustration={BicolorIdCardWithMagnifyingGlass}
      hideModal={hideModal}>
      {user?.requiresIdCheck ? (
        <StyledBody>
          Vérifie ton identité pour débloquer{depositLabel}et réserver cette offre.
        </StyledBody>
      ) : (
        <StyledBody>
          Confirme tes informations personnelles pour débloquer{depositLabel}et réserver cette
          offre.
        </StyledBody>
      )}
      <Spacer.Column numberOfSpaces={6} />
      {isUserTransitioningTo18 ? (
        <React.Fragment>
          <CaptionNeutralInfo>Ton crédit précédent a été remis à {zero}.</CaptionNeutralInfo>
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}
      <ButtonPrimary
        wording={buttonLabel}
        accessibilityLabel="Aller vers la section profil"
        onPress={navigateToStepper}
      />
    </AppModalWithIllustration>
  )
}

const Deposit = ({ depositAmountByAge }: { depositAmountByAge: string }) => (
  <StyledBody>
    {SPACE}
    tes <Typo.ButtonText>{depositAmountByAge}</Typo.ButtonText>
    {SPACE}
  </StyledBody>
)

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})

const CaptionNeutralInfo = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
