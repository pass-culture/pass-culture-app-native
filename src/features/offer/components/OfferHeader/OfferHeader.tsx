import React, { useCallback } from 'react'
import { Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteResponse, OfferResponseV2 } from 'api/gen'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Spacer } from 'ui/theme'

export type FavoriteProps = {
  addFavorite: ({ offerId }: { offerId: number }) => void
  isAddFavoriteLoading: boolean
  removeFavorite: (id: number) => void
  isRemoveFavoriteLoading: boolean
  favorite?: FavoriteResponse | null
}

type OfferHeaderProps = {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
  offer: OfferResponseV2
} & FavoriteProps

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export function OfferHeader({
  headerTransition,
  title,
  offer,
  addFavorite,
  isAddFavoriteLoading,
  removeFavorite,
  isRemoveFavoriteLoading,
  favorite,
}: Readonly<OfferHeaderProps>) {
  const theme = useTheme()

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))

  const { share: shareOffer, shareContent } = getShareOffer({
    offer,
    utmMedium: 'header',
  })

  const { animationState } = getAnimationState(theme, headerTransition)

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'offer', offerId: offer.id })
    shareOffer()
    showShareOfferModal()
  }, [offer.id, shareOffer, showShareOfferModal])

  return (
    <React.Fragment>
      <ContentHeader
        headerTitle={title}
        headerTransition={headerTransition}
        titleTestID="offerHeaderName"
        onBackPress={goBack}
        LeftElement={<Spacer.Row numberOfSpaces={13} />}
        RightElement={
          <ButtonsWrapper gap={3}>
            <RoundedButton
              animationState={animationState}
              iconName="share"
              onPress={pressShareOffer}
              accessibilityLabel="Partager"
              finalColor={theme.colors.black}
            />
            <FavoriteButton
              animationState={animationState}
              offerId={offer.id}
              addFavorite={addFavorite}
              isAddFavoriteLoading={isAddFavoriteLoading}
              removeFavorite={removeFavorite}
              isRemoveFavoriteLoading={isRemoveFavoriteLoading}
              favorite={favorite}
            />
          </ButtonsWrapper>
        }
      />
      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
    </React.Fragment>
  )
}

const ButtonsWrapper = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})
