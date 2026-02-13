import { useCallback, useMemo } from 'react'

import { getSearchHookConfig } from 'features/navigation/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { useModal } from 'ui/components/modals/useModal'

import { OfferHeaderViewModel, UseOfferHeaderParams } from './types'
import { useOfferHeaderAnimation } from './useOfferHeaderAnimation'
import { useOfferHeaderTracking } from './useOfferHeaderTracking'

const SHARE_MODAL_TITLE = 'Partager l\u2019offre'

/**
 * ViewModel du header d'offre
 * DR014 : Séparation UI / Logique / Navigation
 * DR022 : Single Responsibility (orchestration des hooks)
 */
export function useOfferHeader({
  offer,
  headerTransition,
}: UseOfferHeaderParams): OfferHeaderViewModel {
  const { goBack } = useGoBack(...getSearchHookConfig('SearchLanding'))

  const {
    visible: isShareModalVisible,
    showModal: showShareModal,
    hideModal: hideShareModal,
  } = useModal(false)

  const { share: executeShare, shareContent } = useMemo(
    () => getShareOffer({ offer, utmMedium: 'header' }),
    [offer]
  )

  const { trackShare } = useOfferHeaderTracking({ offerId: offer.id })

  const animationState = useOfferHeaderAnimation(headerTransition)

  const handleSharePress = useCallback(() => {
    trackShare()
    executeShare()
    showShareModal()
  }, [trackShare, executeShare, showShareModal])

  return {
    title: offer.name,
    animationState,
    shareModal: {
      isVisible: isShareModalVisible,
      content: shareContent,
      title: SHARE_MODAL_TITLE,
    },
    onBackPress: goBack,
    onSharePress: handleSharePress,
    onDismissShareModal: hideShareModal,
  }
}
