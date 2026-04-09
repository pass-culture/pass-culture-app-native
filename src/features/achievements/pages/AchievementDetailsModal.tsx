import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AchievementEnum } from 'api/gen'
import { useAchievementDetails } from 'features/achievements/hooks/useAchievementDetails'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Typo } from 'ui/theme'

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

  const completedAtLabel = achievement.completedAt
    ? `Fait le ${achievement.completedAt}`
    : 'Débloqué'

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
        <BodyWrapper>
          {achievement.completed ? (
            <Tag label={completedAtLabel} variant={TagVariant.NEW} />
          ) : (
            <Tag label="Non débloqué" />
          )}
        </BodyWrapper>
        {achievement.completed ? (
          <TitleContainer>
            <Typo.Title3>{achievement.title}</Typo.Title3>
          </TitleContainer>
        ) : null}
        <StyledDescrption>{achievement.description}</StyledDescrption>
      </Container>
    </AppInformationModal>
  )
}

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
const Container = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.designSystem.size.spacing.xl,
}))
const IconsWrapper = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
})

const BodyWrapper = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.l,
  paddingHorizontal: theme.designSystem.size.spacing.s,
  paddingVertical: theme.designSystem.size.spacing.xs,
  borderRadius: theme.designSystem.size.borderRadius.s,
}))

const StyledDescrption = styled(Typo.Body)({
  textAlign: 'center',
})
