import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { HEADER_BLACK_BACKGROUND_HEIGHT } from 'features/home/components/constants'
import { BlackBackground } from 'features/home/components/headers/BlackBackground'
import { CategoryThematicHeader } from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { gradientImagesMapping } from 'ui/theme/gradientImagesMapping'

const HEADER_HEIGHT = getSpacing(52)

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
          <TitleContainer>
            <Title numberOfLines={2}>{title}</Title>
            {subtitle ? (
              <React.Fragment>
                <Subtitle numberOfLines={2}>{subtitle}</Subtitle>
                <Spacer.Column numberOfSpaces={1} />
              </React.Fragment>
            ) : null}
          </TitleContainer>
        </BlackBackground>
      </TextContainer>
    </ImageBackground>
  )
}

type AppV2HeaderProps = Omit<CategoryThematicHeaderProps, 'imageUrl'>

const AppV2Header: FunctionComponent<AppV2HeaderProps> = ({ title, subtitle, color }) => {
  return (
    <ImageBackground
      source={color ? gradientImagesMapping[color] : null}
      resizeMode="stretch"
      testID="CategoryThematicHomeHeaderV2">
      <TextContainer>
        <Background>
          <TitleContainer>
            <Typo.Title1 numberOfLines={2}>{title}</Typo.Title1>
            {subtitle ? (
              <React.Fragment>
                <Subtitle numberOfLines={2}>{subtitle}</Subtitle>
                <Spacer.Column numberOfSpaces={1} />
              </React.Fragment>
            ) : null}
          </TitleContainer>
        </Background>
      </TextContainer>
    </ImageBackground>
  )
}

export const CategoryThematicHomeHeader: FunctionComponent<CategoryThematicHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  color,
}) => {
  const enableAppV2Header = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_THEMATIC_HOME_HEADER)
  return enableAppV2Header ? (
    <AppV2Header title={title} subtitle={subtitle} color={color} />
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

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Title = styled(Typo.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))

const TitleContainer = styled.View(({ theme }) => ({
  // The size of the title block should not exceed two lines of title and one of subtitle
  maxHeight:
    parseInt(theme.typography.title1.lineHeight) * 2 +
    getSpacing(1) +
    parseInt(theme.typography.title4.lineHeight),
  overflow: 'hidden',
}))

const Background = styled(BlackBackground)({
  backgroundColor: 'rgba(0, 0, 0, 0)',
})
