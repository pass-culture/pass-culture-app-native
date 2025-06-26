import { useCallback, useMemo } from 'react'
import styled from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { useIconFactory } from 'ui/components/icons/useIconFactory'
import { AccessibleIcon } from 'ui/svg/icons/types'

export const useReactionIcon = (reaction?: ReactionTypeEnum | null) => {
  const iconFactory = useIconFactory()

  const ReactionLikeIcon = useMemo(
    () =>
      styled(iconFactory.getIcon('like-filled')).attrs(({ theme }) => ({
        color: theme.designSystem.color.icon.brandPrimary,
      }))``,
    [iconFactory]
  )

  const getCustomReactionIcon = useCallback(
    (reaction?: ReactionTypeEnum | null): React.FC<AccessibleIcon> => {
      switch (reaction) {
        case ReactionTypeEnum.LIKE:
          return ReactionLikeIcon
        case ReactionTypeEnum.DISLIKE:
          return iconFactory.getIcon('dislike-filled')
        default:
          return iconFactory.getIcon('like')
      }
    },
    [ReactionLikeIcon, iconFactory]
  )

  return getCustomReactionIcon(reaction)
}
