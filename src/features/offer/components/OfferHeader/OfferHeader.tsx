import React, { PropsWithChildren, useCallback } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { getSearchHookConfig } from 'features/navigation/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Share } from 'ui/svg/icons/Share'

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

  const pressShareOffer = useCallback(() => {
    void analytics.logShare({ type: 'Offer', from: 'offer', offerId: offer.id })
    void shareOffer()
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
            <Button
              iconButton
              icon={Share}
              onPress={pressShareOffer}
              accessibilityLabel="Partager"
              variant="secondary"
              color="neutral"
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
