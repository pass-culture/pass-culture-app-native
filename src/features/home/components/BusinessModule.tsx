import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import { Dimensions, PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { IdeaIcon } from 'features/home/assets/IdeaIcon'
import { NextArrowIcon } from 'features/home/assets/NextArrowIcon'
import { BusinessPane } from 'features/home/contentful'
import { openExternalUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Typo, ColorsEnum, getSpacing, MARGIN_DP, LENGTH_S, RATIO_BUSINESS, Spacer } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

import { fillUrlEmail, shouldUrlBeFilled } from './BusinessModule.utils'

export const BusinessModule = (businessPane: BusinessPane) => {
  const { title, firstLine, secondLine, leftIcon, image, url } = businessPane
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const { data: profileData, isLoading: isProfileDataLoading } = useUserProfileInfo()
  const { displayInfosSnackBar } = useSnackBarContext()

  const openUrl = (finalUrl: string) => {
    setShouldRedirect(false)
    analytics.logClickBusinessBlock(title)
    openExternalUrl(finalUrl)
  }

  useEffect(() => {
    if (!url || !shouldRedirect) return
    if (!shouldUrlBeFilled(url)) {
      openUrl(url)
      return
    }
    if (profileData) {
      openUrl(fillUrlEmail(url, profileData.email))
      return
    }
    if (isProfileDataLoading) {
      displayInfosSnackBar({ message: _(t`Redirection en cours`) })
      return
    }
  }, [url, profileData, shouldRedirect])

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <TouchableHighlight onPress={() => setShouldRedirect(true)}>
        <ImageContainer>
          <ImageBackground source={{ uri: image }} testID="imageBusiness">
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
              <IconContainer>
                <NextArrowIcon />
              </IconContainer>
            </Container>
          </ImageBackground>
        </ImageContainer>
      </TouchableHighlight>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const imageWidth = Dimensions.get('window').width - 2 * MARGIN_DP
const imageHeight = PixelRatio.roundToNearestPixel(imageWidth * RATIO_BUSINESS)

const Row = styled.View({
  flexDirection: 'row',
})

const TouchableHighlight = styled.TouchableHighlight({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
})

const ImageContainer = styled.View({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  overflow: 'hidden',
  maxHeight: LENGTH_S,
})

const Image = styled.Image({
  width: getSpacing(14),
  height: getSpacing(14),
  tintColor: ColorsEnum.WHITE,
})

const ImageBackground = styled.ImageBackground({
  height: imageHeight,
  width: imageWidth,
  justifyContent: 'center',
  maxHeight: LENGTH_S,
})

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(2),
})

const TextContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
  padding: getSpacing(1),
})

const IconContainer = styled.View({
  width: getSpacing(14),
  height: getSpacing(14),
  justifyContent: 'center',
  alignItems: 'center',
})
