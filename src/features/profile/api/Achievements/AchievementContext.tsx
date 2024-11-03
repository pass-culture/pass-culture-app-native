import React, { createContext, FC, PropsWithChildren, useEffect, useMemo } from 'react'

import { achievementCompletedListener } from 'features/profile/api/Achievements/application/achievementCompletedListener'
import { AchievementGateway } from 'features/profile/api/Achievements/application/AchievementGateway'
import { useAchievementModalContext } from 'features/profile/api/Achievements/context/AchievementModalProvider'
import { createModalAchievementNotifier } from 'features/profile/api/Achievements/infra/ModalAchievementNotifier'

type AchievementContext = {
  achievementGateway: AchievementGateway
}

const AchievementContext = createContext<AchievementContext | undefined>(undefined)

export const AchievementProvider: FC<
  PropsWithChildren<{ achievementGateway: AchievementGateway }>
> = ({ achievementGateway, children }) => {
  const value = useMemo(() => ({ achievementGateway }), [achievementGateway])
  const { showAchievementModal } = useAchievementModalContext()

  useEffect(() => {
    achievementCompletedListener(
      achievementGateway,
      createModalAchievementNotifier(showAchievementModal)
    )
  }, [achievementGateway, showAchievementModal])

  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>
}

export const useAchievementDependencies = () => {
  const achievementContext = React.useContext(AchievementContext)
  if (!achievementContext) {
    throw new Error('useAchievementDependencies must be used within a AchievementProvider')
  }
  return achievementContext
}
