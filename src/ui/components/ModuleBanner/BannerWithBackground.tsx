import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'

import { BACKGROUND_IMAGE_SOURCE } from './backgroundImageSource'

interface BannerWithBackgroundProps {
  navigateTo: InternalNavigationProps['navigateTo']
  leftIcon: FunctionComponent<IconInterface>
  rightIcon?: FunctionComponent<IconInterface>
  testID?: string
}

export const BannerWithBackground: FunctionComponent<BannerWithBackgroundProps> = ({
  leftIcon,
  rightIcon,
  navigateTo,
  children,

  testID,
}) => {
  const StyledLeftIcon = styled(leftIcon).attrs(({ theme }) => ({
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
  return (
    <StyledTouchableLink navigateTo={navigateTo} testID={testID} highlight>
      <ImageContainer>
        <ImageBackground source={BACKGROUND_IMAGE_SOURCE} testID="module-background">
          <GenericBanner LeftIcon={StyledLeftIcon} RighIcon={StyledRightIcon}>
            {children}
          </GenericBanner>
        </ImageBackground>
      </ImageContainer>
    </StyledTouchableLink>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))({})

const ImageContainer = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  overflow: 'hidden',
}))

const ImageBackground = styled.ImageBackground(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  backgroundColor: theme.colors.primary,
}))
