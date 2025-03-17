import React, { ComponentProps, useRef } from 'react'
import { Animated, View } from 'react-native'
import { DefaultTheme, useTheme } from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { IconNames } from 'ui/components/icons/iconFactory'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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
}): { iconName: IconNames; color: ColorsEnum } => {
  switch (reactionType) {
    case ReactionTypeEnum.LIKE:
      return { iconName: 'like-filled', color: theme.colors.primary }
    case ReactionTypeEnum.DISLIKE:
      return { iconName: 'like-filled', color: theme.colors.black }
    default:
      return { iconName: 'like', color: theme.colors.black }
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
        scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef.current}
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
