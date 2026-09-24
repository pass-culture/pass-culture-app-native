import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ArtistAvatar } from 'features/home/components/ArtistHighlightingModule/ArtistAvatar'
import { ArtistInformation } from 'features/home/components/ArtistHighlightingModule/ArtistInformation'
import { Color } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useArtistQuery } from 'queries/artist/useArtistQuery'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ArtistHighlightingStickerDesktop } from 'ui/svg/ArtistHighlightingStickerDesktop'
import { ArtistHighlightingStickerMobile } from 'ui/svg/ArtistHighlightStickerMobile'
import { getSpacing } from 'ui/theme'
import { colorMapping } from 'ui/theme/colorMapping'

export type ArtistHighlightingModuleProps = {
  homeEntryId: string | undefined
  moduleId: string
  artistId: string
  subtitle: string
  description: string
  color: Color
}

const FIXED_SIZE_MOBILE = getSpacing(87.75)
const FIXED_SIZE_DESKTOP = getSpacing(49.25)

export const ArtistHighlightingModule: FunctionComponent<ArtistHighlightingModuleProps> = ({
  homeEntryId: _homeEntryId,
  moduleId: _moduleId,
  artistId,
  subtitle,
  description,
  color,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    data: artist,
    isError: hasArtistError,
    isLoading: isArtistLoading,
  } = useArtistQuery(artistId, {
    throwOnError: false,
  })
  const { designSystem, isDesktopViewport } = useTheme()

  const shouldModuleBeDisplayed = !isArtistLoading && !hasArtistError && artist

  if (!shouldModuleBeDisplayed) return null

  const onPress = () => {
    navigate('Artist', { id: artist.id })
  }

  return isDesktopViewport ? (
    <Container height={FIXED_SIZE_DESKTOP} color={color} testID="desktopArtistHighlighting">
      <StickerContainer>
        <ArtistHighlightingStickerDesktop />
      </StickerContainer>
      <ContentDesktop gap={10}>
        <ArtistAvatar imageUrl={artist.image} size={designSystem.size.image.l} />
        <ViewGap gap={4}>
          <ArtistInformation name={artist.name} subtitle={subtitle} description={description} />
          <ButtonContainer>
            <Button
              variant="secondary"
              color="neutral"
              onPress={onPress}
              wording="Découvrir"
              accessibilityLabel={`Découvre la page artiste de ${artist.name}`}
              size="small"
            />
          </ButtonContainer>
        </ViewGap>
      </ContentDesktop>
    </Container>
  ) : (
    <Container height={FIXED_SIZE_MOBILE} color={color} testID="mobileArtistHighlighting">
      <StickerContainer>
        <ArtistHighlightingStickerMobile />
      </StickerContainer>
      <Content gap={3}>
        <ArtistAvatar imageUrl={artist.image} size={designSystem.size.image.l} />
        <ArtistInformation name={artist.name} subtitle={subtitle} description={description} />
        <ButtonContainer>
          <Button
            variant="secondary"
            color="neutral"
            onPress={onPress}
            wording="Découvrir"
            accessibilityLabel={`Découvre la page artiste de ${artist.name}`}
            size="small"
          />
        </ButtonContainer>
      </Content>
    </Container>
  )
}

const Container = styled.View<{
  height: number
  color: Color
}>(({ theme, height, color }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
  height,
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.home.spaceBetweenModules,
  backgroundColor: theme.designSystem.color.illustration[colorMapping[color].fill],
}))

const Content = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  paddingVertical: theme.designSystem.size.spacing.xl,
}))

const ContentDesktop = styled(ViewGap)(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  paddingVertical: theme.designSystem.size.spacing.l,
  paddingHorizontal: theme.designSystem.size.spacing.l,
  alignItems: 'center',
}))

const ButtonContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: theme.isDesktopViewport ? 'flex-start' : 'center',
}))

const StickerContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
})
