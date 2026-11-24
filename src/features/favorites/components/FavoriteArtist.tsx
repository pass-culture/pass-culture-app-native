import React, { FunctionComponent, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteArtistResponse } from 'api/gen'
import { FavoriteArtistVenue } from 'features/favorites/components/FavoriteArtistVenue'
import { FavoriteType } from 'features/favorites/enum'
import { getShareArtist } from 'features/share/helpers/getShareArtist'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { useRemoveArtistFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { useModal } from 'ui/components/modals/useModal'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type Props = { favorite: FavoriteArtistResponse }

export const FavoriteArtist: FunctionComponent<Props> = ({ favorite }) => {
  const { artist } = favorite
  const { designSystem } = useTheme()

  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveArtistFavoriteMutation({
    onSuccess: () => {
      void analytics.logRemoveItemFromFavorite({
        id: artist.id,
        type: FavoriteType.ARTIST,
        from: 'favorites',
      })
    },
    onError: () => {
      showErrorSnackBar('L’artiste n’a pas été retiré de tes favoris')
    },
  })

  const { share: shareArtist, shareContent } = getShareArtist({
    artist,
    utmMedium: 'favorite',
  })
  const {
    visible: shareModalVisible,
    showModal: showShareModal,
    hideModal: hideShareModal,
  } = useModal(false)

  const onSharePress = useCallback(() => {
    void analytics.logShare({
      type: 'Artist',
      from: 'favorites',
      artistId: artist.id,
      artistName: artist.name,
    })
    void shareArtist()
    showShareModal()
  }, [artist.id, artist.name, shareArtist, showShareModal])

  const onItemPress = useCallback(() => {
    void analytics.logConsultArtist({
      artistId: artist.id,
      artistName: artist.name,
      from: 'favorites',
    })
  }, [artist.id, artist.name])

  return (
    <React.Fragment>
      <FavoriteArtistVenue
        favorite={favorite}
        title={artist.name}
        navigateTo={{ screen: 'Artist', params: { id: artist.id } }}
        isRemoving={isRemoving}
        onRemove={() => removeFavorite(favorite.id)}
        onSharePress={onSharePress}
        onPress={onItemPress}
        shareAccessibilityLabel={`Partager l’artiste ${artist.name}`}
        thumbnailComponent={
          <Avatar
            size={designSystem.size.image['2xs']}
            rounded={false}
            borderRadius={designSystem.size.borderRadius.pill}>
            {artist.image ? (
              <ArtistImage url={artist.image} testID="ArtistImage" />
            ) : (
              <DefaultAvatar testID="defaultArtistAvatar" />
            )}
          </Avatar>
        }
      />
      {shareContent ? (
        <WebShareModal
          visible={shareModalVisible}
          headerTitle="Partager l’artiste"
          shareContent={shareContent}
          dismissModal={hideShareModal}
        />
      ) : null}
    </React.Fragment>
  )
}

const ArtistImage = styled(FastImage)(({ theme }) => ({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
  borderWidth: 1,
  borderColor: theme.designSystem.color.border.subtle,
}))
