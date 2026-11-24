import { useNavigation } from '@react-navigation/native'
import React, { useRef } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { FavoriteType } from 'features/favorites/enum'
import { selectVenueFavorite } from 'features/favorites/helpers/selectVenueFavorite'
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
import { useAddVenueFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { useVenueFavoritesQuery } from 'queries/favorites/useFavoritesQuery'
import { useRemoveVenueFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
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
  const enableFavoriteButton = useFeatureFlag(RemoteStoreFeatureFlags.WIP_FAVORITES_HUB)
  const surveyConfig = getSurveyConfigFromActivity(venue.activity)

  const mountTimeRef = useRef<number>(Date.now())

  const { mutate: addFavorite, isPending: isAddFavoriteLoading } = useAddVenueFavoriteMutation({
    type: FavoriteType.VENUE,
    onSuccess: () => {
      void analytics.logAddItemToFavorite({
        id: venue.id.toString(),
        type: FavoriteType.VENUE,
        from: 'venue',
      })
    },
  })

  const { mutate: removeFavorite, isPending: isRemoveFavoriteLoading } =
    useRemoveVenueFavoriteMutation({
      onError: () => {
        showErrorSnackBar('Le lieu n’a pas été retiré de tes favoris')
      },
    })

  const { data: favorite } = useVenueFavoritesQuery({
    enabled: enableFavoriteButton,
    select: (data) => selectVenueFavorite(data, venue.id),
  })

  const onBackPress = async () => {
    const timeSpent = Date.now() - mountTimeRef.current
    const stayedMore5s = timeSpent > FIVE_SECONDS_IN_MS

    if (enableVenueSurvey && surveyConfig?.key && stayedMore5s) {
      const isSurveyAlreadySeen = await checkVenueSurveyAccess(surveyConfig.key, 'modal')
      if (!isSurveyAlreadySeen) {
        navigate('VenueSurveyModal', {
          activity: venue.activity,
        })
        return
      }
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
          <RightElementContainer gap={3}>
            <Button
              iconButton
              icon={Share}
              onPress={onSharePress}
              accessibilityLabel="Partager"
              variant="secondary"
              color="neutral"
            />
            {enableFavoriteButton ? (
              <FavoriteButton
                favorite={favorite}
                isRemoveFavoriteLoading={isRemoveFavoriteLoading}
                removeFavorite={removeFavorite}
                addFavorite={addFavorite}
                venueId={venue.id}
                isAddFavoriteLoading={isAddFavoriteLoading}
              />
            ) : null}
          </RightElementContainer>
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

const RightElementContainer = styled(ViewGap)({
  flexDirection: 'row',
})
