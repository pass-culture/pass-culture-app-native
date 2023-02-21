import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { useSimilarOffers } from 'features/offer/api/useSimilarOffers'
import { BottomBanner } from 'features/offer/components/BottomBanner/BottomBanner'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferWebHead } from 'features/offer/components/OfferWebHead'
import { getSearchGroupIdFromSubcategoryId } from 'features/offer/helpers/getSearchGroupIdFromSubcategoryId/getSearchGroupIdFromSubcategoryId'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { useOfferModal } from 'features/offer/helpers/useOfferModal/useOfferModal'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Spacer } from 'ui/theme'

const trackEventHasSeenOffer = () => BatchUser.trackEvent(BatchEvent.hasSeenOffer)

const PLAYLIST_HEIGHT = 300

const getPlaylistsHeight = (numberOfPlaylists: number) => {
  return PLAYLIST_HEIGHT * numberOfPlaylists
}

export const Offer: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const trackEventHasSeenOfferOnce = useFunctionOnce(trackEventHasSeenOffer)
  const offerId = route.params && route.params.id

  const { data: offerResponse } = useOffer({ offerId })

  const logConsultWholeOffer = useFunctionOnce(() => {
    if (offerResponse) {
      analytics.logConsultWholeOffer(offerResponse.id)
    }
  })

  const { data: offer } = useOffer({ offerId })
  const { data } = useSubcategories()
  const { shouldUseAlgoliaRecommend } = useRemoteConfigContext()
  const subcategorySearchGroupId = getSearchGroupIdFromSubcategoryId(data, offer?.subcategoryId)
  const sameCategorySimilarOffers = useSimilarOffers({
    offerId,
    position: offer?.venue.coordinates,
    shouldUseAlgoliaRecommend,
    categoryIncluded: subcategorySearchGroupId || SearchGroupNameEnumv2.NONE,
  })
  const hasSameCategorySimilarOffers = sameCategorySimilarOffers?.length

  const otherCategoriesSimilarOffers = useSimilarOffers({
    offerId,
    position: offer?.venue.coordinates,
    shouldUseAlgoliaRecommend,
    categoryExcluded: subcategorySearchGroupId || SearchGroupNameEnumv2.NONE,
  })
  const hasOtherCategoriesSimilarOffers = otherCategoriesSimilarOffers?.length

  const fromOfferId = route.params?.fromOfferId

  const logPlaylistVerticalScroll = useFunctionOnce(() => {
    if (hasSameCategorySimilarOffers || hasOtherCategoriesSimilarOffers) {
      return analytics.logPlaylistVerticalScroll(fromOfferId, offerId)
    }
  })

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) {
        logConsultWholeOffer()
      }
      // The log event is triggered when the similar offer playlist is visible
      const hasTwoSimilarOffersPlaylist =
        hasSameCategorySimilarOffers && hasOtherCategoriesSimilarOffers
      if (
        isCloseToBottom({
          ...nativeEvent,
          padding: hasTwoSimilarOffersPlaylist ? getPlaylistsHeight(2) : getPlaylistsHeight(1),
        })
      ) {
        logPlaylistVerticalScroll()
      }
    },
  })

  const {
    wording,
    onPress: onPressCTA,
    navigateTo,
    externalNav,
    modalToDisplay,
    isEndedUsedBooking,
    bottomBannerText,
    isDisabled,
  } = useCtaWordingAndAction({ offerId }) || {}

  const { OfferModal: CTAOfferModal, showModal: showOfferModal } = useOfferModal({
    modalToDisplay,
    offerId,
    isEndedUsedBooking,
  })

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOfferOnce()
      if (route.params.openModalOnNavigation) {
        showOfferModal()
      }
    }, [trackEventHasSeenOfferOnce, route.params.openModalOnNavigation, showOfferModal])
  )

  const onPress = () => {
    onPressCTA && onPressCTA()
    showOfferModal()
  }

  if (!offerResponse) return null

  return (
    <Container>
      <OfferWebHead offer={offerResponse} />
      <OfferHeader
        title={offerResponse.name}
        headerTransition={headerTransition}
        offerId={offerResponse.id}
      />
      <OfferBody
        offerId={offerId}
        onScroll={onScroll}
        sameCategorySimilarOffers={sameCategorySimilarOffers}
        otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
      />

      {!!wording && (
        <React.Fragment>
          <CallToActionContainer testID="CTA-button">
            <CTAButton
              wording={wording}
              onPress={onPress}
              navigateTo={navigateTo}
              externalNav={externalNav}
              isDisabled={isDisabled}
            />
            <Spacer.Column numberOfSpaces={bottomBannerText ? 4.5 : 6} />
          </CallToActionContainer>
          {bottomBannerText ? <BottomBanner text={bottomBannerText} /> : <Spacer.BottomScreen />}
        </React.Fragment>
      )}

      {CTAOfferModal}
    </Container>
  )
}

const CTAButton = ({
  wording,
  onPress,
  isDisabled,
  externalNav,
  navigateTo,
}: {
  wording: string
  onPress?: () => void
  isDisabled?: boolean
  externalNav?: ExternalNavigationProps['externalNav']
  navigateTo?: InternalNavigationProps['navigateTo']
}) => {
  const commonLinkProps = {
    as: ButtonWithLinearGradient,
    wording: wording,
    onBeforeNavigate: onPress,
    isDisabled: isDisabled,
    isOnPressDebounced: true,
  }

  if (navigateTo) {
    return <InternalTouchableLink navigateTo={navigateTo} {...commonLinkProps} />
  }
  if (externalNav) {
    return (
      <ExternalTouchableLink externalNav={externalNav} icon={ExternalSite} {...commonLinkProps} />
    )
  }
  return <ButtonWithLinearGradient wording={wording} onPress={onPress} isDisabled={isDisabled} />
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const CallToActionContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
