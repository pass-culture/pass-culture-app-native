import React, { FunctionComponent, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteVenueResponse } from 'api/gen'
import { FavoriteArtistVenue } from 'features/favorites/components/FavoriteArtistVenue'
import { FavoriteType } from 'features/favorites/enum'
import { getShareVenue } from 'features/share/helpers/getShareVenue'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { useRemoveVenueFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { useModal } from 'ui/components/modals/useModal'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type Props = { favorite: FavoriteVenueResponse }

export const FavoriteVenue: FunctionComponent<Props> = ({ favorite }) => {
  const { venue } = favorite
  const { designSystem } = useTheme()

  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveVenueFavoriteMutation({
    onSuccess: () => {
      void analytics.logRemoveItemFromFavorite({
        id: venue.id.toString(),
        type: FavoriteType.VENUE,
        from: 'favorites',
      })
    },
    onError: () => {
      showErrorSnackBar('Le lieu n’a pas été retiré de tes favoris')
    },
  })

  const { share: shareVenue, shareContent } = getShareVenue({ venue, utmMedium: 'favorite' })
  const {
    visible: shareModalVisible,
    showModal: showShareModal,
    hideModal: hideShareModal,
  } = useModal(false)

  const onSharePress = useCallback(() => {
    void analytics.logShare({ type: 'Venue', from: 'favorites', venueId: venue.id })
    void shareVenue()
    showShareModal()
  }, [venue.id, shareVenue, showShareModal])

  const onItemPress = useCallback(() => {
    void analytics.logConsultVenue({ venueId: venue.id.toString(), from: 'favorites' })
  }, [venue.id])

  return (
    <React.Fragment>
      <FavoriteArtistVenue
        favorite={favorite}
        title={venue.name}
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        isRemoving={isRemoving}
        onRemove={() => removeFavorite(favorite.id)}
        onSharePress={onSharePress}
        onPress={onItemPress}
        shareAccessibilityLabel={`Partager le lieu ${venue.name}`}
        thumbnailComponent={
          venue.image ? (
            <VenueThumbnail
              url={venue.image}
              height={designSystem.size.image['2xs']}
              width={designSystem.size.image['2xs']}
              testID="VenuePreviewImage"
            />
          ) : null
        }
      />
      {shareContent ? (
        <WebShareModal
          visible={shareModalVisible}
          headerTitle="Partager le lieu"
          shareContent={shareContent}
          dismissModal={hideShareModal}
        />
      ) : null}
    </React.Fragment>
  )
}

const VenueThumbnail = styled(Image)<{ height: number; width: number }>(
  ({ theme, height, width }) => ({
    borderRadius: theme.designSystem.size.borderRadius.s,
    height,
    width,
    borderColor: theme.designSystem.color.border.subtle,
    borderWidth: 1,
  })
)
