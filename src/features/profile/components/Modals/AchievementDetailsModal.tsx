import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAchievementDetails } from 'features/profile/components/Modals/useAchievementDetails'
import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { getSpacing, TypoDS, Spacer } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
  id: AchievementId
}

export const AchievementDetailsModal = ({ visible, hideModal, id }: Props) => {
  const achievement = useAchievementDetails(id)
  const theme = useTheme()

  if (!achievement) return null

  const Illustration = achievement.illustration

  return (
    <AppInformationModal
      title=""
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="achievement-details">
      <Container>
        <IconsWrapper>
          <Illustration size={theme.illustrations.sizes.fullPage} />
        </IconsWrapper>
        <Spacer.Column numberOfSpaces={6} />
        <BodyWrapper isCompleted={achievement.completed}>
          {achievement.completed ? (
            <StyledBody>Fait le {achievement.completedAt}</StyledBody>
          ) : (
            <TypoDS.Body>Non débloqué</TypoDS.Body>
          )}
        </BodyWrapper>
        <Spacer.Column numberOfSpaces={4} />
        {achievement.completed ? (
          <React.Fragment>
            <TypoDS.Title3>{achievement.name}</TypoDS.Title3>
            <Spacer.Column numberOfSpaces={4} />
          </React.Fragment>
        ) : null}
        <StyledDescrption>{achievement.description}</StyledDescrption>
      </Container>
    </AppInformationModal>
  )
}

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  padding: getSpacing(6),
})
const IconsWrapper = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
})

const BodyWrapper = styled.View<{ isCompleted: boolean }>(({ isCompleted, theme }) => ({
  backgroundColor: isCompleted ? theme.colors.primaryDark : theme.colors.greyLight,
  paddingHorizontal: getSpacing(2),
  paddingVertical: getSpacing(1),
  borderRadius: getSpacing(1),
}))

const StyledBody = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledDescrption = styled(TypoDS.Body)({
  textAlign: 'center',
})
