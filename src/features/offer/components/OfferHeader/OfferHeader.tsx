import React, { useCallback } from 'react'
import { Animated } from 'react-native'
import { useTheme } from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useShareOffer } from 'features/share/helpers/useShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

interface Props {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
  offerId: number
  searchId?: string
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const OfferHeader: React.FC<Props> = (props) => {
  const { headerTransition, offerId, title } = props
  const theme = useTheme()

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { goBack } = useGoBack(...getTabNavConfig('Search'))
  const { share: shareOffer, shareContent } = useShareOffer(offerId, 'header')

  const { animationState } = getAnimationState(theme, headerTransition)

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'offer', offerId })
    shareOffer()
    showShareOfferModal()
  }, [offerId, shareOffer, showShareOfferModal])

  return (
    <React.Fragment>
      <ContentHeader
        headerTitle={title}
        headerTransition={headerTransition}
        titleTestID="offerHeaderName"
        onBackPress={goBack}
        LeftElement={<Spacer.Row numberOfSpaces={13} />}
        RightElement={
          <React.Fragment>
            <RoundedButton
              animationState={animationState}
              iconName="share"
              onPress={pressShareOffer}
              accessibilityLabel="Partager"
              finalColor={theme.colors.black}
            />
            <Spacer.Row numberOfSpaces={3} />
            <FavoriteButton animationState={animationState} offerId={offerId} />
          </React.Fragment>
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
