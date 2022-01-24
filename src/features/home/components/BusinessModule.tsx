import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import { PixelRatio } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { IdeaIcon } from 'features/home/assets/IdeaIcon'
import { NextArrowIcon } from 'features/home/assets/NextArrowIcon'
import { BusinessPane } from 'features/home/contentful'
import { openUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Typo, getSpacing, MARGIN_DP, LENGTH_XS, RATIO_BUSINESS, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { fillUrlEmail, shouldUrlBeFilled, showBusinessModule } from './BusinessModule.utils'

export const BusinessModule = ({ module }: { module: BusinessPane }) => {
  const { title, firstLine, secondLine, leftIcon, image, url } = module
  const isDisabled = !url
  const { appContentWidth } = useTheme()
  const { isLoggedIn } = useAuthContext()
  const imageWidth = appContentWidth - 2 * MARGIN_DP
  const imageHeight = PixelRatio.roundToNearestPixel(imageWidth * RATIO_BUSINESS)

  const [shouldRedirect, setShouldRedirect] = useState(false)

  const { data: user, isLoading: isUserLoading } = useUserProfileInfo()
  const { showInfoSnackBar } = useSnackBarContext()

  const logAndOpenUrl = (finalUrl: string) => {
    setShouldRedirect(false)
    analytics.logClickBusinessBlock(title)
    openUrl(finalUrl)
  }

  useEffect(() => {
    if (!url || !shouldRedirect) return
    if (!shouldUrlBeFilled(url)) {
      logAndOpenUrl(url)
      return
    }
    if (user) {
      logAndOpenUrl(fillUrlEmail(url, user.email))
      return
    }
    if (isUserLoading) {
      showInfoSnackBar({ message: t`Redirection en cours` })
      return
    }
  }, [url, user, shouldRedirect])

  const shouldModuleBeDisplayed = showBusinessModule(module.targetNotConnectedUsersOnly, isLoggedIn)
  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <TouchableHighlight onPress={() => setShouldRedirect(true)} disabled={isDisabled}>
        <ImageContainer>
          <ImageBackground
            source={{ uri: image }}
            height={imageHeight}
            width={imageWidth}
            testID="imageBusiness">
            <Container>
              <IconContainer>
                {leftIcon ? <Image source={{ uri: leftIcon }} /> : <IdeaIcon />}
              </IconContainer>
              <TextContainer>
                <Typo.ButtonText color={ColorsEnum.WHITE} testID="firstLine">
                  {firstLine}
                </Typo.ButtonText>
                <Typo.Body numberOfLines={2} color={ColorsEnum.WHITE}>
                  {secondLine}
                </Typo.Body>
              </TextContainer>
              {!isDisabled && (
                <IconContainer>
                  <NextArrowIcon />
                </IconContainer>
              )}
            </Container>
          </ImageBackground>
        </ImageContainer>
      </TouchableHighlight>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
})

const TouchableHighlight = styled.TouchableHighlight(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
}))

const ImageContainer = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  overflow: 'hidden',
  maxHeight: LENGTH_XS,
}))

const Image = styled.Image({
  width: getSpacing(14),
  height: getSpacing(14),
  tintColor: ColorsEnum.WHITE,
})

const ImageBackground = styled.ImageBackground<{ width: number; height: number }>((props) => ({
  height: props.height,
  width: props.width,
  justifyContent: 'center',
  maxHeight: LENGTH_XS,
}))

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(2),
  paddingHorizontal: getSpacing(1.5),
})

const TextContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(0.5),
})

const IconContainer = styled.View({
  width: getSpacing(14),
  height: getSpacing(14),
  justifyContent: 'center',
  alignItems: 'center',
})
