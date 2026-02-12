import React from 'react'
import { View } from 'react-native'

import { ReactionTypeEnum } from 'api/gen'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonColor } from 'ui/designSystem/Button/types'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { AccessibleIcon } from 'ui/svg/icons/types'

type ReactionHeaderButtonProps = {
  onPress?: () => void
  disabled?: boolean
  defaultReaction?: ReactionTypeEnum | null
}

const getIconAndColorFromReactionType = (
  reactionType?: ReactionTypeEnum | null
): { icon: React.FunctionComponent<AccessibleIcon>; color: ButtonColor } => {
  switch (reactionType) {
    case ReactionTypeEnum.LIKE:
      return { icon: ThumbUpFilled, color: 'brand' }
    case ReactionTypeEnum.DISLIKE:
      return { icon: ThumbUpFilled, color: 'neutral' }
    default:
      return { icon: ThumbUp, color: 'neutral' }
  }
}

export const OfferReactionHeaderButton = ({
  onPress,
  disabled,
  defaultReaction,
}: ReactionHeaderButtonProps) => {
  const { icon, color } = getIconAndColorFromReactionType(defaultReaction)
  const checkboxProps = accessibleCheckboxProps({
    checked: !!defaultReaction,
    label: 'Réagir à cette offre',
  })
  return (
    <View style={{ transform: [{ scale: defaultReaction === ReactionTypeEnum.DISLIKE ? -1 : 1 }] }}>
      <Button
        iconButton
        variant="secondary"
        color={color}
        icon={icon}
        onPress={onPress}
        disabled={disabled}
        {...accessibleCheckboxProps({ checked: !!defaultReaction, label: 'Réagir à cette offre' })}
        accessibilityLabel={checkboxProps.accessibilityLabel ?? 'Réagir à cette offre'}
      />
    </View>
  )
}
