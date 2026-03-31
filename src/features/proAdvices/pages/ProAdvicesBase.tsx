import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, PropsWithChildren, useCallback, useRef } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styled, useTheme } from 'styled-components/native'

import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { AdviceCardListHeader } from 'features/advices/components/AdviceCardListHeader/AdviceCardListHeader'
import { AdvicesHeader } from 'features/advices/components/AdvicesHeader/AdvicesHeader'
import { AdvicesWebMetaHeader } from 'features/advices/components/AdvicesWebMetaHeader/AdvicesWebMetaHeader'
import { AdvicesWritersModal } from 'features/advices/pages/AdvicesWritersModal/AdvicesWritersModal'
import { AdviceCardData } from 'features/advices/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'

type Props = PropsWithChildren<{
  title: string
  advices: AdviceCardData[]
  goBack: () => void
  id?: number
  thumbnailHeight?: number
}>

export const ProAdvicesBase: FunctionComponent<Props> = ({
  title,
  advices,
  goBack,
  id,
  thumbnailHeight,
  children,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { headerTransition, onScroll } = useOpacityTransition()
  const { visible, showModal, hideModal } = useModal(false)
  const advicesListRef = useRef<FlatList<AdviceCardData>>(null)
  const { contentPage, appBarHeight, isDesktopViewport, designSystem } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const selectedAdvice = advices?.findIndex((item) => item.id === id) ?? -1

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

  return (
    <React.Fragment>
      <AdvicesWebMetaHeader title={title} />
      <AdvicesHeader headerTransition={headerTransition} title={title} handleGoBack={goBack} />
      <Container>
        {children}
        <StyledAdviceCardList
          data={advices}
          horizontal={false}
          separatorSize={6}
          headerComponent={
            <AdviceCardListHeader
              title={`Les ${advices.length} avis des pros`}
              buttonWording="Qui écrit les avis des pros&nbsp;?"
              onPressMoreInfo={showModal}
            />
          }
          ref={advicesListRef}
          onScroll={onScroll}
          contentContainerStyle={{
            paddingTop: headerHeight,
            ...(isDesktopViewport
              ? {
                  paddingBottom: headerHeight,
                  marginHorizontal: children ? undefined : contentPage.marginHorizontal,
                }
              : {
                  paddingBottom: designSystem.size.spacing.xxxl,
                  marginTop: designSystem.size.spacing.l,
                  marginHorizontal: contentPage.marginHorizontal,
                }),
          }}
          onLayout={handleLayout}
          thumbnailHeight={thumbnailHeight}
        />
      </Container>

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

const Container = styled.View({
  flex: 1,
  flexDirection: 'row',
  columnGap: getSpacing(18),
})

const StyledAdviceCardList = styled(AdviceCardList)({
  flex: 1,
})
