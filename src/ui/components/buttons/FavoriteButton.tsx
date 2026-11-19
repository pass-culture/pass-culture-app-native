import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { FavoriteAuthModal } from 'features/offer/components/FavoriteAuthModal/FavoriteAuthModal'
import { ArtistFavoriteProps, OfferFavoriteProps, VenueFavoriteProps } from 'features/offer/types'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'
import { AnimatedFavoriteIcon, FavoriteAnimationAction } from 'ui/components/AnimatedFavoriteIcon'
import { useModal } from 'ui/components/modals/useModal'
import { Button } from 'ui/designSystem/Button/Button'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type FavoriteButtonProps =
  | ({ offerId: number; artistId?: never; venueId?: never } & OfferFavoriteProps)
  | ({ artistId: string; offerId?: never; venueId?: never } & ArtistFavoriteProps)
  | ({ venueId: number; offerId?: never; artistId?: never } & VenueFavoriteProps)

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  offerId,
  artistId,
  venueId,
  favorite,
  addFavorite,
  removeFavorite,
  isAddFavoriteLoading,
  isRemoveFavoriteLoading,
}) => {
  const { isLoggedIn } = useAuthContext()
  const {
    visible: signInModalVisible,
    showModal: showSignInModal,
    hideModal: hideSignInModal,
  } = useModal(false)

  const [prevFavoriteProp, setPrevFavoriteProp] = useState(favorite)
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(null)
  const [animatingAction, setAnimatingAction] = useState<FavoriteAnimationAction>(null)

  if (favorite !== prevFavoriteProp) {
    setPrevFavoriteProp(favorite)
    setOptimisticFavorite(null)
  }

  const isFavorited = optimisticFavorite ?? !!favorite
  const isAnimating = animatingAction !== null
  const isPurple = isFavorited || isAnimating
  const isRemoveSource = animatingAction ? animatingAction === 'remove' : isFavorited

  const handleAnimationFinish = useCallback(() => {
    setAnimatingAction(null)
  }, [])

  const pressFavorite = useCallback(() => {
    if (!isLoggedIn) {
      showSignInModal()
      return
    }
    if (isAnimating) return

    if (isFavorited) {
      setOptimisticFavorite(false)
      setAnimatingAction('remove')
      if (favorite) removeFavorite(favorite.id)
    } else {
      setOptimisticFavorite(true)
      setAnimatingAction('add')
      if (artistId) addFavorite?.({ artistId })
      else if (offerId) addFavorite?.({ offerId })
      else if (venueId) addFavorite?.({ venueId })
    }
  }, [
    addFavorite,
    artistId,
    favorite,
    isAnimating,
    isFavorited,
    isLoggedIn,
    offerId,
    removeFavorite,
    showSignInModal,
    venueId,
  ])

  const renderFavoriteIcon: React.FC<AccessibleIcon> = useCallback(
    () => (
      <AnimatedFavoriteIcon
        isFavorited={isFavorited}
        isPurple={isPurple}
        isRemoveSource={isRemoveSource}
        animatingAction={animatingAction}
        onAnimationFinish={handleAnimationFinish}
      />
    ),
    [animatingAction, handleAnimationFinish, isFavorited, isPurple, isRemoveSource]
  )

  const accessibilityLabel = isFavorited ? 'Retirer des favoris' : 'Mettre en favori'
  const checkboxProps = accessibleCheckboxProps({ checked: isFavorited, label: accessibilityLabel })

  return (
    <React.Fragment>
      <Button
        iconButton
        variant="secondary"
        color={isPurple ? 'brand' : 'neutral'}
        icon={renderFavoriteIcon}
        onPress={pressFavorite}
        disabled={isRemoveFavoriteLoading || isAddFavoriteLoading || isAnimating}
        {...checkboxProps}
        accessibilityLabel={checkboxProps.accessibilityLabel ?? accessibilityLabel}
      />
      {/*  TODO(PC-35063): Fix this dirty style hack by removing this modal outside the button ! */}
      <ModalWrapper>
        <FavoriteAuthModal
          visible={signInModalVisible}
          offerId={offerId}
          artistId={artistId}
          venueId={venueId}
          dismissModal={hideSignInModal}
        />
      </ModalWrapper>
    </React.Fragment>
  )
}

const ModalWrapper = styled.View({
  position: 'absolute',
})
