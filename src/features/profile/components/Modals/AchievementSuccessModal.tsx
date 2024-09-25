import React, { FunctionComponent } from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'

import { achievementIconMapper } from 'features/profile/api/Achievements/AchievementIconMapper'
import { useAchievementDetails } from 'features/profile/pages/Achievements/useAchievementDetails'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, TypoDS } from 'ui/theme'

import ColoredBackground from '../../pages/Achievements/assets/Fond_de_couleur.png'

interface Props {
  visible: boolean
  hideModal: () => void
  id: string
}

export const AchievementSuccessModal: FunctionComponent<Props> = ({ visible, hideModal, id }) => {
  const achievement = useAchievementDetails(id)

  if (!achievement) {
    return
  }

  return (
    <AppInformationModal
      title="Félicitations&nbsp;!"
      onCloseIconPress={hideModal}
      visible={visible}>
      <Spacer.Column numberOfSpaces={4} />
      <IconsWrapper>
        <StyledImage source={ColoredBackground} resizeMode="contain" />
        <StyledIcon source={achievementIconMapper[achievement.icon]!} resizeMode="contain" />
      </IconsWrapper>
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Body>{achievement?.name}</TypoDS.Body>
      <Spacer.Column numberOfSpaces={20} />

      <InternalTouchableLink
        navigateTo={{ screen: 'Achievements' }}
        onBeforeNavigate={() => {
          hideModal()
        }}>
        <ButtonPrimary wording="Accéder à mes succès" />
      </InternalTouchableLink>

      <Spacer.Column numberOfSpaces={4} />
      <ButtonQuaternaryBlack
        wording="Fermer"
        accessibilityLabel="Fermer la modale"
        icon={Invalidate}
        onPress={hideModal}
      />
    </AppInformationModal>
  )
}

const IconsWrapper = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
})

const StyledImage = styled(Image)({
  height: getSpacing(60),
  width: getSpacing(60),
})

const StyledIcon = styled(Image)({
  position: 'absolute',
  height: getSpacing(50),
  width: getSpacing(50),
})
