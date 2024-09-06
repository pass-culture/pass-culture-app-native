import React, { ComponentProps, FunctionComponent, useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BookingCancellationReasons, PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { BookingItemTitle } from 'features/bookings/components/BookingItemTitle'
import { isEligibleBookingsForArchive } from 'features/bookings/helpers/expirationDateUtils'
import { BookingItemProps } from 'features/bookings/types'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useIconFactory } from 'ui/components/icons/useIconFactory'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Pastille } from 'ui/svg/icons/Pastille'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Valid } from 'ui/svg/icons/Valid'
import { Wrong } from 'ui/svg/icons/Wrong'
import { getSpacing, Spacer, Typo } from 'ui/theme'

function withSmallBadge<P extends object>(Component: FunctionComponent<P>) {
  return function ComponentWithSmallBadge(props: P) {
    return (
      <View>
        <Component {...props} />
        <SmallBadge />
      </View>
    )
  }
}

const SmallBadgedButton = withSmallBadge<ComponentProps<typeof RoundedButton>>(RoundedButton)

export const EndedBookingItem = ({ booking, onSaveReaction }: BookingItemProps) => {
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking
  const subcategoriesMapping = useSubcategoriesMapping()
  const subCategory = subcategoriesMapping[stock.offer.subcategoryId]

  const prePopulateOffer = usePrePopulateOffer()
  const netInfo = useNetInfoContext()
  const { showErrorSnackBar } = useSnackBarContext()
  const iconFactory = useIconFactory()
  const shouldDisplayReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { reactionCategories } = useRemoteConfigContext()

  const [userReaction, setUserReaction] = useState<ReactionTypeEnum | null | undefined>(
    booking.userReaction
  )

  const isEligibleBookingsForArchiveValue = isEligibleBookingsForArchive(booking)

  const shouldRedirectToBooking = isEligibleBookingsForArchiveValue && !cancellationReason

  const endedBookingReason = getEndedBookingReason(
    cancellationReason,
    dateUsed,
    isEligibleBookingsForArchiveValue
  )
  const endedBookingDateLabel = getEndedBookingDateLabel(cancellationDate, dateUsed)

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.BOOKING, {
    name: stock.offer.name,
    dateUsed: dateUsed ? formatToSlashedFrenchDate(dateUsed) : undefined,
    cancellationDate: cancellationDate ? formatToSlashedFrenchDate(cancellationDate) : undefined,
  })

  const ReactionLikeIcon = useMemo(
    () =>
      styled(iconFactory.getIcon('like-filled')).attrs(({ theme }) => ({
        color: theme.colors.primary,
      }))``,
    [iconFactory]
  )

  const ReactionDislikeIcon = useMemo(
    () =>
      styled(iconFactory.getIcon('dislike-filled')).attrs(({ theme }) => ({
        color: theme.colors.black,
      }))``,
    [iconFactory]
  )

  const getCustomReactionIcon = useCallback(
    (reaction?: ReactionTypeEnum | null): React.FC<AccessibleIcon> => {
      switch (reaction) {
        case ReactionTypeEnum.LIKE:
          return ReactionLikeIcon
        case ReactionTypeEnum.DISLIKE:
          return ReactionDislikeIcon
        default:
          return iconFactory.getIcon('like')
      }
    },
    [iconFactory, ReactionLikeIcon, ReactionDislikeIcon]
  )

  function handlePressOffer() {
    const { offer } = stock
    if (!offer.id) return
    if (isEligibleBookingsForArchiveValue) return
    if (netInfo.isConnected) {
      // We pre-populate the query-cache with the data from the search result for a smooth transition
      prePopulateOffer({
        ...offer,
        categoryId: subCategory.categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })

      analytics.logConsultOffer({ offerId: offer.id, from: 'endedbookings' })
    } else {
      showErrorSnackBar({
        message:
          'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  const {
    visible: reactionModalVisible,
    showModal: showReactionModal,
    hideModal: hideReactionModal,
  } = useModal(false)

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { share: shareOffer, shareContent } = getShareOffer({
    offer: stock.offer,
    utmMedium: 'ended_booking',
  })

  const handleSaveReaction = async ({ offerId, reactionType }: PostReactionRequest) => {
    await onSaveReaction?.({ offerId, reactionType })
    setUserReaction(reactionType)
    hideReactionModal()
  }

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'endedbookings', offerId: stock.offer.id })
    shareOffer()
    showShareOfferModal()
  }, [stock.offer.id, shareOffer, showShareOfferModal])

  const getReactionButtonAccessibilityLabel = (reaction?: ReactionTypeEnum | null) => {
    const additionalInfoMap: Record<ReactionTypeEnum, string> = {
      LIKE: '(tu as liké)',
      DISLIKE: '(tu as disliké)',
      NO_REACTION: '(tu n’as pas souhaité réagir)',
    }

    return ['Réagis à ta réservation']
      .concat(reaction ? [additionalInfoMap[reaction]] : [])
      .join(' ')
  }

  const canReact =
    shouldDisplayReactionFeature &&
    reactionCategories.categories.includes(subCategory.nativeCategoryId) &&
    !cancellationDate

  const ReactionButton = userReaction === null ? SmallBadgedButton : RoundedButton

  return (
    <Container>
      <ContentContainer
        enableNavigate={!!netInfo.isConnected}
        navigateTo={
          shouldRedirectToBooking
            ? { screen: 'BookingDetails', params: { id: booking.id } }
            : { screen: 'Offer', params: { id: stock.offer.id, from: 'endedbookings' } }
        }
        onBeforeNavigate={handlePressOffer}
        accessibilityLabel={accessibilityLabel}>
        <OfferImage imageUrl={stock.offer.image?.url} categoryId={subCategory.categoryId} />
        <Spacer.Row numberOfSpaces={4} />
        <AttributesView>
          <BookingItemTitle title={stock.offer.name} />
          <EndedReasonAndDate>
            {endedBookingReason}
            <Spacer.Row numberOfSpaces={1} />
            <Typo.CaptionNeutralInfo>{endedBookingDateLabel}</Typo.CaptionNeutralInfo>
          </EndedReasonAndDate>
        </AttributesView>
      </ContentContainer>
      <ViewGap gap={4}>
        <ShareContainer>
          <RoundedButton
            iconName="share"
            onPress={pressShareOffer}
            accessibilityLabel={`Partager l’offre ${stock.offer.name}`}
          />
        </ShareContainer>
        {canReact ? (
          <ReactionContainer>
            <ReactionButton
              iconName="like"
              Icon={getCustomReactionIcon(userReaction)}
              onPress={showReactionModal}
              accessibilityLabel={getReactionButtonAccessibilityLabel(userReaction)}
            />
          </ReactionContainer>
        ) : null}
      </ViewGap>
      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
      {shouldDisplayReactionFeature ? (
        <ReactionChoiceModal
          offer={booking.stock.offer}
          dateUsed={endedBookingDateLabel ?? ''}
          closeModal={hideReactionModal}
          visible={reactionModalVisible}
          defaultReaction={userReaction}
          onSave={handleSaveReaction}
        />
      ) : null}
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const ContentContainer = styled(InternalTouchableLink)(({ theme }) => ({
  flexDirection: 'row',
  paddingRight: theme.buttons.roundedButton.size,
  flex: 1,
}))

const AttributesView = styled.View({
  flex: 1,
  paddingRight: getSpacing(1),
})

const EndedReasonAndDate = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
})

function getEndedBookingReason(
  cancellationReason?: BookingCancellationReasons | null,
  dateUsed?: string | null,
  isEligibleBookingsForArchiveValue?: boolean
) {
  if (dateUsed) {
    return <StyledInputRule title="Réservation utilisée" icon={Valid} type="Valid" noFullWidth />
  }

  if (cancellationReason === BookingCancellationReasons.OFFERER) {
    return <StyledInputRule title="Annulée" icon={Wrong} type="Error" noFullWidth />
  }

  if (!!isEligibleBookingsForArchiveValue && !cancellationReason) {
    return <StyledInputRule title="Réservation archivée" icon={Valid} type="Valid" noFullWidth />
  }

  return <StyledInputRule title="Réservation annulée" icon={Wrong} type="Error" noFullWidth />
}

function getEndedBookingDateLabel(cancellationDate?: string | null, dateUsed?: string | null) {
  const endDate = dateUsed ?? cancellationDate
  if (endDate) return `le ${formatToSlashedFrenchDate(endDate)}`
  return null
}

const StyledInputRule = styled(InputRule).attrs(({ theme }) => ({
  iconSize: theme.icons.sizes.smaller,
}))``

const ShareContainer = styled.View(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
}))

const ReactionContainer = styled.View(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
}))

const SmallBadge = styled(Pastille).attrs(({ theme }) => ({
  color: theme.colors.primary,
  width: 8,
  height: 8,
  testID: 'smallBadge',
}))({
  position: 'absolute',
  top: 2,
  right: 2,
})
