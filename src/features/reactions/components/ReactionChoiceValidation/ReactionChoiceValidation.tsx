import React, { FunctionComponent, useCallback, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { ReactionToggleButton } from 'features/reactions/components/ReactionToggleButton/ReactionToggleButton'
import { IconNames } from 'ui/components/icons/iconFactory'
import { useIconFactory } from 'ui/components/icons/useIconFactory'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  handleOnPressReactionButton: (reactionType: ReactionTypeEnum) => void
  reactionStatus?: ReactionTypeEnum | null
  likeLabel: string
  dislikeLabel: string
}

export const ReactionChoiceValidation: FunctionComponent<Props> = ({
  reactionStatus,
  handleOnPressReactionButton,
  likeLabel,
  dislikeLabel,
  ...props
}) => {
  const iconFactory = useIconFactory()
  const { designSystem } = useTheme()

  const getStyledIcon = useCallback(
    (name: IconNames, props?: object) =>
      styled(iconFactory.getIcon(name)).attrs(({ theme }) => ({
        size: theme.icons.sizes.small,
        ...props,
      }))``,
    [iconFactory]
  )

  const ThumbUpIcon = useMemo(
    () => ({
      default: getStyledIcon('like', { testID: 'thumbUp' }),
      pressed: getStyledIcon('like-filled', {
        testID: 'thumbUpFilled',
        color: designSystem.color.icon.brandPrimary,
      }),
    }),
    [getStyledIcon, designSystem.color.icon.brandPrimary]
  )

  const ThumbDownIcon = useMemo(
    () => ({
      default: getStyledIcon('dislike', { testID: 'thumbDown' }),
      pressed: getStyledIcon('dislike-filled', {
        testID: 'thumbDownFilled',
      }),
    }),
    [getStyledIcon]
  )

  return (
    <ButtonsContainer gap={4} {...props}>
      <ReactionToggleButton
        active={reactionStatus === ReactionTypeEnum.LIKE}
        label={likeLabel}
        Icon={ThumbUpIcon.default}
        FilledIcon={ThumbUpIcon.pressed}
        onPress={() => handleOnPressReactionButton(ReactionTypeEnum.LIKE)}
      />
      <ReactionToggleButton
        active={reactionStatus === ReactionTypeEnum.DISLIKE}
        label={dislikeLabel}
        Icon={ThumbDownIcon.default}
        FilledIcon={ThumbDownIcon.pressed}
        onPress={() => handleOnPressReactionButton(ReactionTypeEnum.DISLIKE)}
      />
    </ButtonsContainer>
  )
}

const ButtonsContainer = styled(ViewGap)({
  flexDirection: 'row',
})
