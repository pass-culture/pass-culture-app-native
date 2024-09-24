import React, { createContext, FC, PropsWithChildren, useMemo } from 'react'

import { AchievementGateway } from 'features/profile/api/Achievements/application/AchievementGateway'

type AchievementContext = {
  achievementGateway: AchievementGateway
}

export const AchievementContext = createContext<AchievementContext | undefined>(undefined)

export const AchievementProvider: FC<
  PropsWithChildren<{ achievementGateway: AchievementGateway }>
> = ({ achievementGateway, children }) => {
  const value = useMemo(() => ({ achievementGateway }), [achievementGateway])
  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>
}

export const useAchievementDependencies = () => {
  const achievementContext = React.useContext(AchievementContext)
  if (!achievementContext) {
    throw new Error('useAchievementDependencies must be used within a AchievementProvider')
  }
  return achievementContext
}
