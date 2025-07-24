import { useCallback } from 'react'

import { shareApp } from 'features/share/helpers/shareApp'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'

export type ShareAppModalSelectorViewmodelParams = {
  type: ShareAppModalType
  hideModal: () => void
  setType: (type: ShareAppModalType) => void
  showModal: () => void
}

export const useShareAppModalViewmodel = ({
  hideModal,
  type,
  showModal,
  setType,
}: ShareAppModalSelectorViewmodelParams) => {
  const {
    data: { shareAppModalVersion: version },
  } = useRemoteConfigQuery()

  const close = useCallback(() => {
    analytics.logDismissShareApp(type)
    hideModal()
  }, [hideModal, type])

  const share = useCallback(async () => {
    analytics.logShareApp({ type: type })
    await shareApp(ShareAppModalType.BENEFICIARY ? 'beneficiary_modal' : 'uneligible_modal')
    hideModal()
  }, [hideModal, type])

  const show = useCallback(
    (_type: ShareAppModalType) => {
      analytics.logShowShareAppModal({ type: _type })
      setType(_type)
      showModal()
    },
    [setType, showModal]
  )

  return {
    version,
    share,
    close,
    show,
  }
}
