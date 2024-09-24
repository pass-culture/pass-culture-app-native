import React, { FC } from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

import { achivements } from './achivements.store'
import { userAchivements } from './user-achivements.store'

const badges = achivements.map(({ id, icon }) => {
  const isCompleted = userAchivements.some((u) => u.id === id)
  return {
    id,
    icon,
    isCompleted,
  }
})

export const Achivements = () => {
  const {} = useBadges()
  return (
    <SecondaryPageWithBlurHeader title="Achivements">
      <BadgesContainer>
        {badges.map((badge) => (
          <Badge key={badge.id} {...badge} />
        ))}
      </BadgesContainer>
    </SecondaryPageWithBlurHeader>
  )
}

const BadgesContainer = styled.View({
  flexDirection: 'row',
  gap: getSpacing(4),
  flexWrap: 'wrap',
})

type BadgeProps = {
  id: string
  icon: FC<AccessibleIcon>
  isCompleted?: boolean
}

const Badge: FC<BadgeProps> = ({ isCompleted = false, icon: Icon, id }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: 50,
    color: isCompleted ? 'red' : theme.colors.black,
  }))({ width: '100%' })

  return (
    <InternalTouchableLink
      navigateTo={{
        screen: 'BadgeDetails',
        params: { badgeId: id },
      }}>
      <BadgeContainer isCompleted={isCompleted}>
        <StyledIcon />
      </BadgeContainer>
    </InternalTouchableLink>
  )
}

const BadgeContainer = styled.View<{ isCompleted: boolean }>(({ isCompleted }) => ({
  padding: getSpacing(4),
  border: '1px solid',
  borderRadius: 8,
  backgroundColor: isCompleted ? 'none' : 'grey',
  alignItems: 'center',
}))
