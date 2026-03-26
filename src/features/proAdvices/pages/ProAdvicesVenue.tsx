import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useRef } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styled, useTheme } from 'styled-components/native'

import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { AdviceCardListHeader } from 'features/advices/components/AdviceCardListHeader/AdviceCardListHeader'
import { AdvicesHeader } from 'features/advices/components/AdvicesHeader/AdvicesHeader'
import { AdvicesWebMetaHeader } from 'features/advices/components/AdvicesWebMetaHeader/AdvicesWebMetaHeader'
import { AdvicesWritersModal } from 'features/advices/pages/AdvicesWritersModal/AdvicesWritersModal'
import { useVenueProAdvicesQuery } from 'features/advices/queries/useVenueProAdvicesQuery'
import { AdviceCardData } from 'features/advices/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { proAdvicesToAdviceCardData } from 'features/proAdvices/adapters/proAdvicesToAdviceCardData/proAdvicesToAdviceCardData'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'

export const ProAdvicesVenue: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'ProAdvicesVenue'>>()
  const { venueId, offerId } = route.params
  const { navigate } = useNavigation<UseNavigationType>()
  const enableProAdvices = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_VENUE)

  const { data: venue } = useVenueQuery(venueId)
  const venueName = venue?.name ?? ''
  const { data: advices } = useVenueProAdvicesQuery({
    venueId,
    enableProAdvices,
    select: ({ proAdvices }) => proAdvicesToAdviceCardData(proAdvices),
  })
  const nbAdvices = advices?.length ?? 0

  const { headerTransition, onScroll } = useOpacityTransition()
  const { goBack } = useGoBack('Venue')
  const { visible, showModal, hideModal } = useModal(false)
  const advicesListRef = useRef<FlatList<AdviceCardData>>(null)
  const { contentPage, appBarHeight, isDesktopViewport, designSystem } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const selectedAdvice = advices?.findIndex((item) => item.id === offerId) ?? -1

  const handleLayout = useCallback(() => {
    if (selectedAdvice !== -1) {
      runAfterInteractionsMobile(() => {
        advicesListRef.current?.scrollToIndex({
          index: selectedAdvice,
          animated: true,
          viewOffset: headerHeight,
        })
      })
    }
  }, [selectedAdvice, headerHeight])

  const handleOnShowRecoButtonPress = () => {
    hideModal()
    runAfterInteractionsMobile(() => {
      navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'venue' })
    })
  }

  if (venueName === '' && nbAdvices === 0) return null

  const title = `Les ${nbAdvices} avis par “${venueName}”`

  return (
    <React.Fragment>
      <AdvicesWebMetaHeader title={title} />
      <AdvicesHeader
        headerTransition={headerTransition}
        title="Les avis du pro"
        handleGoBack={goBack}
      />

      <StyledAdviceCardList
        data={advices}
        horizontal={false}
        separatorSize={6}
        headerComponent={
          <AdviceCardListHeader
            title={title}
            buttonWording="Qui écrit les avis des pros&nbsp;?"
            onPressMoreInfo={showModal}
          />
        }
        ref={advicesListRef}
        onScroll={onScroll}
        contentContainerStyle={{
          paddingTop: headerHeight,
          ...(isDesktopViewport
            ? { paddingBottom: headerHeight }
            : {
                paddingBottom: designSystem.size.spacing.xxxl,
                marginTop: designSystem.size.spacing.l,
                marginHorizontal: contentPage.marginHorizontal,
              }),
        }}
        onLayout={handleLayout}
      />

      <AdvicesWritersModal
        closeModal={hideModal}
        isVisible={visible}
        onShowRecoButtonPress={handleOnShowRecoButtonPress}
        modalWording={`Les avis des pros sont rédigés par nos partenaires culturels du pass\u00a0: libraires, disquaires, organisateurs de spectacles...\nCes experts partagent leurs coups de coeur pour t‘aider à découvrir des oeuvres qui pourraient te plaire.`}
        buttonWording="Voir tous les avis des pros"
      />
    </React.Fragment>
  )
}

const StyledAdviceCardList = styled(AdviceCardList)(({ theme }) => ({
  flex: 1,
  marginHorizontal: theme.isDesktopViewport ? theme.designSystem.size.spacing.xl : undefined,
}))
