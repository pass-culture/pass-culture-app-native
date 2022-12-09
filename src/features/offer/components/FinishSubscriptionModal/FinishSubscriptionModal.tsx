import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGetDepositAmountsByAge } from 'features/user/helpers/useGetDepositAmountsByAge/useGetDepositAmountsByAge'
import { analytics } from 'libs/firebase/analytics'
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
    navigate(...getTabNavConfig('Profile'))
  }, [offerId, hideModal, navigate])

  const title = 'Débloque ton crédit' + LINE_BREAK + 'pour réserver cette offre'

  const depositAmoutByAge = useGetDepositAmountsByAge(user?.birthDate)
  const deposit = depositAmoutByAge ? <Deposit depositAmoutByAge={depositAmoutByAge} /> : SPACE

  return (
    <AppModalWithIllustration
      visible={visible}
      title={title}
      Illustration={BicolorIdCardWithMagnifyingGlass}
      hideModal={hideModal}>
      <StyledBody>
        Finalise ton inscription pour obtenir ton crédit{deposit}et réserver cette offre.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Terminer mon inscription"
        accessibilityLabel="Aller vers la section profil"
        onPress={navigateToProfile}
      />
    </AppModalWithIllustration>
  )
}

const Deposit = ({ depositAmoutByAge }: { depositAmoutByAge: string }) => (
  <StyledBody>
    {SPACE}
    de <Typo.ButtonText>{depositAmoutByAge}</Typo.ButtonText>
    {SPACE}
  </StyledBody>
)

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
