import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { CategoryType, ReportedOffer, UserReportedOffersResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { OfferHero } from 'features/offer/components/OfferHero'
import { ReportOfferDescriptionModal } from 'features/offer/components/ReportOfferDescriptionModal'
import { ReportOfferOtherReasonModal } from 'features/offer/components/ReportOfferOtherReasonModal'
import { ReportOfferReasonModal } from 'features/offer/components/ReportOfferReasonModal'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { formatDatePeriod } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { QueryKeys } from 'libs/queryKeys'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { useModalNavigation } from 'ui/components/modals/useModalNavigation'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Flag } from 'ui/svg/icons/Flag'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useOffer } from '../api/useOffer'
import { OfferIconCaptions, AccessibilityBlock, OfferPartialDescription } from '../components'

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
  const {
    visible: isReportDescriptionVisible,
    showModal: showReportDescription,
    hideModal: hideReportDescription,
  } = useModal(false)

  const {
    visible: isReportReasonVisible,
    showModal: showReportReason,
    hideModal: hideReportReason,
  } = useModal(false)

  const {
    visible: isReportOtherReasonVisible,
    showModal: showReportOtherReason,
    hideModal: hideReportOtherReason,
  } = useModal(false)

  useTrackOfferSeenDuration(offerId)

  const navigateToReportReason = useModalNavigation(hideReportDescription, showReportReason)
  const goBackToReportDescription = useModalNavigation(hideReportReason, showReportDescription)
  const navigateToReportOtherReason = useModalNavigation(hideReportReason, showReportOtherReason)
  const goBackToReportReason = useModalNavigation(hideReportOtherReason, showReportReason)

  const { data } = useQuery<UserReportedOffersResponse>(
    QueryKeys.REPORTED_OFFERS,
    () => api.getnativev1offersreports(),
    { enabled: isLoggedIn }
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

      <SectionWithDivider visible={shouldDisplayWhenBlock} margin={true}>
        <SectionTitle>{t`Quand ?`}</SectionTitle>
        <SectionBody>{formattedDate}</SectionBody>
      </SectionWithDivider>

      <SectionWithDivider visible={!offerResponse.isDigital} margin={true}>
        <WhereSection
          address={offerResponse.fullAddress}
          locationCoordinates={venue.coordinates}
          beforeNavigateToItinerary={() => analytics.logConsultItinerary(offerResponse.id, 'offer')}
        />
      </SectionWithDivider>

      <SectionWithDivider visible={!!offerResponse.withdrawalDetails && !!user?.isBeneficiary}>
        <AccordionItem
          title={t`Modalités de retrait`}
          onOpenOnce={() => analytics.logConsultWithdrawal(offerResponse.id)}>
          <Typo.Body>
            {offerResponse.withdrawalDetails && highlightLinks(offerResponse.withdrawalDetails)}
          </Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider
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
            onPress={showReportDescription}
          />
        </SectionBody>
      </SectionWithDivider>

      {/* TODO(anoukhello) use one modal for the entire report process (see bookoffer process)*/}
      <ReportOfferDescriptionModal
        isVisible={isReportDescriptionVisible}
        dismissModal={hideReportDescription}
        onPressReportOffer={navigateToReportReason}
      />
      <ReportOfferReasonModal
        isVisible={isReportReasonVisible}
        dismissModal={hideReportReason}
        onGoBack={goBackToReportDescription}
        onPressOtherReason={navigateToReportOtherReason}
        offerId={offerId}
      />
      <ReportOfferOtherReasonModal
        isVisible={isReportOtherReasonVisible}
        dismissModal={hideReportOtherReason}
        onGoBack={goBackToReportReason}
        offerId={offerId}
      />
    </Container>
  )
}

const Container = styled.ScrollView({ overflow: 'visible' })
const OfferTitle = styled(Typo.Title3)({ textAlign: 'center' })
const SectionTitle = styled(Typo.Title4)({ paddingVertical: getSpacing(6) })
const SectionBody = styled(Typo.Body)({ marginTop: -getSpacing(2), paddingBottom: getSpacing(6) })

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
