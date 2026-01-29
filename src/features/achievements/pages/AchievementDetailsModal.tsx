import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AchievementEnum } from 'api/gen'
import { useAchievementDetails } from 'features/achievements/hooks/useAchievementDetails'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Spacer, Typo, getSpacing } from 'ui/theme'

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
        <Spacer.Column numberOfSpaces={6} />
        <BodyWrapper>
          {achievement.completed ? (
            <Tag label={completedAtLabel} variant={TagVariant.NEW} />
          ) : (
            <Tag label="Non débloqué" />
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

const BodyWrapper = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.s,
  paddingVertical: theme.designSystem.size.spacing.xs,
  borderRadius: theme.designSystem.size.borderRadius.s,
}))

const StyledDescrption = styled(Typo.Body)({
  textAlign: 'center',
})
