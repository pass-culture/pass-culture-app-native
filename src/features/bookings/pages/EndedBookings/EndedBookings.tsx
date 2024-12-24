import React, { FunctionComponent, useCallback, useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled from 'styled-components/native'

import {
  BookingOfferResponse,
  PostOneReactionRequest,
  PostReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { EndedBookingItem } from 'features/bookings/components/EndedBookingItem'
import { NoBookingsView } from 'features/bookings/components/NoBookingsView'
import { getEndedBookingDateLabel } from 'features/bookings/helpers/getEndedBookingDateLabel/getEndedBookingDateLabel'
import { Booking } from 'features/bookings/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { plural } from 'libs/plural'
import { ShareContent } from 'libs/share/types'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT_V2 } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const keyExtractor: (item: Booking) => string = (item) => item.id.toString()

export const EndedBookings: FunctionComponent = () => {
  const enableBookingImprove = useFeatureFlag(RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE)
  const shouldDisplayReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { data: bookings } = useBookings()
  const { goBack } = useGoBack(...getTabNavConfig('Bookings'))
  const headerHeight = useGetHeaderHeight()
  const { mutate: addReaction } = useReactionMutation()

  const [selectedBookingOffer, setSelectedBookingOffer] = useState<BookingOfferResponse>()
  const [selectedBookingOfferEndedDateLabel, setSelectedBookingOfferEndedDateLabel] =
    useState<string>('')
  const [shareContent, setShareContent] = useState<ShareContent | null>()
  const [userReaction, setUserReaction] = useState<ReactionTypeEnum | null>()

  const {
    visible: reactionModalVisible,
    showModal: showReactionModal,
    hideModal: hideReactionModal,
  } = useModal(false)

  const {
    visible: shareModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const endedBookingsCount = bookings?.ended_bookings?.length ?? 0
  const endedBookingsLabel = plural(endedBookingsCount, {
    singular: '# réservation terminée',
    plural: '# réservations terminées',
  })

  const openReactionModal = useCallback(
    (booking: Booking) => {
      setSelectedBookingOffer(booking.stock.offer)
      setUserReaction(booking.userReaction)

      const endedBookingDateLabel =
        getEndedBookingDateLabel(booking.cancellationDate, booking.dateUsed) ?? ''
      setSelectedBookingOfferEndedDateLabel(endedBookingDateLabel)

      showReactionModal()
    },
    [showReactionModal]
  )

  const closeReactionModal = useCallback(() => {
    setSelectedBookingOffer(undefined)
    setUserReaction(undefined)
    hideReactionModal()
  }, [hideReactionModal])

  const openShareModal = useCallback(
    (shareContent: ShareContent | null) => {
      setShareContent(shareContent)
      showShareOfferModal()
    },
    [showShareOfferModal]
  )

  const closeShareModal = useCallback(() => {
    setShareContent(undefined)
    hideShareOfferModal()
  }, [hideShareOfferModal])

  const onSaveReaction = useCallback(
    ({ offerId, reactionType }: PostOneReactionRequest) => {
      const reactionRequest: PostReactionRequest = {
        reactions: [{ offerId, reactionType }],
      }
      addReaction(reactionRequest)
      return Promise.resolve(true)
    },
    [addReaction]
  )

  const handleSaveReaction = useCallback(
    async ({ offerId, reactionType }: PostOneReactionRequest) => {
      await onSaveReaction?.({ offerId, reactionType })
      hideReactionModal()
    },
    [hideReactionModal, onSaveReaction]
  )

  const renderItem: ListRenderItem<Booking> = useCallback(
    ({ item }) => {
      return (
        <EndedBookingItem
          booking={item}
          handleShowReactionModal={openReactionModal}
          handleShowShareOfferModal={openShareModal}
        />
      )
    },
    [openReactionModal, openShareModal]
  )

  const ListHeaderComponent = useCallback(
    () => (
      <React.Fragment>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={6} />
        <EndedBookingsCount>{endedBookingsLabel}</EndedBookingsCount>
      </React.Fragment>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endedBookingsCount]
  )

  return (
    <React.Fragment>
      {enableBookingImprove ? (
        <FlatList
          listAs="ul"
          itemAs="li"
          contentContainerStyle={contentContainerStyle}
          data={bookings?.ended_bookings ?? []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={StyledSeparator}
          ListHeaderComponent={endedBookingsCount ? <Spacer.Column numberOfSpaces={6} /> : null}
          ListEmptyComponent={<NoBookingsView />}
        />
      ) : (
        <React.Fragment>
          <PageHeaderWithoutPlaceholder title="Réservations terminées" onGoBack={goBack} />
          <FlatList
            listAs="ul"
            itemAs="li"
            contentContainerStyle={contentContainerStyle}
            data={bookings?.ended_bookings ?? []}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={StyledSeparator}
            ListHeaderComponent={ListHeaderComponent}
          />
          <BlurHeader height={headerHeight} />
        </React.Fragment>
      )}
      {shareContent ? (
        <WebShareModal
          visible={shareModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={closeShareModal}
        />
      ) : null}
      {shouldDisplayReactionFeature && selectedBookingOffer ? (
        <ReactionChoiceModal
          offer={selectedBookingOffer}
          dateUsed={selectedBookingOfferEndedDateLabel}
          closeModal={closeReactionModal}
          visible={reactionModalVisible}
          defaultReaction={userReaction}
          onSave={handleSaveReaction}
          from={ReactionFromEnum.ENDED_BOOKING}
          bodyType={ReactionChoiceModalBodyEnum.VALIDATION}
        />
      ) : null}
    </React.Fragment>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const EndedBookingsCount = styled(Typo.Body).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
  paddingBottom: getSpacing(5.5),
}))

const contentContainerStyle = {
  flexGrow: 1,
  paddingHorizontal: getSpacing(5),
  paddingBottom: TAB_BAR_COMP_HEIGHT_V2 + getSpacing(8),
}

const StyledSeparator = styled(Separator.Horizontal)({ marginVertical: getSpacing(4) })
