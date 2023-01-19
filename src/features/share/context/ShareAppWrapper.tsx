import React, { memo, useCallback, useContext, useMemo, useState } from 'react'

import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { ShareAppModal } from 'features/share/pages/ShareAppModal'
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
  children: JSX.Element
}) {
  const { showModal, ...shareAppModalProps } = useModal(false)
  const [modalType, setModalType] = useState(ShareAppModalType.NOT_ELIGIBLE)

  const showShareAppModal = useCallback(
    (modalType: ShareAppModalType) => {
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
