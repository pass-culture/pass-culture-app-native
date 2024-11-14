import React, { FC } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AchievementDetailsModal } from 'features/profile/components/Modals/AchievementDetailsModal'
import { useAchievementDetails } from 'features/profile/components/Modals/useAchievementDetails'
import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { useModal } from 'ui/components/modals/useModal'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { TypoDS, getSpacing } from 'ui/theme'

type BadgeProps = {
  id: AchievementId
  Illustration: React.FC<AccessibleIcon>
  isCompleted?: boolean
}

export const Badge: FC<BadgeProps> = ({ Illustration, id, isCompleted }) => {
  const achievement = useAchievementDetails(id)
  const { visible, showModal, hideModal } = useModal(false)
  const theme = useTheme()

  return (
    <React.Fragment>
      <TouchableOpacity onPress={showModal}>
        <BadgeContainer isCompleted={isCompleted}>
          <Illustration size={theme.illustrations.sizes.small} />
          <TypoBadgeName numberOfLines={2}>{achievement?.name}</TypoBadgeName>
        </BadgeContainer>
      </TouchableOpacity>
      <AchievementDetailsModal visible={visible} hideModal={hideModal} id={id} />
    </React.Fragment>
  )
}

const BadgeContainer = styled.View<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  paddingVertical: getSpacing(6),
  paddingHorizontal: getSpacing(2),
  border: `1px solid ${theme.colors.greySemiDark}`,
  borderRadius: getSpacing(2),
  alignItems: 'center',
  backgroundColor: isCompleted ? theme.colors.white : theme.colors.greyLight,
  width: getSpacing(35),
  height: getSpacing(50),
  gap: getSpacing(2),
}))

const TypoBadgeName = styled(TypoDS.Button)({
  textAlign: 'center',
})
