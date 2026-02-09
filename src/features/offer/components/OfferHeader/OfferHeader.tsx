import React, { PropsWithChildren, useCallback } from 'react'
import { Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type OfferHeaderProps = PropsWithChildren<{
  headerTransition: Animated.AnimatedInterpolation<string | number>
  title: string
  offer: OfferResponseV2
}>

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export function OfferHeader({
  headerTransition,
  title,
  offer,
  children,
}: Readonly<OfferHeaderProps>) {
  const theme = useTheme()

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { goBack } = useGoBack(...getSearchHookConfig('SearchLanding'))

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
        RightElement={
          <ButtonsWrapper gap={3}>
            <RoundedButton
              animationState={animationState}
              iconName="share"
              onPress={pressShareOffer}
              accessibilityLabel="Partager"
              finalColor={theme.designSystem.color.icon.default}
            />
            {children}
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
