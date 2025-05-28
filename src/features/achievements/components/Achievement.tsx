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
  const theme = useTheme()

  return (
    <React.Fragment>
      <StyledTouchableOpacity onPress={showModal}>
        <AchievementContainer isCompleted={isCompleted}>
          <IllustrationContainer>
            <Illustration size={theme.illustrations.sizes.small} />
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
  paddingHorizontal: getSpacing(2),
  border: `1px solid ${theme.colors.greyDark}`,
  borderRadius: getSpacing(2),
  alignItems: 'center',
  backgroundColor: isCompleted ? theme.colors.white : theme.colors.greyLight,
  flex: 1,
  justifyContent: 'center',
}))

const TypoAchievementName = styled(Typo.Button)<{ isCompleted: boolean }>(
  ({ theme, isCompleted }) => ({
    color: isCompleted ? theme.colors.black : theme.colors.greySemiDark,
    textAlign: 'center',
  })
)

const IllustrationContainer = styled.View(({ theme }) => ({
  height: theme.illustrations.sizes.small,
  width: theme.illustrations.sizes.small,
  marginBottom: getSpacing(2),
}))
