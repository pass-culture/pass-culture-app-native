import React, { FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'

import { AchievementSuccessModal } from 'features/profile/components/Modals/AchievementSuccessModal'
import { useModal } from 'ui/components/modals/useModal'

interface AchievementContextValue {
  showAchievementModal: (id: string) => void
}

const AchievementModalContext = React.createContext<AchievementContextValue | undefined>(undefined)

export const AchievementModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showModal, ...achievementModalProps } = useModal(false)
  const [id, setId] = useState<string | null>(null)

  const showAchievementModal = useCallback(
    (id: string) => {
      showModal()
      setId(id)
    },
    [showModal]
  )

  const value = useMemo(() => ({ showAchievementModal }), [showAchievementModal])

  return (
    <AchievementModalContext.Provider value={value}>
      {children}

      {id ? <AchievementSuccessModal {...achievementModalProps} id={id} /> : null}
    </AchievementModalContext.Provider>
  )
}

export function useAchievementModalContext(): AchievementContextValue {
  const context = useContext(AchievementModalContext)
  if (!context) {
    throw new Error('useAchievementModalContext must be used within a AchievementModalProvider')
  }
  return context
}
