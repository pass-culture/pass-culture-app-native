import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

import { VenueResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getShareVenue } from 'features/share/helpers/getShareVenue'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { getSurveyConfigFromActivity } from 'features/venue/helpers/getSurveyConfigFromActivity'
import { checkVenueSurveyAccess } from 'features/venue/helpers/venueSurveyAccessStorage'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Button } from 'ui/designSystem/Button/Button'
import { Share } from 'ui/svg/icons/Share'

const FIVE_SECONDS_IN_MS = 5000

interface Props {
  headerTransition: Animated.AnimatedInterpolation<string | number>
  venue: VenueResponse
}

/**
 * @param props.headerTransition should be between animated between 0 and 1
 */
export const VenueHeader: React.FC<Props> = ({ headerTransition, venue }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getSearchHookConfig('SearchLanding'))

  const enableVenueSurvey = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_VENUE_SURVEY)
  const surveyConfig = getSurveyConfigFromActivity(venue.activity)

  const mountTimeRef = useRef<number>(Date.now())
  const isSurveyAlreadySeenRef = useRef(true)

  useEffect(
    function initSurveyCheckEffect() {
      if (!enableVenueSurvey || !surveyConfig?.key) {
        return
      }

      void checkVenueSurveyAccess(surveyConfig.key).then((isAccessed) => {
        isSurveyAlreadySeenRef.current = isAccessed
      })
    },
    [enableVenueSurvey, surveyConfig?.key]
  )

  const onBackPress = () => {
    const timeSpent = Date.now() - mountTimeRef.current
    const stayedUnder5s = timeSpent < FIVE_SECONDS_IN_MS
    const shouldDisplaySurvey =
      enableVenueSurvey && surveyConfig?.key && stayedUnder5s && !isSurveyAlreadySeenRef.current

    if (shouldDisplaySurvey) {
      navigate('VenueSurveyModal', {
        activity: venue.activity,
      })
      return
    }

    goBack()
  }

  const { share: shareVenue, shareContent } = getShareVenue({ venue, utmMedium: 'header' })
  const {
    visible: shareVenueModalVisible,
    showModal: showShareVenueModal,
    hideModal: hideShareVenueModal,
  } = useModal(false)

  const onSharePress = () => {
    void analytics.logShare({ type: 'Venue', from: 'venue', venueId: venue.id })
    void shareVenue()
    showShareVenueModal()
  }

  return (
    <React.Fragment>
      <ContentHeader
        headerTitle={venue.name}
        headerTransition={headerTransition}
        onBackPress={onBackPress}
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
