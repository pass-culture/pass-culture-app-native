import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'
import styled from 'styled-components/native'

import { achievementIconMapper } from 'features/profile/api/Achievements/AchievementIconMapper'
import { useAchievementDetails } from 'features/profile/pages/Achievements/useAchievementDetails'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Trophie } from 'ui/svg/icons/Trophie'
import { getSpacing, TypoDS } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
  id: string
}

export const AchievementSuccessModal = ({ visible, hideModal, id }: Props) => {
  const achievement = useAchievementDetails(id)

  if (!achievement) {
    return null
  }

  const icon = achievementIconMapper[achievement.icon]
  return (
    <AppInformationModal
      title="Félicitations&nbsp;!"
      onCloseIconPress={hideModal}
      visible={visible}>
      <Spacer.Column numberOfSpaces={2} />
      <IconsWrapper>
        {icon ? <StyledIcon source={icon} resizeMode="contain" /> : <StyledTophie />}
      </IconsWrapper>
      <Spacer.Column numberOfSpaces={2} />
      <TypoDS.Title3>{achievement?.name}</TypoDS.Title3>
      <Spacer.Column numberOfSpaces={2} />
      <TypoDS.Body>{achievement?.description}</TypoDS.Body>
      <Spacer.Column numberOfSpaces={10} />

      <InternalTouchableLink
        navigateTo={{ screen: 'Achievements' }}
        onBeforeNavigate={() => {
          hideModal()
        }}>
        <ButtonWrapper>
          <StyledButtonText>Accéder à mes succès</StyledButtonText>
        </ButtonWrapper>
      </InternalTouchableLink>

      <Spacer.Column numberOfSpaces={2} />
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

const StyledIcon = styled(Image)({
  position: 'absolute',
  height: getSpacing(50),
  width: getSpacing(50),
})

const StyledTophie = styled(Trophie).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``

const ButtonWrapper = styled.View(({ theme }) => ({
  paddingVertical: getSpacing(2),
  paddingHorizontal: getSpacing(4),
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.button,
}))

const StyledButtonText = styled(TypoDS.Button)(({ theme }) => ({
  color: theme.colors.white,
}))
