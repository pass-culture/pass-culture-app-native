import React from 'react'
import { Animated } from 'react-native'

import { VenueResponse } from 'api/gen'
import { getSearchHookConfig } from 'features/navigation/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getShareVenue } from 'features/share/helpers/getShareVenue'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Button } from 'ui/designSystem/Button/Button'
import { Share } from 'ui/svg/icons/Share'

interface Props {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  venue: Omit<VenueResponse, 'isVirtual'>
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const VenueHeader: React.FC<Props> = ({ headerTransition, venue }) => {
  const { goBack } = useGoBack(...getSearchHookConfig('SearchLanding'))

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

  return (
    <React.Fragment>
      <ContentHeader
        headerTitle={venue.name}
        headerTransition={headerTransition}
        onBackPress={goBack}
        titleTestID="venueHeaderName"
        RightElement={
          <Button
            iconButton
            icon={Share}
            onPress={onSharePress}
            accessibilityLabel="Partager"
            variant="secondary"
            color="neutral"
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
