import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ArtistAvatar } from 'features/home/components/ArtistHighlightingModule/ArtistAvatar'
import { ArtistInformation } from 'features/home/components/ArtistHighlightingModule/ArtistInformation'
import { Color } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { useArtistQuery } from 'queries/artist/useArtistQuery'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ArtistHighlightingStickerDesktop } from 'ui/svg/ArtistHighlightingStickerDesktop'
import { ArtistHighlightingStickerMobile } from 'ui/svg/ArtistHighlightStickerMobile'
import { colorMapping } from 'ui/theme/colorMapping'

export type ArtistHighlightingModuleProps = {
  homeEntryId: string | undefined
  moduleId: string
  index: number
  artistId: string
  subtitle: string
  description: string
  color: Color
}

export const ArtistHighlightingModule: FunctionComponent<ArtistHighlightingModuleProps> = ({
  homeEntryId,
  moduleId,
  index,
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

  const triggerLogModuleDisplayedOnHomepage = useCallback(() => {
    if (shouldModuleBeDisplayed) {
      void analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.ARTIST_HIGHLIGHTING,
        index,
        homeEntryId,
      })
    }
  }, [homeEntryId, index, moduleId, shouldModuleBeDisplayed])

  useEffect(() => {
    triggerLogModuleDisplayedOnHomepage()
  }, [triggerLogModuleDisplayedOnHomepage])

  if (!shouldModuleBeDisplayed) return null

  const onPress = () => {
    void analytics.logConsultArtist({
      from: 'home',
      originDetails: 'artistHighlightModule',
      moduleId,
      homeEntryId,
      artistId,
      artistName: artist.name,
    })
    navigate('Artist', { id: artist.id })
  }

  const wording = 'Découvrir'
  const accessibilityLabel = `${wording} la page artiste de ${artist.name}`

  return isDesktopViewport ? (
    <Container color={color} testID="desktopArtistHighlighting">
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
              wording={wording}
              accessibilityLabel={accessibilityLabel}
              size="small"
            />
          </ButtonContainer>
        </ViewGap>
      </ContentDesktop>
    </Container>
  ) : (
    <Container color={color} testID="mobileArtistHighlighting">
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
            wording={wording}
            accessibilityLabel={accessibilityLabel}
            size="small"
          />
        </ButtonContainer>
      </Content>
    </Container>
  )
}

const Container = styled.View<{
  color: Color
}>(({ theme, color }) => ({
  borderRadius: theme.designSystem.size.borderRadius.l,
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.home.spaceBetweenModules,
  backgroundColor: theme.designSystem.color.illustration[colorMapping[color].fill],
  overflow: 'hidden',
}))

const Content = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  paddingVertical: theme.designSystem.size.spacing.xl,
}))

const ContentDesktop = styled(ViewGap)(({ theme }) => ({
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
