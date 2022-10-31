import React, { memo, useCallback, useContext, useMemo, useState } from 'react'

import { ShareAppModal } from 'libs/share/shareApp/shareAppModalInformations'
import { ShareAppModalNew } from 'libs/share/shareApp/ShareAppModalNew'
import { useModal } from 'ui/components/modals/useModal'

interface ShareAppContextValue {
  showShareAppModal: (modalType: ShareAppModal) => void
}

const ShareAppContext = React.createContext<ShareAppContextValue>({
  showShareAppModal: () => null,
})

export const ShareAppWrapper = memo(function ShareAppWrapper({
  children,
}: {
  children: JSX.Element
}) {
  const { showModal, ...shareAppModalProps } = useModal(false)
  const [modalType, setModalType] = useState(ShareAppModal.NOT_ELIGIBLE)

  const showShareAppModal = useCallback(
    (modalType: ShareAppModal) => {
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
      <ShareAppModalNew modalType={modalType} {...shareAppModalProps} />
    </ShareAppContext.Provider>
  )
})

export function useShareAppContext(): ShareAppContextValue {
  return useContext(ShareAppContext)
}
