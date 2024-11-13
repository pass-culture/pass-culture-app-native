import React, { FC } from 'react'
import styled from 'styled-components/native'

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

  return (
    <React.Fragment>
      <TouchableOpacity onPress={showModal}>
        <BadgeContainer isCompleted={isCompleted}>
          <Illustration size={getSpacing(21.25)} />
          <TypoBadgeName numberOfLines={2}>{achievement?.name}</TypoBadgeName>
        </BadgeContainer>
      </TouchableOpacity>
      <AchievementDetailsModal visible={visible} hideModal={hideModal} id={id} />
    </React.Fragment>
  )
}

const BadgeContainer = styled.View<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(6),
  paddingLeft: getSpacing(2),
  paddingRight: getSpacing(2),
  border: `1px solid ${theme.colors.greySemiDark}`,
  borderRadius: getSpacing(2),
  alignItems: 'center',
  backgroundColor: isCompleted ? theme.colors.white : theme.colors.greyLight,
  width: getSpacing(35),
  height: getSpacing(45),
  gap: getSpacing(2),
}))

const TypoBadgeName = styled(TypoDS.Button)({
  textAlign: 'center',
  lineHeight: `${getSpacing(5)}px`,
})
