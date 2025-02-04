import { useNavigation } from '@react-navigation/native'
import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { OfferImageResponse, OfferResponseV2 } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { CineContentCTA } from 'features/offer/components/OfferCine/CineContentCTA'
import { ChronicleSection } from 'features/offer/components/OfferContent/ChronicleSection/ChronicleSection'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { OfferContentProps } from 'features/offer/types'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useFunctionOnce } from 'libs/hooks'
import { QueryKeys } from 'libs/queryKeys'
import { getImagesUrls } from 'shared/getImagesUrls/getImagesUrls'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { getSpacing } from 'ui/theme'

type OfferContentBaseProps = OfferContentProps & {
  BodyWrapper: FunctionComponent
  onOfferPreviewPress: (index?: number) => void
  footer?: ReactElement | null
  chronicles?: ChronicleCardData[]
  contentContainerStyle?: StyleProp<ViewStyle>
}

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

export const OfferContentBase: FunctionComponent<OfferContentBaseProps> = ({
  offer,
  searchGroupList,
  subcategory,
  footer,
  chronicles,
  onOfferPreviewPress,
  contentContainerStyle,
  BodyWrapper = React.Fragment,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup: subcategory.searchGroupName, searchGroupList })
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)
  const { isButtonVisible } = useOfferCTA()
  const { showAccessScreeningButton } = useRemoteConfigContext()

  const logConsultWholeOffer = useFunctionOnce(() => {
    analytics.logConsultWholeOffer(offer.id)
  })

  const { shouldTriggerBatchSurveyEvent, trackBatchEvent, trackEventHasSeenOfferOnce } =
    useOfferBatchTracking(subcategory.id)

  // We want to show images from offer when it's loaded. Not the one preloaded in query cache...
  const offerImages = useMemo(
    () => (offer.metadata && offer.images ? getImagesUrls<OfferImageResponse>(offer.images) : []),
    [offer]
  )

  const queryClient = useQueryClient()
  const cachedOffer = queryClient.getQueryData<OfferResponseV2>([QueryKeys.OFFER, offer.id])

  // Extract cached image before it's been updated by next offer query
  const placeholderImage = useRef(cachedOffer?.images?.recto?.url).current

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (shouldTriggerBatchSurveyEvent) {
      timeoutId = setTimeout(() => {
        trackBatchEvent()
      }, DELAY_BEFORE_CONSIDERING_PAGE_SEEN)
    }

    return () => clearTimeout(timeoutId)
  }, [shouldTriggerBatchSurveyEvent, trackBatchEvent])

  const scrollEventListener = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) {
        logConsultWholeOffer()
        if (shouldTriggerBatchSurveyEvent) {
          trackBatchEvent()
        }
      }
    },
    [logConsultWholeOffer, shouldTriggerBatchSurveyEvent, trackBatchEvent]
  )

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: scrollEventListener,
  })

  const handleCheckScrollY = useRef(() => {
    return scrollYRef.current
  }).current

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll(event)
      scrollYRef.current = event.nativeEvent.contentOffset.y
    },
    [onScroll]
  )

  const onSeeMoreButtonPress = (chronicleId: number) => {
    navigate('Chronicles', { offerId: offer.id, chronicleId })
  }

  return (
    <Container>
      <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
        <OfferWebMetaHeader offer={offer} />
        <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
        <ScrollViewContainer
          testID="offerv2-container"
          scrollEventThrottle={16}
          scrollIndicatorInsets={scrollIndicatorInsets}
          bounces={false}
          ref={scrollViewRef}
          contentContainerStyle={contentContainerStyle}
          onScroll={handleScroll}>
          <BodyWrapper>
            <OfferImageContainer
              imageUrls={offerImages}
              categoryId={subcategory.categoryId}
              onPress={onOfferPreviewPress}
              placeholderImage={placeholderImage}
            />
            <OfferBody
              offer={offer}
              subcategory={subcategory}
              trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
            />
          </BodyWrapper>
          {chronicles?.length ? (
            <StyledSectionWithDivider visible testID="chronicles-section" gap={8}>
              <ChronicleSection
                title="La reco du Book Club"
                ctaLabel="Voir tous les avis"
                subtitle="Notre communauté de lecteurs te partagent leurs avis sur ce livre&nbsp;!"
                data={chronicles}
                navigateTo={{ screen: 'Chronicles', params: { offerId: offer.id } }}
                onSeeMoreButtonPress={onSeeMoreButtonPress}
              />
            </StyledSectionWithDivider>
          ) : null}
          <StyledSectionWithDivider
            visible
            margin
            testID="messagingApp-container-with-divider"
            gap={8}>
            <OfferMessagingApps offer={offer} />
          </StyledSectionWithDivider>
          <OfferPlaylistList
            offer={offer}
            sameCategorySimilarOffers={sameCategorySimilarOffers}
            apiRecoParamsSameCategory={apiRecoParamsSameCategory}
            otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
            apiRecoParamsOtherCategories={apiRecoParamsOtherCategories}
          />
        </ScrollViewContainer>
        {showAccessScreeningButton && isButtonVisible ? <CineContentCTA /> : footer}
      </AnchorProvider>
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const Container = styled.View({
  flex: 1,
})

const ScrollViewContainer = React.memo(
  styled(IntersectionObserverScrollView)({
    overflow: 'visible',
  })
)

const StyledSectionWithDivider = styled(SectionWithDivider)({
  paddingBottom: getSpacing(8),
})
