import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { HEADER_BLACK_BACKGROUND_HEIGHT } from 'features/home/components/constants'
import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { SubscribeButtonWithModals } from 'features/home/components/SubscribeButtonWithModals'
import { CategoryThematicHeader } from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getSpacing, Spacer, Typo, TypoDS } from 'ui/theme'
import { gradientImagesMapping } from 'ui/theme/gradientImagesMapping'

const HEADER_HEIGHT = getSpacing(45)

type CategoryThematicHeaderProps = Omit<CategoryThematicHeader, 'type'>

const AppV1Header: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
}) => {
  return (
    <ImageBackground source={{ uri: imageUrl }} testID="CategoryThematicHomeHeaderV1">
      <TextContainer>
        <BlackGradient height={HEADER_BLACK_BACKGROUND_HEIGHT} />
        <BlackBackground>
          <Title numberOfLines={2}>{title}</Title>
          {subtitle ? (
            <React.Fragment>
              <Subtitle numberOfLines={2}>{subtitle}</Subtitle>
              <Spacer.Column numberOfSpaces={1} />
            </React.Fragment>
          ) : null}
        </BlackBackground>
      </TextContainer>
    </ImageBackground>
  )
}

type AppV2HeaderProps = Omit<CategoryThematicHeaderProps, 'imageUrl'> & {
  homeId: string
}

const AppV2Header: FunctionComponent<AppV2HeaderProps> = ({ title, subtitle, color, homeId }) => {
  return (
    <ImageBackground
      source={color ? gradientImagesMapping[color] : null}
      resizeMode="stretch"
      testID="CategoryThematicHomeHeaderV2">
      <TextContainer>
        <Background>
          <TypoDS.Title1 numberOfLines={2}>{title}</TypoDS.Title1>
          {subtitle ? (
            <React.Fragment>
              <Subtitle numberOfLines={2}>{subtitle}</Subtitle>
              <Spacer.Column numberOfSpaces={1} />
            </React.Fragment>
          ) : null}
        </Background>
      </TextContainer>
      {Platform.OS === 'ios' ? null : (
        <SubscribeButtonContainer>
          <SubscribeButtonWithModals homeId={homeId} />
        </SubscribeButtonContainer>
      )}
    </ImageBackground>
  )
}

type AppV2CategoryThematicHeaderProps = CategoryThematicHeaderProps & {
  homeId: string
}

export const CategoryThematicHomeHeader: FunctionComponent<AppV2CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  color,
  homeId,
}) => {
  const enableAppV2Header = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_THEMATIC_HOME_HEADER)
  return enableAppV2Header ? (
    <AppV2Header title={title} subtitle={subtitle} color={color} homeId={homeId} />
  ) : (
    <AppV1Header title={title} subtitle={subtitle} imageUrl={imageUrl} color={color} />
  )
}

const ImageBackground = styled.ImageBackground({
  height: HEADER_HEIGHT,
  marginBottom: getSpacing(6),
})

const TextContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})

const SubscribeButtonContainer = styled.View({
  position: 'absolute',
  bottom: getSpacing(4),
  right: getSpacing(6),
})

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Title = styled(TypoDS.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))

const Background = styled(BlackBackground)({
  backgroundColor: 'rgba(0, 0, 0, 0)',
})
