import React, { FC } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AchievementDetailsModal } from 'features/profile/components/Modals/AchievementDetailsModal'
import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { useModal } from 'ui/components/modals/useModal'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

type BadgeProps = {
  id: AchievementId
  Illustration: React.FC<AccessibleIcon>
  name: string
  isCompleted?: boolean
}

export const Badge: FC<BadgeProps> = ({ Illustration, id, name, isCompleted }) => {
  const { visible, showModal, hideModal } = useModal(false)
  const theme = useTheme()

  return (
    <React.Fragment>
      <StyledTouchableOpacity onPress={showModal}>
        <BadgeContainer isCompleted={isCompleted}>
          <IllustrationContainer>
            <Illustration size={theme.illustrations.sizes.small} />
          </IllustrationContainer>
          <Spacer.Column numberOfSpaces={2} />
          <TypoBadgeName numberOfLines={2} isCompleted={!!isCompleted}>
            {name}
          </TypoBadgeName>
        </BadgeContainer>
      </StyledTouchableOpacity>
      <AchievementDetailsModal visible={visible} hideModal={hideModal} id={id} />
    </React.Fragment>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)({
  flex: 0.5,
  height: getSpacing(55),
})

const BadgeContainer = styled.View<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  paddingVertical: getSpacing(6),
  paddingHorizontal: getSpacing(2),
  border: `1px solid ${theme.colors.greyDark}`,
  borderRadius: getSpacing(2),
  alignItems: 'center',
  backgroundColor: isCompleted ? theme.colors.white : theme.colors.greyLight,
  flex: 1,
  justifyContent: 'center',
}))

const TypoBadgeName = styled(TypoDS.Button)<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  color: isCompleted ? theme.colors.black : theme.colors.greySemiDark,
  textAlign: 'center',
}))

const IllustrationContainer = styled.View(({ theme }) => ({
  height: theme.illustrations.sizes.small,
  width: theme.illustrations.sizes.small,
}))
