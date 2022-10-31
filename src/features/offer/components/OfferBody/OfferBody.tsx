import React, { FunctionComponent, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { ReportedOffer } from 'api/gen'
import { useOffer } from 'features/offer/api/useOffer'
import { LocationCaption } from 'features/offer/components/LocationCaption'
import { OfferIconCaptions } from 'features/offer/components/OfferIconCaptions/OfferIconCaptions'
import { OfferPartialDescription } from 'features/offer/components/OfferPartialDescription/OfferPartialDescription'
import { ReportOfferModal } from 'features/offer/components/ReportOfferModal/ReportOfferModal'
import { useReportedOffers } from 'features/offer/services/useReportedOffers'
import { useTrackOfferSeenDuration } from 'features/offer/services/useTrackOfferSeenDuration'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import {
  formatFullAddress,
  formatFullAddressWithVenueName,
} from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/firebase/analytics'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { formatDatePeriod } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Hero } from 'ui/components/hero/Hero'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Flag as DefaultFlag } from 'ui/svg/icons/Flag'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  offerId: number
  onScroll: () => void
}

export const OfferBody: FunctionComponent<Props> = ({ offerId, onScroll }) => {
  const { data: offer } = useOffer({ offerId })
  const { data: user } = useUserProfileInfo()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const mapping = useSubcategoriesMapping()

  const [isReportOfferModalVisible, setIsReportOfferModalVisible] = useState(false)
  const showReportOfferDescription = () => setIsReportOfferModalVisible(true)
  const hideReportOfferDescription = () => setIsReportOfferModalVisible(false)

  useTrackOfferSeenDuration(offerId)

  const { data: reportedOffersResponse } = useReportedOffers()
  const isOfferAlreadyReported = reportedOffersResponse?.reportedOffers?.find(
    (reportedOffer: ReportedOffer) => reportedOffer.offerId === offerId
  )

  if (!offer) return <React.Fragment></React.Fragment>
  const { accessibility, venue } = offer
  const { categoryId, isEvent, appLabel } = mapping[offer.subcategoryId]

  const showVenueBanner = venue.isPermanent === true
  const fullAddress = showVenueBanner
    ? formatFullAddress(venue.address, venue.postalCode, venue.city)
    : formatFullAddressWithVenueName(
        venue.address,
        venue.postalCode,
        venue.city,
        venue.publicName,
        venue.name
      )

  const dates = offer.stocks.reduce<string[]>(
    (accumulator, stock) =>
      stock.beginningDatetime ? [...accumulator, stock.beginningDatetime] : accumulator,
    []
  )

  const formattedDate = formatDatePeriod(dates)
  const shouldDisplayWhenBlock = isEvent && !!formattedDate
  const shouldShowAccessibility = Object.values(accessibility).some(
    (value) => value !== undefined && value !== null
  )

  return (
    <Container
      testID="offer-container"
      scrollEventThrottle={20}
      scrollIndicatorInsets={scrollIndicatorInsets}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
      <Hero imageUrl={offer.image?.url} type="offer" categoryId={categoryId || null} />
      <Spacer.Column numberOfSpaces={4} />
      <LocationCaption venue={venue} isDigital={offer.isDigital} />
      <Spacer.Column numberOfSpaces={2} />
      <MarginContainer>
        <OfferTitle
          testID="offerTitle"
          numberOfLines={3}
          adjustsFontSizeToFit
          allowFontScaling={false}
          accessibilityLabel={`Nom de l'offre\u00a0: ${offer.name}`}>
          {offer.name}
        </OfferTitle>
      </MarginContainer>
      <Spacer.Column numberOfSpaces={4} />
      <OfferIconCaptions
        isDuo={offer.isDuo}
        stocks={offer.stocks}
        categoryId={categoryId || null}
        label={appLabel}
      />
      <OfferPartialDescription description={offer.description || ''} id={offerId} />
      <Spacer.Column numberOfSpaces={4} />

      <SectionWithDivider visible={shouldDisplayWhenBlock} margin>
        <StyledTitle4>Quand&nbsp;?</StyledTitle4>
        <SectionBody>{formattedDate}</SectionBody>
      </SectionWithDivider>

      <SectionWithDivider visible={!offer.isDigital} margin>
        <WhereSection
          beforeNavigateToItinerary={() =>
            analytics.logConsultItinerary({ offerId: offer.id, from: 'offer' })
          }
          venue={venue}
          address={fullAddress}
          locationCoordinates={venue.coordinates}
          showVenueBanner={showVenueBanner}
        />
      </SectionWithDivider>

      <SectionWithDivider visible={!!offer.withdrawalDetails && !!user?.isBeneficiary}>
        <AccordionItem
          title="Modalités de retrait"
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultWithdrawal({ offerId: offer.id })}>
          <Typo.Body>
            {offer.withdrawalDetails && highlightLinks(offer.withdrawalDetails)}
          </Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible={shouldShowAccessibility}>
        <AccordionItem
          title="Accessibilité"
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultAccessibility({ offerId: offer.id })}>
          <AccessibilityBlock {...accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider
        visible={!!user && (isUserBeneficiary(user) || isUserExBeneficiary(user))}
        margin>
        <SectionReportOffer>
          <ButtonTertiaryBlack
            inline
            wording={isOfferAlreadyReported ? 'Tu as déjà signalé cette offre' : 'Signaler l’offre'}
            disabled={!!isOfferAlreadyReported}
            icon={() => <Flag />}
            onPress={showReportOfferDescription}
            testID="report-offer-body"
            justifyContent="flex-start"
          />
        </SectionReportOffer>
      </SectionWithDivider>

      <ReportOfferModal
        isVisible={isReportOfferModalVisible}
        dismissModal={hideReportOfferDescription}
        offerId={offerId}
      />

      <SectionWithDivider visible>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const Container = styled.ScrollView({ overflow: 'visible' })
const OfferTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
})
const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(6),
})
const SectionBody = styled(Typo.Body)({
  marginTop: -getSpacing(2),
  paddingBottom: getSpacing(6),
})
const SectionReportOffer = styled.View({
  paddingVertical: getSpacing(5),
  alignItems: 'flex-start',
})

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const Flag = styled(DefaultFlag).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
