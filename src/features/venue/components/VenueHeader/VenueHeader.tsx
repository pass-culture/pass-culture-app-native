import React, { useEffect, useState } from 'react'
import { Animated } from 'react-native'
import { styled } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getShareVenue } from 'features/share/helpers/getShareVenue'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Bell } from 'ui/svg/icons/Bell'
import { Share } from 'ui/svg/icons/Share'

interface Props {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  venue: VenueResponse
  onPressFollowButton: () => void
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const VenueHeader: React.FC<Props> = ({ headerTransition, venue, onPressFollowButton }) => {
  const { goBack } = useGoBack(...getSearchHookConfig('SearchLanding'))
  const [showSmallSubscriptionButton, setShowSmallSubscriptionButton] = useState(false)

  const { share: shareVenue, shareContent } = getShareVenue({ venue, utmMedium: 'header' })
  const {
    visible: shareVenueModalVisible,
    showModal: showShareVenueModal,
    hideModal: hideShareVenueModal,
  } = useModal(false)

  const onSharePress = () => {
    analytics.logShare({ type: 'Venue', from: 'venue', venueId: venue.id })
    shareVenue()
    showShareVenueModal()
  }

  useEffect(() => {
    const listenerId = headerTransition.addListener(({ value }) => {
      setShowSmallSubscriptionButton(value > 0.5)
    })
    return () => {
      headerTransition.removeListener(listenerId)
    }
  }, [headerTransition])

  const smallSubscribeButtonOpacity = headerTransition.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  return (
    <React.Fragment>
      <ContentHeader
        headerTitle={venue.name}
        headerTransition={headerTransition}
        onBackPress={goBack}
        titleTestID="venueHeaderName"
        RightElement={
          <ButtonsContainer gap={3}>
            {showSmallSubscriptionButton ? (
              <Animated.View style={{ opacity: smallSubscribeButtonOpacity }}>
                <Button
                  iconButton
                  icon={Bell}
                  onPress={onPressFollowButton}
                  accessibilityLabel="Suivre le lieu"
                  variant="secondary"
                  color="neutral"
                />
              </Animated.View>
            ) : null}
            <Button
              iconButton
              icon={Share}
              onPress={onSharePress}
              accessibilityLabel="Partager"
              variant="secondary"
              color="neutral"
            />
          </ButtonsContainer>
        }
      />
      {shareContent ? (
        <WebShareModal
          visible={shareVenueModalVisible}
          headerTitle="Partager le lieu"
          shareContent={shareContent}
          dismissModal={hideShareVenueModal}
        />
      ) : null}
    </React.Fragment>
  )
}

const ButtonsContainer = styled(ViewGap)({
  flexDirection: 'row',
})
