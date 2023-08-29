import React from 'react'

import {
  Action,
  initialPerformanceState,
  performanceReducer,
} from 'shared/performance/context/reducer'
import { PerformanceState } from 'shared/performance/types'

interface IPerformanceContext {
  performanceState: PerformanceState
  dispatch: React.Dispatch<Action>
}

const PerformanceContext = React.createContext<IPerformanceContext | null>(null)

export const PerformanceWrapper = React.memo(function PerformanceWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const [performanceState, dispatch] = React.useReducer(performanceReducer, initialPerformanceState)

  const contextValue = React.useMemo(
    () => ({ performanceState, dispatch }),
    [performanceState, dispatch]
  )

  return <PerformanceContext.Provider value={contextValue}>{children}</PerformanceContext.Provider>
})

// The performanceState is initialized so his can't be null
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const usePerformance = () => React.useContext(PerformanceContext)!
