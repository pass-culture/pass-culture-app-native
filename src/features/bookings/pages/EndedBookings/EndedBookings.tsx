import React, { FunctionComponent, useCallback, useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled from 'styled-components/native'

import {
  BookingOfferResponseV2,
  BookingResponse,
  PostOneReactionRequest,
  PostReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { EndedBookingItem } from 'features/bookings/components/EndedBookingItem'
import { NoBookingsView } from 'features/bookings/components/NoBookingsView'
import { getEndedBookingDateLabel } from 'features/bookings/helpers/getEndedBookingDateLabel/getEndedBookingDateLabel'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ShareContent } from 'libs/share/types'
import { useBookingsV2WithConvertedTimezoneQuery } from 'queries/bookings/useBookingsQuery'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT_V2 } from 'ui/theme/constants'

const keyExtractor: (item: BookingResponse) => string = (item) => item.id.toString()

export const EndedBookings: FunctionComponent = () => {
  const { isLoggedIn } = useAuthContext()

  const shouldDisplayReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { data: bookings } = useBookingsV2WithConvertedTimezoneQuery(isLoggedIn)

  const { mutate: addReaction } = useReactionMutation()

  const [selectedBookingOffer, setSelectedBookingOffer] = useState<BookingOfferResponseV2>()
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

  const endedBookingsCount = bookings?.endedBookings?.length ?? 0

  const openReactionModal = useCallback(
    (booking: BookingResponse) => {
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

  const renderItem: ListRenderItem<BookingResponse> = useCallback(
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

  return (
    <React.Fragment>
      <FlatList
        contentContainerStyle={contentContainerStyle}
        data={bookings?.endedBookings ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={StyledSeparator}
        ListHeaderComponent={endedBookingsCount ? <Spacer.Column numberOfSpaces={6} /> : null}
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

const contentContainerStyle = {
  flexGrow: 1,
  paddingHorizontal: getSpacing(5),
  paddingBottom: TAB_BAR_COMP_HEIGHT_V2 + getSpacing(8),
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
