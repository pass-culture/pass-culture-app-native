import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Animated, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CategoryType } from 'api/gen'
import { BookingOfferModal } from 'features/bookOffer/pages/BookingOfferModal'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { _ } from 'libs/i18n'
import { formatDatePeriod } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { useOffer } from '../api/useOffer'
import {
  AccordionItem,
  CallToAction,
  OfferHeader,
  OfferHero,
  OfferIconCaptions,
  OfferWhereSection,
  AccessibilityBlock,
  OfferPartialDescription,
} from '../components'
import { useCtaWordingAndAction } from '../services/useCtaWordingAndAction'
import { useFunctionOnce } from '../services/useFunctionOnce'

import { useTrackOfferSeenDuration } from './useTrackOfferSeenDuration'

const HEIGHT_END_OF_TRANSITION = getSpacing(20)

export const Offer: FunctionComponent = () => {
  const { bottom } = useCustomSafeInsets()
  const { params } = useRoute<UseRouteType<'Offer'>>()
  const { data: offerResponse } = useOffer({ offerId: params.id })
  const headerScroll = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView | null>(null)
  const [showBookingOfferModal, setShowBookingOfferModal] = useState<boolean>(false)

  const logConsultWholeOffer = useFunctionOnce(() => {
    if (offerResponse) {
      analytics.logConsultWholeOffer(offerResponse.id)
    }
  })
  useTrackOfferSeenDuration(params.id)
  const { wording, onPress: onPressCTA, isExternal } =
    useCtaWordingAndAction({ offerId: params.id }) || {}

  if (!offerResponse) return <React.Fragment></React.Fragment>
  const { accessibility, category, venue } = offerResponse

  const dates = offerResponse.stocks.reduce<Date[]>(
    (accumulator, stock) =>
      stock.beginningDatetime ? [...accumulator, stock.beginningDatetime] : accumulator,
    []
  )
  const shouldDisplayWhenBlock = category.categoryType === CategoryType.Event && dates.length > 0
  const headerTransition = headerScroll.interpolate({
    inputRange: [0, HEIGHT_END_OF_TRANSITION],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  const checkIfAllPageHaveBeenSeen = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      logConsultWholeOffer()
    }
  }

  return (
    <React.Fragment>
      <Container
        testID="offer-container"
        scrollEventThrottle={10}
        scrollIndicatorInsets={{ right: 1 }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={scrollViewRef as any}
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
          useNativeDriver: false,
          listener: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) =>
            checkIfAllPageHaveBeenSeen({ nativeEvent }),
        })}>
        <OfferHero categoryName={category.name} imageUrl={offerResponse.image?.url || ''} />
        <Spacer.Column numberOfSpaces={4} />
        <LocationCaption venue={venue} isDigital={offerResponse.isDigital} />
        <Spacer.Column numberOfSpaces={2} />
        <MarginContainer>
          <OfferTitle
            testID="offerTitle"
            numberOfLines={3}
            adjustsFontSizeToFit
            allowFontScaling={false}>
            {offerResponse.name}
          </OfferTitle>
        </MarginContainer>
        <Spacer.Column numberOfSpaces={4} />
        <OfferIconCaptions
          isDuo={offerResponse.isDuo}
          stocks={offerResponse.stocks}
          category={category.name || null}
          label={category.label}
        />
        <OfferPartialDescription description={offerResponse.description || ''} id={params.id} />
        <Spacer.Column numberOfSpaces={4} />

        <Section visible={shouldDisplayWhenBlock} margin={true}>
          <SectionTitle>{_(t`Quand ?`)}</SectionTitle>
          <SectionBody>{formatDatePeriod(dates)}</SectionBody>
        </Section>

        <Section visible={!offerResponse.isDigital} margin={true}>
          <OfferWhereSection
            address={offerResponse.fullAddress}
            offerCoordinates={venue.coordinates}
            offerId={offerResponse.id}
          />
        </Section>

        <Section visible={!!offerResponse.withdrawalDetails}>
          <AccordionItem
            title={_(t`Modalités de retrait`)}
            onOpenOnce={() => analytics.logConsultWithdrawal(offerResponse.id)}>
            <Typo.Body>
              {offerResponse.withdrawalDetails && highlightLinks(offerResponse.withdrawalDetails)}
            </Typo.Body>
          </AccordionItem>
        </Section>

        <Section
          visible={Object.values(accessibility).some(
            (value) => value !== undefined && value !== null
          )}>
          <AccordionItem
            title={_(t`Accessibilité`)}
            onOpen={() => {
              if (scrollViewRef !== null && scrollViewRef.current !== null) {
                scrollViewRef.current.scrollToEnd()
              }
            }}
            onOpenOnce={() => analytics.logConsultAccessibility(offerResponse.id)}>
            <AccessibilityBlock {...accessibility} />
          </AccordionItem>
        </Section>
      </Container>

      {wording ? (
        <CallToActionContainer testID="CTA-button" style={{ paddingBottom: bottom }}>
          <CallToAction
            wording={wording}
            onPress={() => {
              onPressCTA && onPressCTA()
              if (!isExternal) {
                setShowBookingOfferModal(true)
              }
            }}
            isExternal={isExternal}
            isDisabled={onPressCTA === undefined}
          />
        </CallToActionContainer>
      ) : (
        <Spacer.Column numberOfSpaces={10} />
      )}

      <BookingOfferModal
        visible={showBookingOfferModal}
        dismissModal={() => setShowBookingOfferModal(false)}
        offerId={offerResponse.id}
      />

      <OfferHeader
        title={offerResponse.name}
        headerTransition={headerTransition}
        offerId={offerResponse.id}
      />
    </React.Fragment>
  )
}

interface SectionProps {
  visible: boolean
  children: Element
  margin?: boolean
}

const Section = ({ visible, children, margin = false }: SectionProps) => {
  if (!visible) return <React.Fragment></React.Fragment>

  return (
    <React.Fragment>
      <Divider />
      {margin ? <MarginContainer>{children}</MarginContainer> : children}
    </React.Fragment>
  )
}

const Container = styled.ScrollView({ overflow: 'visible' })
const OfferTitle = styled(Typo.Title3)({ textAlign: 'center' })
const SectionTitle = styled(Typo.Title4)({ paddingVertical: getSpacing(6) })
const SectionBody = styled(Typo.Body)({ marginTop: -getSpacing(2), paddingBottom: getSpacing(6) })

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const Divider = styled.View({
  height: getSpacing(2),
  backgroundColor: ColorsEnum.GREY_LIGHT,
})

const CallToActionContainer = styled.View({
  marginHorizontal: getSpacing(6),
  marginBottom: getSpacing(8),
})
