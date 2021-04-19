import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CategoryType } from 'api/gen'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { OfferHero } from 'features/offer/components/OfferHero'
import { analytics } from 'libs/analytics'
import { formatDatePeriod } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useOffer } from '../api/useOffer'
import {
  AccordionItem,
  OfferIconCaptions,
  OfferWhereSection,
  AccessibilityBlock,
  OfferPartialDescription,
} from '../components'

import { useTrackOfferSeenDuration } from './useTrackOfferSeenDuration'

export const OfferBody: FunctionComponent<{
  offerId: number
  onScroll: () => void
}> = ({ offerId, onScroll }) => {
  const { data: offerResponse } = useOffer({ offerId })
  const scrollViewRef = useRef<ScrollView | null>(null)

  useTrackOfferSeenDuration(offerId)

  if (!offerResponse) return <React.Fragment></React.Fragment>
  const { accessibility, category, venue } = offerResponse

  const dates = offerResponse.stocks.reduce<Date[]>(
    (accumulator, stock) =>
      stock.beginningDatetime ? [...accumulator, stock.beginningDatetime] : accumulator,
    []
  )
  const formattedDate = formatDatePeriod(dates)
  const shouldDisplayWhenBlock = category.categoryType === CategoryType.Event && !!formattedDate

  return (
    <Container
      testID="offer-container"
      scrollEventThrottle={10}
      scrollIndicatorInsets={{ right: 1 }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
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
      <OfferPartialDescription description={offerResponse.description || ''} id={offerId} />
      <Spacer.Column numberOfSpaces={4} />

      <Section visible={shouldDisplayWhenBlock} margin={true}>
        <SectionTitle>{t`Quand ?`}</SectionTitle>
        <SectionBody>{formattedDate}</SectionBody>
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
          title={t`Modalités de retrait`}
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
          title={t`Accessibilité`}
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
