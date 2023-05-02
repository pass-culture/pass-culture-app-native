import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Typo, Spacer } from 'ui/theme'
import { LINE_BREAK, SPACE } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
  offerId: number
  children?: never
}

export const FinishSubscriptionModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  offerId,
}) => {
  const { user } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = useCallback(() => {
    analytics.logGoToProfil({ from: 'FinishSubscriptionModal', offerId })
    hideModal()
    navigate('Stepper')
  }, [offerId, hideModal, navigate])

  const title = 'Débloque ton crédit' + LINE_BREAK + 'pour réserver cette offre'

  const depositAmountByAge = useGetDepositAmountsByAge(user?.birthDate)
  const depositLabel = depositAmountByAge ? (
    <Deposit depositAmountByAge={depositAmountByAge} />
  ) : (
    ' ton crédit '
  )

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
      <Typo.Caption>Ton crédit précédent a été remis à 0&nbsp;€.</Typo.Caption>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Terminer mon inscription"
        accessibilityLabel="Aller vers la section profil"
        onPress={navigateToProfile}
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

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
