import React, { memo, useCallback, useContext, useMemo, useState } from 'react'

import { ShareAppModal } from 'features/share/pages/ShareAppModal'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics'
import { useModal } from 'ui/components/modals/useModal'

interface ShareAppContextValue {
  showShareAppModal: (modalType: ShareAppModalType) => void
}

const ShareAppContext = React.createContext<ShareAppContextValue>({
  showShareAppModal: () => null,
})

export const ShareAppWrapper = memo(function ShareAppWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const { showModal, ...shareAppModalProps } = useModal(false)
  const [modalType, setModalType] = useState(ShareAppModalType.NOT_ELIGIBLE)

  const showShareAppModal = useCallback(
    (modalType: ShareAppModalType) => {
      analytics.logShowShareAppModal({ type: modalType })
      setModalType(modalType)
      showModal()
    },
    [showModal]
  )

  const value = useMemo(
    () => ({
      showShareAppModal,
    }),
    [showShareAppModal]
  )

  return (
    <ShareAppContext.Provider value={value}>
      {children}
      <ShareAppModal modalType={modalType} {...shareAppModalProps} />
    </ShareAppContext.Provider>
  )
})

export function useShareAppContext(): ShareAppContextValue {
  return useContext(ShareAppContext)
}
