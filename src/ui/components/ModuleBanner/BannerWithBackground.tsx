import React, { FunctionComponent } from 'react'
import { ImageSourcePropType } from 'react-native'
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
  testID?: string
  children: React.ReactNode
}

export const BannerWithBackground: FunctionComponent<BannerWithBackgroundProps> = ({
  leftIcon,
  rightIcon,
  children,
  backgroundSource,
  testID,
  ...touchableProps
}) => {
  const StyledLeftIcon =
    leftIcon &&
    styled(leftIcon).attrs(({ theme }) => ({
      color: theme.colors.white,
    }))``
  const StyledRightIcon = rightIcon
    ? styled(rightIcon).attrs(({ theme }) => ({
        color: theme.colors.white,
        size: theme.icons.sizes.small,
      }))``
    : styled(ArrowNext).attrs(({ theme }) => ({
        color: theme.colors.white,
        size: theme.icons.sizes.small,
      }))``

  const TouchableComponent = 'navigateTo' in touchableProps ? StyledTouchableLink : TouchableOpacity

  return (
    <TouchableComponent {...touchableProps} testID={testID}>
      <ImageContainer>
        <ImageBackground
          source={backgroundSource || BACKGROUND_IMAGE_SOURCE}
          testID="module-background">
          <GenericBannerWithoutBorder
            LeftIcon={StyledLeftIcon ? <StyledLeftIcon /> : undefined}
            RightIcon={StyledRightIcon}>
            {children}
          </GenericBannerWithoutBorder>
        </ImageBackground>
      </ImageContainer>
    </TouchableComponent>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
  hightlight: true,
}))({})

const ImageContainer = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius - BANNER_BORDER_WIDTH,
  overflow: 'hidden',
}))

const ImageBackground = styled.ImageBackground(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  backgroundColor: theme.colors.primary,
}))

const GenericBannerWithoutBorder = styled(GenericBanner)({
  borderWidth: 0,
})
