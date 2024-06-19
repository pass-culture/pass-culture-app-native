import React from 'react'
import { Animated } from 'react-native'
import { useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { getShareVenue } from 'features/share/helpers/getShareVenue'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'

interface Props {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  venue: VenueResponse
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const VenueHeader: React.FC<Props> = ({ headerTransition, venue }) => {
  const theme = useTheme()
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))

  const { share: shareVenue, shareContent } = getShareVenue({ venue, utmMedium: 'header' })
  const {
    visible: shareVenueModalVisible,
    showModal: showShareVenueModal,
    hideModal: hideShareVenueModal,
  } = useModal(false)

  const title = venue.publicName || venue.name

  const onSharePress = () => {
    analytics.logShare({ type: 'Venue', from: 'venue', venueId: venue.id })
    shareVenue()
    showShareVenueModal()
  }

  const { animationState } = getAnimationState(theme, headerTransition)

  return (
    <React.Fragment>
      <ContentHeader
        headerTitle={title}
        headerTransition={headerTransition}
        onBackPress={goBack}
        titleTestID="venueHeaderName"
        RightElement={
          <RoundedButton
            animationState={animationState}
            iconName="share"
            onPress={onSharePress}
            accessibilityLabel="Partager"
          />
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
