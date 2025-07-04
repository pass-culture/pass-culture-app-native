import React, { FunctionComponent } from 'react'
import { AccessibilityRole, ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'

import { BANNER_BORDER_WIDTH, GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'

import { BACKGROUND_IMAGE_SOURCE } from './backgroundImageSource'

type TouchableProps =
  | {
      navigateTo: InternalNavigationProps['navigateTo']
      onBeforeNavigate?: () => void
    }
  | {
      onPress: () => void
    }

type BannerWithBackgroundProps = TouchableProps & {
  leftIcon?: FunctionComponent<AccessibleIcon>
  rightIcon?: FunctionComponent<AccessibleIcon>
  backgroundSource?: ImageSourcePropType
  noRightIcon?: boolean
  testID?: string
  disabled?: boolean
  accessibilityRole?: AccessibilityRole
  children: React.ReactNode
}

export const BannerWithBackground: FunctionComponent<BannerWithBackgroundProps> = ({
  leftIcon,
  rightIcon,
  children,
  backgroundSource,
  testID,
  disabled = false,
  accessibilityRole,
  ...touchableProps
}) => {
  const StyledLeftIcon =
    leftIcon &&
    styled(leftIcon).attrs(({ theme }) => ({
      color: theme.designSystem.color.icon.lockedInverted,
    }))``
  const StyledRightIcon = rightIcon
    ? styled(rightIcon).attrs(({ theme }) => ({
        color: theme.designSystem.color.icon.lockedInverted,
        size: theme.icons.sizes.small,
      }))``
    : styled(ArrowNext).attrs(({ theme }) => ({
        color: theme.designSystem.color.icon.lockedInverted,
        size: theme.icons.sizes.small,
      }))``

  const TouchableComponent = 'navigateTo' in touchableProps ? StyledTouchableLink : TouchableOpacity

  return (
    <TouchableComponent
      {...touchableProps}
      testID={testID}
      disabled={disabled}
      accessibilityRole={accessibilityRole}>
      <ImageContainer>
        <ImageBackground
          source={backgroundSource || BACKGROUND_IMAGE_SOURCE}
          testID="module-background">
          <GenericBannerWithoutBorder
            LeftIcon={StyledLeftIcon ? <StyledLeftIcon /> : undefined}
            RightIcon={StyledRightIcon}
            noRightIcon={touchableProps.noRightIcon}>
            {children}
          </GenericBannerWithoutBorder>
        </ImageBackground>
      </ImageContainer>
    </TouchableComponent>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.designSystem.color.text.inverted,
  hightlight: true,
}))({})

const ImageContainer = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius - BANNER_BORDER_WIDTH,
  overflow: 'hidden',
}))

const ImageBackground = styled.ImageBackground(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.brandPrimary,
}))

const GenericBannerWithoutBorder = styled(GenericBanner)({
  borderWidth: 0,
})
