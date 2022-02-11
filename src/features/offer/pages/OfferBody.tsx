import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { ReportedOffer } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { ReportOfferModal } from 'features/offer/components/ReportOfferModal'
import { useReportedOffers } from 'features/offer/services/useReportedOffers'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import {
  formatFullAddress,
  formatFullAddressWithVenueName,
} from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/analytics'
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
import { Dd } from 'ui/web/list/Dd'
import { Dl } from 'ui/web/list/Dl'
import { Dt } from 'ui/web/list/Dt'

import { useOffer } from '../api/useOffer'
import { OfferIconCaptions, OfferPartialDescription } from '../components'

import { useTrackOfferSeenDuration } from './useTrackOfferSeenDuration'

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
      <Dl>
        <LocationCaption venue={venue} isDigital={offer.isDigital} />
        <Spacer.Column numberOfSpaces={2} />
        <MarginContainer>
          <HiddenTitle>{t`Titre`}</HiddenTitle>
          <OfferTitle
            testID="offerTitle"
            numberOfLines={3}
            adjustsFontSizeToFit
            allowFontScaling={false}>
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
        <HiddenTitle>{t`Description`}</HiddenTitle>
        <OfferPartialDescription description={offer.description || ''} id={offerId} />
        <Spacer.Column numberOfSpaces={4} />

        <SectionWithDivider visible={shouldDisplayWhenBlock} margin={true}>
          <SectionTitle>{t`Quand\u00a0?`}</SectionTitle>
          <SectionBody>{formattedDate}</SectionBody>
        </SectionWithDivider>

        <SectionWithDivider visible={!offer.isDigital} margin={true}>
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
      </Dl>

      <SectionWithDivider visible={!!offer.withdrawalDetails && !!user?.isBeneficiary}>
        <AccordionItem
          title={t`Modalités de retrait`}
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultWithdrawal({ offerId: offer.id })}>
          <Typo.Body>
            {offer.withdrawalDetails && highlightLinks(offer.withdrawalDetails)}
          </Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible={shouldShowAccessibility}>
        <AccordionItem
          title={t`Accessibilité`}
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultAccessibility({ offerId: offer.id })}>
          <AccessibilityBlock {...accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider
        visible={!!user && (isUserBeneficiary(user) || isUserExBeneficiary(user))}
        margin={true}>
        <SectionReportOffer>
          <ButtonTertiaryBlack
            inline
            wording={
              isOfferAlreadyReported ? t`Tu as déjà signalé cette offre` : t`Signaler l'offre`
            }
            disabled={!!isOfferAlreadyReported}
            icon={() => <Flag />}
            onPress={showReportOfferDescription}
            testID={'report-offer-body'}
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
const OfferTitle = webStyled(Dd)(({ theme }) => ({
  ...theme.typography.title3,
  textAlign: 'center',
}))
const SectionTitle = webStyled(Dt)(({ theme }) => ({
  ...theme.typography.title4,
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(6),
}))
const HiddenTitle = webStyled(Dt)({ display: 'none' })
const SectionBody = webStyled(Dd)(({ theme }) => ({
  ...theme.typography.body,
  marginTop: -getSpacing(2),
  paddingBottom: getSpacing(6),
}))
const SectionReportOffer = styled.View({
  paddingVertical: getSpacing(5),
  marginLeft: -getSpacing(2),
})

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const Flag = styled(DefaultFlag).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
