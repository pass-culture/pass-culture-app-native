import React, { useContext, useMemo, useReducer } from 'react'

import {
  initialVenueMapState,
  VenueMapContextType,
  venueMapReducer,
} from 'features/venueMap/context/reducer'

type VenueMapWrapperProps = {
  children: React.JSX.Element
}

const VenueMapContext = React.createContext<VenueMapContextType>({
  venueMapState: initialVenueMapState,
  dispatch: () => null,
})

export const VenueMapWrapper = ({ children }: VenueMapWrapperProps) => {
  const [venueMapState, dispatch] = useReducer(venueMapReducer, initialVenueMapState)

  const value = useMemo(() => ({ venueMapState, dispatch }), [venueMapState])
  return <VenueMapContext.Provider value={value}>{children}</VenueMapContext.Provider>
}

export const useVenueMapState = (): VenueMapContextType => {
  return useContext(VenueMapContext)
}
