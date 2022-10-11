import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGetDepositAmountsByAge } from 'features/offer/helpers/useGetDepositAmountsByAge/useGetDepositAmountsByAge'
import { useUserProfileInfo } from 'features/profile/api'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Typo, Spacer } from 'ui/theme'
import { LINE_BREAK, SPACE } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
}

export const FinishSubscriptionModal: FunctionComponent<Props> = ({ visible, hideModal }) => {
  const { data: user } = useUserProfileInfo()
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToProfile = () => {
    hideModal()
    navigate(...getTabNavConfig('Profile'))
  }
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
