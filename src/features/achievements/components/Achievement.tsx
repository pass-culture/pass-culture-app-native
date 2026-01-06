import React, { FC } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AchievementEnum } from 'api/gen'
import { AchievementDetailsModal } from 'features/achievements/pages/AchievementDetailsModal'
import { useModal } from 'ui/components/modals/useModal'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, getSpacing } from 'ui/theme'

type AchievementProps = {
  name: AchievementEnum
  Illustration: React.FC<AccessibleIcon>
  title: string
  isCompleted?: boolean
}

export const Achievement: FC<AchievementProps> = ({ Illustration, name, title, isCompleted }) => {
  const { visible, showModal, hideModal } = useModal(false)
  const { illustrations } = useTheme()

  return (
    <React.Fragment>
      <StyledTouchableOpacity onPress={showModal}>
        <AchievementContainer isCompleted={!!isCompleted}>
          <IllustrationContainer>
            <Illustration size={illustrations.sizes.small} />
          </IllustrationContainer>
          <TypoAchievementName numberOfLines={2} isCompleted={!!isCompleted}>
            {title}
          </TypoAchievementName>
        </AchievementContainer>
      </StyledTouchableOpacity>
      <AchievementDetailsModal visible={visible} hideModal={hideModal} name={name} />
    </React.Fragment>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)({
  flex: 0.5,
  height: getSpacing(55),
})

const AchievementContainer = styled.View<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  paddingVertical: getSpacing(6),
  paddingHorizontal: theme.designSystem.size.spacing.s,
  border: `1px solid ${theme.designSystem.color.border.default}`,
  borderRadius: theme.designSystem.size.borderRadius.m,
  alignItems: 'center',
  backgroundColor: isCompleted
    ? theme.designSystem.color.background.default
    : theme.designSystem.color.background.disabled,
  flex: 1,
  justifyContent: 'center',
}))

const TypoAchievementName = styled(Typo.Button)<{ isCompleted: boolean }>(
  ({ theme, isCompleted }) => ({
    color: isCompleted
      ? theme.designSystem.color.text.default
      : theme.designSystem.color.text.disabled,
    textAlign: 'center',
  })
)

const IllustrationContainer = styled.View(({ theme }) => ({
  height: theme.illustrations.sizes.small,
  width: theme.illustrations.sizes.small,
  marginBottom: theme.designSystem.size.spacing.s,
}))
