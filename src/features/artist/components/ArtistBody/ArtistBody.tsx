import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ArtistPlaylist } from 'features/artist/components/ArtistPlaylist/ArtistPlaylist'
import { ArtistWebMetaHeader } from 'features/artist/components/ArtistWebMetaHeader'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { getOfferArtists } from 'features/offer/helpers/getOfferArtists/getOfferArtists'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

// To remove when description is going to be provided
const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam accumsan sodales metus efficitur accumsan. Etiam aliquam lorem scelerisque volutpat dapibus. Nam sollicitudin quam a turpis mattis gravida ut at dolor. Sed leo lorem, vulputate vitae nulla elementum, ultricies varius velit. Curabitur felis lorem, hendrerit vitae purus aliquam, euismod dictum nisl. Nam vel gravida libero, non maximus nibh. In hac habitasse platea dictumst. Morbi ut magna vel elit dapibus sollicitudin et eu orci. Quisque commodo bibendum risus, nec aliquam dolor consequat vel. Nam quam nulla, pretium non vestibulum nec, convallis et elit.

Curabitur consectetur sapien et convallis fringilla. Suspendisse consequat nec sem non convallis. Aliquam pulvinar mi vitae felis commodo, eget ornare nulla lacinia. Fusce ultricies nibh dui, eget tempus orci placerat eu. Nam pulvinar metus quis purus semper, eu hendrerit justo consequat. Suspendisse potenti. Proin in elementum risus, nec porttitor purus. Vestibulum sodales, turpis eget feugiat maximus, purus nisl laoreet est, euismod pulvinar tellus elit quis enim. Mauris id scelerisque orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac interdum leo. Fusce non est nisi. Nam imperdiet in sem eu semper.`

export const ArtistBody: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'Artist'>>()
  const { goBack } = useGoBack('Offer', { id: params.fromOfferId })
  const theme = useTheme()
  const { headerTransition, onScroll } = useOpacityTransition()

  const { data: offer } = useOffer({ offerId: params.fromOfferId })
  const subcategoriesMapping = useSubcategoriesMapping()

  const { top } = useSafeAreaInsets()
  const headerHeight = theme.appBarHeight + top

  if (!offer) return null

  const subcategory = subcategoriesMapping[offer?.subcategoryId]
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const mainArtistName = artists?.split(',')[0] ?? ''

  if (mainArtistName === '') return null

  return (
    <Container>
      <ArtistWebMetaHeader artist={mainArtistName} />
      {/* On web header is called before Body for accessibility navigate order */}
      {isWeb ? (
        <ContentHeader
          headerTitle={mainArtistName}
          onBackPress={goBack}
          headerTransition={headerTransition}
        />
      ) : null}

      <ContentContainer
        scrollEventThrottle={16}
        bounces={false}
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: headerHeight }}>
        <ViewGap gap={8}>
          <ViewGap gap={6}>
          <ArtistTitle isWeb={isWeb}>{mainArtistName}</ArtistTitle>
            <Description gap={1}>
              <Typo.ButtonText>Quelques infos à son sujet</Typo.ButtonText>
              <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
                {text}
              </CollapsibleText>
            </Description>
          </ViewGap>
          <ArtistPlaylist offer={offer} subcategory={subcategory} artistName={mainArtistName} />
        </ViewGap>
      </ContentContainer>

      {/* On native header is called after Body to implement the BlurView for iOS */}
      {isWeb ? null : (
        <ContentHeader
          headerTitle={mainArtistName}
          onBackPress={goBack}
          headerTransition={headerTransition}
        />
      )}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const ContentContainer = styled(IntersectionObserverScrollView).attrs({
  scrollIndicatorInsets: { right: 1 },
})({
  overflow: 'visible',
})

const ArtistTitle = styled(Typo.Title1)<{ isWeb: boolean }>(({ theme, isWeb }) => ({
  marginLeft: isWeb ? theme.contentPage.marginHorizontal : undefined,
  alignSelf: isWeb ? 'start' : 'center',
  })
)

const Description = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
