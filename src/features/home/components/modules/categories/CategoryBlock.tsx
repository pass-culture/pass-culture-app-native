import { useNavigation } from '@react-navigation/native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { Color } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { CategoryButtonV2 } from 'shared/Buttons/CategoryButtonV2'
import { theme } from 'theme'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

import { Shape } from './Shape'

const BLOCK_HEIGHT = getSpacing(24)

interface CategoryBlockProps {
  title: string
  navigateTo: InternalNavigationProps['navigateTo']
  color: Color
  hasGraphicRedesign: boolean
  onBeforePress: () => void | Promise<void>
}

export const newColorMapping: Record<
  keyof typeof Color,
  { border: ColorsEnum; text: ColorsEnum; fill: ColorsEnum }
> = {
  SkyBlue: {
    border: ColorsEnum.SKY_BLUE_DARK,
    text: ColorsEnum.DEEP_PINK_DARK,
    fill: ColorsEnum.SKY_BLUE_LIGHT,
  },
  Gold: {
    border: ColorsEnum.GOLD_DARK,
    text: ColorsEnum.LILAC_DARK,
    fill: ColorsEnum.GOLD_LIGHT_200,
  },
  Coral: {
    border: ColorsEnum.CORAL_DARK,
    text: ColorsEnum.SKY_BLUE_DARK,
    fill: ColorsEnum.CORAL_LIGHT,
  },
  DeepPink: {
    border: ColorsEnum.DEEP_PINK_DARK,
    text: ColorsEnum.AQUAMARINE_DARK,
    fill: ColorsEnum.DEEP_PINK_LIGHT,
  },
  Lilac: {
    border: ColorsEnum.LILAC_DARK,
    text: ColorsEnum.DEEP_PINK_DARK,
    fill: ColorsEnum.LILAC_LIGHT,
  },
  Aquamarine: {
    border: ColorsEnum.AQUAMARINE_DARK,
    text: ColorsEnum.LILAC_DARK,
    fill: ColorsEnum.AQUAMARINE_LIGHT,
  },
}

export function CategoryBlock({
  title,
  navigateTo,
  color,
  hasGraphicRedesign,
  onBeforePress,
}: Readonly<CategoryBlockProps>) {
  const { navigate } = useNavigation<UseNavigationType>()

  if (hasGraphicRedesign) {
    return (
      <StyledCategoryButtonV2
        label={title}
        textColor={newColorMapping[color].text}
        fillColor={newColorMapping[color].fill}
        borderColor={newColorMapping[color].border}
        onPress={() => {
          onBeforePress()
          navigate(navigateTo.screen, navigateTo.params)
        }}
      />
    )
  }

  return (
    <StyledInternalTouchableLink onBeforeNavigate={onBeforePress} navigateTo={navigateTo}>
      <ColoredContainer colors={gradientColorsMapping[color]}>
        <StyledShape color={color} height={BLOCK_HEIGHT} />
        <StyledTitle numberOfLines={2}>{title}</StyledTitle>
      </ColoredContainer>
    </StyledInternalTouchableLink>
  )
}

const StyledCategoryButtonV2 = styled(CategoryButtonV2)({
  width: getSpacing(44.5),
  height: getSpacing(41),
})

const ColoredContainer = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})(({ theme }) => ({
  flex: 1,
  flexDirection: 'column-reverse',
  borderRadius: theme.borderRadius.radius,
}))

const StyledShape = styled(Shape)({ position: 'absolute', right: 0 })

const StyledTitle = styled(Typo.ButtonText)({
  color: theme.colors.white,
  margin: getSpacing(3),
})

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))({
  height: BLOCK_HEIGHT,
})
