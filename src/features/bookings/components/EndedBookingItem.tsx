import React from 'react'
import { View } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { BookingCancellationReasons } from 'api/gen'
import { BookingItemProps } from 'features/bookings/types'
import { mergeOfferData } from 'features/offer/atoms/OfferTile'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { useCategoryId } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Check } from 'ui/svg/icons/Check'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { BookingItemTitle } from './BookingItemTitle'

export const EndedBookingItem = ({ booking }: BookingItemProps) => {
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking
  const categoryId = useCategoryId(stock.offer.subcategoryId)
  const queryClient = useQueryClient()
  const netInfo = useNetInfoContext()
  const { showErrorSnackBar } = useSnackBarContext()

  const endedBookingReason = getEndedBookingReason(cancellationReason, dateUsed)
  const endedBookingDateLabel = getEndedBookingDateLabel(cancellationDate, dateUsed)

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.BOOKING, {
    name: stock.offer.name,
    dateUsed: dateUsed ? formatToSlashedFrenchDate(dateUsed) : undefined,
    cancellationDate: cancellationDate ? formatToSlashedFrenchDate(cancellationDate) : undefined,
  })

  function handlePressOffer() {
    const { offer } = stock
    if (!offer.id) return
    if (netInfo.isConnected) {
      // We pre-populate the query-cache with the data from the search result for a smooth transition
      queryClient.setQueryData(
        [QueryKeys.OFFER, offer.id],
        mergeOfferData({
          ...offer,
          categoryId,
          thumbUrl: offer.image?.url,
          name: offer.name,
          offerId: offer.id,
        })
      )
      analytics.logConsultOffer({ offerId: offer.id, from: 'endedbookings' })
    } else {
      showErrorSnackBar({
        message:
          "Impossible d'afficher le détail de l'offre. Connecte-toi à internet avant de réessayer.",
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <TouchableLink
        enableNavigate={!!netInfo.isConnected}
        navigateTo={{ screen: 'Offer', params: { id: stock.offer.id, from: 'endedbookings' } }}
        onBeforeNavigate={handlePressOffer}
        accessibilityLabel={accessibilityLabel}
        testID="EndedBookingItem">
        <ItemContainer>
          <OfferImage imageUrl={stock.offer.image?.url} categoryId={categoryId} />
          <Spacer.Row numberOfSpaces={4} />
          <AttributesView>
            <BookingItemTitle title={stock.offer.name} />
            <EndedReasonAndDate>
              {endedBookingReason}
              <Spacer.Row numberOfSpaces={1} />
              <Typo.CaptionNeutralInfo>{endedBookingDateLabel}</Typo.CaptionNeutralInfo>
            </EndedReasonAndDate>
          </AttributesView>
        </ItemContainer>
      </TouchableLink>
    </View>
  )
}

const AttributesView = styled.View({
  flex: 1,
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(1),
})

const ItemContainer = styled.View({
  flexDirection: 'row',
})

const EndedReasonAndDate = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  flex: 1,
  alignItems: 'center',
})

function getEndedBookingReason(
  cancellationReason?: BookingCancellationReasons | null,
  dateUsed?: string | null
) {
  if (dateUsed) return <StyledInputRule title="Utilisé" icon={Check} isValid />

  if (cancellationReason === BookingCancellationReasons.OFFERER)
    return <StyledInputRule title="Annulé" icon={Check} isValid={false} />

  return <StyledInputRule title="Réservation annulée" icon={Check} isValid={false} />
}

function getEndedBookingDateLabel(cancellationDate?: string | null, dateUsed?: string | null) {
  const endDate = dateUsed ?? cancellationDate
  if (endDate) return `le ${formatToSlashedFrenchDate(endDate)}`
  return null
}

const StyledInputRule = styled(InputRule).attrs(({ theme }) => ({
  iconSize: theme.icons.sizes.smaller,
}))``
