import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Info } from 'ui/svg/icons/Info'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type Achivement = {
  id: string
  icon: FC<AccessibleIcon>
}

const achivements: Achivement[] = [
  {
    id: '1',
    icon: Info,
  },
  {
    id: '2',
    icon: Info,
  },
  {
    id: '3',
    icon: Info,
  },
  {
    id: '4',
    icon: Info,
  },
  {
    id: '5',
    icon: Info,
  },
]

type UserAchivement = {
  id: string
}

const userAchivements: UserAchivement[] = [{ id: '1' }, { id: '3' }]

const badges = achivements.map(({ id, icon }) => {
  const isCompleted = userAchivements.some((userAchivement) => userAchivement.id === id)
  return {
    id,
    icon,
    isCompleted,
  }
})

export const Achivements = () => {
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
  icon: FC<AccessibleIcon>
  isCompleted?: boolean
}

const Badge: FC<BadgeProps> = ({ isCompleted = false, icon: Icon }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: 50,
    color: isCompleted ? 'red' : theme.colors.black,
  }))({ width: '100%' })
  return (
    <BadgeContainer isCompleted={isCompleted}>
      <StyledIcon />
    </BadgeContainer>
  )
}

const BadgeContainer = styled.View<{ isCompleted: boolean }>(({ isCompleted }) => ({
  padding: getSpacing(4),
  border: '1px solid',
  borderRadius: 8,
  backgroundColor: isCompleted ? 'none' : 'grey',
  alignItems: 'center',
}))
