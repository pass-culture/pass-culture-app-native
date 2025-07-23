import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AchievementEnum } from 'api/gen'
import { useAchievementDetails } from 'features/achievements/hooks/useAchievementDetails'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { getSpacing, Typo, Spacer } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
  name: AchievementEnum
}

export const AchievementDetailsModal = ({ visible, hideModal, name }: Props) => {
  const achievement = useAchievementDetails(name)
  const { illustrations } = useTheme()

  useEffect(() => {
    if (!visible) return
    achievement?.track()
  }, [achievement, visible])

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
          <Illustration size={illustrations.sizes.fullPage} />
        </IconsWrapper>
        <Spacer.Column numberOfSpaces={6} />
        <BodyWrapper isCompleted={achievement.completed}>
          {achievement.completed ? (
            <StyledBody>Fait le {achievement.completedAt}</StyledBody>
          ) : (
            <StyledBody>Non débloqué</StyledBody>
          )}
        </BodyWrapper>
        <Spacer.Column numberOfSpaces={4} />
        {achievement.completed ? (
          <React.Fragment>
            <Typo.Title3>{achievement.title}</Typo.Title3>
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
  backgroundColor: isCompleted
    ? theme.designSystem.color.background.brandPrimary
    : theme.designSystem.color.background.disabled,
  paddingHorizontal: getSpacing(2),
  paddingVertical: getSpacing(1),
  borderRadius: getSpacing(1),
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.inverted,
}))

const StyledDescrption = styled(Typo.Body)({
  textAlign: 'center',
})
