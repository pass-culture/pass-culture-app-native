import { UseQueryResult } from '@tanstack/react-query'
import React, { FunctionComponent, useCallback, useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  BookingListItemOfferResponse,
  BookingListItemResponse,
  BookingsListResponseV2,
  PostOneReactionRequest,
  PostReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import { EndedBookingItem } from 'features/bookings/components/EndedBookingItem'
import { EndedBookingListItemWrapper } from 'features/bookings/components/EndedBookingListItemWrapper'
import { NoBookingsView } from 'features/bookings/components/NoBookingsView'
import { getEndedBookingDateLabel } from 'features/bookings/helpers/getEndedBookingDateLabel/getEndedBookingDateLabel'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ShareContent } from 'libs/share/types'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT_V2 } from 'ui/theme/constants'

const keyExtractor: (item: BookingListItemResponse) => string = (item) => item.id.toString()

type Props = {
  useEndedBookingsQuery: () => UseQueryResult<BookingsListResponseV2, Error>
}

export const EndedBookings: FunctionComponent<Props> = ({ useEndedBookingsQuery }) => {
  const enableNewBookings = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_BOOKINGS_ENDED_ONGOING)
  const { designSystem } = useTheme()
  const { data: bookings = { bookings: [] } } = useEndedBookingsQuery()

  const { bookings: endedBookings } = bookings

  const { mutateAsync: addReaction } = useReactionMutation()

  const [selectedBookingOffer, setSelectedBookingOffer] = useState<BookingListItemOfferResponse>()
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

  const hasEndedBookings = endedBookings.length > 0

  const openReactionModal = useCallback(
    (booking: BookingListItemResponse) => {
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

  const renderItem: ListRenderItem<BookingListItemResponse> = useCallback(
    ({ item }) => {
      return enableNewBookings ? (
        <EndedBookingListItemWrapper booking={item} />
      ) : (
        <EndedBookingItem
          booking={item}
          handleShowReactionModal={openReactionModal}
          handleShowShareOfferModal={openShareModal}
        />
      )
    },
    [openReactionModal, openShareModal, enableNewBookings]
  )

  return (
    <React.Fragment>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: designSystem.size.spacing.xl,
          ...contentContainerStyle,
        }}
        data={endedBookings ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={enableNewBookings ? null : StyledSeparator}
        ListHeaderComponent={hasEndedBookings ? <Spacer.Column numberOfSpaces={6} /> : null}
        ListEmptyComponent={<NoBookingsView />}
      />

      {shareContent ? (
        <WebShareModal
          visible={shareModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={closeShareModal}
        />
      ) : null}
      {selectedBookingOffer ? (
        <ReactionChoiceModal
          offerId={selectedBookingOffer?.id}
          offerName={selectedBookingOffer?.name}
          imageUrl={selectedBookingOffer?.imageUrl ?? ''}
          subcategoryId={selectedBookingOffer?.subcategoryId}
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

const contentContainerStyle = {
  flexGrow: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT_V2 + getSpacing(8),
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
