import React, { memo, useContext, useMemo, useState } from 'react'

import { ShareAppModalType } from 'features/share/types'
import { useModal } from 'ui/components/modals/useModal'

import { useShareAppModalViewmodel } from '../api/useShareAppModalViewmodel'
import { ShareAppModalSelector } from '../components/ShareAppModalSelector'

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
  const { showModal, visible, hideModal } = useModal(false)
  const [modalType, setModalType] = useState(ShareAppModalType.NOT_ELIGIBLE)

  const { close, share, show, version } = useShareAppModalViewmodel({
    hideModal,
    showModal,
    setType: setModalType,
    type: modalType,
  })

  const value = useMemo(
    () => ({
      showShareAppModal: show,
    }),
    [show]
  )

  return (
    <ShareAppContext.Provider value={value}>
      {children}
      <ShareAppModalSelector visible={visible} close={close} share={share} version={version} />
    </ShareAppContext.Provider>
  )
})

export function useShareAppContext(): ShareAppContextValue {
  return useContext(ShareAppContext)
}
