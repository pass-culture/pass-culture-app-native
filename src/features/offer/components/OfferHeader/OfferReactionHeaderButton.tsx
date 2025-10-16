import React, { ComponentProps, useRef } from 'react'
import { Animated, View } from 'react-native'
import { DefaultTheme, useTheme } from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { ColorsType } from 'theme/types'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { IconNames } from 'ui/components/icons/iconFactory'

type ReactionHeaderButtonProps = Omit<
  ComponentProps<typeof RoundedButton>,
  'scaleAnimatedValue'
> & { defaultReaction?: ReactionTypeEnum | null }

const getIconAndColorFromReactionType = ({
  theme,
  reactionType,
}: {
  theme: DefaultTheme
  reactionType?: ReactionTypeEnum | null
}): { iconName: IconNames; color: ColorsType } => {
  switch (reactionType) {
    case ReactionTypeEnum.LIKE:
      return { iconName: 'like-filled', color: theme.designSystem.color.icon.brandPrimary }
    case ReactionTypeEnum.DISLIKE:
      return { iconName: 'like-filled', color: theme.designSystem.color.icon.default }
    default:
      return { iconName: 'like', color: theme.designSystem.color.icon.default }
  }
}

export const OfferReactionHeaderButton = ({
  animationState,
  onPress,
  disabled,
  defaultReaction,
}: ReactionHeaderButtonProps) => {
  const theme = useTheme()
  const scaleFavoriteIconAnimatedValueRef = useRef(new Animated.Value(1))
  const { iconName, color } = getIconAndColorFromReactionType({
    theme,
    reactionType: defaultReaction,
  })
  return (
    <View style={{ transform: [{ scale: defaultReaction === ReactionTypeEnum.DISLIKE ? -1 : 1 }] }}>
      <RoundedButton
        animationState={animationState}
        scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef}
        finalColor={color}
        initialColor={color}
        iconName={iconName}
        onPress={onPress}
        disabled={disabled}
        {...accessibleCheckboxProps({ checked: !!defaultReaction, label: 'Réagir à cette offre' })}
      />
    </View>
  )
}
