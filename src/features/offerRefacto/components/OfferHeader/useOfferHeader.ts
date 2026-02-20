import { getSearchHookConfig } from 'features/navigation/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { OfferHeaderViewModel, UseOfferHeaderParams } from 'features/offerRefacto/types'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { analytics } from 'libs/analytics/provider'
import { useModal } from 'ui/components/modals/useModal'

const SHARE_MODAL_TITLE = 'Partager l\u2019offre'

export const useOfferHeader = ({ offer }: UseOfferHeaderParams): OfferHeaderViewModel => {
  const { goBack } = useGoBack(...getSearchHookConfig('SearchLanding'))

  const {
    visible: isShareModalVisible,
    showModal: showShareModal,
    hideModal: hideShareModal,
  } = useModal(false)

  const { share: executeShare, shareContent } = getShareOffer({ offer, utmMedium: 'header' })

  const handleSharePress = () => {
    void analytics.logShare({ type: 'Offer', from: 'offer', offerId: offer.id })
    void executeShare()
    showShareModal()
  }

  return {
    title: offer.name,
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
