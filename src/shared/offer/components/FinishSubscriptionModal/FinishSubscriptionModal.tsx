import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { IdCardWithMagnifyingGlass as InitialIdCardWithMagnifyingGlass } from 'ui/svg/icons/IdCardWithMagnifyingGlass'
import { Typo, getSpacing } from 'ui/theme'
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

  const navigateToStepper = useCallback(() => {
    hideModal()
    navigate(...getSubscriptionHookConfig('Stepper', { from }))
  }, [hideModal, navigate, from])

  const depositAmountByAge = useGetDepositAmountsByAge(user?.birthDate)
  const depositLabel = depositAmountByAge ? (
    <Deposit depositAmountByAge={depositAmountByAge} />
  ) : (
    ' ton crédit '
  )

  const buttonLabel = user?.requiresIdCheck ? 'Vérifier mon identité' : 'Confirmer mes informations'

  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Débloque ton crédit' + LINE_BREAK + 'pour réserver cette offre'}
      Illustration={IdCardWithMagnifyingGlass}
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
    tes <Typo.BodyAccent>{depositAmountByAge}</Typo.BodyAccent>
    {SPACE}
  </StyledBody>
)

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(6),
})

const IdCardWithMagnifyingGlass = styled(InitialIdCardWithMagnifyingGlass).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.designSystem.color.icon.brandPrimary,
}))``
