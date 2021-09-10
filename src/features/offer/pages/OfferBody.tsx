import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { CategoryType, ReportedOffer, UserReportedOffersResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { ReportOfferModal } from 'features/offer/components/ReportOfferModal'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { formatDatePeriod } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { QueryKeys } from 'libs/queryKeys'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Hero } from 'ui/components/hero/Hero'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Flag } from 'ui/svg/icons/Flag'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useOffer } from '../api/useOffer'
import { OfferIconCaptions, OfferPartialDescription } from '../components'

import { useTrackOfferSeenDuration } from './useTrackOfferSeenDuration'

export const OfferBody: FunctionComponent<{
  offerId: number
  onScroll: () => void
}> = ({ offerId, onScroll }) => {
  const { data: offerResponse } = useOffer({ offerId })
  const credit = useAvailableCredit()
  const { isLoggedIn } = useAuthContext()
  const { data: user } = useUserProfileInfo()
  const scrollViewRef = useRef<ScrollView | null>(null)

  const [isReportOfferModalVisible, setIsReportOfferModalVisible] = useState(false)
  const showReportOfferDescription = () => setIsReportOfferModalVisible(true)
  const hideReportOfferDescription = () => setIsReportOfferModalVisible(false)

  useTrackOfferSeenDuration(offerId)

  const { data } = useQuery<UserReportedOffersResponse>(
    QueryKeys.REPORTED_OFFERS,
    () => api.getnativev1offersreports(),
    { enabled: isLoggedIn, retry: true }
  )

  const reportedOffers = data?.reportedOffers
  const isOfferAlreadyReported = reportedOffers?.find((reportedOffer: ReportedOffer) => {
    return reportedOffer.offerId === offerId
  })

  if (!offerResponse) return <React.Fragment></React.Fragment>
  const { accessibility, category, venue } = offerResponse

  const dates = offerResponse.stocks.reduce<Date[]>(
    (accumulator, stock) =>
      stock.beginningDatetime ? [...accumulator, stock.beginningDatetime] : accumulator,
    []
  )
  const formattedDate = formatDatePeriod(dates)
  const shouldDisplayWhenBlock = category.categoryType === CategoryType.Event && !!formattedDate
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
      <Hero imageUrl={offerResponse.image?.url} type="offer" categoryName={category.name || null} />
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

      <SectionWithDivider visible={shouldDisplayWhenBlock} margin={true}>
        <SectionTitle>{t`Quand ?`}</SectionTitle>
        <SectionBody>{formattedDate}</SectionBody>
      </SectionWithDivider>

      <SectionWithDivider visible={!offerResponse.isDigital} margin={true}>
        <WhereSection
          beforeNavigateToItinerary={() => analytics.logConsultItinerary(offerResponse.id, 'offer')}
          venue={venue}
          address={offerResponse.fullAddress}
          locationCoordinates={venue.coordinates}
          showVenueBanner
        />
      </SectionWithDivider>

      <SectionWithDivider visible={!!offerResponse.withdrawalDetails && !!user?.isBeneficiary}>
        <AccordionItem
          title={t`Modalités de retrait`}
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultWithdrawal({ offerId: offerResponse.id })}>
          <Typo.Body>
            {offerResponse.withdrawalDetails && highlightLinks(offerResponse.withdrawalDetails)}
          </Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible={shouldShowAccessibility}>
        <AccordionItem
          title={t`Accessibilité`}
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultAccessibility({ offerId: offerResponse.id })}>
          <AccessibilityBlock {...accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider
        visible={
          !!user && !!credit && (isUserBeneficiary(user) || isUserExBeneficiary(user, credit))
        }
        margin={true}>
        <Spacer.Column numberOfSpaces={7} />
        <SectionBody>
          <ButtonTertiaryBlack
            inline
            title={isOfferAlreadyReported ? t`Tu as déjà signalé cette offre` : t`Signaler l'offre`}
            disabled={!!isOfferAlreadyReported}
            icon={() => <Flag size={24} />}
            onPress={showReportOfferDescription}
            testId={'report-offer-body'}
          />
        </SectionBody>
      </SectionWithDivider>

      <ReportOfferModal
        isVisible={isReportOfferModalVisible}
        dismissModal={hideReportOfferDescription}
        offerId={offerId}
      />
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const Container = styled.ScrollView({ overflow: 'visible' })
const OfferTitle = styled(Typo.Title3)({ textAlign: 'center' })
const SectionTitle = styled(Typo.Title4)({ paddingVertical: getSpacing(6) })
const SectionBody = styled(Typo.Body)({ marginTop: -getSpacing(2), paddingBottom: getSpacing(6) })

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
